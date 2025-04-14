
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DrugResult } from '@/services/fdaApi';
import { ChevronDown, ChevronUp, Plus, PlusCircle, AlertTriangle, Navigation, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MedicineSearchResultProps {
  drug: DrugResult;
  onAddClick: () => void;
}

const MedicineSearchResult: React.FC<MedicineSearchResultProps> = ({ drug, onAddClick }) => {
  const [expanded, setExpanded] = useState(false);
  
  const brandName = drug.openfda.brand_name?.[0] || 'Unknown';
  const genericName = drug.openfda.generic_name?.[0] || 'Unknown';
  const manufacturer = drug.openfda.manufacturer_name?.[0] || 'Unknown Manufacturer';
  const routeOfAdmin = drug.openfda.route?.[0] || 'Not specified';
  const substanceName = drug.openfda.substance_name?.[0] || '';
  
  const toggleExpanded = () => setExpanded(prev => !prev);

  const renderInfoSection = (title: string, content?: string[], maxLength: number = 300, isWarning = false) => {
    if (!content || content.length === 0) return null;
    
    let displayText = content[0];
    
    // Trim text if it's too long
    if (displayText.length > maxLength) {
      displayText = displayText.substring(0, maxLength) + '...';
    }
    
    return (
      <div className="mb-3">
        <h4 className={`font-medium text-sm mb-1 flex items-center gap-1 ${isWarning ? 'text-amber-500' : ''}`}>
          {isWarning && <AlertTriangle className="h-3 w-3" />}
          {title}
        </h4>
        <p className="text-sm text-muted-foreground">{displayText}</p>
      </div>
    );
  };

  // Calculate badge color based on the first letter of the brand name
  const getBadgeColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800', 
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800'
    ];
    
    const firstChar = (brandName || 'A').charAt(0).toUpperCase();
    const index = firstChar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-xl overflow-hidden bg-background shadow-sm"
    >
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={toggleExpanded}>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getBadgeColor()}`}>
            {brandName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium">{brandName}</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-sm text-muted-foreground">{genericName}</p>
              {substanceName && (
                <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {substanceName}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
          <div className="p-1 rounded-full bg-secondary">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 border-t"
        >
          <div className="py-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Manufacturer: {manufacturer}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              <span>Route: {routeOfAdmin}</span>
            </div>
          </div>
          
          {renderInfoSection('Usage', drug.indications_and_usage)}
          {renderInfoSection('Purpose', drug.purpose)}
          {renderInfoSection('Active Ingredients', drug.active_ingredient)}
          {renderInfoSection('Dosage', drug.dosage_and_administration)}
          {renderInfoSection('Warnings', drug.warnings || drug.warnings_and_cautions, 300, true)}
          {renderInfoSection('Drug Interactions', drug.drug_interactions)}
          {renderInfoSection('Pregnancy Information', drug.pregnancy)}
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            className="w-full mt-2"
          >
            Add to My Medications
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MedicineSearchResult;
