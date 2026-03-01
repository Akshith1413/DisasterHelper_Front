import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DoodleHeart, DoodleStar } from './DoodleDecorations';

export default function Footer() {
    const footerLinks = {
        'Features': [
            { label: 'Disaster Tracking', href: '/disasters' },
            { label: 'Smart Relocation', href: '/plan' },
            { label: 'City Explorer', href: '/explore' },
            { label: 'Emergency Checklist', href: '/emergency-checklist' },
        ],
        'Resources': [
            { label: 'FEMA Resources', href: '/resources' },
            { label: 'Evacuation Guides', href: '/resources' },
            { label: 'Community Support', href: '/resources' },
            { label: 'API Docs', href: '/resources' },
        ],
        'Account': [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile', href: '/profile' },
            { label: 'Sign In', href: '/login' },
            { label: 'Register', href: '/register' },
        ],
    };

    return (
        <footer style={{ background: 'var(--bg-alt)', borderTop: '2px dashed var(--border-dashed)', padding: '60px 20px 30px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: 'white' }} fill="currentColor">
                                    <path d="M12,2 L15.09,8.26 L22,9.27 L17,14.14 L18.18,21.02 L12,17.77 L5.82,21.02 L7,14.14 L2,9.27 L8.91,8.26 L12,2 Z" />
                                </svg>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 20 }}>SafeHaven</span>
                        </Link>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                            Your journey to safety starts here. We help you find not just where to go, but where to thrive.
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <DoodleStar style={{ width: 20, height: 20, color: 'var(--chart-4)' }} />
                            <DoodleHeart style={{ width: 20, height: 20, color: 'var(--primary)' }} />
                        </div>
                    </div>

                    {/* Link groups */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-sketch)' }}>{title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {links.map((link) => (
                                    <Link key={link.label} to={link.href}
                                        style={{ color: 'var(--text-secondary)', fontSize: 14, transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                                        onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '2px dashed var(--border-dashed)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        © 2026 SafeHaven. Built with ❤️ for disaster preparedness.
                    </p>
                    <div style={{ display: 'flex', gap: 16 }}>
                        {['FEMA', 'NOAA', 'EPA', 'Census'].map((api) => (
                            <span key={api} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '4px 8px', background: 'var(--surface)', borderRadius: 8 }}>{api}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
