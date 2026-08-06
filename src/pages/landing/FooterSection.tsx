import React from 'react';
import { Link } from 'react-router';
import { Globe, Share2, MessageCircle, Send, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl shadow-md">
                <Logo size="md" />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Accelerating Indonesia's transition to EV by empowering vocational talents and connecting them with top industry leaders.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Website" className="text-slate-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" aria-label="Share" className="text-slate-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></a>
              <a href="#" aria-label="Chat" className="text-slate-400 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" aria-label="Send" className="text-slate-400 hover:text-white transition-colors"><Send className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/schools" className="hover:text-white transition-colors">For Schools</Link></li>
              <li><Link to="/industries" className="hover:text-white transition-colors">For Industries</Link></li>
              <li><Link to="/students" className="hover:text-white transition-colors">For Students</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/partners" className="hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest EV industry insights.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <Button variant="primary" className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; 2026 Spora Juara. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
