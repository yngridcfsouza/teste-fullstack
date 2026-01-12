# SmartMart - Sistema de Gestão de Vendas

Sistema fullstack para importação e gestão de categorias, produtos e vendas através de arquivos CSV.

## 📋 Sobre o Projeto

O SmartMart é uma aplicação web que permite importar dados de categorias, produtos e vendas através de arquivos CSV. O sistema possui uma interface moderna e intuitiva para upload de dados e uma API REST robusta para processamento.

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.x**
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para Python
- **SQLite** - Banco de dados
- **Pandas** - Processamento de dados CSV

### Frontend
- **React 19** - Biblioteca JavaScript
- **TypeScript** - Superset do JavaScript com tipagem
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Axios** - Cliente HTTP
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
teste-fullstack/
├── backend/
│   ├── main.py          # Aplicação FastAPI
│   ├── models.py        # Modelos SQLAlchemy
│   ├── database.py      # Configuração do banco de dados
│   ├── .gitignore       # Arquivos ignorados pelo Git
│   └── venv/            # Ambiente virtual Python
│
└── frontend/
    ├── src/
    │   ├── App.tsx      # Componente principal
    │   ├── components/  # Componentes UI
    │   ├── services/    # Serviços API
    │   └── types/       # Definições TypeScript
    ├── package.json
    └── vite.config.ts
```

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Python 3.8+**
- **Node.js 18+** e **npm** (ou **yarn**)
- **Git**

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd teste-fullstack
```

### 2. Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Crie um ambiente virtual (se ainda não tiver)
python -m venv venv

# Ative o ambiente virtual
# No Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# No Windows (CMD):
.\venv\Scripts\activate.bat
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install fastapi uvicorn sqlalchemy pandas python-multipart
```

### 3. Configuração do Frontend

```bash
# Volte para a raiz e entre na pasta do frontend
cd ../frontend

# Instale as dependências
npm install
```

## 🏃 Como Executar

### Backend

```bash
cd backend

# Ative o ambiente virtual (se ainda não estiver ativo)
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# ou
source venv/bin/activate     # Linux/Mac

# Execute o servidor
uvicorn main:app --reload
```

O backend estará rodando em: `http://localhost:8000`

Documentação interativa da API: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173` (ou outra porta disponível)

## 📡 Endpoints da API

### `GET /`
Retorna uma mensagem de status da API.

**Resposta:**
```json
{
  "message": "API SmartMart rodando!"
}
```

### `POST /upload/categories`
Importa categorias a partir de um arquivo CSV.

**Formato do CSV esperado:**
```csv
id,name
1,Eletrônicos
2,Roupas
3,Alimentos
```

**Resposta:**
```json
{
  "message": "5 categorias importadas."
}
```

### `POST /upload/products`
Importa produtos a partir de um arquivo CSV.

**Formato do CSV esperado:**
```csv
id,name,price,category_id
1,Notebook,2500.00,1
2,Camisa,89.90,2
3,Arroz,15.50,3
```

**Resposta:**
```json
{
  "message": "10 produtos importados."
}
```

### `POST /upload/sales`
Importa vendas a partir de um arquivo CSV.

**Formato do CSV esperado:**
```csv
id,product_id,quantity,total_price,date
1,1,2,5000.00,2024-01-15
2,2,3,269.70,2024-01-16
3,3,5,77.50,2024-01-17
```

**Resposta:**
```json
{
  "message": "20 vendas importadas."
}
```

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

### Categories
- `id` (Integer, Primary Key)
- `name` (String, Unique)

### Products
- `id` (Integer, Primary Key)
- `name` (String)
- `price` (Float)
- `category_id` (Integer, Foreign Key → Categories.id)

### Sales
- `id` (Integer, Primary Key)
- `product_id` (Integer, Foreign Key → Products.id)
- `quantity` (Integer)
- `total_price` (Float)
- `date` (Date)

## 📝 Formato dos Arquivos CSV

### Categorias (`categories.csv`)
```csv
id,name
1,Eletrônicos
2,Roupas
3,Alimentos
```

### Produtos (`products.csv`)
```csv
id,name,price,category_id
1,Notebook,2500.00,1
2,Camisa,89.90,2
3,Arroz,15.50,3
```

### Vendas (`sales.csv`)
```csv
id,product_id,quantity,total_price,date
1,1,2,5000.00,2024-01-15
2,2,3,269.70,2024-01-16
3,3,5,77.50,2024-01-17
```

**Importante:**
- O formato de data deve ser `YYYY-MM-DD`
- Os valores decimais devem usar ponto (.) como separador
- O arquivo deve ter cabeçalho (primeira linha com os nomes das colunas)
- O encoding deve ser UTF-8

## 🔒 Segurança

- O sistema evita duplicação de registros verificando se o ID já existe antes de inserir
- Arquivos são validados para garantir que são CSV
- O banco de dados SQLite é criado automaticamente na primeira execução

## 🛠️ Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## 📦 Dependências Principais

### Backend
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `sqlalchemy` - ORM
- `pandas` - Processamento de dados
- `python-multipart` - Suporte a upload de arquivos

### Frontend
- `react` - Biblioteca UI
- `typescript` - Tipagem estática
- `vite` - Build tool
- `tailwindcss` - Estilização
- `axios` - Cliente HTTP
- `@radix-ui/*` - Componentes acessíveis

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como parte de um teste fullstack.

---

**Nota:** Certifique-se de que o backend esteja rodando antes de usar o frontend, pois o frontend faz requisições para `http://localhost:8000`.

