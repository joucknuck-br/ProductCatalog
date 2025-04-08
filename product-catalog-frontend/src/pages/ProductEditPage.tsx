/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { getProductById, updateProduct, getCategories } from '../api/apiService';
import { Product, Category, ProductCreateDTO } from '../model/models';
import { Col, Container, Row } from 'react-bootstrap';

const ProductEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    const productId = Number(id);

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(productId)) {
            setError('Invalid Product ID.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        Promise.all([
            getProductById(productId),
            getCategories()
        ]).then(([productData, categoryData]) => {
            setProduct(productData);
            setCategories(categoryData);
        }).catch(err => {
            const strError = 'Failed to load product or category data: ' + err;
            setError(strError);
        }).finally(() => {
            setLoading(false);
        });

    }, [productId]);

    const handleUpdateProduct = async (data: ProductCreateDTO) => {
         if (isNaN(productId)) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await updateProduct(productId, data);
            alert('Product updated successfully!');
            navigate('/'); 
        } catch (err: any) {
            console.error('Failed to update product:', err);

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
    
            setError(`Failed to update product: ${errorMessage}`);
    
            alert(`Error: Failed to update product: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading product data...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

     if (!product) {
        return <div className="error-message">Product not found.</div>;
    }


    return (
        <Container className="mt-4">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <h1>Edit Product</h1>
                    {error && <p className="error-message">{error}</p>}
                    <ProductForm
                        initialData={product}
                        categories={categories}
                        onSubmit={handleUpdateProduct}
                        isSubmitting={isSubmitting}
                        submitButtonText="Update Product"
                    />
                    <button onClick={() => navigate('/')} disabled={isSubmitting}>Cancel</button>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductEditPage;