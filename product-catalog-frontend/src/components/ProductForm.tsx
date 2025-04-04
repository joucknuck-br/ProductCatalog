import { useState, useEffect } from 'react';
import { Category, ProductCreateDTO, ProductUpdateDTO, Product } from '../model/models';

interface ProductFormProps {
    initialData?: Product | null; // Product data for editing, null/undefined for adding
    categories: Category[];
    onSubmit: (data: ProductCreateDTO | ProductUpdateDTO) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
    initialData = null,
    categories,
    onSubmit,
    isSubmitting,
    submitButtonText = 'Save Product'
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState<string>(initialData?.price?.toString() || ''); // Keep as string for input
    const [stockQuantity, setStockQuantity] = useState<string>(initialData?.stockQuantity?.toString() || ''); // Keep as string
    const [sku, setSku] = useState(initialData?.sku || '');
    // Find the initial category ID based on the path (this is tricky if path isn't unique/reliable)
    // A better approach would be if initialData included categoryId directly
    // For simplicity, let's find the best match or default
    const findInitialCategoryId = (): string => {
        if (!initialData || !initialData.categoryPath || categories.length === 0) return '';
        // Attempt to find category by path if available, otherwise fallback
        const matchingCategory = categories.find(c => c.path === initialData.categoryPath);
        if(matchingCategory) return matchingCategory.id.toString();
        // Fallback: maybe find by name part? Or just default to first?
        // This depends heavily on how categories are structured/returned
        return categories[0]?.id.toString() || ''; // Default to first or empty
    }
    const [categoryId, setCategoryId] = useState<string>(findInitialCategoryId());


    useEffect(() => {
        // Update form if initialData changes (e.g., when navigating to edit page)
        setName(initialData?.name || '');
        setDescription(initialData?.description || '');
        setPrice(initialData?.price?.toString() || '');
        setStockQuantity(initialData?.stockQuantity?.toString() || '');
        setSku(initialData?.sku || '');
        setCategoryId(findInitialCategoryId());
    }, [initialData, categories]); // Rerun effect if initialData or categories change

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stockQuantity, 10);
        const parsedCategoryId = parseInt(categoryId, 10);

        if (isNaN(parsedPrice) || isNaN(parsedStock) || isNaN(parsedCategoryId)) {
            alert('Please enter valid numbers for Price, Stock, and select a Category.');
            return;
        }

        const productData: ProductCreateDTO | ProductUpdateDTO = {
            name,
            description: description || null,
            price: parsedPrice,
            stockQuantity: parsedStock,
            sku: sku || null,
            categoryId: parsedCategoryId,
        };
        onSubmit(productData);
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="stockQuantity">Stock Quantity:</label>
                <input
                    type="number"
                    id="stockQuantity"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="sku">SKU:</label>
                <input
                    type="text"
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    disabled={categories.length === 0}
                >
                    <option value="" disabled>-- Select Category --</option>
                    {categories.length === 0 && <option disabled>Loading categories...</option>}
                    {categories.map((cat) => (
                         // Display category path if available, otherwise name
                        <option key={cat.id} value={cat.id}>
                           {cat.path || cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" disabled={isSubmitting || categories.length === 0}>
                {isSubmitting ? 'Saving...' : submitButtonText}
            </button>
        </form>
    );
};

export default ProductForm;