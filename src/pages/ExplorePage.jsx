import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FloatingDoodles, SquigglyUnderline } from '../components/DoodleDecorations';
import { getRelocations, getCostOfLiving, getAirQuality } from '../services/api';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiMapPin, FiTrendingUp, FiLoader, FiPlus, FiX, FiDollarSign } from 'react-icons/fi';

function CompareCard({ city, onRemove }) {
    const radarData = city.scores ? Object.entries(city.scores).map(([key, val]) => ({
        category: key.replace(/([A-Z])/g, ' $1').trim(), value: val, fullMark: 100
    })) : [];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
            <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                        <h3 style={{ fontSize: 20, fontWeight: 700 }}>{city.city}, {city.state}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}><FiMapPin size={12} style={{ display: 'inline' }} /> {city.distance} miles away</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', background: city.overallScore >= 90 ? 'var(--accent)' : city.overallScore >= 80 ? 'var(--info)' : 'var(--warning)' }}>
                            {city.overallScore}
                        </div>
                        {onRemove && <button className="btn btn-ghost btn-sm" onClick={onRemove}><FiX size={16} /></button>}
                    </div>
                </div>

                <div style={{ height: 240 }}>
                    <ResponsiveContainer>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--border)" />
                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                            <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
                    {[
                        ['Monthly Rent', `$${city.details?.medianRent?.toLocaleString()}`],
                        ['Home Price', `$${city.details?.medianHomePrice?.toLocaleString()}`],
                        ['Unemployment', `${city.details?.unemploymentRate}%`],
                        ['Crime Index', city.details?.crimeIndex],
                    ].map(([l, v]) => (
                        <div key={l} style={{ padding: 8, borderRadius: 8, background: 'var(--surface)' }}>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{v}</p>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {(city.matchReasons || []).map((r, i) => (
                        <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'var(--primary-bg)', color: 'var(--primary)' }}>{r}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function ExplorePage() {
    const [cities, setCities] = useState([]);
    const [compared, setCompared] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRelocations().then(r => {
            const data = r.data.relocations || [];
            setCities(data);
            setCompared(data.slice(0, 3));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const addCity = (city) => {
        if (compared.length < 4 && !compared.find(c => c.id === city.id)) {
            setCompared([...compared, city]);
        }
    };

    const removeCity = (id) => setCompared(compared.filter(c => c.id !== id));

    const barData = compared.map(c => ({
        name: c.city,
        safety: c.scores?.safety || 0,
        jobs: c.scores?.jobMarket || 0,
        cost: c.scores?.costOfLiving || 0,
        schools: c.scores?.schools || 0,
        health: c.scores?.healthcare || 0,
    }));

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 1280, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-hand)', marginBottom: 8 }}>
                        Explore <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                            Cities
                            <SquigglyUnderline style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, color: 'var(--primary)' }} />
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
                        Compare cities side-by-side across safety, cost, jobs, and quality of life
                    </p>
                </motion.div>

                {/* City selector */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Comparing:</span>
                        {compared.map(c => (
                            <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: 14, fontWeight: 500 }}>
                                {c.city}
                                <button onClick={() => removeCity(c.id)} style={{ padding: 0, lineHeight: 1, color: 'var(--primary)' }}><FiX size={14} /></button>
                            </span>
                        ))}
                        {compared.length < 4 && (
                            <div style={{ position: 'relative' }}>
                                <select onChange={e => {
                                    const city = cities.find(c => c.id === e.target.value);
                                    if (city) addCity(city);
                                    e.target.value = '';
                                }} className="input" style={{ width: 160, padding: '6px 12px', fontSize: 13 }}>
                                    <option value="">+ Add city</option>
                                    {cities.filter(c => !compared.find(cc => cc.id === c.id)).map(c => (
                                        <option key={c.id} value={c.id}>{c.city}, {c.state}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </motion.div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 64 }}><FiLoader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} /></div>
                ) : (
                    <>
                        {/* Comparison bar chart */}
                        {compared.length > 1 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="card" style={{ padding: 24, marginBottom: 32 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiTrendingUp size={20} /> Score Comparison
                                </h3>
                                <div style={{ height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={barData} barCategoryGap="20%">
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: 12, border: '2px dashed var(--border-dashed)', background: 'var(--bg-card)' }} />
                                            <Legend />
                                            <Bar dataKey="safety" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="jobs" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="cost" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="schools" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="health" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}

                        {/* City cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                            {compared.map(c => <CompareCard key={c.id} city={c} onRemove={compared.length > 1 ? () => removeCity(c.id) : null} />)}
                        </div>
                    </>
                )}
            </main>
            <Footer />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
