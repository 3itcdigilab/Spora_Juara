import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './components/ui/Toast';
import { AppRouter } from './router/AppRouter';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { initFirestoreSync } from './services/firestoreSync';
import './styles/design-system.css';
import './styles/components.css';

function App() {
  const [firestoreReady, setFirestoreReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    initFirestoreSync()
      .then(() => setFirestoreReady(true))
      .catch((err) => {
        console.error('[App] Firestore init failed:', err);
        setLoadError('Gagal memuat database. Silakan refresh halaman.');
        // Fallback: allow app to load anyway with empty data
        setFirestoreReady(true);
      });
  }, []);

  if (!firestoreReady) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #0099B8 100%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: 'white'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '24px'
        }} />
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          Spora Juara
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>
          Memuat database dari cloud...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (loadError) {
    console.warn('[App] Load error:', loadError);
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;