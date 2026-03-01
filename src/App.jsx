import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import CreativeLoader from './components/CreativeLoader';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DisastersPage = lazy(() => import('./pages/DisastersPage'));
const PlanPage = lazy(() => import('./pages/PlanPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EmergencyChecklistPage = lazy(() => import('./pages/EmergencyChecklistPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));

function PageLoader() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg)', fontFamily: 'var(--font-hand)', fontSize: 24, color: 'var(--text-muted)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}>
                    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="80" strokeLinecap="round" />
                </svg>
                <p>Loading...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useStore();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
    const [showLoader, setShowLoader] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (hasVisited) {
            setShowLoader(false);
            setShowContent(true);
        }
    }, []);

    const handleLoaderComplete = () => {
        setShowLoader(false);
        sessionStorage.setItem('hasVisited', 'true');
        setTimeout(() => setShowContent(true), 100);
    };

    return (
        <>
            {showLoader && <CreativeLoader onComplete={handleLoaderComplete} />}
            {showContent && (
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/disasters" element={<DisastersPage />} />
                        <Route path="/plan" element={<PlanPage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/emergency-checklist" element={<EmergencyChecklistPage />} />
                        <Route path="/resources" element={<ResourcesPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            )}
        </>
    );
}
