import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { FloatingDoodles } from '../components/DoodleDecorations';
import useStore from '../store/useStore';
import { FiUser, FiMail, FiMapPin, FiDollarSign, FiUsers, FiBriefcase, FiSave, FiTrash2, FiLoader } from 'react-icons/fi';

export default function ProfilePage() {
    const { user, updateUserProfile, isAuthenticated } = useStore();
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [city, setCity] = useState(user?.currentLocation?.city || '');
    const [state, setState] = useState(user?.currentLocation?.state || '');
    const [budget, setBudget] = useState(user?.preferences?.maxBudget || 2500);
    const [familySize, setFamilySize] = useState(user?.preferences?.familySize || 1);
    const [workType, setWorkType] = useState(user?.preferences?.workType || 'remote');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            updateUserProfile({
                name, email,
                currentLocation: { city, state },
                preferences: { maxBudget: budget, familySize, workType }
            });
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 500);
    };

    if (!isAuthenticated) return (
        <div className="page paper-texture"><Navbar /><div style={{ paddingTop: 120, textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: 32 }}>Please login to view your profile</h2>
        </div></div>
    );

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />
            <main style={{ padding: '88px 20px 40px', maxWidth: 800, margin: '0 auto' }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-hand)', marginBottom: 8 }}>Your Profile</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your preferences to get better relocation matches</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiUser size={20} /> Personal Info</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div><label className="label"><FiUser size={12} style={{ display: 'inline' }} /> Full Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} /></div>
                        <div><label className="label"><FiMail size={12} style={{ display: 'inline' }} /> Email</label><input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiMapPin size={20} /> Current Location</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div><label className="label">City</label><input className="input" placeholder="e.g. Los Angeles" value={city} onChange={e => setCity(e.target.value)} /></div>
                        <div><label className="label">State</label><input className="input" placeholder="e.g. CA" value={state} onChange={e => setState(e.target.value)} /></div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}><FiBriefcase size={20} /> Preferences</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        <div><label className="label"><FiDollarSign size={12} style={{ display: 'inline' }} /> Max Budget ($/mo)</label><input className="input" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)} /></div>
                        <div><label className="label"><FiUsers size={12} style={{ display: 'inline' }} /> Family Size</label><input className="input" type="number" min={1} max={10} value={familySize} onChange={e => setFamilySize(parseInt(e.target.value) || 1)} /></div>
                        <div>
                            <label className="label"><FiBriefcase size={12} style={{ display: 'inline' }} /> Work Type</label>
                            <select className="input" value={workType} onChange={e => setWorkType(e.target.value)} style={{ cursor: 'pointer' }}>
                                <option value="remote">Remote</option><option value="hybrid">Hybrid</option>
                                <option value="onsite">On-site</option><option value="retired">Retired</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    {saved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'center', color: 'var(--success)', fontWeight: 500 }}>✓ Saved!</motion.span>}
                    <button onClick={handleSave} className="btn btn-primary btn-lg" disabled={saving} style={{ borderRadius: 12 }}>
                        {saving ? <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FiSave size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {/* Saved locations */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: 24, marginTop: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><FiMapPin size={20} /> Saved Locations</h2>
                    {(user?.savedLocations || []).length === 0 ? (
                        <p style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No saved locations yet. Explore cities and save your favorites!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(user?.savedLocations || []).map((loc, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, background: 'var(--surface)' }}>
                                    <div><p style={{ fontWeight: 500 }}>{loc.city}, {loc.state}</p><p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score: {loc.score}</p></div>
                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}><FiTrash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media(max-width:768px) { .card > div:has(> div) { grid-template-columns: 1fr !important; } }`}</style>
        </div>
    );
}
