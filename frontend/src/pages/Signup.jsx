import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { KARNATAKA_DISTRICTS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    district: 'Bangalore Urban',
    avatar: '🐘',
  });
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const avatars = ['🐘', '🎨', '📚', '🌟', '🎭', '🏛️', '☕', '🎵'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    toast.success('Account created successfully!');
    setTimeout(() => navigate('/dashboard'), 500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-sky/10 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-4xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🐘</div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">Join Us!</h1>
          <p className="text-neutral-600">Start learning Kannada today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">District</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none appearance-none"
              >
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Choose Avatar</label>
            <div className="grid grid-cols-8 gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData({...formData, avatar})}
                  className={`text-3xl p-2 rounded-xl transition-all ${
                    formData.avatar === avatar
                      ? 'bg-primary-100 ring-2 ring-primary-500'
                      : 'hover:bg-neutral-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>
        
        <p className="text-center text-neutral-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
