import React, { useState, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { CategoryNode } from '../model/models';

interface RecursiveDropdownItemProps {
    category: CategoryNode;
    onSelectCategory: (eventKey: string | null) => void;
    level?: number;
}

const RecursiveDropdownItem: React.FC<RecursiveDropdownItemProps> = ({
    category,
    onSelectCategory,
    level = 0
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const currentEventKey = category.path || '';
    const itemRef = useRef<HTMLAnchorElement | null>(null);
    const timeoutId = useRef<number | null>(null);

    const openSubmenu = () => {
        if (hasChildren) {
            setIsOpen(true);
        }
    };

    const closeSubmenu = () => {
        if (hasChildren) {
            setIsOpen(false);
        }
    };

    const handleMouseEnter = () => {
        if (hasChildren) {
            timeoutId.current = setTimeout(openSubmenu, 150); 
        }
    };

    const handleMouseLeave = () => {
        if (hasChildren) {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            timeoutId.current = setTimeout(closeSubmenu, 150); 
        }
    };

    const handleSubmenuMouseEnter = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
    };

    const handleSubmenuMouseLeave = () => {
        timeoutId.current = setTimeout(closeSubmenu, 150);
    };

    const handleSelect = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onSelectCategory(currentEventKey);
        if (hasChildren) {
            e?.preventDefault();
        }
    };

    const itemStyle = {
        paddingLeft: `${15 + level * 20}px`
    };

    return (
        <>
            <Dropdown.Item
                ref={itemRef}
                onClick={handleSelect}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={itemStyle}
                eventKey={currentEventKey}
            >
                {hasChildren ? (isOpen ? '▼ ' : '\u25B6 ') : ''}
                {category.name}
            </Dropdown.Item>

            {hasChildren && isOpen && (
                <div
                    onMouseEnter={handleSubmenuMouseEnter}
                    onMouseLeave={handleSubmenuMouseLeave}
                >
                    {category.children.map(child => (
                        <RecursiveDropdownItem
                            key={child.id}
                            category={child}
                            onSelectCategory={onSelectCategory}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default RecursiveDropdownItem;