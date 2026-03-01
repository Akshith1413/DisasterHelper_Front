import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getDisasters } from '../services/api';
import { FiAlertTriangle, FiMapPin, FiSearch, FiRefreshCw, FiLoader, FiWind, FiDroplet } from 'react-icons/fi';
import { FaFire, FaMountain, FaBolt, FaTemperatureHigh } from 'react-icons/fa';

function DisasterGlobe({ disasters }) {
    return (
        <group>
            <mesh><sphereGeometry args={[2, 64, 64]} /><meshStandardMaterial color="#87CEEB" roughness={0.8} transparent opacity={0.7} /></mesh>
            <mesh><sphereGeometry args={[2.01, 32, 32]} /><meshStandardMaterial color="#90EE90" wireframe transparent opacity={0.3} /></mesh>
            {disasters.slice(0, 8).map((d, i) => {
                const phi = (i / 8) * Math.PI * 2, theta = Math.PI / 3 + (i % 3) * 0.3;
                return (
                    <Float key={d.id} speed={2} floatIntensity={0.5}>
                        <group position={[2.2 * Math.sin(theta) * Math.cos(phi), 2.2 * Math.cos(theta), 2.2 * Math.sin(theta) * Math.sin(phi)]}>
                            <mesh><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color={d.severity === 'critical' ? '#FF6B6B' : d.severity === 'high' ? '#FFA94D' : '#FFD93D'} emissive={d.severity === 'critical' ? '#FF6B6B' : '#FFA94D'} emissiveIntensity={0.4} /></mesh>
                        </group>
                    </Float>
                );
            })}
        </group>
    );
}

const typeIcons = { hurricane: FiWind, flood: FiDroplet, wildfire: FaFire, earthquake: FaMountain, tornado: FiWind, heatwave: FaTemperatureHigh, storm: FaBolt };
const sevColors = { low: { bg: 'rgba(39,174,96,0.1)', text: '#27ae60' }, medium: { bg: 'rgba(243,156,18,0.1)', text: '#f39c12' }, high: { bg: 'rgba(231,76,60,0.1)', text: '#e74c3c' }, critical: { bg: 'rgba(231,76,60,0.15)', text: '#c0392b' }, watch: { bg: 'rgba(243,156,18,0.1)', text: '#f39c12' }, warning: { bg: 'rgba(231,76,60,0.1)', text: '#e74c3c' }, emergency: { bg: 'rgba(231,76,60,0.15)', text: '#c0392b' } };

function DisasterCard({ disaster, index }) {
    const Icon = typeIcons[disaster.type] || FiAlertTriangle;
    const sev = sevColors[disaster.severity] || sevColors.medium;
    return (
        <motion.div initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }} whileHover={{ scale: 1.02 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                style={{ padding: 10, borderRadius: 12, background: sev.bg, color: sev.text }}>
                                <Icon size={20} />
                            </motion.div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: 'capitalize' }}>{disaster.type}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 13 }}>
                                    <FiMapPin size={12} />{disaster.location}
                                </div>
                            </div>
                        </div>
                        <span className="badge" style={{ background: sev.bg, color: sev.text, alignSelf: 'flex-start' }}>{disaster.severity}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{disaster.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px dashed var(--border-dashed)', fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>Affected: {disaster.affectedArea}</span>
                        <span>{new Date(disaster.timestamp).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/plan?location=${encodeURIComponent(disaster.location)}`}>
                        <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 12, borderRadius: 12 }}>Plan Relocation</button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default function DisastersPage() {
    const [disasters, setDisasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selType, setSelType] = useState(null);
    const [selSev, setSelSev] = useState(null);

    const fetchData = () => {
        setLoading(true);
        getDisasters().then(r => { setDisasters(r.data.disasters || []); setLoading(false); }).catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = disasters.filter(d => {
        const matchSearch = !search || d.location?.toLowerCase().includes(search.toLowerCase()) || d.type?.toLowerCase().includes(search.toLowerCase());
        const matchType = !selType || d.type === selType;
        const matchSev = !selSev || d.severity === selSev;
        return matchSearch && matchType && matchSev;
    });

    const types = [...new Set(disasters.map(d => d.type))];

    return (
        <div className="page paper-texture">
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 1280, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-hand)' }}>Active Disasters</h1>
                    <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>Monitor real-time disaster events and plan your safe relocation</p>
                </motion.div>

                {/* 3D Globe */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    style={{ height: 350, marginBottom: 40, borderRadius: 24, overflow: 'hidden', border: '2px dashed var(--border-dashed)', background: 'linear-gradient(135deg, #e8f4f8, #e8f8ee)' }}>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <ambientLight intensity={0.6} /><directionalLight position={[5, 5, 5]} intensity={0.8} />
                        <Suspense fallback={null}><DisasterGlobe disasters={disasters} /></Suspense>
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
                    </Canvas>
                </motion.div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                        <input className="input" placeholder="Search by location or type..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button className={`btn btn-sm ${!selType ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelType(null)} style={{ borderRadius: 12 }}>All</button>
                        {types.map(t => <button key={t} className={`btn btn-sm ${selType === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelType(t)} style={{ borderRadius: 12, textTransform: 'capitalize' }}>{t}</button>)}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {['low', 'medium', 'high', 'critical'].map(s => (
                            <button key={s} className={`btn btn-sm ${selSev === s ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setSelSev(selSev === s ? null : s)} style={{ borderRadius: 12, textTransform: 'capitalize' }}>{s}</button>
                        ))}
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={fetchData} style={{ borderRadius: 12 }}><FiRefreshCw size={14} /> Refresh</button>
                </motion.div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
                    {[
                        { label: 'Total Active', value: disasters.length, color: 'var(--primary-bg)', text: 'var(--primary)' },
                        { label: 'Critical', value: disasters.filter(d => d.severity === 'critical').length, color: 'var(--danger-bg)', text: 'var(--danger)' },
                        { label: 'High Risk', value: disasters.filter(d => d.severity === 'high').length, color: 'var(--warning-bg)', text: 'var(--warning)' },
                        { label: 'Monitoring', value: disasters.filter(d => ['medium', 'low', 'watch'].includes(d.severity)).length, color: 'var(--success-bg)', text: 'var(--success)' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                            style={{ padding: 16, borderRadius: 16, background: s.color, color: s.text, border: '2px dashed transparent' }}>
                            <div style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
                            <div style={{ fontSize: 13, opacity: 0.8 }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {[...Array(6)].map((_, i) => <div key={i} className="card skeleton" style={{ height: 200 }} />)}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {filtered.map((d, i) => <DisasterCard key={d.id} disaster={d} index={i} />)}
                    </div>
                )}

                {filtered.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
                        <FiSearch size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ fontSize: 20, fontWeight: 500 }}>No disasters match your search</p>
                        <p style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
