
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Salad, Apple, Utensils, Clock } from 'lucide-react';
import WeightGainPlan from './WeightGainPlan';
import WeightLossPlan from './WeightLossPlan';
import { motion } from 'framer-motion';

const DietPlanSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weight-loss');

  return (
    <motion.div 
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Diet Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weight-loss" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="weight-loss" className="flex items-center gap-2">
                <ArrowDownCircle className="h-4 w-4" />
                <span>Weight Loss</span>
              </TabsTrigger>
              <TabsTrigger value="weight-gain" className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4" />
                <span>Weight Gain</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight-loss" className="mt-0">
              <WeightLossPlan />
            </TabsContent>
            
            <TabsContent value="weight-gain" className="mt-0">
              <WeightGainPlan />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DietPlanSection;
