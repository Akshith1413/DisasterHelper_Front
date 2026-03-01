import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FloatingDoodles, SquigglyUnderline, DoodleArrow } from '../components/DoodleDecorations';
import { FiExternalLink, FiPhone, FiMapPin, FiAlertTriangle, FiHeart, FiShield, FiBook, FiGlobe } from 'react-icons/fi';

const resources = [
    {
        category: 'Government Agencies',
        icon: FiShield,
        items: [
            { name: 'FEMA', desc: 'Federal Emergency Management Agency — disaster assistance and resources', url: 'https://www.fema.gov', icon: '🏛️' },
            { name: 'Ready.gov', desc: 'Official government preparedness site with emergency plans and kits', url: 'https://www.ready.gov', icon: '📋' },
            { name: 'NOAA Weather', desc: 'National weather alerts, forecasts, and severe weather tracking', url: 'https://www.weather.gov', icon: '🌤️' },
            { name: 'USGS Earthquakes', desc: 'Real-time earthquake data, maps, and seismic monitoring', url: 'https://earthquake.usgs.gov', icon: '🌍' },
        ]
    },
    {
        category: 'Emergency Services',
        icon: FiPhone,
        items: [
            { name: 'American Red Cross', desc: 'Disaster relief, shelters, blood donations, and first aid training', url: 'https://www.redcross.org', icon: '➕' },
            { name: 'Salvation Army', desc: 'Emergency disaster services, food, and shelter assistance', url: 'https://www.salvationarmyusa.org', icon: '🤝' },
            { name: '211 Helpline', desc: 'Local community resources for food, housing, and disaster info', url: 'https://www.211.org', icon: '📞' },
            { name: 'National Suicide Prevention', desc: '988 hotline for crisis support and mental health during disasters', url: 'https://988lifeline.org', icon: '💚' },
        ]
    },
    {
        category: 'Housing & Relocation',
        icon: FiMapPin,
        items: [
            { name: 'HUD Resources', desc: 'Housing assistance for disaster victims, rental help, and counseling', url: 'https://www.hud.gov', icon: '🏠' },
            { name: 'FEMA Temporary Housing', desc: 'Temporary housing programs for disaster-displaced individuals', url: 'https://www.fema.gov', icon: '🏡' },
            { name: 'DisasterAssistance.gov', desc: 'One-stop portal for all federal disaster aid programs', url: 'https://www.disasterassistance.gov', icon: '🆘' },
            { name: 'National Low Income Housing', desc: 'Affordable housing programs for disaster survivors', url: 'https://nlihc.org', icon: '🔑' },
        ]
    },
    {
        category: 'Insurance & Financial',
        icon: FiBook,
        items: [
            { name: 'NFIP Flood Insurance', desc: 'National Flood Insurance Program information and claims', url: 'https://www.floodsmart.gov', icon: '🌊' },
            { name: 'SBA Disaster Loans', desc: 'Small Business Administration loans for disaster recovery', url: 'https://www.sba.gov/disaster', icon: '💼' },
            { name: 'IRS Disaster Tax Relief', desc: 'Tax relief provisions for federally declared disaster areas', url: 'https://www.irs.gov', icon: '📊' },
        ]
    },
];

const emergencyNumbers = [
    { name: 'Emergency', number: '911', desc: 'Police, Fire, Ambulance' },
    { name: 'FEMA Helpline', number: '1-800-621-3362', desc: 'Disaster Assistance' },
    { name: 'Red Cross', number: '1-800-733-2767', desc: 'Disaster Relief' },
    { name: 'Poison Control', number: '1-800-222-1222', desc: 'Poison Questions' },
];

export default function ResourcesPage() {
    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 1100, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-hand)', marginBottom: 8 }}>
                        Disaster <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                            Resources
                            <SquigglyUnderline style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, color: 'var(--primary)' }} />
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
                        Essential contacts, tools, and guides for disaster preparedness and recovery
                    </p>
                </motion.div>

                {/* Emergency numbers */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="card" style={{ padding: 24, marginBottom: 32, borderColor: 'rgba(231,76,60,0.3)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiAlertTriangle size={20} /> Emergency Numbers
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {emergencyNumbers.map((e, i) => (
                            <motion.div key={e.number} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.08 }}
                                style={{ padding: 16, borderRadius: 16, background: 'var(--danger-bg)', border: '2px dashed rgba(231,76,60,0.2)', textAlign: 'center' }}>
                                <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-hand)' }}>{e.number}</p>
                                <p style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</p>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Resource categories */}
                {resources.map((cat, ci) => {
                    const Icon = cat.icon;
                    return (
                        <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + ci * 0.1 }}
                            className="card" style={{ padding: 24, marginBottom: 20 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon size={20} color="var(--primary)" /> {cat.category}
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                                {cat.items.map((item, ii) => (
                                    <motion.a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        style={{ display: 'block', padding: 16, borderRadius: 16, background: 'var(--surface)', border: '1px dashed var(--border-dashed)', textDecoration: 'none', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{item.name}</p>
                                                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                                                </div>
                                            </div>
                                            <FiExternalLink size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </main>
            <Footer />
        </div>
    );
}
