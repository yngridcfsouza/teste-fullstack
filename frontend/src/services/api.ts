import axios from 'axios';

export interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number;
    category?: Category;
}

export interface Category {
    id: number;
    name: string;
}

export interface Sale {
    id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    date: string;
    product?: Product;
}

export interface ProductCreate {
    name: string;
    price: number;
    category_id: number;
}

export interface ProductUpdate {
    name?: string;
    price?: number;
    category_id?: number;
}

export interface SalesAnalytics {
    total_sales: number;
    total_revenue: number;
    total_quantity: number;
    average_sale_value: number;
}

export interface ProductAnalytics {
    id: number;
    name: string;
    total_quantity: number;
    total_revenue: number;
}

export interface CategoryAnalytics {
    id: number;
    name: string;
    total_quantity: number;
    total_revenue: number;
}

export interface MonthlyAnalytics {
    month: string;
    total_quantity: number;
    total_revenue: number;
    total_sales: number;
}

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Upload
export const uploadFile = async (endpoint: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (category: { name: string }): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
};

// Products
export const getProducts = async (params?: {
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
}): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (product: ProductCreate): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
};

export const updateProduct = async (id: number, product: ProductUpdate): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
};

// Sales
export const getSales = async (params?: { product_id?: number }): Promise<Sale[]> => {
    const response = await api.get('/sales', { params });
    return response.data;
};

// Analytics
export const getSalesAnalytics = async (): Promise<SalesAnalytics> => {
    const response = await api.get('/analytics/sales');
    return response.data;
};

export const getProductsAnalytics = async (): Promise<ProductAnalytics[]> => {
    const response = await api.get('/analytics/products');
    return response.data;
};

export const getCategoriesAnalytics = async (): Promise<CategoryAnalytics[]> => {
    const response = await api.get('/analytics/categories');
    return response.data;
};

export const getMonthlyAnalytics = async (): Promise<MonthlyAnalytics[]> => {
    const response = await api.get('/analytics/monthly');
    return response.data;
};

export default api;