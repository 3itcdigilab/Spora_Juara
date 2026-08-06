import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
export default function LoginPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const { login } = useAuth(); const navigate = useNavigate();
  const handleSubmit = async (e: any) => { e.preventDefault(); await login(email, password); navigate('/dashboard'); };
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Spora TalentOS</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <Input label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          <Button type="submit" className="w-full mt-4">Login</Button>
        </form>
      </div>
    </div>
  );
}