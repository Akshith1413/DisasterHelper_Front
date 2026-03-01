import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FloatingDoodles, SquigglyUnderline, DoodleCheck } from '../components/DoodleDecorations';
import { FiCheckSquare, FiSquare, FiDownload, FiPrinter } from 'react-icons/fi';

const categories = [
    {
        title: 'Documents & Records', icon: '📄', color: 'var(--primary)',
        items: [
            'Personal identification (IDs, passports, birth certificates)',
            'Insurance policies (home, auto, health, life)',
            'Financial documents (bank statements, deeds, titles)',
            'Medical records and prescriptions',
            'Social Security cards',
            'Marriage/divorce certificates',
            'School records and diplomas',
            'Pet vaccination records',
        ]
    },
    {
        title: 'Emergency Supplies', icon: '🎒', color: 'var(--danger)',
        items: [
            'Water (1 gallon per person per day for 3 days)',
            'Non-perishable food (3-day supply)',
            'First aid kit',
            'Flashlight and extra batteries',
            'Battery-powered or hand-crank radio',
            'Multi-tool or Swiss army knife',
            'Dust masks and plastic sheeting',
            'Moist towelettes and garbage bags',
        ]
    },
    {
        title: 'Communication Plan', icon: '📱', color: 'var(--accent)',
        items: [
            'Emergency contact list (family, friends, neighbors)',
            'Designate an out-of-area contact person',
            'Know your community warning signals',
            'Download emergency alert apps (FEMA, Red Cross)',
            'Identify two meeting places for your family',
            'Know evacuation routes from your area',
            'Share your plan with all family members',
            'Keep phone chargers and portable battery packs',
        ]
    },
    {
        title: 'Financial Preparation', icon: '💰', color: 'var(--warning)',
        items: [
            'Keep emergency cash in small bills',
            'Know how to access funds if displaced',
            'Review and update insurance coverage',
            'Create digital copies of all financial documents',
            'Set up automatic bill payments',
            'Identify temporary housing options (hotels, family)',
            'Research FEMA assistance programs',
            'Document home inventory with photos/video',
        ]
    },
    {
        title: 'Special Needs', icon: '💊', color: 'var(--info)',
        items: [
            'Extra supply of critical medications (7-day minimum)',
            'Copies of prescriptions and medical device info',
            'Extra glasses, contacts, or hearing aid batteries',
            'Baby supplies (formula, diapers, bottles)',
            'Pet supplies (food, leash, carrier, medications)',
            'Mobility aids and accessibility equipment',
            'Comfort items for children',
            'Supplies for elderly family members',
        ]
    },
];

function CheckItem({ text, checked, onToggle }) {
    return (
        <motion.div whileHover={{ x: 4 }} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', cursor: 'pointer', borderBottom: '1px dashed var(--border-dashed)' }} onClick={onToggle}>
            <div style={{ marginTop: 2, flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                    {checked ? (
                        <motion.div key="checked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ color: 'var(--accent)' }}>
                            <DoodleCheck style={{ width: 24, height: 24 }} />
                        </motion.div>
                    ) : (
                        <motion.div key="unchecked" initial={{ scale: 0.8 }} animate={{ scale: 1 }}><FiSquare size={20} color="var(--text-muted)" /></motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: checked ? 'var(--text-muted)' : 'var(--text)', textDecoration: checked ? 'line-through' : 'none', transition: 'all 0.3s' }}>{text}</span>
        </motion.div>
    );
}

export default function EmergencyChecklistPage() {
    const getStored = () => { try { return JSON.parse(localStorage.getItem('emergency-checklist') || '{}'); } catch { return {}; } };
    const [checked, setChecked] = useState(getStored);

    const toggle = (catIdx, itemIdx) => {
        const key = `${catIdx}-${itemIdx}`;
        const updated = { ...checked, [key]: !checked[key] };
        setChecked(updated);
        localStorage.setItem('emergency-checklist', JSON.stringify(updated));
    };

    const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
    const checkedCount = Object.values(checked).filter(Boolean).length;
    const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 900, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-hand)', marginBottom: 8 }}>
                        Emergency <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                            Checklist
                            <SquigglyUnderline style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, color: 'var(--primary)' }} />
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
                        Be prepared for any disaster. Check off items as you complete them.
                    </p>
                </motion.div>

                {/* Progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="card" style={{ padding: 20, marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <FiCheckSquare size={24} color="var(--accent)" />
                            <span style={{ fontWeight: 700, fontSize: 18 }}>{checkedCount}/{totalItems} Complete</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-hand)', fontSize: 20, fontWeight: 700, color: progress === 100 ? 'var(--accent)' : 'var(--primary)' }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="score-bar" style={{ height: 12, borderRadius: 6 }}>
                        <motion.div className="score-bar-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            style={{ background: progress === 100 ? 'var(--accent)' : `linear-gradient(90deg, var(--primary), var(--accent))`, borderRadius: 6 }} />
                    </div>
                    {progress === 100 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--accent)' }}>
                            🎉 Fully prepared! Great job!
                        </motion.p>
                    )}
                </motion.div>

                {/* Categories */}
                {categories.map((cat, ci) => {
                    const catChecked = cat.items.filter((_, ii) => checked[`${ci}-${ii}`]).length;
                    return (
                        <motion.div key={cat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + ci * 0.08 }}
                            className="card" style={{ padding: 24, marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <span style={{ fontSize: 28 }}>{cat.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>{cat.title}</h2>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{catChecked}/{cat.items.length} items</p>
                                </div>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: catChecked === cat.items.length ? 'var(--success-bg)' : 'var(--surface)', color: catChecked === cat.items.length ? 'var(--success)' : 'var(--text-muted)' }}>
                                    {catChecked === cat.items.length ? '✓' : `${catChecked}`}
                                </div>
                            </div>
                            {cat.items.map((item, ii) => (
                                <CheckItem key={ii} text={item} checked={!!checked[`${ci}-${ii}`]} onToggle={() => toggle(ci, ii)} />
                            ))}
                        </motion.div>
                    );
                })}
            </main>
            <Footer />
        </div>
    );
}
