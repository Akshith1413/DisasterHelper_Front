import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { FiMenu, FiX, FiHome, FiAlertTriangle, FiMap, FiGrid, FiUser, FiLogOut, FiCheckSquare, FiBook } from 'react-icons/fi';

const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/disasters', label: 'Disasters', icon: FiAlertTriangle },
    { href: '/explore', label: 'Explore', icon: FiMap },
    { href: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { href: '/emergency-checklist', label: 'Checklist', icon: FiCheckSquare },
    { href: '/resources', label: 'Resources', icon: FiBook },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, logout } = useStore();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '12px 16px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 24px', borderRadius: 16,
                        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
                        border: '2px dashed var(--border-dashed)', boxShadow: 'var(--shadow-md)'
                    }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <motion.div whileHover={{ rotate: 10, scale: 1.05 }}
                            style={{
                                width: 40, height: 40, borderRadius: 12, background: 'var(--primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'white' }} fill="currentColor">
                                <path d="M12,2 L15.09,8.26 L22,9.27 L17,14.14 L18.18,21.02 L12,17.77 L5.82,21.02 L7,14.14 L2,9.27 L8.91,8.26 L12,2 Z" />
                            </svg>
                        </motion.div>
                        <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)' }} className="sm-hidden">SafeHaven</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="md-hidden" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.href;
                            return (
                                <Link key={link.href} to={link.href}>
                                    <button className="btn btn-ghost btn-sm" style={{
                                        borderRadius: 12, gap: 6,
                                        background: isActive ? 'var(--primary-bg)' : 'transparent',
                                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
                                    }}>
                                        <Icon size={16} /> {link.label}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth / hamburger */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="md-hidden" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 12, background: 'var(--surface)' }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FiUser size={16} color="white" />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name || 'User'}</span>
                                    </Link>
                                    <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ borderRadius: 12, color: 'var(--danger)' }}>
                                        <FiLogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"><button className="btn btn-ghost btn-sm" style={{ borderRadius: 12 }}>Sign In</button></Link>
                                    <Link to="/register"><button className="btn btn-primary btn-sm" style={{ borderRadius: 12 }}>Get Started</button></Link>
                                </>
                            )}
                        </div>
                        {/* Mobile hamburger - shown on small screens only via CSS */}
                        <button onClick={() => setIsOpen(!isOpen)}
                            style={{ display: 'none', padding: 8, borderRadius: 12 }}
                            className="mobile-menu-btn">
                            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </motion.div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            style={{ marginTop: 8, overflow: 'hidden' }}>
                            <div style={{
                                padding: 16, borderRadius: 16,
                                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                                border: '2px dashed var(--border-dashed)', boxShadow: 'var(--shadow-lg)'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)}>
                                                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12 }}>
                                                    <Icon size={20} /> {link.label}
                                                </button>
                                            </Link>
                                        );
                                    })}
                                    <hr style={{ border: 'none', borderTop: '2px dashed var(--border-dashed)', margin: '8px 0' }} />
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/profile" onClick={() => setIsOpen(false)}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px' }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FiUser size={20} color="white" />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 500 }}>{user?.name}</p>
                                                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <button className="btn btn-ghost" onClick={handleLogout}
                                                style={{ width: '100%', justifyContent: 'flex-start', gap: 12, borderRadius: 12, color: 'var(--danger)' }}>
                                                <FiLogOut size={20} /> Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                                <button className="btn btn-ghost" style={{ width: '100%', borderRadius: 12 }}>Sign In</button>
                                            </Link>
                                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                                <button className="btn btn-primary" style={{ width: '100%', borderRadius: 12 }}>Get Started</button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Responsive CSS for mobile menu button */}
            <style>{`
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .md-hidden { display: none !important; }
        }
      `}</style>
        </nav>
    );
}
