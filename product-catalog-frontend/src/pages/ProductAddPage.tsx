import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct, getCategories } from '../api/apiService';
import { Category, ProductCreateDTO } from '../model/models';

const ProductAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);

     useEffect(() => {
        setLoadingCategories(true);
        getCategories()
            .then(data => setCategories(data))
            .catch(err => {
                console.error("Failed to load categories", err);
                setError("Could not load categories for form.");
            })
            .finally(() => setLoadingCategories(false));
    }, []);


    const handleAddProduct = async (data: ProductCreateDTO) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createProduct(data);
            alert('Product added successfully!');
            navigate('/'); // Redirect to product list
        } catch (err: unknown) {
            console.error('Failed to add product:', err);

            let errorMessage = 'An unknown error occurred.'; // Default message
    
            if (err instanceof Error) {
                // It's a standard JavaScript Error object (or subclass)
                errorMessage = err.message;
    
                if (typeof err === 'object' && err !== null && 'response' in err) {
                     // Assert the type cautiously after the check OR create a more specific type guard
                     const response = (err as { response?: { data?: { message?: string } } }).response;
                     if (response?.data?.message && typeof response.data.message === 'string') {
                        errorMessage = response.data.message; // Use the specific message from the response
                     }
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            setError(`Failed to add product: ${errorMessage}`);
    
            alert(`Error: Failed to add product: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Add New Product</h1>
             {loadingCategories && <p>Loading category options...</p>}
             {error && <p className="error-message">{error}</p>}
             {!loadingCategories && (
                  <ProductForm
                      categories={categories}
                      onSubmit={handleAddProduct}
                      isSubmitting={isSubmitting}
                      submitButtonText="Add Product"
                  />
             )}
            <button onClick={() => navigate('/')} disabled={isSubmitting}>Cancel</button>
        </div>
    );
};

export default ProductAddPage;