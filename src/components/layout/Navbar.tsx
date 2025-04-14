
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  Filter,
  SlidersHorizontal,
  User,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command";

interface NavbarProps {
  username?: string;
  themeToggle?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ username: propUsername, themeToggle }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState(propUsername || 'User');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const { theme, setTheme } = useTheme();
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationFilter, setNotificationFilter] = useState<string | null>(null);
  
  // Mark all notifications as read when opening the notifications panel
  const openNotifications = useCallback(() => {
    setNotificationsOpen(true);
    setHasUnreadNotifications(false);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    if (!propUsername) {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUsername(storedName);
      }
    }
    
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propUsername]);

  const getTitle = () => {
    if (location.pathname === '/dashboard') {
      return greeting;
    }
    
    switch(location.pathname) {
      case '/add-medication':
        return 'Add Medication';
      case '/reminders':
        return 'Reminders';
      case '/chatbot':
        return 'Health Assistant';
      case '/health-records':
        return 'Health Records';
      case '/profile':
        return 'Profile';
      default:
        return 'Medico';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const notifications = [
    {
      id: 1,
      title: 'Medication Reminder',
      message: 'Time to take your evening medication',
      time: '1 hour ago',
      status: 'pending',
      category: 'reminder',
      icon: Clock
    },
    {
      id: 2, 
      title: 'Appointment Confirmed',
      message: 'Your doctor appointment is confirmed for tomorrow at 2:00 PM',
      time: 'Yesterday',
      status: 'success',
      category: 'appointment',
      icon: CheckCircle2
    },
    {
      id: 3,
      title: 'Health Alert',
      message: 'Remember to measure your blood pressure today',
      time: '2 days ago',
      status: 'alert',
      category: 'alert',
      icon: AlertCircle
    }
  ];

  const filteredNotifications = notificationFilter 
    ? notifications.filter(n => n.category === notificationFilter)
    : notifications;

  const recentSearches = [
    { id: 1, text: 'Aspirin', type: 'medication' },
    { id: 2, text: 'Blood pressure medication', type: 'medication' },
    { id: 3, text: 'Evening reminders', type: 'reminder' },
    { id: 4, text: 'Health records', type: 'record' }
  ];

  const filteredSearches = searchQuery 
    ? recentSearches.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentSearches;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 py-3",
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-screen-sm mx-auto flex items-center justify-between">
        {location.pathname === '/dashboard' ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-lg font-medium"
          >
            <motion.h1 
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-400 dark:to-teal-500 font-semibold"
              animate={{ 
                scale: [1, 1.03, 1],
                opacity: [1, 0.95, 1]
              }}
              transition={{ 
                duration: 2.5, 
                ease: "easeInOut", 
                repeat: Infinity, 
                repeatDelay: 3
              }}
            >
              {greeting}
            </motion.h1>
          </motion.div>
        ) : (
          <Link to="/" className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-400 dark:to-teal-500">
            {getTitle()}
          </Link>
        )}
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)}
            className="rounded-full hover:bg-secondary/80 transition-all"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
          </Button>
          
          <div className="relative">
            <Button 
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary/80 transition-all"
              onClick={openNotifications}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <AnimatePresence>
                {hasUnreadNotifications && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-primary border-white dark:border-gray-800 border-2"></Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          
          {themeToggle || (
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-secondary/80 transition-all"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          )}
        </div>
      </div>
      
      {/* Enhanced Search Dialog using Command component */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
          <Command className="rounded-lg shadow-md border-0">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Search medications, reminders, health records..." 
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none focus-visible:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
                autoFocus
              />
              <Button 
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Recent Searches">
                {filteredSearches.map((item) => (
                  <CommandItem
                    key={item.id}
                    className="flex items-center py-3 px-2 cursor-pointer"
                    onSelect={() => {
                      setSearchOpen(false);
                      // Navigate or perform action based on the item
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center mr-3">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.text}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-primary text-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                >
                  Clear recent searches
                </Button>
              </div>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      
      {/* Enhanced Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[80vh]">
          <DialogHeader className="p-4 border-b sticky top-0 bg-background z-10 flex flex-row items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="text-lg font-medium">Notifications</DialogTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => setNotificationFilter(null)}
                >
                  All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs",
                    notificationFilter === 'reminder' && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setNotificationFilter('reminder')}
                >
                  Reminders
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2 text-xs",
                    notificationFilter === 'alert' && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setNotificationFilter('alert')}
                >
                  Alerts
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setNotificationsOpen(false)}
                  className="w-8 h-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
            {filteredNotifications.length > 0 ? (
              <AnimatePresence>
                <div className="divide-y">
                  {filteredNotifications.map(notification => (
                    <motion.div 
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                          notification.status === 'success' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                          notification.status === 'pending' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                          notification.status === 'alert' && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                        )}>
                          <notification.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground ml-2">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center mt-2">
                            <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                              {notification.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <h3 className="font-medium text-lg mb-1">No notifications</h3>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t sticky bottom-0 bg-background">
            <Button 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => {
                setNotificationsOpen(false);
              }}
            >
              View all notifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
