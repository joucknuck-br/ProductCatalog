import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { Product, Category, ProductCreateDTO, CategoryDetail, CategoryCreateUpdateDTO, Page } from '../model/models';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ProductApiParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    name?: string;
    categoryPath?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth'); // Get the token from the cookie
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Product API Calls ---

export const getProducts = async (
    params: ProductApiParams = {}
): Promise<Page<Product>> => {
    const cleanParams: Record<string, unknown> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (key === 'inStockOnly' && value === false) {
                // Skip sending 'inStockOnly=false'
            } else {
                cleanParams[key] = value;
            }
        }
    });

    const response = await apiClient.get<Page<Product>>('/products', {
        params: cleanParams,
    });
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
};

export const createProduct = async (
    productData: ProductCreateDTO
): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
};

export const updateProduct = async (
    id: number,
    productData: ProductCreateDTO
): Promise<Product> => {
    const response = await apiClient.put<Product>(
        `/products/${id}`,
        productData
    );
    return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
};

// --- Category API Calls ---

export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
};

export const getCategoryById = async (id: number): Promise<CategoryDetail> => {
    const response = await apiClient.get<CategoryDetail>(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (
    categoryData: CategoryCreateUpdateDTO
): Promise<Category> => {
    const response = await apiClient.post<Category>(
        '/categories',
        categoryData
    );
    return response.data;
};

export const updateCategory = async (
    id: number,
    categoryData: CategoryCreateUpdateDTO
): Promise<Category> => {
    const response = await apiClient.put<Category>(
        `/categories/${id}`,
        categoryData
    );
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
};

export type { Page };