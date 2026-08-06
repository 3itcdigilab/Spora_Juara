import React from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';
export default function Error404() {
  return <div className="flex flex-col h-screen items-center justify-center text-center"><h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1><h2 className="text-2xl font-semibold mb-2">Page Not Found</h2><p className="text-gray-500 mb-6">The page you are looking for doesn't exist.</p><Link to="/"><Button>Go Home</Button></Link></div>;
}