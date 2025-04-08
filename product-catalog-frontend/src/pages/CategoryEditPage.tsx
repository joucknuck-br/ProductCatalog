/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { getCategoryById, updateCategory, getCategories } from '../api/apiService';
import { Category, CategoryDetail, CategoryCreateUpdateDTO } from '../model/models';

const CategoryEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const categoryId = Number(id);

    const [category, setCategory] = useState<CategoryDetail | null>(null);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(categoryId)) {
            setError('Invalid Category ID.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        Promise.all([
            getCategoryById(categoryId),
            getCategories()
        ]).then(([categoryData, allCategoryData]) => {
            setCategory(categoryData);
            setAllCategories(allCategoryData);
        }).catch(err => {
            console.error('Failed to load data for editing category:', err);
            setError('Failed to load category data. Please try again.');
        }).finally(() => {
            setLoading(false);
        });

    }, [categoryId]);

    const handleUpdateCategory = async (data: CategoryCreateUpdateDTO) => {
         if (isNaN(categoryId)) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await updateCategory(categoryId, data);
            alert('Category updated successfully!');
            navigate('/');
        } catch (err: any) {
             console.error('Failed to update category:', err);
             const message = `Failed to update category: ${err.response?.data?.message || err.message || 'Unknown error'}`;
             setError(message);
             alert(`Error: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading category data...</div>;
    }

    if (error && !category) {
        return <div className="error-message">{error}</div>;
    }

     if (!category) {
        return <div className="error-message">Category not found or failed to load.</div>;
    }

    return (
        <div className="container">
            <h1>Edit Category</h1>
            {error && <p className="error-message">{error}</p>}
            <CategoryForm
                initialData={category}
                allCategories={allCategories}
                onSubmit={handleUpdateCategory}
                isSubmitting={isSubmitting}
                submitButtonText="Update Category"
            />
            <button onClick={() => navigate(-1)} disabled={isSubmitting} style={{marginTop: '10px'}}>
                 Cancel
            </button>
        </div>
    );
};

export default CategoryEditPage;