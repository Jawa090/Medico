
import React from 'react';
import PageTransition from '@/components/ui/PageTransition';
import ChatInterface from '@/components/chatbot/ChatInterface';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Brain } from 'lucide-react';

const Chatbot = () => {
  return (
    <PageTransition className="min-h-[calc(100vh-80px)] flex flex-col app-container pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 relative"
      >
        <h1 className="page-title text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
          Medico Assistant
        </h1>
        <div className="flex justify-center">
          <p className="page-subtitle text-base max-w-md">
            Get personalized answers to your health questions and medication management assistance
          </p>
        </div>

        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-10 -left-4 text-blue-300/30 dark:text-blue-700/20"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={40} />
        </motion.div>
        
        <motion.div 
          className="absolute top-0 right-10 text-cyan-300/30 dark:text-cyan-700/20"
          animate={{ 
            rotate: [0, -15, 15, 0],
            scale: [1, 0.9, 1.1, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Bot size={32} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-0 right-0 text-teal-300/30 dark:text-teal-700/20"
          animate={{ 
            rotate: [0, 15, -5, 0],
            scale: [1, 1.05, 0.95, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Brain size={28} />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel overflow-hidden rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/20 flex-grow bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20"
      >
        <ChatInterface className="h-full flex flex-col" />
      </motion.div>
      
      {/* Feature badges */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-xl border border-cyan-100 dark:border-cyan-900/20 flex flex-col items-center text-center"
        >
          <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-2">
            <Bot size={18} />
          </div>
          <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">AI-Powered Advice</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20 flex flex-col items-center text-center"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
            <Brain size={18} />
          </div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Medication Insights</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-teal-50 dark:bg-teal-950/30 p-3 rounded-xl border border-teal-100 dark:border-teal-900/20 flex flex-col items-center text-center"
        >
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-2">
            <Sparkles size={18} />
          </div>
          <p className="text-xs font-medium text-teal-700 dark:text-teal-400">24/7 Assistance</p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Chatbot;
