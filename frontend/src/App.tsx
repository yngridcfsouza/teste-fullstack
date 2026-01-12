import { useState, useEffect } from 'react';
import { 
  uploadFile, 
  getProducts, 
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getSalesAnalytics,
  getProductsAnalytics,
  getCategoriesAnalytics,
  getMonthlyAnalytics,
  Product,
  Category,
  ProductCreate,
  SalesAnalytics,
  ProductAnalytics,
  CategoryAnalytics,
  MonthlyAnalytics
} from './services/api';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Plus, Edit, Trash2, Search, Filter, X, BarChart3, Upload } from 'lucide-react';

type View = 'dashboard' | 'products' | 'upload';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // Dialog de produto
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductCreate>({
    name: '',
    price: 0,
    category_id: 0
  });
  
  // Analytics
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [topProducts, setTopProducts] = useState<ProductAnalytics[]>([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState<CategoryAnalytics[]>([]);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalytics[]>([]);

  // Carregar dados
  useEffect(() => {
    loadCategories();
    if (view === 'products') {
      loadProducts();
    } else if (view === 'dashboard') {
      loadAnalytics();
    }
  }, [view]);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (view === 'products') {
      loadProducts();
    }
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;
      if (minPrice) params.min_price = parseFloat(minPrice);
      if (maxPrice) params.max_price = parseFloat(maxPrice);
      
      const data = await getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setMessage("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [sales, products, categories, monthly] = await Promise.all([
        getSalesAnalytics(),
        getProductsAnalytics(),
        getCategoriesAnalytics(),
        getMonthlyAnalytics()
      ]);
      setSalesAnalytics(sales);
      setTopProducts(products);
      setCategoryAnalytics(categories);
      setMonthlyAnalytics(monthly);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File, type: 'products' | 'categories' | 'sales' = 'products') => {
    setLoading(true);
    setMessage("");
    try {
      const result = await uploadFile(`/upload/${type}`, file);
      setMessage(`Sucesso: ${result.message}`);
      if (view === 'products') {
        loadProducts();
      }
      if (view === 'dashboard') {
        loadAnalytics();
      }
    } catch (error: any) {
      console.error(error);
      setMessage(`Erro: ${error.response?.data?.detail || 'Erro ao fazer upload'}`);
    } finally {
      setLoading(false);
    }
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: product.price,
        category_id: product.category_id
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        category_id: categories[0]?.id || 0
      });
    }
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || productForm.price <= 0 || !productForm.category_id) {
      setMessage("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        setMessage("Produto atualizado com sucesso!");
      } else {
        await createProduct(productForm);
        setMessage("Produto criado com sucesso!");
      }
      setDialogOpen(false);
      loadProducts();
    } catch (error: any) {
      setMessage(`Erro: ${error.response?.data?.detail || 'Erro ao salvar produto'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    setLoading(true);
    try {
      await deleteProduct(id);
      setMessage("Produto deletado com sucesso!");
      loadProducts();
    } catch (error: any) {
      setMessage(`Erro: ${error.response?.data?.detail || 'Erro ao deletar produto'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(undefined);
    setMinPrice("");
    setMaxPrice("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-slate-900">SmartMart Dashboard</h1>
            <nav className="flex gap-2">
              <Button
                variant={view === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setView('dashboard')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={view === 'products' ? 'default' : 'outline'}
                onClick={() => setView('products')}
              >
                Produtos
              </Button>
              <Button
                variant={view === 'upload' ? 'default' : 'outline'}
                onClick={() => setView('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Dashboard */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Análise de Vendas</h2>
            
            {salesAnalytics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesAnalytics.total_sales}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(salesAnalytics.total_revenue)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quantidade Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{salesAnalytics.total_quantity}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(salesAnalytics.average_sale_value)}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.total_quantity}</TableCell>
                          <TableCell>{formatCurrency(p.total_revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryAnalytics.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.total_quantity}</TableCell>
                          <TableCell>{formatCurrency(c.total_revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Vendas</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Receita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyAnalytics.map((m) => (
                      <TableRow key={m.month}>
                        <TableCell>{m.month}</TableCell>
                        <TableCell>{m.total_sales}</TableCell>
                        <TableCell>{m.total_quantity}</TableCell>
                        <TableCell>{formatCurrency(m.total_revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Produtos */}
        {view === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Produtos</h2>
              <Button onClick={() => openProductDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Preço mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Preço máximo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                      <Button variant="outline" size="icon" onClick={clearFilters}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Produtos */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center">Carregando...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                            Nenhum produto encontrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category?.name || 'N/A'}</TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openProductDialog(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload CSV */}
        {view === 'upload' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Importação de Dados (CSV)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Categorias</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUpload(e.target.files[0], 'categories');
                      }
                    }}
                  />
                  <p className="text-sm text-slate-500">
                    Formato: id, name
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Produtos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUpload(e.target.files[0], 'products');
                      }
                    }}
                  />
                  <p className="text-sm text-slate-500">
                    Formato: id, name, price, category_id
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Vendas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUpload(e.target.files[0], 'sales');
                      }
                    }}
                  />
                  <p className="text-sm text-slate-500">
                    Formato: id, product_id, quantity, total_price, date (ou month)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Dialog de Produto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preço</label>
              <Input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: parseInt(e.target.value) })}
              >
                <option value="0">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
