
import React, { useState } from 'react';
import PageTransition from '@/components/ui/PageTransition';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, PhoneCall, Check, Clock, Calendar, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const reminderMethods = [
  {
    id: 'push',
    icon: Bell,
    title: 'Push Notification',
    description: 'Get reminders on your phone or tablet',
    isConnected: true
  },
  {
    id: 'sms',
    icon: MessageSquare,
    title: 'SMS',
    description: 'Receive text message reminders',
    isConnected: false
  },
  {
    id: 'whatsapp',
    icon: PhoneCall,
    title: 'WhatsApp',
    description: 'Get reminders via WhatsApp messenger',
    isConnected: false
  }
];

const Reminders = () => {
  const [enabledMethods, setEnabledMethods] = useState<string[]>(['push']);
  const [beforeTime, setBeforeTime] = useState<string>("0");
  const [quietHoursStart, setQuietHoursStart] = useState<string>("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState<string>("07:00");
  
  const toggleMethod = (id: string) => {
    setEnabledMethods(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id) 
        : [...prev, id]
    );
  };

  const handleSave = () => {
    toast.success("Reminder settings saved successfully", { duration: 1000 });
  };

  return (
    <PageTransition className="app-container pb-20">
      <div className="mb-8">
        <h1 className="page-title text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
          Reminder Settings
        </h1>
        <p className="text-muted-foreground text-lg">
          Customize how and when you receive medication reminders
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border shadow-md bg-white dark:bg-gray-950">
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notification Methods
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose how you'd like to receive medication reminders
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {reminderMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleMethod(method.id)}
                    className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                      enabledMethods.includes(method.id) 
                        ? 'border-primary/50 bg-primary/5 shadow-sm' 
                        : 'border-border hover:bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        enabledMethods.includes(method.id) 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      enabledMethods.includes(method.id) ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {enabledMethods.includes(method.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-md bg-white dark:bg-gray-950">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium text-lg">Reminder Timing</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              How early would you like to be notified before your scheduled medication?
            </p>
            
            <select 
              className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={beforeTime}
              onChange={(e) => setBeforeTime(e.target.value)}
            >
              <option value="0">At the scheduled time</option>
              <option value="5">5 minutes before</option>
              <option value="10">10 minutes before</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
            </select>
            
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded-full">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Critical medications will always send reminders at the exact scheduled time
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-md bg-white dark:bg-gray-950">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium text-lg">Quiet Hours</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              During these hours, you'll only receive critical reminders
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">From</label>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To</label>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                Sleep Schedule
              </h4>
              <p className="text-xs text-muted-foreground">
                Quiet hours are synced with your sleep schedule to minimize disruptions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            y: -2
          }}
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md flex items-center justify-center"
        >
          <span>Save Reminder Settings</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </PageTransition>
  );
};

export default Reminders;
