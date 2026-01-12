export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number;
    category?: Category; 
}

export interface Sale {
    id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    date: string;
}