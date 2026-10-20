import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@musatransport.com');
  const [password, setPassword] = useState('Admin@Musa2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome to MUSA Transport Operations Dashboard.');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Invalid administrator credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F5EC] flex flex-col justify-between relative overflow-hidden font-body">
      {/* Ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Top Bar */}
      <div className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-[#F8F5EC]">
          MUSA<span className="text-[#D4AF37] font-normal">TRANSPORT</span>
        </Link>
        <Link
          to="/"
          className="text-xs uppercase tracking-wider text-[#B8B2A3] hover:text-[#D4AF37] transition-colors"
        >
          ← Return to Public Website
        </Link>
      </div>

      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md bg-[#0D0E10] border border-[rgba(201,162,39,0.30)] rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative">
          {/* Subtle top spotlight */}
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.35)] flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
              <ShieldCheck size={24} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F8F5EC] tracking-tight">
              Operations Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#B8B2A3] mt-2">
              Authorized personnel access for Umrah dispatch & voucher management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-medium mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A756C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@musatransport.com"
                  required
                  className="w-full bg-[#141619] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-xl px-4 py-3 pl-10 text-sm text-[#F8F5EC] outline-none transition-all placeholder:text-[#6F6A60]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B8B2A3] font-medium mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A756C]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#141619] border border-[rgba(74,57,28,0.35)] focus:border-[#D4AF37] rounded-xl px-4 py-3 pl-10 text-sm text-[#F8F5EC] outline-none transition-all placeholder:text-[#6F6A60]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-[#050505] flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                style={{
                  background: 'linear-gradient(135deg, #D7B447 0%, #A47B16 100%)',
                }}
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate & Access</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick testing hint */}
          <div className="mt-6 p-3 rounded-lg bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.18)] text-[11px] text-[#B8B2A3] text-center">
            <span className="text-[#D4AF37] font-semibold">Demo Dispatch Access: </span>
            <span>admin@musatransport.com (Default Super Admin)</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-[11px] text-[#6F6A60] relative z-10">
        © {new Date().getFullYear()} MUSA TRANSPORT. Confidential Transportation Operations System.
      </div>
    </div>
  );
};

export default AdminLogin;
