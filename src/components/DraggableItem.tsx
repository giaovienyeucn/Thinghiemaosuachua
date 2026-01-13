import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface DraggableItemProps {
    id: string;
    name: string;
    image: string;
    disabled?: boolean;
}

export function DraggableItem({ id, name, image, disabled = false }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        disabled,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`draggable-item ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
            whileHover={!disabled ? { scale: 1.1 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: disabled ? 0.4 : 1, y: 0 }}
        >
            <span className="item-image">{image}</span>
            <span className="item-label">{name}</span>
        </motion.div>
    );
}
