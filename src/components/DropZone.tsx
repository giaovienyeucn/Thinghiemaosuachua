import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface DropZoneProps {
    id: string;
    children?: React.ReactNode;
    label: string;
    isActive?: boolean;
    isComplete?: boolean;
}

export function DropZone({ id, children, label, isActive = false, isComplete = false }: DropZoneProps) {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    return (
        <motion.div
            ref={setNodeRef}
            className={`drop-zone ${isOver ? 'over' : ''} ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
            animate={{
                scale: isOver ? 1.05 : 1,
                borderColor: isOver ? '#22c55e' : isComplete ? '#10b981' : '#60a5fa',
            }}
        >
            {children}
            <div className="drop-zone-label">{label}</div>
            {isComplete && (
                <motion.div
                    className="check-mark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                >
                    ✓
                </motion.div>
            )}
        </motion.div>
    );
}
