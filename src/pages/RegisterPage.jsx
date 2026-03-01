import { useState, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { registerUser } from '../services/api';
import { SquigglyUnderline, DoodleArrow } from '../components/DoodleDecorations';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

const AuthScene = lazy(() => import('../components/three/AuthScene'));

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPw) return setError('Passwords do not match');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        setLoading(true);
        setError('');
        try {
            const { data } = await registerUser({ name, email, password });
            if (data.success) {
                login(data.user, data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
            <div className="md-hidden" style={{ flex: 1, position: 'relative', background: 'var(--bg-alt)' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiLoader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} /></div>}>
                        <AuthScene />
                    </Suspense>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, background: 'linear-gradient(transparent, rgba(250,248,244,0.9))' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Start your journey</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Create an account to get personalized relocation plans.</p>
                    </motion.div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%', maxWidth: 440 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, color: 'white' }} fill="currentColor">
                                <path d="M12,2 L15.09,8.26 L22,9.27 L17,14.14 L18.18,21.02 L12,17.77 L5.82,21.02 L7,14.14 L2,9.27 L8.91,8.26 L12,2 Z" />
                            </svg>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 20 }}>SafeHaven</span>
                    </Link>

                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                            Create your{' '}
                            <span style={{ position: 'relative', display: 'inline-block', color: 'var(--primary)' }}>
                                account
                                <SquigglyUnderline style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 8, color: 'var(--primary)' }} />
                            </span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
                        </p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: 'var(--danger-bg)', border: '1px solid rgba(231,76,60,0.2)', color: 'var(--danger)', fontSize: 14 }}>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label className="label">Full name</label>
                            <div style={{ position: 'relative' }}>
                                <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                                <input className="input" type="text" placeholder="Your name" value={name}
                                    onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: 44 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="label">Email address</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                                <input className="input" type="email" placeholder="you@example.com" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: 44 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label className="label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                                <input className="input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: 44, paddingRight: 44 }} />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    {showPw ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label className="label">Confirm password</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                                <input className="input" type="password" placeholder="Repeat your password"
                                    value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required style={{ paddingLeft: 44 }} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-xl" disabled={loading} style={{ borderRadius: 16 }}>
                            {loading ? <FiLoader size={20} style={{ animation: 'spin 1s linear infinite' }} /> :
                                <>Create Account <DoodleArrow style={{ width: 24, height: 16 }} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 24 }}>
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </motion.div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
