/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { createCategory, getCategories } from '../api/apiService';
import { Category, CategoryCreateUpdateDTO } from '../model/models';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';

const CategoryAddPage: React.FC = () => {
    const navigate = useNavigate();
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        setLoadingCategories(true);
        getCategories()
            .then(data => setAllCategories(data))
            .catch(err => {
                console.error("Failed to load categories", err);
                setError("Could not load categories for parent selection.");
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleAddCategory = async (data: CategoryCreateUpdateDTO) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createCategory(data);
            alert('Category added successfully!');
            navigate('/');
        } catch (err: any) {
            console.error('Failed to add category:', err);
            const message = `Failed to add category: ${err.response?.data?.message || err.message || 'Unknown error'}`;
            setError(message);
            alert(`Error: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={{ span: 8, offset: 2 }}>
                    <h1>Add New Category</h1>
                    {loadingCategories && (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading parent category options...</span>
                            </Spinner>
                            <p className="mt-2">Loading parent category options...</p>
                        </div>
                    )}
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}
                    {!loadingCategories && (
                        <CategoryForm
                            allCategories={allCategories}
                            onSubmit={handleAddCategory}
                            isSubmitting={isSubmitting}
                            submitButtonText="Add Category"
                        />
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        className="mt-3"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CategoryAddPage;