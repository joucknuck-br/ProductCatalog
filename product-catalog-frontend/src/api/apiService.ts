import axios from 'axios';
import { Product, Category, ProductCreateDTO, ProductUpdateDTO } from '../model/models';

// Make sure this matches where your Spring Boot API is running
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Product API Calls ---

export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
};

export const createProduct = async (productData: ProductCreateDTO): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
};

export const updateProduct = async (id: number, productData: ProductUpdateDTO): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
};

// --- Category API Calls ---
// !! IMPORTANT: Assumes GET /api/categories exists on your backend !!
export const getCategories = async (): Promise<Category[]> => {
    // If your backend returns {id, name, path}, adjust the Category type accordingly
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
};