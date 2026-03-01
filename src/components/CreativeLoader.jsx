import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const doodlePaths = [
    'M50,80 L50,40 L80,20 L110,40 L110,80 L50,80 M65,80 L65,55 L85,55 L85,80',
    'M30,30 Q20,30 20,40 Q10,40 15,50 Q15,60 30,60 L70,60 Q85,60 85,50 Q95,50 90,40 Q90,30 75,30 Q70,20 55,25 Q40,15 30,30',
    'M160,40 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 M160,15 L160,5 M180,25 L190,15 M185,40 L195,40 M180,55 L190,65 M160,65 L160,75 M140,55 L130,65 M135,40 L125,40 M140,25 L130,15',
    'M250,80 L250,50 M230,55 Q250,30 270,55 Q250,20 230,55',
    'M300,30 Q310,25 320,30 Q310,25 310,35 M315,28 L318,28',
    'M350,45 C350,35 340,30 340,40 C340,30 330,35 330,45 L340,60 L350,45',
];

const loadingMessages = [
    'Sketching your journey...',
    'Drawing safe paths...',
    'Coloring new beginnings...',
    'Mapping your adventure...',
    'Finding your new home...',
];

const doodleColors = ['#e07a5f', '#3d9970', '#4a90d9', '#f2cc8f', '#81b29a', '#e74c3c'];

export default function CreativeLoader({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(true);

    const handleComplete = useCallback(() => {
        if (onComplete) onComplete();
    }, [onComplete]);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(handleComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 1500);
        return () => { clearInterval(progressInterval); clearInterval(messageInterval); };
    }, [handleComplete]);

    useEffect(() => {
        if (progress >= 100) setIsDrawing(false);
    }, [progress]);

    return (
        <AnimatePresence>
            {isDrawing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 50,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg)'
                    }}>
                    {/* Animated pencil drawing */}
                    <div style={{ position: 'relative', width: 320, height: 192, marginBottom: 32 }}>
                        <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            {doodlePaths.map((path, i) => (
                                <motion.path key={i} d={path} fill="none" stroke={doodleColors[i]}
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: progress > i * 15 ? 1 : 0, opacity: progress > i * 15 ? 1 : 0 }}
                                    transition={{ duration: 1.5, ease: 'easeInOut', delay: i * 0.2 }} />
                            ))}
                            {/* Animated pencil */}
                            <motion.g animate={{ x: [0, 50, 100, 150, 200, 250, 300], y: [40, 30, 50, 35, 45, 30, 40], rotate: [0, -5, 5, -3, 3, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                <rect x="-25" y="-5" width="50" height="10" fill="#f2cc8f" rx="2" />
                                <polygon points="25,-5 35,0 25,5" fill="#5e3a29" />
                                <rect x="-30" y="-4" width="8" height="8" fill="#e07a5f" rx="1" />
                                <rect x="-22" y="-5" width="4" height="10" fill="#999" />
                            </motion.g>
                            {/* Progress line */}
                            <motion.path d="M20,90 Q60,70 100,85 T180,80 T260,85 T340,75 T380,90"
                                fill="none" stroke="#e07a5f" strokeWidth="3" strokeLinecap="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.5 }} />
                        </svg>
                    </div>

                    {/* Title */}
                    <motion.div style={{ textAlign: 'center' }}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <motion.h2 style={{ fontSize: 28, fontFamily: 'var(--font-hand)', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}
                            animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                            SafeHaven
                        </motion.h2>
                        <AnimatePresence mode="wait">
                            <motion.p key={messageIndex}
                                style={{ color: 'var(--text-muted)', fontSize: 18, fontFamily: 'var(--font-sketch)' }}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                {loadingMessages[messageIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>

                    {/* Hand-drawn progress bar */}
                    <div style={{ marginTop: 32, width: 256, position: 'relative' }}>
                        <svg viewBox="0 0 260 30" style={{ width: '100%' }}>
                            <path d="M5,15 Q30,5 65,15 T125,15 T185,15 T245,15 Q255,15 255,15"
                                fill="none" stroke="var(--surface-alt)" strokeWidth="12" strokeLinecap="round" />
                            <motion.path d="M5,15 Q30,5 65,15 T125,15 T185,15 T245,15 Q255,15 255,15"
                                fill="none" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.3 }} />
                        </svg>
                        <motion.div
                            style={{
                                position: 'absolute', right: -32, top: '50%', transform: 'translateY(-50%)',
                                fontSize: 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-hand)'
                            }}
                            animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 0.5, repeat: Infinity }}>
                            {Math.round(progress)}%
                        </motion.div>
                    </div>

                    {/* Floating shapes */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                        {[...Array(6)].map((_, i) => (
                            <motion.div key={i}
                                style={{ position: 'absolute', left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                                animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}>
                                <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: 0.15 }}>
                                    {i % 3 === 0 && <path d="M20,5 L23,15 L33,15 L25,22 L28,32 L20,26 L12,32 L15,22 L7,15 L17,15 Z" fill={doodleColors[i]} />}
                                    {i % 3 === 1 && <circle cx="20" cy="20" r="12" fill="none" stroke={doodleColors[i]} strokeWidth="3" />}
                                    {i % 3 === 2 && <path d="M20,8 C20,8 8,18 8,25 C8,32 20,38 20,38 C20,38 32,32 32,25 C32,18 20,8 20,8" fill={doodleColors[i]} />}
                                </svg>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
