
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Calendar, Trash2, PlusCircle, Clock, X, Edit2, User, Building, Activity, Syringe, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MedicalRecord {
  id: string;
  date: Date;
  type: 'doctor-visit' | 'procedure' | 'vaccination' | 'other';
  provider: string;
  location: string;
  notes: string;
}

const RECORD_TYPES = [
  { value: 'doctor-visit', label: 'Doctor Visit', icon: Stethoscope },
  { value: 'procedure', label: 'Medical Procedure', icon: Activity },
  { value: 'vaccination', label: 'Vaccination', icon: Syringe },
  { value: 'other', label: 'Other', icon: Clipboard },
];

const MedicalHistorySection: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, 'id' | 'date'>>({
    type: 'doctor-visit',
    provider: '',
    location: '',
    notes: '',
  });
  
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load medical history records from localStorage
    const savedRecords = localStorage.getItem('medicalHistory');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        // Sort records by date (newest first)
        const sortedRecords = parsedRecords.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecords(sortedRecords);
      } catch (error) {
        console.error("Error parsing medical history:", error);
        setRecords([]);
      }
    }
  }, []);

  const handleNewRecordChange = (field: keyof typeof newRecord, value: string) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const addRecord = () => {
    if (!newRecord.provider.trim()) {
      toast.error('Please enter a provider name', {
        duration: 3000,
      });
      return;
    }
    
    const record: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date(),
      ...newRecord
    };
    
    const updatedRecords = [record, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('medicalHistory', JSON.stringify(updatedRecords));
    
    // Reset form
    setNewRecord({
      type: 'doctor-visit',
      provider: '',
      location: '',
      notes: '',
    });
    setShowAddForm(false);
    
    toast.success(`Added new medical record`, {
      duration: 3000,
    });
  };

  const openEditDialog = (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleEditRecordChange = (field: keyof MedicalRecord, value: string) => {
    if (!editingRecord) return;
    setEditingRecord({ ...editingRecord, [field]: value });
  };

  const saveEditedRecord = () => {
    if (!editingRecord) return;
    
    if (!editingRecord.provider.trim()) {
      toast.error('Please enter a provider name', {
        duration: 3000,
      });
      return;
    }

    const updatedRecords = records.map(record => 
      record.id === editingRecord.id ? editingRecord : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('medicalHistory', JSON.stringify(updatedRecords));
    setIsEditDialogOpen(false);
    setEditingRecord(null);
    
    toast.success(`Updated medical record`, {
      duration: 3000,
    });
  };

  const openDeleteConfirmation = (id: string) => {
    setRecordToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!recordToDelete) return;
    
    const updatedRecords = records.filter(record => record.id !== recordToDelete);
    setRecords(updatedRecords);
    localStorage.setItem('medicalHistory', JSON.stringify(updatedRecords));
    setIsDeleteDialogOpen(false);
    setRecordToDelete(null);
    
    toast.success(`Medical record removed`, {
      duration: 3000,
    });
  };

  const getTypeLabel = (type: string) => {
    return RECORD_TYPES.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = RECORD_TYPES.find(t => t.value === type) || RECORD_TYPES[3];
    const IconComponent = typeInfo.icon;
    return <IconComponent className="h-3.5 w-3.5 mr-1.5" />;
  };

  const getBadgeColor = (type: string): string => {
    switch(type) {
      case 'doctor-visit':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'procedure':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'vaccination':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm h-full border dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/80">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg flex items-center">
            <Stethoscope className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-500" />
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Your Medical History
            </span>
          </h3>
          <Button 
            size="sm" 
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "secondary" : "default"}
            className="gap-1 shadow-sm"
            data-add-history
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" /> Add Entry
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Keep a complete record of doctor visits, procedures, and vaccinations
        </p>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50/70 dark:bg-gray-900/50 p-4 border-b dark:border-gray-800"
          >
            <div className="grid gap-3">
              <div>
                <Label htmlFor="record-type" className="text-sm font-medium">Record Type</Label>
                <Select 
                  value={newRecord.type} 
                  onValueChange={(value) => handleNewRecordChange('type', value)}
                >
                  <SelectTrigger className="w-full mt-1 bg-white dark:bg-gray-950/50">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECORD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value} className="flex items-center gap-2">
                        <div className="flex items-center">
                          {React.createElement(type.icon, { className: "h-4 w-4 mr-2 text-blue-600" })}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="provider-name" className="text-sm font-medium">Provider Name</Label>
                <Input 
                  id="provider-name"
                  value={newRecord.provider}
                  onChange={(e) => handleNewRecordChange('provider', e.target.value)}
                  placeholder="Enter doctor or provider name"
                  className="mt-1 bg-white dark:bg-gray-950/50"
                />
              </div>
              <div>
                <Label htmlFor="location-name" className="text-sm font-medium">Location</Label>
                <Input 
                  id="location-name"
                  value={newRecord.location}
                  onChange={(e) => handleNewRecordChange('location', e.target.value)}
                  placeholder="Enter hospital or clinic name"
                  className="mt-1 bg-white dark:bg-gray-950/50"
                />
              </div>
              <div>
                <Label htmlFor="record-notes" className="text-sm font-medium">Notes</Label>
                <Textarea 
                  id="record-notes"
                  value={newRecord.notes}
                  onChange={(e) => handleNewRecordChange('notes', e.target.value)}
                  placeholder="Add details about this visit or procedure"
                  className="mt-1 bg-white dark:bg-gray-950/50"
                  rows={3}
                />
              </div>
              <Button 
                onClick={addRecord}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-1.5" /> Save Record
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 overflow-auto" style={{ maxHeight: showAddForm ? "calc(100% - 250px)" : "calc(100% - 80px)" }}>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3">
              <Stethoscope className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="font-medium text-gray-700 dark:text-gray-300">No medical history records yet.</p>
            <p className="text-sm mt-2 max-w-xs">
              Add details about doctor visits, procedures, and vaccinations.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50"
              onClick={() => setShowAddForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add your first record
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table className="border dark:border-gray-800 rounded-md overflow-hidden">
              <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <TableHead className="font-medium text-gray-700 dark:text-gray-300">Type</TableHead>
                  <TableHead className="font-medium text-gray-700 dark:text-gray-300">Provider & Location</TableHead>
                  <TableHead className="font-medium text-gray-700 dark:text-gray-300">Date & Time</TableHead>
                  <TableHead className="text-right font-medium text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-b dark:border-gray-800 last:border-0">
                    <TableCell>
                      <Badge className={`${getBadgeColor(record.type)} font-normal border`}>
                        <div className="flex items-center">
                          {getTypeIcon(record.type)}
                          {getTypeLabel(record.type)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center text-gray-900 dark:text-gray-100">
                        <User className="h-3.5 w-3.5 mr-1.5 text-gray-600 dark:text-gray-400" />
                        {record.provider}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <Building className="h-3 w-3 mr-1.5" />
                        {record.location || "No location specified"}
                      </div>
                      {record.notes && (
                        <div className="mt-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-900/50 rounded text-xs text-gray-600 dark:text-gray-400 border-l-2 border-blue-400">
                          <p className="line-clamp-2" title={record.notes}>
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex flex-col">
                        <span className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditDialog(record)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0 dark:hover:bg-blue-950/30"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteConfirmation(record.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medical Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-record-type">Record Type</Label>
              <Select 
                value={editingRecord?.type || 'doctor-visit'} 
                onValueChange={(value) => handleEditRecordChange('type', value as any)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-provider-name">Provider Name</Label>
              <Input
                id="edit-provider-name"
                value={editingRecord?.provider || ''}
                onChange={(e) => handleEditRecordChange('provider', e.target.value)}
                placeholder="Enter doctor or provider name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-location-name">Location</Label>
              <Input
                id="edit-location-name"
                value={editingRecord?.location || ''}
                onChange={(e) => handleEditRecordChange('location', e.target.value)}
                placeholder="Enter hospital or clinic name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-record-notes">Notes</Label>
              <Textarea
                id="edit-record-notes"
                value={editingRecord?.notes || ''}
                onChange={(e) => handleEditRecordChange('notes', e.target.value)}
                placeholder="Add details about this visit or procedure"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedRecord}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medical Record</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this medical record? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalHistorySection;
