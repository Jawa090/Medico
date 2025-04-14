
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Trash2, PlusCircle, Clock, CalendarDays, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MedicationCard from '../medication/MedicationCard';

interface HealthRecord {
  id: string;
  date: Date | string;
  medicationName: string;
  notes: string;
  dosage?: string;
  time?: string;
}

const HealthRecordsComponent: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('');
  const [view, setView] = useState<'list' | 'card'>('card');

  // Load health records from localStorage and chatbot-added records
  useEffect(() => {
    loadRecords();
    
    // Set up interval to update records every minute (for "daily dose" simulation)
    const intervalId = setInterval(() => {
      loadRecords();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadRecords = () => {
    try {
      // 1. Load regular health records
      const savedRecords = localStorage.getItem('healthRecords');
      let allRecords: HealthRecord[] = savedRecords ? JSON.parse(savedRecords) : [];
      
      // 2. Load medication records (if any) and merge
      const medicationRecords = localStorage.getItem('medications');
      if (medicationRecords) {
        const medications = JSON.parse(medicationRecords);
        medications.forEach((med: any) => {
          // Check if this medication is already in our records
          const exists = allRecords.some(
            record => record.medicationName.toLowerCase() === med.name.toLowerCase()
          );
          
          if (!exists) {
            allRecords.push({
              id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              date: new Date(),
              medicationName: med.name,
              notes: med.dosage || '',
              dosage: med.dosage || '',
              time: med.schedule || 'Daily'
            });
          }
        });
      }
      
      // Sort records by date (newest first)
      const sortedRecords = allRecords.sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Save merged records
      localStorage.setItem('healthRecords', JSON.stringify(sortedRecords));
      setRecords(sortedRecords);
    } catch (error) {
      console.error("Error loading health records:", error);
      setRecords([]);
    }
  };

  const addRecord = () => {
    if (!newMedication.trim()) {
      toast.error('Please enter a medication name');
      return;
    }
    
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      date: new Date(),
      medicationName: newMedication,
      notes: newNotes,
      dosage: newDosage || '1 tablet',
      time: newTime || 'Morning'
    };
    
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
    
    // Reset form
    setNewMedication('');
    setNewNotes('');
    setNewDosage('');
    setNewTime('');
    setShowAddForm(false);
    
    toast.success(`Added ${newMedication} to your health records`);
  };

  const deleteRecord = (id: string) => {
    const recordToDelete = records.find(r => r.id === id);
    const updatedRecords = records.filter(record => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
    
    if (recordToDelete) {
      toast.success(`Removed ${recordToDelete.medicationName} from your health records`);
    }
  };

  return (
    <div className="bg-white h-full dark:bg-gray-900 dark:text-white">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg flex items-center">
            <Pill className="h-5 w-5 mr-2 text-medicine-blue" />
            Your Medication History
          </h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setView(view === 'list' ? 'card' : 'list')}
              className="h-9"
            >
              {view === 'list' ? (
                <><Book className="h-4 w-4 mr-1" /> Cards</>
              ) : (
                <><Book className="h-4 w-4 mr-1" /> List</>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "secondary" : "default"}
              className="h-9"
            >
              {showAddForm ? 'Cancel' : <><PlusCircle className="h-4 w-4 mr-1" /> Add</>}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your medication history is automatically tracked when mentioned in chat
        </p>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-secondary/50 p-4 border-b dark:bg-gray-800/50 dark:border-gray-700"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input 
                  id="medication-name"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Enter medication name"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="medication-dosage">Dosage</Label>
                <Input 
                  id="medication-dosage"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g., 10mg, 1 tablet"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="medication-time">Time</Label>
                <Input 
                  id="medication-time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g., Morning, Evening, Daily"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="medication-notes">Notes (optional)</Label>
                <Input 
                  id="medication-notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Add any notes about this medication"
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={addRecord} 
                  className="w-full"
                >
                  Save Record
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        className="p-4 overflow-auto" 
        style={{ maxHeight: showAddForm ? "calc(100% - 220px)" : "calc(100% - 80px)" }}
      >
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No health records yet.</p>
            <p className="text-sm mt-2">
              Your medication history will appear here automatically when mentioned in chat.
            </p>
          </div>
        ) : view === 'list' ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="dark:border-gray-700">
                  <TableCell className="font-medium">
                    {record.medicationName}
                    {record.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]" title={record.notes}>
                        {record.notes}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{record.dosage || 'Not specified'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    <div className="flex flex-col">
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span>{new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((record, index) => (
              <MedicationCard
                key={record.id}
                id={record.id}
                name={record.medicationName}
                dosage={record.dosage || 'Not specified'}
                time={record.time || new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                color={['blue', 'green', 'peach', 'purple', 'teal'][index % 5] as any}
                taken={false}
                onDelete={deleteRecord}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordsComponent;
