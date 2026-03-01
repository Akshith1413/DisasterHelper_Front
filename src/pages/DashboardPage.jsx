import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { FloatingDoodles, DoodlePin, DoodleHouseIcon, DoodleSunIcon } from '../components/DoodleDecorations';
import useStore from '../store/useStore';
import { getDisasters, getRelocations, getWeather } from '../services/api';
import { FiAlertTriangle, FiMapPin, FiHeart, FiTrendingUp, FiChevronRight, FiSun, FiCloud, FiDroplet, FiWind, FiLoader } from 'react-icons/fi';

const GlobeScene = lazy(() => import('../components/three/GlobeScene'));

function StatCard({ icon: Icon, label, value, trend, color, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} color="white" />
                </div>
                {trend && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}><FiTrendingUp size={12} />{trend}</span>}
            </div>
            <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 30, fontWeight: 700 }}>{value}</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</p>
            </div>
        </motion.div>
    );
}

function WeatherWidget({ data }) {
    if (!data) return <div className="card" style={{ padding: 24, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLoader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} /></div>;
    const w = data.weather;
    return (
        <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 12 }}>Current Weather</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: 30, fontWeight: 700 }}>{w?.temperature || '--'}°F</p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{w?.condition || 'Unknown'}</p>
                </div>
                <FiSun size={32} color="var(--chart-4)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiDroplet size={12} />{w?.humidity || '--'}%</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiWind size={12} />{w?.windSpeed || '--'} mph</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>AQI: {w?.airQualityIndex || '--'}</span>
            </div>
        </div>
    );
}

function DisasterAlertCard({ disaster, index }) {
    const sevColors = { watch: 'var(--warning-bg)', warning: 'var(--danger-bg)', emergency: 'var(--danger-bg)', low: 'var(--success-bg)', medium: 'var(--warning-bg)', high: 'var(--danger-bg)', critical: 'var(--danger-bg)' };
    const sevText = { watch: 'var(--warning)', warning: 'var(--danger)', emergency: 'var(--danger)', low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)', critical: 'var(--danger)' };
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="card" style={{ padding: 16, cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', flexShrink: 0 }}>
                        <FiAlertTriangle size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h4 style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{disaster.title}</h4>
                            <span className="badge" style={{ background: sevColors[disaster.severity], color: sevText[disaster.severity] }}>{disaster.severity}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{disaster.affectedArea || disaster.location}</p>
                    </div>
                    <FiChevronRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
            </div>
        </motion.div>
    );
}

function RelocationCard({ loc, index }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DoodleHouseIcon style={{ width: 24, height: 24, color: 'var(--accent)' }} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600 }}>{loc.city}, {loc.state}</h4>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{loc.distance} miles away</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{loc.overallScore}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Match</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                        {[['Safety', loc.scores?.safety], ['Jobs', loc.scores?.jobMarket], ['Rent', `$${loc.details?.medianRent}`]].map(([label, v]) => (
                            <div key={label} style={{ textAlign: 'center', padding: 8, borderRadius: 8, background: 'var(--surface)' }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(loc.matchReasons || []).slice(0, 2).map((r, i) => (
                            <span key={i} style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: 12 }}>{r}</span>
                        ))}
                    </div>
                </div>
                <div style={{ height: 4, background: 'var(--surface)' }}>
                    <motion.div style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }}
                        initial={{ width: 0 }} animate={{ width: `${loc.overallScore}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }} />
                </div>
            </div>
        </motion.div>
    );
}

export default function DashboardPage() {
    const { user, isAuthenticated } = useStore();
    const [disasters, setDisasters] = useState([]);
    const [relocations, setRelocations] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loadingD, setLoadingD] = useState(true);
    const [loadingR, setLoadingR] = useState(true);

    useEffect(() => {
        getDisasters().then(r => { setDisasters(r.data.disasters || []); setLoadingD(false); }).catch(() => setLoadingD(false));
        getRelocations().then(r => { setRelocations(r.data.relocations || []); setLoadingR(false); }).catch(() => setLoadingR(false));
        getWeather('austin').then(r => setWeather(r.data)).catch(() => { });
    }, []);

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ paddingTop: 88, paddingBottom: 64, padding: '88px 20px 64px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginBottom: 8 }}>
                                    Welcome back, {isAuthenticated ? user?.name || 'Explorer' : 'Explorer'}
                                </h1>
                                <p style={{ color: 'var(--text-secondary)' }}>Here's your safety overview & relocation options</p>
                            </div>
                            <Link to="/plan"><button className="btn btn-primary" style={{ borderRadius: 12 }}><FiMapPin size={16} /> Find New Home</button></Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                        <StatCard icon={FiAlertTriangle} label="Active Disasters" value={disasters.length} color="var(--danger)" delay={0.1} />
                        <StatCard icon={FiMapPin} label="Cities Analyzed" value={relocations.length} trend="+12%" color="var(--accent)" delay={0.2} />
                        <StatCard icon={FiHeart} label="Saved Locations" value={user?.savedLocations?.length || 0} color="var(--primary)" delay={0.3} />
                        <StatCard icon={FiTrendingUp} label="Safety Score" value="85" trend="+5%" color="var(--info)" delay={0.4} />
                    </div>

                    {/* Main grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                        {/* Left column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Globe */}
                            <div className="card" style={{ overflow: 'hidden' }}>
                                <div style={{ height: 192, position: 'relative', background: 'linear-gradient(135deg, var(--bg-alt), var(--surface))' }}>
                                    <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLoader size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>}>
                                        <GlobeScene />
                                    </Suspense>
                                </div>
                                <div style={{ padding: 16, textAlign: 'center' }}>
                                    <h3 style={{ fontWeight: 600 }}>Global Disaster Monitor</h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time tracking active</p>
                                </div>
                            </div>

                            <WeatherWidget data={weather} />

                            {/* Alerts */}
                            <div className="card">
                                <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Active Alerts</h3>
                                    <Link to="/disasters"><button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>View all <FiChevronRight size={14} /></button></Link>
                                </div>
                                <div style={{ padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {loadingD ? <div style={{ textAlign: 'center', padding: 32 }}><FiLoader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} /></div> :
                                        disasters.length > 0 ? disasters.slice(0, 3).map((d, i) => <DisasterAlertCard key={d.id} disaster={d} index={i} />) :
                                            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}><DoodleSunIcon style={{ width: 48, height: 48, margin: '0 auto 8px', color: 'var(--chart-4)' }} /><p>No active disasters</p></div>}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Relocations */}
                        <div className="card" style={{ height: 'fit-content' }}>
                            <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Recommended Relocations</h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Based on your profile and preferences</p>
                                </div>
                                <Link to="/plan"><button className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>Explore <FiChevronRight size={14} /></button></Link>
                            </div>
                            <div style={{ padding: '8px 20px 20px' }}>
                                {loadingR ? <div style={{ textAlign: 'center', padding: 64 }}><FiLoader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} /></div> :
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                                        {relocations.slice(0, 4).map((loc, i) => <RelocationCard key={loc.id} loc={loc} index={i} />)}
                                    </div>}
                                {!isAuthenticated && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                        style={{ marginTop: 24, padding: 20, borderRadius: 16, background: 'var(--primary-bg)', border: '2px dashed rgba(224,122,95,0.2)', textAlign: 'center' }}>
                                        <DoodlePin style={{ width: 40, height: 40, margin: '0 auto 8px', color: 'var(--primary)' }} />
                                        <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Get Personalized Recommendations</h4>
                                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>Sign up to save locations and get personalized matches</p>
                                        <Link to="/register"><button className="btn btn-primary btn-sm" style={{ borderRadius: 12 }}>Create Free Account</button></Link>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media(max-width:1024px) { main > div > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
        </div>
    );
}
