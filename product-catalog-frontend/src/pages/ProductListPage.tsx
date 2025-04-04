import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/apiService';
import { Product } from '../model/models';

const ProductListPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Depend on the memoized fetch function

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                // Refetch products after deletion or filter locally
                setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
                // fetchProducts(); // Alternatively, refetch the whole list
                alert('Product deleted successfully!');
            } catch (err) {
                setError('Failed to delete product.');
                console.error(err);
                alert('Error deleting product. See console for details.');
            }
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="product-list-page">
            <h1>Product Management</h1>
            <Link to="/add" className="add-button">Add New Product</Link>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category Path</th>
                            <th>Available (Stock)</th>
                            <th>SKU</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price?.toFixed(2)}</td> {/* Format price */}
                                <td>{product.categoryPath || 'N/A'}</td>
                                <td>{product.stockQuantity}</td>
                                <td>{product.sku || 'N/A'}</td>
                                <td>
                                    <Link to={`/edit/${product.id}`} className="action-button edit">Edit</Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="action-button delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductListPage;