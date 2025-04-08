// Matches backend ProductDTO (more or less)
export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number; 
    categoryPath: string | null;
    stockQuantity: number;
    sku: string | null;
    categoryId: number;
}

export interface ProductCreateDTO {
    name: string;
    description: string | null;
    price: number; 
    categoryId: number; 
    stockQuantity: number;
    sku: string | null;
}

export interface Category {
    id: number;
    parentCategoryId: number | null;
    name: string; 
    path?: string; 
}

export interface CategoryNode extends Category {
    children: CategoryNode[];
}

export interface CategoryDetail extends Category {
    parentCategoryId: number | null;
}

export interface CategoryCreateUpdateDTO {
    name: string;
    parentCategoryId: number | null;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}