
import React from 'react';
import { motion } from 'framer-motion';
import DailyHealthTip from './DailyHealthTip';

interface CompactHealthTipProps {
  className?: string;
}

const CompactHealthTip: React.FC<CompactHealthTipProps> = ({ className }) => {
  return (
    <div className={`${className} overflow-hidden`}>
      <motion.div
        className="bg-primary/5 rounded-xl p-2 border border-primary/10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ boxShadow: 'none' }} 
      >
        <div className="scale-70 origin-top-left mx-auto">
          <DailyHealthTip enhanced={true} autoRotate={true} rotationInterval={15000} />
        </div>
      </motion.div>
    </div>
  );
};

export default CompactHealthTip;
