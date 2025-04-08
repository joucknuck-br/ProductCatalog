/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Category, CategoryCreateUpdateDTO, CategoryDetail } from '../model/models';
import { Form, Button, FormGroup, FormLabel, FormControl, FormSelect } from 'react-bootstrap';

interface CategoryFormProps {
    initialData?: CategoryDetail | null;
    allCategories: Category[]; 
    onSubmit: (data: CategoryCreateUpdateDTO) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData = null,
    allCategories,
    onSubmit,
    isSubmitting,
    submitButtonText = 'Save Category'
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Array<number | null>>([]);

    // --- Helper Functions ---
    const getChildrenOf = (parentId: number | null): Category[] => {
        const categoryIdBeingEdited = initialData?.id;
        return allCategories.filter(cat =>
            cat.parentCategoryId === parentId && cat.id !== categoryIdBeingEdited
        );
    };

    // Memoize root categories
    const rootCategories = useMemo(() => getChildrenOf(null), [allCategories, initialData?.id]);

    // --- Effect to set initial selection path when editing ---
    useEffect(() => {
        setName(initialData?.name || '');
        if (initialData && initialData.parentCategoryId !== undefined) {
            const pathIds: Array<number | null> = [];
            let currentParentId: number | null = initialData.parentCategoryId;
            const safetyBreak = 10;
            let count = 0;

            while (currentParentId !== null && count < safetyBreak) {
                pathIds.unshift(currentParentId);
                const parent = allCategories.find(c => c.id === currentParentId);
                currentParentId = parent ? parent.parentCategoryId : null;
                count++;
            }
            setSelectedCategoryIds(pathIds);
        } else {
            setSelectedCategoryIds([]);
        }
    }, [initialData, allCategories]); 

    // --- Event Handlers ---
    const handleSelectionChange = (level: number, selectedIdString: string) => {
        const newSelectedIds = [...selectedCategoryIds].slice(0, level); 
        const selectedId = selectedIdString === '' ? null : parseInt(selectedIdString, 10);

        if (selectedId !== null && !isNaN(selectedId)) {
            newSelectedIds[level] = selectedId;
        }
        if (JSON.stringify(newSelectedIds) !== JSON.stringify(selectedCategoryIds)) {
            setSelectedCategoryIds(newSelectedIds);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const finalParentId = selectedCategoryIds.length > 0 ? selectedCategoryIds[selectedCategoryIds.length - 1] : null;

        if (initialData && initialData.id === finalParentId) {
            alert("A category cannot be its own parent.");
            return;
        }

        const categoryData: CategoryCreateUpdateDTO = {
            name,
            parentCategoryId: finalParentId,
        };
        onSubmit(categoryData);
    };

    // --- Dynamic Dropdown Rendering ---
    const renderDropdowns = () => {
        const dropdowns = [];
        let currentLevelCategories = rootCategories;
        let parentIdForNextLevel: number | null = null;

        dropdowns.push(
            <FormGroup key="level-root" className="mb-3">
                <FormLabel htmlFor="parentCategory-root">Parent Level 1 (Root):</FormLabel>
                <FormSelect
                    id="parentCategory-root"
                    value={selectedCategoryIds[0] ?? ''}
                    onChange={(e) => handleSelectionChange(0, e.target.value)}
                    disabled={isSubmitting || currentLevelCategories.length === 0}
                >
                    <option value="">-- None (Root Category) --</option>
                    {currentLevelCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name} 
                        </option>
                    ))}
                </FormSelect>
            </FormGroup>
        );

        // Render subsequent dropdowns based on selections
        for (let i = 0; i < selectedCategoryIds.length; i++) {
            parentIdForNextLevel = selectedCategoryIds[i];
            if (parentIdForNextLevel === null) break; 

            currentLevelCategories = getChildrenOf(parentIdForNextLevel);
            if (currentLevelCategories.length === 0) break;

            dropdowns.push(
                <FormGroup key={`level-${i + 1}`} className="mb-3">
                    <FormLabel htmlFor={`parentCategory-${i + 1}`}>Parent Level {i + 2}:</FormLabel>
                    <FormSelect
                        id={`parentCategory-${i + 1}`}
                        value={selectedCategoryIds[i + 1] ?? ''}
                        onChange={(e) => handleSelectionChange(i + 1, e.target.value)}
                        disabled={isSubmitting}
                    >
                        <option value="">-- Select Subcategory --</option>
                        {currentLevelCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>
            );
        }

        return dropdowns;
    };


    return (
        <Form onSubmit={handleSubmit} className="category-form">
            <FormGroup className="mb-3">
                <FormLabel htmlFor="name">Category Name:</FormLabel>
                <FormControl
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </FormGroup>

            <fieldset className="mb-3" style={{ border: '1px solid #ccc', padding: '10px' }}>
                <legend>Parent Category</legend>
                {allCategories.length === 0 && <p>Loading category options...</p>}
                {allCategories.length > 0 && renderDropdowns()}
            </fieldset>

            <Button type="submit" disabled={isSubmitting || !name}>
                {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>
        </Form>
    );
};

export default CategoryForm;