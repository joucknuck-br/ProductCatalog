/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Category, ProductCreateDTO , Product } from '../model/models';
import { Form, FormGroup, FormLabel, FormControl, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { buildCategoryTree } from '../utils/treeUtils';
import RecursiveDropdownItem from './RecursiveDropdownItem';

interface ProductFormProps {
    initialData?: Product | null;
    categories: Category[];
    onSubmit: (data: ProductCreateDTO | ProductCreateDTO ) => void;
    isSubmitting: boolean;
    submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
    initialData = null,
    categories: flatCategories,
    onSubmit,
    isSubmitting,
    submitButtonText = 'Save Product'
}) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState<string>(initialData?.price?.toString() || '');
    const [stockQuantity, setStockQuantity] = useState<string>(initialData?.stockQuantity?.toString() || '');
    const [sku, setSku] = useState(initialData?.sku || '');
    const [categoryPathFilter, setCategoryPathFilter] = useState<string>('');
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("Select Category");

    const categoryTree = useMemo(() => {
        return buildCategoryTree(flatCategories);
    }, [flatCategories]);

    const findInitialCategoryPath = (): string => {
        if (!initialData || !initialData.categoryPath) return '';
        return initialData.categoryPath;
    }
    useEffect(() => {
        setName(initialData?.name || '');
        setDescription(initialData?.description || '');
        setPrice(initialData?.price?.toString() || '');
        setStockQuantity(initialData?.stockQuantity?.toString() || '');
        setSku(initialData?.sku || '');
        setCategoryPathFilter(findInitialCategoryPath());
        setSelectedCategoryName("Select Category");
    }, [initialData, flatCategories]);

    const handleCategorySelect = (eventKey: string | null) => {
        setCategoryPathFilter(eventKey || "");
        if (eventKey === "") {
            setSelectedCategoryName("Select Category");
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stockQuantity, 10);
        const selectedCategory = flatCategories.find(c => c.name === selectedCategoryName);
        const parsedCategoryId = selectedCategory ? selectedCategory.id : null;

        if (isNaN(parsedPrice) || isNaN(parsedStock) || parsedCategoryId === null) {
            alert('Please enter valid numbers for Price, Stock, and select a Category.');
            return;
        }

        const productData: ProductCreateDTO = {
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
        <Form onSubmit={handleSubmit} className="product-form">
            <FormGroup className="mb-3">
                <FormLabel htmlFor="name">Name:</FormLabel>
                <FormControl
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel htmlFor="description">Description:</FormLabel>
                <FormControl
                    as="textarea"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel htmlFor="price">Price:</FormLabel>
                <FormControl
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel htmlFor="stockQuantity">Stock Quantity:</FormLabel>
                <FormControl
                    type="number"
                    id="stockQuantity"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel htmlFor="sku">SKU:</FormLabel>
                <FormControl
                    type="text"
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />
            </FormGroup>
            <FormGroup className="mb-3">
                <FormLabel htmlFor="category">Category:</FormLabel>
                <DropdownButton
                    id="category-filter-dropdown"
                    title={selectedCategoryName || "Select Category"}
                    variant="secondary"
                    disabled={isSubmitting || flatCategories.length === 0}
                >
                    <Dropdown.Item
                        eventKey=""
                        onClick={() => handleCategorySelect("")}
                    >
                        -- Select Category --
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
                    {flatCategories.length === 0 && <Dropdown.Item disabled>Loading categories...</Dropdown.Item>}
                </DropdownButton>
                <FormControl
                    type="hidden"
                    value={categoryPathFilter}
                    id="categoryPath"
                />
            </FormGroup>
            <Button type="submit" disabled={isSubmitting || flatCategories.length === 0}>
                {isSubmitting ? 'Saving...' : submitButtonText}
            </Button>
        </Form>
    );
};

export default ProductForm;