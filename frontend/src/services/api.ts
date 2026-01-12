import axios from 'axios';

export interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number;
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
}

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

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

export default api;