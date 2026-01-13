import { motion } from 'framer-motion';

interface SteamProps {
    isActive: boolean;
}

export function Steam({ isActive }: SteamProps) {
    if (!isActive) return null;

    return (
        <div className="steam-container">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="steam-particle"
                    initial={{
                        y: 0,
                        opacity: 0.8,
                        x: Math.random() * 60 - 30
                    }}
                    animate={{
                        y: [-20, -80],
                        opacity: [0.8, 0],
                        x: [Math.random() * 60 - 30, Math.random() * 100 - 50],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 1,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}
