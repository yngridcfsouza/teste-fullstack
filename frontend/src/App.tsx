import { useState } from 'react';
import { uploadFile } from './services/api';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (type: 'products' | 'categories' | 'sales') => {
    if (!file) return alert("Selecione um arquivo primeiro!");
    
    setLoading(true);
    try {
      const result = await uploadFile(`/upload/${type}`, file);
      setMessage(`Sucesso: ${result.message}`);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao fazer upload. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <h1 className="text-3xl font-bold text-slate-900">SmartMart Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Importação de Dados (CSV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-center">
              <Input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange} 
                className="max-w-sm"
              />
              <span className="text-sm text-slate-500">
                {file ? file.name : "Nenhum arquivo selecionado"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleUpload('categories')}
                disabled={loading}
                variant="outline"
              >
                {loading ? "Enviando..." : "1. Enviar Categorias"}
              </Button>

              <Button 
                onClick={() => handleUpload('products')} 
                disabled={loading}
                variant="outline"
              >
                {loading ? "Enviando..." : "2. Enviar Produtos"}
              </Button>

              <Button 
                onClick={() => handleUpload('sales')}
                disabled={loading}
              >
                {loading ? "Enviando..." : "3. Enviar Vendas"}
              </Button>
            </div>
            
            {message && (
              <div className={`p-4 rounded-md ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default App;