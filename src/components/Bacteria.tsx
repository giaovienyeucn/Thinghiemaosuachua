import { motion } from 'framer-motion';

interface BacteriaProps {
    isActive: boolean;
    multiplying?: boolean;
}

export function Bacteria({ isActive, multiplying = false }: BacteriaProps) {
    if (!isActive) return null;

    const bacteriaCount = multiplying ? 20 : 8;

    return (
        <div className="bacteria-container">
            {[...Array(bacteriaCount)].map((_, i) => (
                <motion.div
                    key={i}
                    className="bacterium"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                    }}
                    initial={{
                        scale: 0,
                        rotate: Math.random() * 360,
                    }}
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        x: [0, Math.random() * 40 - 20, 0],
                        y: [0, Math.random() * 40 - 20, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                    }}
                />
            ))}
            {multiplying && (
                <motion.div
                    className="multiply-text"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Vi khuẩn đang nhân đôi! 🦠×2
                </motion.div>
            )}
        </div>
    );
}
