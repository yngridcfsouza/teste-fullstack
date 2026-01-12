# Checklist - Finalização do Projeto SmartMart

## 📋 Análise do Desafio vs. Implementação Atual

### ✅ O que já está implementado:
1. ✅ Upload de CSV para categorias (`POST /upload/categories`)
2. ✅ Upload de CSV para produtos (`POST /upload/products`)
3. ✅ Upload de CSV para vendas (`POST /upload/sales`)
4. ✅ Modelos de dados (Category, Product, Sale)
5. ✅ Banco de dados SQLite configurado
6. ✅ Interface básica de upload no frontend

### ❌ O que falta implementar:

## 🔴 Backend - Endpoints Necessários

### 1. Endpoints de Visualização (GET)
- [ ] `GET /products` - Listar todos os produtos (com paginação opcional)
- [ ] `GET /products/{id}` - Obter produto específico
- [ ] `GET /categories` - Listar todas as categorias
- [ ] `GET /categories/{id}` - Obter categoria específica
- [ ] `GET /sales` - Listar todas as vendas
- [ ] `GET /sales/{id}` - Obter venda específica

### 2. Endpoints de Cadastro Manual
- [ ] `POST /products` - Criar produto manualmente
- [ ] `POST /categories` - Criar categoria manualmente

### 3. Endpoints de Edição
- [ ] `PUT /products/{id}` - Atualizar produto completo
- [ ] `PATCH /products/{id}` - Atualizar produto parcialmente
- [ ] `PUT /categories/{id}` - Atualizar categoria

### 4. Endpoints de Exclusão
- [ ] `DELETE /products/{id}` - Deletar produto
- [ ] `DELETE /categories/{id}` - Deletar categoria (com validação de produtos associados)

### 5. Endpoints de Análise/Estatísticas
- [ ] `GET /analytics/sales` - Estatísticas gerais de vendas
- [ ] `GET /analytics/products` - Produtos mais vendidos
- [ ] `GET /analytics/categories` - Vendas por categoria
- [ ] `GET /analytics/monthly` - Vendas por mês (se o modelo usar month)

### 6. Endpoints de Filtros/Busca
- [ ] `GET /products?category_id={id}` - Filtrar produtos por categoria
- [ ] `GET /products?search={term}` - Buscar produtos por nome
- [ ] `GET /products?min_price={value}&max_price={value}` - Filtrar por faixa de preço

## 🎨 Frontend - Interface Necessária

### 1. Painel de Visualização de Produtos
- [ ] Tabela de produtos com colunas: ID, Nome, Preço, Categoria
- [ ] Paginação (se houver muitos produtos)
- [ ] Ordenação por colunas (nome, preço, etc.)

### 2. Filtros
- [ ] Filtro por categoria (dropdown/select)
- [ ] Busca por nome (input de texto)
- [ ] Filtro por faixa de preço (min/max)
- [ ] Botão para limpar filtros

### 3. Cadastro Manual de Produtos
- [ ] Formulário modal/dialog para cadastro
- [ ] Campos: Nome, Preço, Categoria (select)
- [ ] Validação de campos obrigatórios
- [ ] Feedback de sucesso/erro

### 4. Edição de Produtos
- [ ] Botão "Editar" em cada linha da tabela
- [ ] Modal/dialog com formulário pré-preenchido
- [ ] Atualização em tempo real após edição

### 5. Exclusão de Produtos
- [ ] Botão "Deletar" em cada linha
- [ ] Confirmação antes de deletar
- [ ] Atualização da lista após exclusão

### 6. Painel de Análise de Vendas
- [ ] Cards com métricas principais:
  - Total de vendas
  - Receita total
  - Produto mais vendido
  - Categoria mais vendida
- [ ] Gráficos (opcional, mas recomendado):
  - Vendas por mês (linha ou barra)
  - Vendas por categoria (pizza ou barra)
  - Top 10 produtos (barra horizontal)

### 7. Navegação/Organização
- [ ] Abas ou seções para:
  - Dashboard/Análise
  - Produtos (lista + cadastro)
  - Importação CSV
- [ ] Menu de navegação lateral ou superior

## 🔧 Ajustes Técnicos

### 1. Modelo de Dados
- [ ] Verificar se o campo `date` em Sales deve ser `month` conforme mencionado no desafio
- [ ] Se necessário, criar migration ou ajustar modelo

### 2. Validações
- [ ] Validação de preço positivo
- [ ] Validação de categoria existente ao criar produto
- [ ] Validação de produto existente ao criar venda
- [ ] Tratamento de erros adequado (mensagens claras)

### 3. Relacionamentos
- [ ] Garantir que produtos incluam dados da categoria nas respostas (join)
- [ ] Garantir que vendas incluam dados do produto nas respostas (join)

### 4. CORS (se necessário)
- [ ] Configurar CORS no FastAPI se houver problemas de conexão

## 📊 Priorização Sugerida

### Fase 1 - Funcionalidades Essenciais (MVP)
1. Endpoints GET para listar produtos, categorias e vendas
2. Interface de visualização de produtos com tabela
3. Filtros básicos (categoria e busca por nome)
4. Cadastro manual de produtos
5. Edição de produtos

### Fase 2 - Funcionalidades Complementares
6. Exclusão de produtos
7. Painel de análise básico (métricas em cards)
8. Endpoints de estatísticas

### Fase 3 - Melhorias e Polimento
9. Gráficos de análise
10. Paginação
11. Ordenação
12. Validações avançadas

## 📝 Observações Importantes

1. **Formato de Vendas**: O desafio menciona coluna `month` no CSV de vendas, mas o modelo atual usa `date`. Verificar qual formato os arquivos CSV fornecidos realmente usam.

2. **Design**: O projeto já tem Tailwind CSS e componentes Radix UI, então a interface pode ser moderna e responsiva.

3. **Biblioteca de Gráficos** (opcional): Para os gráficos de análise, considerar:
   - Recharts (React)
   - Chart.js
   - Victory

4. **Testes**: Embora não mencionado no desafio, seria bom ter testes básicos.

## 🚀 Próximos Passos

1. Começar pelos endpoints GET no backend
2. Criar a interface de visualização de produtos
3. Implementar filtros
4. Adicionar cadastro e edição
5. Criar painel de análise

---

**Status Atual**: ~30% completo
**Estimativa para finalização**: 6-8 horas de desenvolvimento

