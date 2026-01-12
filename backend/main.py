from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from database import engine, get_db, Base
from io import StringIO
from datetime import datetime
from typing import List, Optional
import models
import schemas
import pandas as pd

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartMart API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API SmartMart rodando!"}

@app.post("/upload/categories")
async def upload_categories(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo precisa ser um CSV!")

    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")))

    count = 0
    for _, row in df.iterrows():
        if not db.query(models.Category).filter(models.Category.id == row['id']).first():
            category = models.Category(id=row['id'], name=row['name'])
            db.add(category)
            count += 1
    
    db.commit()
    return {"message": f"{count} categorias importadas."}

@app.post("/upload/products")
async def upload_products(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo precisa ser um CSV!")
        
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")))

    count = 0
    for _, row in df.iterrows():
        if not db.query(models.Product).filter(models.Product.id == row['id']).first():
            product = models.Product(
                id=row['id'], 
                name=row['name'], 
                price=row['price'],
                category_id=row['category_id']
            )
            db.add(product)
            count += 1
            
    db.commit()
    return {"message": f"{count} produtos importados."}

@app.post("/upload/sales")
async def upload_sales(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo precisa ser um CSV!")
        
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")))

    count = 0
    for _, row in df.iterrows():
        # Suporta tanto 'date' quanto 'month' no CSV
        date_str = row.get('date') or row.get('month', '')
        if not date_str:
            continue
            
        try:
            # Tenta formatos diferentes
            if len(date_str) == 7:  # YYYY-MM
                sale_date = datetime.strptime(date_str + '-01', '%Y-%m-%d').date()
            else:
                sale_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except:
            continue

        if not db.query(models.Sale).filter(models.Sale.id == row['id']).first():
            sale = models.Sale(
                id=row['id'],
                product_id=row['product_id'],
                quantity=row['quantity'],
                total_price=row['total_price'],
                date=sale_date
            )
            db.add(sale)
            count += 1

    db.commit()
    return {"message": f"{count} vendas importadas."}

# ========== ENDPOINTS DE VISUALIZAÇÃO ==========

@app.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return categories

@app.get("/categories/{category_id}", response_model=schemas.Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return category

@app.get("/products", response_model=List[schemas.Product])
def get_products(
    category_id: Optional[int] = Query(None, description="Filtrar por categoria"),
    search: Optional[str] = Query(None, description="Buscar por nome"),
    min_price: Optional[float] = Query(None, description="Preço mínimo"),
    max_price: Optional[float] = Query(None, description="Preço máximo"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Product).join(models.Category)
    
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
    
    products = query.all()
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product

@app.get("/sales", response_model=List[schemas.Sale])
def get_sales(
    product_id: Optional[int] = Query(None, description="Filtrar por produto"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Sale).join(models.Product)
    
    if product_id:
        query = query.filter(models.Sale.product_id == product_id)
    
    sales = query.order_by(models.Sale.date.desc()).all()
    return sales

@app.get("/sales/{sale_id}", response_model=schemas.Sale)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return sale

# ========== ENDPOINTS DE CADASTRO MANUAL ==========

@app.post("/categories", response_model=schemas.Category, status_code=201)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    # Verifica se já existe categoria com mesmo nome
    existing = db.query(models.Category).filter(models.Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria com este nome já existe")
    
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.post("/products", response_model=schemas.Product, status_code=201)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    # Verifica se categoria existe
    category = db.query(models.Category).filter(models.Category.id == product.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Categoria não encontrada")
    
    if product.price <= 0:
        raise HTTPException(status_code=400, detail="Preço deve ser maior que zero")
    
    db_product = models.Product(
        name=product.name,
        price=product.price,
        category_id=product.category_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# ========== ENDPOINTS DE EDIÇÃO ==========

@app.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    # Verifica se nome já existe em outra categoria
    existing = db.query(models.Category).filter(
        and_(models.Category.name == category.name, models.Category.id != category_id)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Categoria com este nome já existe")
    
    db_category.name = category.name
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    if product.category_id:
        category = db.query(models.Category).filter(models.Category.id == product.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Categoria não encontrada")
        db_product.category_id = product.category_id
    
    if product.name is not None:
        db_product.name = product.name
    
    if product.price is not None:
        if product.price <= 0:
            raise HTTPException(status_code=400, detail="Preço deve ser maior que zero")
        db_product.price = product.price
    
    db.commit()
    db.refresh(db_product)
    return db_product

# ========== ENDPOINTS DE EXCLUSÃO ==========

@app.delete("/categories/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    # Verifica se há produtos associados
    products_count = db.query(models.Product).filter(models.Product.category_id == category_id).count()
    if products_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Não é possível deletar categoria com {products_count} produto(s) associado(s)"
        )
    
    db.delete(db_category)
    db.commit()
    return None

@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    db.delete(db_product)
    db.commit()
    return None

# ========== ENDPOINTS DE ANÁLISE ==========

@app.get("/analytics/sales")
def get_sales_analytics(db: Session = Depends(get_db)):
    total_sales = db.query(func.count(models.Sale.id)).scalar() or 0
    total_revenue = db.query(func.sum(models.Sale.total_price)).scalar() or 0
    total_quantity = db.query(func.sum(models.Sale.quantity)).scalar() or 0
    
    return {
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "total_quantity": int(total_quantity) if total_quantity else 0,
        "average_sale_value": float(total_revenue / total_sales) if total_sales > 0 else 0
    }

@app.get("/analytics/products")
def get_products_analytics(db: Session = Depends(get_db)):
    # Produtos mais vendidos
    top_products = db.query(
        models.Product.id,
        models.Product.name,
        func.sum(models.Sale.quantity).label('total_quantity'),
        func.sum(models.Sale.total_price).label('total_revenue')
    ).join(
        models.Sale, models.Product.id == models.Sale.product_id
    ).group_by(
        models.Product.id, models.Product.name
    ).order_by(
        func.sum(models.Sale.quantity).desc()
    ).limit(10).all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "total_quantity": int(p.total_quantity) if p.total_quantity else 0,
            "total_revenue": float(p.total_revenue) if p.total_revenue else 0
        }
        for p in top_products
    ]

@app.get("/analytics/categories")
def get_categories_analytics(db: Session = Depends(get_db)):
    # Vendas por categoria
    category_sales = db.query(
        models.Category.id,
        models.Category.name,
        func.sum(models.Sale.quantity).label('total_quantity'),
        func.sum(models.Sale.total_price).label('total_revenue')
    ).join(
        models.Product, models.Category.id == models.Product.category_id
    ).join(
        models.Sale, models.Product.id == models.Sale.product_id
    ).group_by(
        models.Category.id, models.Category.name
    ).order_by(
        func.sum(models.Sale.total_price).desc()
    ).all()
    
    return [
        {
            "id": c.id,
            "name": c.name,
            "total_quantity": int(c.total_quantity) if c.total_quantity else 0,
            "total_revenue": float(c.total_revenue) if c.total_revenue else 0
        }
        for c in category_sales
    ]

@app.get("/analytics/monthly")
def get_monthly_analytics(db: Session = Depends(get_db)):
    # Vendas por mês
    monthly_sales = db.query(
        func.strftime('%Y-%m', models.Sale.date).label('month'),
        func.sum(models.Sale.quantity).label('total_quantity'),
        func.sum(models.Sale.total_price).label('total_revenue'),
        func.count(models.Sale.id).label('total_sales')
    ).group_by(
        func.strftime('%Y-%m', models.Sale.date)
    ).order_by(
        func.strftime('%Y-%m', models.Sale.date)
    ).all()
    
    return [
        {
            "month": m.month,
            "total_quantity": int(m.total_quantity) if m.total_quantity else 0,
            "total_revenue": float(m.total_revenue) if m.total_revenue else 0,
            "total_sales": int(m.total_sales) if m.total_sales else 0
        }
        for m in monthly_sales
    ]