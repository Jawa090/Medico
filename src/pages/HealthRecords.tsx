
import React, { useState } from 'react';
import PageTransition from '@/components/ui/PageTransition';
import HealthRecordsComponent from '@/components/health/HealthRecordsComponent';
import MedicalHistorySection from '@/components/health/MedicalHistorySection';
import HealthStatsSection from '@/components/health/HealthStatsSection';
import { Pill, HeartPulse, Stethoscope, Activity, ClipboardList, BarChart3, FilePlus2, FileEdit } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HealthRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("medications");

  return (
    <PageTransition className="min-h-[calc(100vh-80px)] flex flex-col app-container pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="page-title text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-1">
            Health Records
          </h1>
          <p className="page-subtitle text-base text-gray-600 dark:text-gray-400 mb-0">
            Your complete medical history in one secure place
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50 py-1 px-3">
            <FileEdit size={14} className="mr-1" /> Last updated: {new Date().toLocaleDateString()}
          </Badge>
          
          <Button 
            variant="outline"
            size="sm" 
            className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/50"
            onClick={() => {
              const element = document.querySelector(activeTab === "medications" 
                ? '[data-add-medication]' 
                : activeTab === "stats" 
                  ? '[data-add-stat]' 
                  : '[data-add-history]');
              if (element) {
                (element as HTMLButtonElement).click();
              }
            }}
          >
            <FilePlus2 size={16} className="mr-1.5" /> Add Record
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel overflow-hidden rounded-2xl shadow-lg border border-emerald-100/80 dark:border-emerald-900/20 flex-grow bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/10"
      >
        <Tabs 
          defaultValue="medications" 
          className="w-full h-full flex flex-col"
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-900 border-b dark:border-emerald-900/20 p-0 h-auto rounded-none overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="medications" 
              className="flex-1 py-3 data-[state=active]:rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950/80 data-[state=active]:border-b-2 data-[state=active]:border-b-emerald-500 whitespace-nowrap gap-2"
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              Medications
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex-1 py-3 data-[state=active]:rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950/80 data-[state=active]:border-b-2 data-[state=active]:border-b-emerald-500 whitespace-nowrap gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              Health Stats
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 py-3 data-[state=active]:rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950/80 data-[state=active]:border-b-2 data-[state=active]:border-b-emerald-500 whitespace-nowrap gap-2"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Medical History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="medications" className="p-0 m-0 flex-grow bg-white dark:bg-gray-950/50">
            <HealthRecordsComponent />
          </TabsContent>
          
          <TabsContent value="stats" className="p-0 m-0 flex-grow bg-white dark:bg-gray-950/50">
            <HealthStatsSection />
          </TabsContent>
          
          <TabsContent value="history" className="p-0 m-0 flex-grow bg-white dark:bg-gray-950/50">
            <MedicalHistorySection />
          </TabsContent>
        </Tabs>
      </motion.div>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute backdrop-blur-sm"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50,
              rotate: Math.random() * 180,
              opacity: 0.4
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ 
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear"
            }}
          >
            {i % 8 === 0 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500/30">
                <path d="M20 10h-3V7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3h3a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 1 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500/30">
                <path d="M7 20h10M12 16v4M6 8V5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v3M5 8h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 2 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500/30">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 3 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500/30">
                <path d="M3 12h18M12 3v18M5.641 5.631A9 9 0 1 0 18.36 18.36l-5.66-5.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 4 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500/30">
                <path d="M19 11V9a7 7 0 1 0-14 0v2M4 11h16a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 11V9a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 16v2a2 2 0 0 1-4 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 5 && (
              <div className="w-14 h-7 rounded-full bg-teal-500/30 backdrop-blur-sm" />
            )}
            {i % 8 === 6 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500/30">
                <path d="M7 12H3V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7h-4m-6 0v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8m-10 0h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {i % 8 === 7 && (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500/30">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.93 16.93A10 10 0 0 1 2 12h10v10a9.98 9.98 0 0 1-3.07-5.07z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
};

export default HealthRecords;
