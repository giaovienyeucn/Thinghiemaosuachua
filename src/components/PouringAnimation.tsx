import { motion } from 'framer-motion';

interface PouringAnimationProps {
    isActive: boolean;
}

export function PouringAnimation({ isActive }: PouringAnimationProps) {
    if (!isActive) return null;

    return (
        <div className="pouring-container">
            {/* Milk stream */}
            <motion.div
                className="milk-stream"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                    scaleY: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Milk drops */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="milk-drop"
                    style={{
                        left: `${45 + Math.random() * 10}%`,
                    }}
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        y: [0, 80, 120],
                        opacity: [1, 1, 0],
                        scale: [1, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeIn"
                    }}
                />
            ))}

            {/* Splash effect at bottom */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={`splash-${i}`}
                    className="milk-splash"
                    style={{
                        left: `${40 + i * 5}%`,
                        bottom: '20%'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.8, 0],
                        y: [0, -10, -5]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: 0.5 + i * 0.15,
                    }}
                />
            ))}
        </div>
    );
}
