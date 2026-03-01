import { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, color } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FloatingDoodles, SquigglyUnderline, DoodleArrow, DoodlePin, DoodleHouseIcon, DoodleSunIcon, DoodleCloudIcon, DoodleHeart, DoodleStar, DoodleCheck } from '../components/DoodleDecorations';

const Hero3DScene = lazy(() => import('../components/three/Hero3DScene'));

const features = [
    { icon: DoodlePin, title: 'Real-Time Disaster Tracking', desc: 'Monitor wildfires, floods, hurricanes, and earthquakes as they happen with live FEMA and NOAA data.', color: 'var(--danger)', bg: 'var(--danger-bg)' },
    { icon: DoodleHouseIcon, title: 'Personalized Relocation Matches', desc: 'Find cities that match your budget, career, family needs, and lifestyle. We analyze cost of living, jobs, and schools.', color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { icon: DoodleSunIcon, title: 'Climate & Air Quality Data', desc: 'Compare weather patterns, air quality, and disaster history between your current location and potential new homes.', color: 'var(--chart-4)', bg: 'var(--warning-bg)' },
    { icon: DoodleCloudIcon, title: 'Smart Evacuation Routes', desc: 'Get route suggestions based on real-time traffic, road closures, and shelter availability during emergencies.', color: 'var(--accent)', bg: 'var(--accent-bg)' },
    { icon: DoodleHeart, title: 'Community Support Network', desc: 'Connect with others who have relocated and share experiences, tips, and resources for building a new life.', color: 'var(--chart-5)', bg: 'rgba(129,178,154,0.1)' },
    { icon: DoodleStar, title: 'Comprehensive City Reports', desc: 'Detailed reports on housing costs, employment, healthcare facilities, schools, and recreational activities.', color: 'var(--accent)', bg: 'var(--accent-bg)' },
];

const steps = [
    { num: '01', title: 'Tell Us About You', desc: 'Share your budget, family size, work preferences, and what matters most.', icon: '✏️' },
    { num: '02', title: 'We Analyze Everything', desc: 'Our system cross-references disaster data, cost of living, jobs, schools, and air quality.', icon: '🔍' },
    { num: '03', title: 'Get Your Shortlist', desc: 'Receive a personalized ranking of the safest, most compatible cities for your next chapter.', icon: '📋' },
    { num: '04', title: 'Plan Your Move', desc: 'Save locations, compare details, and get resources to make your transition smooth.', icon: '🏠' },
];

function FeatureCard({ feature, index }) {
    const ref = useRef();
    const isInView = useInView(ref, { once: true, margin: '-80px' });
    const Icon = feature.icon;
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}>
            <div className="card" style={{ height: '100%', padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: feature.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon style={{ width: 32, height: 32, color: feature.color }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
        </motion.div>
    );
}

function StepCard({ step, index }) {
    const ref = useRef();
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.15, duration: 0.5 }}>
            <div className="card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 56, height: 56, borderRadius: 16, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {step.icon}
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--primary)', fontWeight: 700 }}>{step.num}</span>
                        <h3 style={{ fontSize: 18, fontWeight: 700 }}>{step.title}</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function HomePage() {
    const [mounted, setMounted] = useState(false);
    const heroRef = useRef();
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => setMounted(true), []);

    return (
        <div className="page paper-texture">
            <FloatingDoodles />
            <Navbar />

            {/* Hero */}
            <section ref={heroRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    {mounted && (
                        <Suspense fallback={<div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, var(--bg), var(--bg-alt))' }} />}>
                            <Hero3DScene />
                        </Suspense>
                    )}
                </div>
                <motion.div style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px 20px 20px', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        style={{ position: 'absolute', top: '15vh', left: 0, right: 0, maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
                        {/* <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', marginBottom: 24, borderRadius: 999, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', border: '2px dashed var(--border-dashed)', boxShadow: 'var(--shadow-md)' }}>
                            <span className="pulse-dot" />
                            <span style={{ fontSize: 14, fontWeight: 500 }}>Real-time disaster tracking</span>
                        </motion.div> */}

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                            style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
                            <span style={{ display: 'block' }}>Your Journey to</span>
                            <span style={{ position: 'relative', display: 'inline-block', color: 'var(--primary)' }}>
                                Safety
                                <SquigglyUnderline style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 16, color: 'var(--primary)' }} />
                            </span>
                            {/* <span style={{ display: 'block', marginTop: 8 }}>Starts <strong style={{ color: '#00f' }}> Here</strong></span> */}
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'transparent', maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.7 }}>
                            When disaster strikes, we help you find not just where to go, but where to <strong style={{ color: 'transparent' }}>thrive</strong>.
                            Personalized relocation planning based on your life, your needs, your future.
                        </motion.p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        style={{ position: 'absolute', bottom: 'clamp(16px, 3vh, 32px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(16px, 3vh, 24px)', width: '100%', padding: '0 20px', zIndex: 20 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
                            style={{ display: 'flex', gap: 'clamp(12px, 2vw, 20px)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/dashboard">
                                <button className="btn btn-primary btn-xl" style={{ borderRadius: 16 }}>
                                    Start Planning <DoodleArrow style={{ width: 24, height: 16 }} />
                                </button>
                            </Link>
                            <Link to="/disasters">
                                <button className="btn btn-outline btn-xl" style={{ borderRadius: 16, backdropFilter: 'blur(8px)' }}>
                                    View Active Disasters
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}
                            style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['FEMA Data Integrated', 'Real-time Updates', 'Cost of Living Analysis'].map((text) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 'clamp(12px, 1.2vw, 14px)' }}>
                                    <DoodleCheck style={{ width: 18, height: 18, color: 'var(--accent)' }} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                            <span>Scroll to explore</span>
                            <DoodleArrow direction="down" style={{ width: 24, height: 24, margin: '2px auto 0', display: 'block', color: '#000' }} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features */}
            <section style={{ padding: '96px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: 64 }}>
                        <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'var(--surface)', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Everything You Need</span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 16 }}>
                            Plan Your Safe <span style={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
                                Tomorrow
                                <SquigglyUnderline style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 12, color: 'var(--primary)' }} />
                            </span>
                        </h2>
                        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto' }}>
                            From disaster detection to finding your perfect new home, we provide every tool you need.
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '96px 20px', background: 'var(--bg-alt)' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: 64 }}>
                        <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'var(--surface)', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Simple Process</span>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800 }}>
                            How It <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-hand)', fontSize: 'clamp(32px, 4.5vw, 56px)' }}>Works</span>
                        </h2>
                    </motion.div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {steps.map((s, i) => <StepCard key={s.num} step={s} index={i} />)}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
