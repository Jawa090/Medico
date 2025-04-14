
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MedicationCard from '@/components/medication/MedicationCard';
import { Plus, Calendar, Clock, MessageCircle, Activity, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import CompactHealthTip from '@/components/health/CompactHealthTip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Dashboard = () => {
  // Mock data - would come from a backend in a real app
  const [medications, setMedications] = useState([
    { id: '1', name: 'Aspirin', dosage: '80mg - 1 tablet', time: '8:00 AM', color: 'blue' as const, taken: true },
    { id: '2', name: 'Vitamin D', dosage: '1000 IU - 1 capsule', time: '9:00 AM', color: 'green' as const, taken: true },
    { id: '3', name: 'Lisinopril', dosage: '10mg - 1 tablet', time: '1:00 PM', color: 'purple' as const, taken: false },
    { id: '4', name: 'Metformin', dosage: '500mg - 1 tablet', time: '7:00 PM', color: 'peach' as const, taken: false },
  ]);

  const [progress, setProgress] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // Calculate progress
    const takenCount = medications.filter(med => med.taken).length;
    const progressValue = medications.length > 0 ? (takenCount / medications.length) * 100 : 0;
    
    // Animate progress from 0 to actual value
    let start = 0;
    const target = progressValue;
    const duration = 1500;
    const startTime = Date.now();
    
    const animateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(start + progress * (target - start));
      
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);
  }, [medications]);

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  // Container animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Format the selected date
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <PageTransition className="app-container">
      {/* Enhanced Daily Health Tip */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CompactHealthTip />
      </motion.div>
      
      {/* Enhanced animated progress section with glassy effect */}
      <motion.div 
        className="mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="flex flex-col gap-2 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/10 shadow-sm"
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground font-medium">Daily Progress</p>
            <span className="text-sm bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {medications.filter(m => m.taken).length}/{medications.length} taken
            </span>
          </div>
          
          {/* Animated progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Progress value={progress} className="h-2.5" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Quick action buttons with refined animations */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Link to="/add-medication">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
            className="flex flex-col items-center p-3 bg-primary/5 rounded-xl relative overflow-hidden border border-primary/10"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Add Meds</span>
          </motion.div>
        </Link>
        
        <Link to="/reminders">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
            className="flex flex-col items-center p-3 bg-primary/5 rounded-xl relative overflow-hidden border border-primary/10"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Reminders</span>
          </motion.div>
        </Link>
        
        <Link to="/chatbot">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
            className="flex flex-col items-center p-3 bg-primary/5 rounded-xl relative overflow-hidden border border-primary/10"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-2">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Health AI</span>
          </motion.div>
        </Link>
        
        <Link to="/health-records">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)' }}
            whileTap={{ y: 0 }}
            className="flex flex-col items-center p-3 bg-primary/5 rounded-xl relative overflow-hidden border border-primary/10"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Records</span>
          </motion.div>
        </Link>
      </div>

      {/* Calendar strip with elegant date navigation */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <button 
              onClick={() => navigateDate('prev')}
              className="mr-1 p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <h2 className="font-medium text-primary">{formatSelectedDate(selectedDate)}</h2>
            <button 
              onClick={() => navigateDate('next')}
              className="ml-1 p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <motion.button 
                className="text-xs text-primary flex items-center bg-primary/10 px-2 py-1 rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-3 h-3 mr-1" />
                Calendar
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Refined day selection strip */}
        <motion.div 
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index - 3);
            const isToday = index === 3;
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <motion.div
                key={index}
                whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                className={`flex-shrink-0 w-10 h-14 flex flex-col items-center justify-center rounded-xl cursor-pointer ${
                  isSelected 
                    ? 'bg-primary text-white shadow-md' 
                    : isToday
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-gray-50 text-foreground hover:bg-primary/10 border border-gray-100'
                }`}
                onClick={() => {
                  const newDate = new Date(date);
                  setSelectedDate(newDate);
                }}
              >
                <span className="text-xs opacity-80">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                </span>
                <span className="text-base font-medium mt-1">{date.getDate()}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Today's medications with enhanced styling */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-gray-800">Medications for Today</h2>
        </div>
        
        <AnimatePresence>
          {medications.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-3"
            >
              {medications.map((medication) => (
                <motion.div 
                  key={medication.id} 
                  variants={item}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                  layoutId={medication.id}
                >
                  <MedicationCard
                    {...medication}
                    onDelete={handleDeleteMedication}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-6 bg-secondary/50 rounded-xl border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-muted-foreground">No medications for today</p>
              <Link to="/add-medication" className="mt-3 inline-block text-primary hover:underline">
                + Add your first medication
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle animated floating medical elements (purely decorative) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-5"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              scale: 0.5 + Math.random() * 0.5
            }}
            animate={{ 
              y: -100 + Math.random() * -100,
              rotate: 360,
            }}
            transition={{ 
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 5,
              ease: "easeInOut"
            }}
          >
            {i % 4 === 0 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5m7 12v4a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1m-7-8v2m-2-4h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 4 === 1 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M16.5 4.5a1.5 1.5 0 0 0-3 0v2.5h-3V4.5a1.5 1.5 0 0 0-3 0V9H5a1.5 1.5 0 0 0 0 3h2.5v3H5a1.5 1.5 0 0 0 0 3h2.5v1a1.5 1.5 0 0 0 3 0v-1h3v1a1.5 1.5 0 0 0 3 0v-1H19a1.5 1.5 0 0 0 0-3h-2.5v-3H19a1.5 1.5 0 0 0 0-3h-2.5V4.5z" />
              </svg>
            )}
            {i % 4 === 2 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
            {i % 4 === 3 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                <path d="M7 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H7zM7 17a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H7z" strokeWidth="2" stroke="currentColor" fill="none" />
                <path d="M12 7v5M10 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
