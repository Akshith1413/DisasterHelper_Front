import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FloatingDoodles, SquigglyUnderline, DoodleHouseIcon, DoodleCheck } from '../components/DoodleDecorations';
import { generateRelocations } from '../services/api';
import { FiSearch, FiSliders, FiLoader, FiMapPin, FiDollarSign, FiUsers, FiBriefcase, FiHeart, FiChevronDown } from 'react-icons/fi';

const priorityOptions = [
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'costOfLiving', label: 'Cost of Living', icon: '💰' },
    { id: 'jobMarket', label: 'Job Market', icon: '💼' },
    { id: 'schools', label: 'Schools', icon: '🎓' },
    { id: 'airQuality', label: 'Air Quality', icon: '🌿' },
    { id: 'climate', label: 'Climate', icon: '☀️' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
];

function ResultCard({ loc, index }) {
    const [expanded, setExpanded] = useState(false);
    const scoreColors = { safety: '#27ae60', costOfLiving: '#f39c12', jobMarket: '#3498db', schools: '#9b59b6', airQuality: '#2ecc71', climate: '#e67e22', healthcare: '#e74c3c' };
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, type: 'spring', stiffness: 80 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--border-dashed)' }}>
                    <div style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DoodleHouseIcon style={{ width: 32, height: 32, color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{loc.city}, {loc.state}</h3>
                            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                                <span><FiMapPin size={12} /> {loc.distance} mi away</span>
                                <span><FiDollarSign size={12} /> ${loc.details?.medianRent}/mo</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: 20, textAlign: 'center' }}>
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', background: loc.overallScore >= 90 ? 'var(--accent)' : loc.overallScore >= 80 ? 'var(--info)' : 'var(--warning)' }}>
                            {loc.overallScore}
                        </motion.div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Match Score</p>
                    </div>
                </div>

                {/* Score bars */}
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
                        {Object.entries(loc.scores || {}).map(([key, val]) => (
                            <div key={key}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span style={{ fontWeight: 600 }}>{val}</span>
                                </div>
                                <div className="score-bar">
                                    <motion.div className="score-bar-fill" initial={{ width: 0 }} animate={{ width: `${val}%` }}
                                        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                                        style={{ background: scoreColors[key] || 'var(--accent)' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                        {(loc.matchReasons || []).map((r, i) => (
                            <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                                <DoodleCheck style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{r}
                            </span>
                        ))}
                    </div>

                    <button onClick={() => setExpanded(!expanded)} className="btn btn-ghost btn-sm w-full" style={{ borderRadius: 12, justifyContent: 'center' }}>
                        <FiChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                        {expanded ? 'Less' : 'More'} Details
                    </button>

                    <AnimatePresence>
                        {expanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', marginTop: 12 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, padding: 16, background: 'var(--surface)', borderRadius: 12 }}>
                                    {[
                                        ['Home Price', `$${(loc.details?.medianHomePrice || 0).toLocaleString()}`],
                                        ['Unemployment', `${loc.details?.unemploymentRate}%`],
                                        ['Crime Index', loc.details?.crimeIndex],
                                        ['Top Employer', loc.details?.topEmployers?.[0]],
                                        ['Hospital', loc.details?.nearestHospital?.split(' ').slice(0, 3).join(' ')],
                                        ['Population', (loc.details?.population || 0).toLocaleString()],
                                    ].map(([l, v]) => (
                                        <div key={l}><p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</p><p style={{ fontWeight: 600, fontSize: 14 }}>{v}</p></div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

export default function PlanPage() {
    const [searchParams] = useSearchParams();
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [budget, setBudget] = useState(2500);
    const [familySize, setFamilySize] = useState(1);
    const [priorities, setPriorities] = useState(['safety', 'costOfLiving']);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const togglePriority = (id) => {
        setPriorities(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const { data } = await generateRelocations({
                currentLocation: { city: location },
                preferences: { maxBudget: budget, familySize, priorities }
            });
            setResults(data.relocations || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { if (location) handleSearch(); }, []);

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 1280, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-hand)', marginBottom: 8 }}>
                        Plan Your <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                            Relocation
                            <SquigglyUnderline style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, color: 'var(--primary)' }} />
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
                        Tell us your preferences and we'll find the best cities for your fresh start
                    </p>
                </motion.div>

                {/* Preferences form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="card" style={{ padding: 24, marginBottom: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiSliders size={20} /> Your Preferences
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                        <div>
                            <label className="label"><FiMapPin size={14} style={{ display: 'inline', marginRight: 4 }} />Current Location</label>
                            <input className="input" placeholder="City, State" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div>
                            <label className="label"><FiDollarSign size={14} style={{ display: 'inline', marginRight: 4 }} />Max Monthly Rent</label>
                            <input className="input" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)} />
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>${budget.toLocaleString()}/month</p>
                        </div>
                        <div>
                            <label className="label"><FiUsers size={14} style={{ display: 'inline', marginRight: 4 }} />Family Size</label>
                            <input className="input" type="number" min="1" max="10" value={familySize} onChange={e => setFamilySize(parseInt(e.target.value) || 1)} />
                        </div>
                    </div>

                    <label className="label" style={{ marginBottom: 8 }}>Priorities (select what matters most)</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        {priorityOptions.map(p => (
                            <button key={p.id} onClick={() => togglePriority(p.id)}
                                className={`btn btn-sm ${priorities.includes(p.id) ? 'btn-primary' : 'btn-outline'}`}
                                style={{ borderRadius: 999, gap: 4 }}>
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleSearch} className="btn btn-primary btn-lg" disabled={loading} style={{ borderRadius: 12 }}>
                        {loading ? <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FiSearch size={16} />}
                        {loading ? 'Analyzing cities...' : 'Find My Match'}
                    </button>
                </motion.div>

                {/* Results */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[...Array(3)].map((_, i) => <div key={i} className="card skeleton" style={{ height: 200 }} />)}
                    </div>
                )}

                {searched && !loading && results.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-hand)' }}>Top Matches for You</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{results.length} cities found</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {results.map((loc, i) => <ResultCard key={loc.id} loc={loc} index={i} />)}
                        </div>
                    </motion.div>
                )}

                {searched && !loading && results.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
                        <FiMapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ fontSize: 20, fontWeight: 500 }}>No cities match your criteria</p>
                        <p style={{ marginTop: 8 }}>Try increasing your budget or adjusting priorities</p>
                    </div>
                )}
            </main>
            <Footer />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
