import React from 'react';
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="p-8 text-center"><h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary">Reload Page</button></div>
    );
    return this.props.children;
  }
}