
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Bell, MessageSquare, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/add-medication', icon: PlusCircle, label: 'Add' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/chatbot', icon: MessageSquare, label: 'Chat' },
    { path: '/health-records', icon: FileText, label: 'Records' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 py-2 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <nav className="max-w-screen-sm mx-auto">
        <ul className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="relative">
                <Link 
                  to={item.path} 
                  className={cn(
                    "flex flex-col items-center p-2 transition-colors group",
                    isActive 
                      ? "text-primary dark:text-primary" 
                      : "text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-300"
                  )}
                >
                  {isActive ? (
                    <motion.div
                      layoutId="navIconBackground"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  ) : null}
                  
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 mb-1",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground dark:text-gray-400 dark:group-hover:text-gray-300"
                    )} />
                  </motion.div>
                  
                  <span className={cn(
                    "text-xs",
                    isActive ? "font-medium" : ""
                  )}>{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-2 h-1 w-10 bg-primary rounded-t-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default BottomNav;
