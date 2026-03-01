import { motion, AnimatePresence } from 'framer-motion';

// Animated hand-drawn arrow
export function DoodleArrow({ className = '', direction = 'right', style = {} }) {
    const paths = {
        right: 'M10,25 Q25,20 40,25 Q55,30 70,25 L60,15 M70,25 L60,35',
        left: 'M70,25 Q55,20 40,25 Q25,30 10,25 L20,15 M10,25 L20,35',
        up: 'M40,70 Q35,55 40,40 Q45,25 40,10 L30,20 M40,10 L50,20',
        down: 'M40,10 Q35,25 40,40 Q45,55 40,70 L30,60 M40,70 L50,60',
    };
    return (
        <motion.svg viewBox={['up', 'down'].includes(direction) ? "0 0 80 80" : "0 0 80 50"} className={className} style={style}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.path d={paths[direction]} fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }} />
        </motion.svg>
    );
}

// Squiggly underline
export function SquigglyUnderline({ className = '', color = 'currentColor', style = {} }) {
    return (
        <motion.svg viewBox="0 0 200 20" className={className} style={style} preserveAspectRatio="none">
            <motion.path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10"
                fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }} />
        </motion.svg>
    );
}

// Animated star
export function DoodleStar({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 50 50" className={className} style={style}
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}>
            <motion.path d="M25,5 L28,20 L43,20 L31,28 L35,43 L25,33 L15,43 L19,28 L7,20 L22,20 Z"
                fill="currentColor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
        </motion.svg>
    );
}

// Heart
export function DoodleHeart({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 50 50" className={className} style={style}
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <motion.path d="M25,45 C25,45 5,30 5,18 C5,10 12,5 20,8 C23,9 25,12 25,12 C25,12 27,9 30,8 C38,5 45,10 45,18 C45,30 25,45 25,45"
                fill="currentColor" initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }} />
        </motion.svg>
    );
}

// Map pin
export function DoodlePin({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 40 50" className={className} style={style}
            animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <motion.path d="M20,48 L20,48 C20,48 35,30 35,18 C35,8 28,2 20,2 C12,2 5,8 5,18 C5,30 20,48 20,48"
                fill="currentColor" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
            <motion.circle cx="20" cy="18" r="6" fill="white"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} />
        </motion.svg>
    );
}

// Sun
export function DoodleSunIcon({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 60 60" className={className} style={style}
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <circle cx="30" cy="30" r="12" fill="currentColor" />
            {[...Array(8)].map((_, i) => (
                <motion.line key={i} x1="30" y1="8" x2="30" y2="2" stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" transform={`rotate(${i * 45} 30 30)`}
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }} />
            ))}
        </motion.svg>
    );
}

// Cloud
export function DoodleCloudIcon({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 80 50" className={className} style={style}
            animate={{ x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <motion.path d="M60,40 L20,40 C10,40 5,35 5,28 C5,21 12,16 20,18 C22,10 30,5 40,8 C48,5 58,10 60,20 C70,20 75,28 70,35 C68,38 64,40 60,40"
                fill="currentColor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }} />
        </motion.svg>
    );
}

// House
export function DoodleHouseIcon({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 50 50" className={className} style={style}>
            <motion.path d="M5,25 L25,5 L45,25 L45,45 L5,45 L5,25"
                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.rect x="18" y="30" width="14" height="15" fill="currentColor"
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }} style={{ transformOrigin: 'bottom' }} />
        </motion.svg>
    );
}

// Checkmark
export function DoodleCheck({ className = '', style = {} }) {
    return (
        <motion.svg viewBox="0 0 50 50" className={className} style={style}>
            <motion.path d="M10,25 Q15,35 20,40 Q30,20 45,10" fill="none" stroke="currentColor"
                strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }} />
        </motion.svg>
    );
}

// Floating doodles background
export function FloatingDoodles() {
    const doodles = [
        { Component: DoodleStar, x: '10%', y: '20%', size: 32, color: 'var(--chart-4)', delay: 0 },
        { Component: DoodleHeart, x: '85%', y: '15%', size: 24, color: 'var(--primary)', delay: 0.2 },
        { Component: DoodleCloudIcon, x: '75%', y: '70%', size: 64, color: 'var(--accent)', delay: 0.4 },
        { Component: DoodleSunIcon, x: '15%', y: '75%', size: 40, color: 'var(--chart-4)', delay: 0.6 },
        { Component: DoodleStar, x: '90%', y: '45%', size: 24, color: 'var(--accent)', delay: 0.8 },
        { Component: DoodleHeart, x: '5%', y: '50%', size: 20, color: 'var(--danger)', delay: 1 },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
            {doodles.map(({ Component, x, y, size, color, delay }, i) => (
                <motion.div key={i}
                    style={{ position: 'absolute', left: x, top: y, width: size, height: size, color, opacity: 0.2 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.2, scale: 1, y: [0, -10, 0] }}
                    transition={{
                        opacity: { delay, duration: 0.5 },
                        scale: { delay, duration: 0.5, type: 'spring' },
                        y: { delay: delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    }}>
                    <Component style={{ width: '100%', height: '100%' }} />
                </motion.div>
            ))}
        </div>
    );
}
