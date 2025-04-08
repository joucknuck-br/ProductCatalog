/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/ProductListPage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, deleteProduct, Page } from '../api/apiService';
import { Product, Category } from '../model/models';
import { buildCategoryTree } from '../utils/treeUtils';
import { DropdownButton, Dropdown, Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import RecursiveDropdownItem from '../components/RecursiveDropdownItem';

const ProductListPage: React.FC = () => {
    // --- State Variables ---
    const [productPage, setProductPage] = useState<Page<Product> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryPathFilter, setCategoryPathFilter] = useState<string>('');
    const [minPriceFilter, setMinPriceFilter] = useState('');
    const [maxPriceFilter, setMaxPriceFilter] = useState('');
    const [inStockFilter, setInStockFilter] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sortField, setSortField] = useState<string>('name');
    const [sortDir, setSortDir] = useState<string>('asc');
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("All Categories");

    // --- Fetch Categories ---
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(err => console.error("Failed to load categories", err));
    }, []);

    // --- Build Category Tree ---
    const categoryTree = useMemo(() => {
        if (categories.length === 0) return [];
        const tree = buildCategoryTree(categories);
        return tree;
    }, [categories]);

    // --- Fetch Products ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const params = {
            page: currentPage,
            size: pageSize,
            sortBy: sortField,
            sortDir: sortDir,
            name: nameFilter || undefined,
            categoryPath: categoryPathFilter || undefined, 
            minPrice: minPriceFilter ? parseFloat(minPriceFilter) : undefined,
            maxPrice: maxPriceFilter ? parseFloat(maxPriceFilter) : undefined,
            inStockOnly: inStockFilter || undefined,
        };
        try {
            const data = await getProducts(params);
            setProductPage(data);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }

    }, [currentPage, pageSize, sortField, sortDir, nameFilter, categoryPathFilter, minPriceFilter, maxPriceFilter, inStockFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Handlers ---
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                alert('Product deleted successfully!');
                fetchProducts();
            } catch (err) {
                const strError = 'Failed to delete product: ' + err; 
                setError(strError);
                alert('Error deleting product. See console for details.');
            }
        }
    };

    const handleSortChange = (field: string) => {
        const newDir = (field === sortField && sortDir === 'asc') ? 'desc' : 'asc';
        setSortField(field);
        setSortDir(newDir);
        setCurrentPage(0);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    }

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(0);
    }

    const handleCategorySelect = (eventKey: string | null) => {
        setCategoryPathFilter(eventKey || "");
        setCurrentPage(0);
        if (eventKey === "") {
            setSelectedCategoryName("All Categories");
            return;
        }
        const findNodeInTree = (nodes: any[], path: string): string | undefined => {
            for (const node of nodes) {
                if (node.path === path) {
                    return node.name;
                }
                if (node.children && node.children.length > 0) {
                    const found = findNodeInTree(node.children, path);
                    if (found) {
                        return found;
                    }
                }
            }
            return undefined;
        };

        let eventKeyStr = ''
        if (eventKey != null) {
            eventKeyStr = eventKey.toString()
        }
        const categoryNameFromTree = findNodeInTree(categoryTree, eventKeyStr);
        if (categoryNameFromTree) {
            setSelectedCategoryName(categoryNameFromTree);
        }
    };

    // --- Determine Dropdown Button Title ---
    const selectedCategoryLabel = useMemo(() => {
        return selectedCategoryName;
    }, [selectedCategoryName]);

    // --- Render Logic ---
    if (loading && !productPage) {
        return <Container className="mt-4"><Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner></Container>;
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container className="mt-4">
            <h1>Product Management</h1>
            <div className="mb-3">
                <Link to="/add" className="btn btn-success me-2">Add New Product</Link>
                <Link to="/categories/add" className="btn btn-info">Add Category</Link>
            </div>

            <Row className="mb-3 align-items-center">
                <Col xs="auto">
                    <Form.Control
                        type="text"
                        placeholder="Filter by name..."
                        value={nameFilter}
                        onChange={(e) => { setNameFilter(e.target.value); setCurrentPage(0); }}
                    />
                </Col>
                <Col xs="auto">
                    <DropdownButton
                        id="category-filter-dropdown"
                        title={selectedCategoryLabel}
                        variant="secondary"
                    >
                        <Dropdown.Item
                            eventKey=""
                            onClick={() => {
                                handleCategorySelect("");
                            }}
                        >
                            All Categories
                        </Dropdown.Item>
                        <Dropdown.Divider />

                        {categoryTree.map(rootCategory => (
                            <RecursiveDropdownItem
                                key={rootCategory.id}
                                category={rootCategory}
                                onSelectCategory={handleCategorySelect}
                                level={0}
                            />
                        ))}

                        {categories.length === 0 && <Dropdown.Item disabled>Loading...</Dropdown.Item>}
                    </DropdownButton>
                </Col>
                <Col xs="auto">
                    <Form.Control type="number" placeholder="Min Price" value={minPriceFilter} onChange={e => { setMinPriceFilter(e.target.value); setCurrentPage(0); }} style={{ width: '8rem' }} />
                </Col>
                <Col xs="auto">
                    <Form.Control type="number" placeholder="Max Price" value={maxPriceFilter} onChange={e => { setMaxPriceFilter(e.target.value); setCurrentPage(0); }} style={{ width: '8rem' }} />
                </Col>
                <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        label="In Stock Only"
                        checked={inStockFilter}
                        onChange={e => { setInStockFilter(e.target.checked); setCurrentPage(0); }}
                    />
                </Col>
            </Row>

            {!productPage || productPage.empty ? (
                <Alert variant="info">No products found matching the criteria.</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th onClick={() => handleSortChange('name')} style={{ cursor: 'pointer' }}>
                                    Name {sortField === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th>Description</th>
                                <th onClick={() => handleSortChange('price')} style={{ cursor: 'pointer' }}>
                                    Price {sortField === 'price' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSortChange('categoryPath')} style={{ cursor: 'pointer' }}>
                                    Category Path {sortField === 'categoryPath' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => handleSortChange('stockQuantity')} style={{ cursor: 'pointer' }}>
                                    Available {sortField === 'stockQuantity' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th>SKU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productPage.content.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price?.toFixed(2)}</td>
                                    <td>{product.categoryPath || 'N/A'}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>{product.sku || 'N/A'}</td>
                                    <td>
                                        <Link to={`/edit/${product.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                        <Link to={`/categories/edit/${product.categoryId}`} className="btn btn-sm btn-warning me-1">Edit Cat</Link>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center">
                        <span>Page {productPage.number + 1} of {productPage.totalPages}</span>
                        <div>
                            <Button variant="outline-primary" onClick={() => handlePageChange(currentPage - 1)} disabled={productPage.first} className="me-2">
                                Previous
                            </Button>
                            <Button variant="outline-primary" onClick={() => handlePageChange(currentPage + 1)} disabled={productPage.last}>
                                Next
                            </Button>
                        </div>
                        <Form.Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            style={{ width: 'auto' }}
                            className="ms-2"
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </Form.Select>
                    </div>
                </>
            )}
        </Container>
    );
};

export default ProductListPage;