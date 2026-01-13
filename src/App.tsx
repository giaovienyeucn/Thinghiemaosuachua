import { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableItem } from './components/DraggableItem';
import { DropZone } from './components/DropZone';
import { Steam } from './components/Steam';
import { Bubbles } from './components/Bubbles';
import { Bacteria } from './components/Bacteria';
import { PouringAnimation } from './components/PouringAnimation';
import { useSoundEffect } from './components/useSoundEffect';
import './index.css';

// Import step images
import step1 from './assets/1.png';
import step2 from './assets/2.png';
import step2Bowl from './assets/warm_water_bowl.png';
import step3 from './assets/3.png';
import step3Bowl from './assets/milk_bowl.png';
import step4 from './assets/4.png';
import step5 from './assets/5.png';
import step5Empty from './assets/empty_box.png';
import step6 from '../anh/8.jpg';
import step7 from './assets/7.png';

interface StepData {
    title: string;
    description: string;
    image: string;
    scienceInfo: {
        title: string;
        content: string;
        hasAudio?: boolean;
    };
    dragItems: { id: string; name: string; emoji: string }[];
    dropZoneLabel: string;
    animation: 'steam' | 'bubbles' | 'bacteria' | 'bacteria-multiply' | 'snowflakes' | 'pouring' | 'none';
}

const stepsData: StepData[] = [
    {
        title: "Bước 1: Pha nước ấm (40-50°C)",
        description: "Kéo ấm nước nóng và nước lạnh vào bình pha để có nhiệt độ 40-50°C",
        image: step1,
        scienceInfo: {
            title: "🌡️ Tại sao cần nhiệt độ 40-50°C?",
            content: "Nhiệt độ này là môi trường lý tưởng cho vi khuẩn lactic phát triển. Nếu quá nóng (>60°C), vi khuẩn sẽ chết. Nếu quá lạnh (<35°C), vi khuẩn hoạt động yếu."
        },
        dragItems: [
            { id: 'hot-water', name: 'Nước nóng', emoji: '🫖' },
            { id: 'cold-water', name: 'Nước lạnh', emoji: '🧊' },
        ],
        dropZoneLabel: 'Bình pha 🫙',
        animation: 'pouring',
    },
    {
        title: "Bước 2: Hòa sữa đặc",
        description: "Kéo lon sữa đặc để đổ vào bình nước ấm",
        image: step2Bowl,
        scienceInfo: {
            title: "🥛 Vai trò của sữa đặc",
            content: "Sữa đặc cung cấp đường lactose - nguồn thức ăn chính cho vi khuẩn lactic. Vi khuẩn sẽ 'ăn' đường này và chuyển hóa thành acid lactic."
        },
        dragItems: [
            { id: 'condensed-milk', name: 'Sữa đặc', emoji: '🥫' },
        ],
        dropZoneLabel: 'Bình nước ấm 🫙',
        animation: 'pouring',
    },
    {
        title: "Bước 3: Cho sữa chua giống",
        description: "Kéo hũ sữa chua giống để đổ vào hỗn hợp sữa (bổ sung vi khuẩn lên men)",
        image: step3Bowl,
        scienceInfo: {
            title: "🦠 Vi khuẩn Lactobacillus (Lac-tô-ba-xi-lút)",
            content: "Sữa chua giống chứa vi khuẩn Lactobacillus - 'nhân vật chính' của quá trình lên men! Vi khuẩn này sẽ nhân đôi và biến đường thành acid lactic, làm sữa đông đặc lại thành sữa chua.",
            hasAudio: true
        },
        dragItems: [
            { id: 'yogurt-starter', name: 'Sữa chua giống', emoji: '🥛' },
        ],
        dropZoneLabel: 'Hỗn hợp sữa 🥣',
        animation: 'pouring',
    },
    {
        title: "Bước 4: Rót vào cốc",
        description: "Kéo cốc sữa để rót hỗn hợp vào các hũ thủy tinh",
        image: step4,
        scienceInfo: {
            title: "🫙 Tại sao phải đậy kín nắp?",
            content: "Vi khuẩn lactic là vi khuẩn kỵ khí (không cần oxy). Đậy kín nắp giúp tạo môi trường yếm khí, giúp vi khuẩn hoạt động hiệu quả hơn."
        },
        dragItems: [
            { id: 'milk-cup', name: 'Cốc sữa', emoji: '🥛' },
        ],
        dropZoneLabel: 'Hũ thủy tinh 🫙',
        animation: 'pouring',
    },
    {
        title: "Bước 5: Ủ ấm (8-12 giờ)",
        description: "Kéo từng hũ sữa vào hộp ủ nhiệt để vi khuẩn hoạt động",
        image: step5Empty,
        scienceInfo: {
            title: "⏰ Quá trình lên men diệu kỳ!",
            content: "Trong 8-12 giờ, vi khuẩn lactic sẽ: 1) Nhân đôi số lượng hàng triệu lần 2) 'Ăn' đường lactose 3) Tạo ra acid lactic 4) Acid lactic làm protein sữa đông tụ → sữa chua thành hình!"
        },
        dragItems: [
            { id: 'jar-1', name: 'Hũ 1', emoji: '🫙' },
            { id: 'jar-2', name: 'Hũ 2', emoji: '🫙' },
            { id: 'jar-3', name: 'Hũ 3', emoji: '🫙' },
            { id: 'jar-4', name: 'Hũ 4', emoji: '🫙' },
        ],
        dropZoneLabel: 'Hộp ủ nhiệt 📦',
        animation: 'bacteria-multiply',
    },
    {
        title: "Bước 6: Kiểm tra sản phẩm",
        description: "Nhấn nút kiểm tra để xem kết quả thí nghiệm!",
        image: step6,
        scienceInfo: {
            title: "✅ Dấu hiệu thành công",
            content: "Sữa chua thành công khi: • Đông đặc, không chảy nước • Màu trắng ngà • Mùi thơm nhẹ, hơi chua • Vị chua dịu, ngọt nhẹ. Vị chua là do acid lactic mà vi khuẩn tạo ra!"
        },
        dragItems: [],
        dropZoneLabel: '',
        animation: 'none',
    },
    {
        title: "Bước 7: Bảo quản lạnh",
        description: "Kéo sữa chua vào tủ lạnh để bảo quản",
        image: step7,
        scienceInfo: {
            title: "❄️ Tại sao cần bảo quản lạnh?",
            content: "Nhiệt độ lạnh (2-4°C) làm vi khuẩn 'ngủ đông', ngừng hoạt động. Điều này giúp sữa chua không bị chua thêm và giữ được chất lượng lâu hơn (7-14 ngày)."
        },
        dragItems: [
            { id: 'yogurt-cup', name: 'Hũ sữa chua', emoji: '🫙' },
        ],
        dropZoneLabel: 'Tủ lạnh 🧊',
        animation: 'snowflakes',
    }
];

// Snowflakes component
function Snowflakes({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;
    return (
        <div className="snowflakes-container">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="snowflake"
                    style={{ left: `${Math.random() * 100}%` }}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{ y: 150, opacity: 0 }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                >
                    ❄️
                </motion.div>
            ))}
        </div>
    );
}

function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showComplete, setShowComplete] = useState(false);
    const [completedItems, setCompletedItems] = useState<Record<number, string[]>>({});
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { play } = useSoundEffect();

    // Fullscreen toggle
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const stepData = stepsData[currentStep - 1];
    const stepCompleted = completedItems[currentStep]?.length === stepData.dragItems.length;

    // Hàm phát âm Lactobacillus
    const speakLactobacillus = useCallback(() => {
        const utterance = new SpeechSynthesisUtterance('Lactobacillus');
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // Chậm hơn để nghe rõ
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && over.id === 'drop-zone') {
            const itemId = active.id as string;
            const currentCompleted = completedItems[currentStep] || [];

            if (!currentCompleted.includes(itemId)) {
                play('drop');
                setCompletedItems(prev => ({
                    ...prev,
                    [currentStep]: [...currentCompleted, itemId]
                }));

                // Show animation when all items are dropped
                if (currentCompleted.length + 1 === stepData.dragItems.length) {
                    setShowAnimation(true);
                    setTimeout(() => play('success'), 500);
                }
            }
        }
    }, [currentStep, completedItems, stepData.dragItems.length, play]);

    const handleNext = () => {
        if (currentStep < 7) {
            setShowAnimation(false);
            setCurrentStep(currentStep + 1);
        } else {
            play('complete');
            setShowComplete(true);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setShowAnimation(false);
            setCurrentStep(currentStep - 1);
        }
        setShowComplete(false);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setShowComplete(false);
        setCompletedItems({});
        setShowAnimation(false);
    };

    const handleCheckStep6 = () => {
        setShowAnimation(true);
        play('success');
        setCompletedItems(prev => ({ ...prev, 6: ['checked'] }));
    };

    const isItemCompleted = (itemId: string) => {
        return completedItems[currentStep]?.includes(itemId) || false;
    };

    const canProceed = stepData.dragItems.length === 0
        ? (currentStep === 6 ? completedItems[6]?.includes('checked') : true)
        : stepCompleted;

    return (
        <div className="app-container">
            {/* Fullscreen Button */}
            <motion.button
                className="fullscreen-btn"
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Phóng to màn hình'}
            >
                {isFullscreen ? '⛶' : '⛶'}
            </motion.button>

            {/* Header */}
            <header className="header">
                <motion.h1
                    className="title-3d"
                    initial={{ opacity: 0, y: -20, rotateX: -30 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    🥛 Thí Nghiệm Làm Sữa Chua
                </motion.h1>
                <motion.p
                    className="step-indicator"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {showComplete ? "🎉 Hoàn thành!" : `Bước ${currentStep} / 7`}
                </motion.p>
            </header>

            {/* Progress Bar */}
            <div className="progress-bar">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <motion.div
                        key={step}
                        className={`progress-step ${step < currentStep ? 'completed' :
                            step === currentStep ? 'current' : 'pending'
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setCurrentStep(step);
                            setShowComplete(false);
                            setShowAnimation(false);
                        }}
                    >
                        {completedItems[step]?.length === stepsData[step - 1].dragItems.length && stepsData[step - 1].dragItems.length > 0 ? '✓' : step}
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.main
                    key={showComplete ? 'complete' : currentStep}
                    className="main-content"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    {showComplete ? (
                        <div className="complete-animation">
                            <motion.div
                                className="emoji"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                🎉
                            </motion.div>
                            <h2>Chúc mừng! Bạn đã hoàn thành thí nghiệm!</h2>
                            <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '20px' }}>
                                Bạn đã học được vai trò quan trọng của <strong>vi khuẩn Lactobacillus</strong> trong quá trình làm sữa chua:
                            </p>
                            <div className="science-info" style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto', padding: '25px 30px' }}>
                                <h3 style={{ fontSize: '1.6rem', marginBottom: '20px' }}>🦠 Tóm tắt kiến thức</h3>
                                <p style={{ fontSize: '1.4rem', lineHeight: '2.2' }}>
                                    • Vi khuẩn lác-tíc chuyển hóa đường lac-tô-zơ → a-xít lác-tíc<br />
                                    • A-xít lác-tíc làm prô-tê-in sữa đông tụ → sữa chua<br />
                                    • Nhiệt độ 40-50°C là môi trường lý tưởng cho vi khuẩn<br />
                                    • Bảo quản lạnh giúp vi khuẩn ngừng hoạt động
                                </p>
                            </div>
                            <motion.button
                                className="btn btn-primary"
                                onClick={handleReset}
                                style={{ marginTop: '30px' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                🔄 Làm lại từ đầu
                            </motion.button>
                        </div>
                    ) : (
                        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <h2 className="step-title">{stepData.title}</h2>

                            {/* Drag Items Panel */}
                            {stepData.dragItems.length > 0 && (
                                <div className="drag-items-panel">
                                    <p className="drag-hint">👆 Kéo các vật phẩm vào vùng thả bên dưới:</p>
                                    <div className="drag-items">
                                        {stepData.dragItems.map((item) => (
                                            <DraggableItem
                                                key={item.id}
                                                id={item.id}
                                                name={item.name}
                                                image={item.emoji}
                                                disabled={isItemCompleted(item.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lab Bench with Drop Zone */}
                            <div className="lab-bench">
                                {stepData.dragItems.length > 0 ? (
                                    <DropZone
                                        id="drop-zone"
                                        label={stepData.dropZoneLabel}
                                        isComplete={stepCompleted}
                                    >
                                        <img
                                            src={stepData.image}
                                            alt={`Bước ${currentStep}`}
                                            className="step-image"
                                        />

                                        {/* Show dropped jars inside box for step 5 */}
                                        {currentStep === 5 && (completedItems[5]?.length ?? 0) > 0 && (
                                            <div className="dropped-jars-container">
                                                {completedItems[5]?.map((itemId, index) => (
                                                    <motion.div
                                                        key={itemId}
                                                        className="dropped-jar"
                                                        style={{
                                                            left: `${20 + index * 18}%`,
                                                        }}
                                                        initial={{ y: -50, opacity: 0, scale: 0.5 }}
                                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                                    >
                                                        🫙
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Animations */}
                                        {showAnimation && stepData.animation === 'steam' && <Steam isActive={true} />}
                                        {showAnimation && stepData.animation === 'bubbles' && <Bubbles isActive={true} />}
                                        {showAnimation && stepData.animation === 'bacteria' && <Bacteria isActive={true} />}
                                        {showAnimation && stepData.animation === 'bacteria-multiply' && <Bacteria isActive={true} multiplying={true} />}
                                        {showAnimation && stepData.animation === 'snowflakes' && <Snowflakes isActive={true} />}
                                        {showAnimation && stepData.animation === 'pouring' && <PouringAnimation isActive={true} />}
                                    </DropZone>
                                ) : (
                                    <div className="step-image-container">
                                        <img
                                            src={stepData.image}
                                            alt={`Bước ${currentStep}`}
                                            className={`step-image ${currentStep === 6 ? 'landscape-mode' : ''}`}
                                        />
                                        {showAnimation && currentStep === 6 && (
                                            <motion.div
                                                className="success-overlay"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                            >
                                                <span className="success-emoji">✅</span>
                                                <span>Sữa chua thành công!</span>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Check Button for Step 6 */}
                            {currentStep === 6 && !completedItems[6]?.includes('checked') && (
                                <motion.button
                                    className="btn btn-check"
                                    onClick={handleCheckStep6}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🔍 Kiểm tra sản phẩm
                                </motion.button>
                            )}

                            {/* Drag Overlay */}
                            <DragOverlay>
                                {activeId ? (
                                    <div className="drag-overlay">
                                        {stepData.dragItems.find(item => item.id === activeId)?.emoji}
                                    </div>
                                ) : null}
                            </DragOverlay>

                            {/* Step Description */}
                            <div className="step-description">
                                {stepData.description}
                            </div>

                            {/* Science Info */}
                            <motion.div
                                className="science-info"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3>
                                    {stepData.scienceInfo.title}
                                    {stepData.scienceInfo.hasAudio && (
                                        <button
                                            onClick={speakLactobacillus}
                                            style={{
                                                marginLeft: '10px',
                                                padding: '5px 10px',
                                                background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                color: 'white',
                                                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
                                            }}
                                            title="Nghe phát âm"
                                        >
                                            🔊
                                        </button>
                                    )}
                                </h3>
                                <p>{stepData.scienceInfo.content}</p>
                            </motion.div>

                            {/* Controls */}
                            <div className="controls">
                                <motion.button
                                    className="btn btn-secondary"
                                    onClick={handlePrev}
                                    disabled={currentStep === 1}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ← Quay lại
                                </motion.button>
                                <motion.button
                                    className={`btn ${canProceed ? 'btn-primary' : 'btn-disabled'}`}
                                    onClick={handleNext}
                                    disabled={!canProceed}
                                    whileHover={canProceed ? { scale: 1.05 } : undefined}
                                    whileTap={canProceed ? { scale: 0.95 } : undefined}
                                >
                                    {currentStep === 7 ? "Hoàn thành ✓" : "Tiếp theo →"}
                                </motion.button>
                            </div>
                        </DndContext>
                    )}
                </motion.main>
            </AnimatePresence>

            {/* Footer */}
            <footer style={{
                marginTop: '10px',
                textAlign: 'center',
                padding: '8px'
            }}>
                <span style={{
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    🔬 Thí nghiệm ảo - Lớp 5 | ✨ Tạo bởi thầy Đức
                </span>
            </footer>
        </div>
    );
}

export default App;
