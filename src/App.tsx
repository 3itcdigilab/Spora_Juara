import React from 'react';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './components/ui/Toast';
import { AppRouter } from './router/AppRouter';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles/design-system.css';
import './styles/components.css';
function App() {
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