import { motion } from 'framer-motion';

interface BubblesProps {
    isActive: boolean;
}

export function Bubbles({ isActive }: BubblesProps) {
    if (!isActive) return null;

    return (
        <div className="bubbles-container">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="bubble"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        width: `${8 + Math.random() * 12}px`,
                        height: `${8 + Math.random() * 12}px`,
                    }}
                    initial={{
                        y: 0,
                        opacity: 0.7,
                    }}
                    animate={{
                        y: [-20, -120],
                        opacity: [0.7, 0],
                    }}
                    transition={{
                        duration: 1.5 + Math.random() * 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}
