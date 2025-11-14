import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Trophy, User } from 'lucide-react';
import Header from './Header';

export default function MainLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/chatbot', icon: MessageCircle, label: 'Chat' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-primary-100' : ''}`} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="h-20 md:hidden" />
    </div>
  );
}
