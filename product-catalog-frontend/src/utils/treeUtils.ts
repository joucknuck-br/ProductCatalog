import { Category, CategoryNode } from '../model/models';

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
    const categoriesById: { [key: number]: CategoryNode } = {};
    const rootNodes: CategoryNode[] = [];

    categories.forEach(cat => {
        categoriesById[cat.id] = { ...cat, children: [] };
    });

    const getPath = (categoryId: number): string | undefined => {
        const category = categoriesById[categoryId];
        if (!category) {
            return undefined;
        }
        if (category.parentCategoryId === null || category.parentCategoryId === undefined) {
            return category.name;
        }
        const parentPath = getPath(category.parentCategoryId);
        return parentPath ? `${parentPath} > ${category.name}` : category.name;
    };

    categories.forEach(cat => {
        const node = categoriesById[cat.id];
        node.path = getPath(cat.id);
        if (cat.parentCategoryId === null || cat.parentCategoryId === undefined) {
            rootNodes.push(node);
        } else {
            const parentNode = categoriesById[cat.parentCategoryId];
            if (parentNode) {
                if (!parentNode.children.some(child => child.id === node.id)) {
                    parentNode.children.push(node);
                }
            }
            else {
                console.warn(`Parent category with ID ${cat.parentCategoryId} not found for category ${cat.name}`);
            }
        }
    });

    const sortChildren = (node: CategoryNode) => {
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.forEach(sortChildren);
    };
    rootNodes.forEach(sortChildren);
    rootNodes.sort((a,b)=> a.name.localeCompare(b.name));

    return rootNodes;
}