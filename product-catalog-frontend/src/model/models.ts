// Matches backend ProductDTO (more or less)
export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number; // Or string if you prefer to handle BigDecimal carefully
    categoryPath: string | null;
    stockQuantity: number;
    sku: string | null;
    // Add other fields if necessary (createdAt, updatedAt)
}

// Matches backend Category structure needed for dropdown
// !! Adjust based on what your GET /api/categories returns !!
export interface Category {
    id: number;
    name: string; // Or use path if more descriptive
    path?: string; // Optional, depending on backend endpoint
}

// Matches backend ProductCreateDTO
export interface ProductCreateDTO {
    name: string;
    description: string | null;
    price: number; // Send as number
    categoryId: number; // Send category ID
    stockQuantity: number;
    sku: string | null;
}

// Matches backend ProductUpdateDTO
export interface ProductUpdateDTO extends ProductCreateDTO {
     // Inherits fields from CreateDTO, assumes update uses the same structure + ID
}