from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from io import StringIO
from datetime import datetime
import models
import pandas as pd

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartMart API")

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
        sale_date = datetime.strptime(row['date'], '%Y-%m-%d').date()

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