import React from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/Button';
export default function Error403() {
  return <div className="flex flex-col h-screen items-center justify-center text-center"><h1 className="text-6xl font-bold text-red-500 mb-4">403</h1><h2 className="text-2xl font-semibold mb-2">Access Denied</h2><p className="text-gray-500 mb-6">You don't have permission to access this page.</p><Link to="/"><Button>Go Home</Button></Link></div>;
}