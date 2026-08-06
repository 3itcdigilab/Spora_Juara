import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 relative z-10">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-600 mb-8">
              We've sent a password reset link to <span className="font-semibold">{email}</span>.
            </p>
            <Button variant="primary" className="w-full justify-center" onClick={() => setIsSubmitted(false)}>
              Send another link
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h1>
              <p className="text-slate-500">Enter your email address and we'll send you a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm sm:text-sm"
                    placeholder="student@spora.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full justify-center text-base py-2.5">
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
