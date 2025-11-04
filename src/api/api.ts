import { Product } from '../types/Product';

const API_URL = 'https://fakestoreapi.com';

export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch('https://fakestoreapi.com/products');
    return response.json();
};

export const getCategories = async (): Promise<string[]> => {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    return response.json();
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
};