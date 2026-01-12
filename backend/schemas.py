from pydantic import BaseModel
from typing import Optional
from datetime import date

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None

class Product(ProductBase):
    id: int
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True

class SaleBase(BaseModel):
    product_id: int
    quantity: int
    total_price: float
    date: date

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id: int
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

