import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { createProduct, getCategories } from '../api/apiService';
import { Category, ProductCreateDTO } from '../model/models';
import { Col, Container, Row } from 'react-bootstrap';

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
            navigate('/'); 
        } catch (err: unknown) {
            console.error('Failed to add product:', err);

            let errorMessage = 'An unknown error occurred.';
    
            if (err instanceof Error) {
                errorMessage = err.message;
    
                if (typeof err === 'object' && err !== null && 'response' in err) {
                     const response = (err as { response?: { data?: { message?: string } } }).response;
                     if (response?.data?.message && typeof response.data.message === 'string') {
                        errorMessage = response.data.message; 
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
        <Container className="mt-4">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
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
                </Col>
            </Row>
        </Container>
    );
};

export default ProductAddPage;