
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '@/components/ui/PageTransition';
import ScheduleSelector from '@/components/medication/ScheduleSelector';
import { motion } from 'framer-motion';
import { Clock, Calendar, Info, Search, X, Check, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DrugResult } from '@/services/fdaApi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';

interface MedicationLocationState {
  medication?: {
    name: string;
    usage: string;
    dosage: string;
    warnings: string;
    details: DrugResult;
  }
}

const AddMedication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const medicationData = (location.state as MedicationLocationState)?.medication;
  
  // Form state
  const [name, setName] = useState<string>(medicationData?.name || '');
  const [dosage, setDosage] = useState<string>('');
  const [dosageUnit, setDosageUnit] = useState<string>('mg');
  const [amount, setAmount] = useState<string>('1');
  const [amountType, setAmountType] = useState<string>('tablet');
  const [frequency, setFrequency] = useState<string>('daily');
  const [selectedTime, setSelectedTime] = useState<string>('08:00');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]); // All days selected by default
  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false);
  const [hour, setHour] = useState<number>(8);
  const [minute, setMinute] = useState<number>(0);
  const [ampm, setAmPm] = useState<'AM' | 'PM'>('AM');
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const colors = [
    { name: 'blue', value: 'bg-teal-500', displayName: 'Blue' },
    { name: 'green', value: 'bg-green-500', displayName: 'Green' },
    { name: 'peach', value: 'bg-orange-500', displayName: 'Peach' },
    { name: 'purple', value: 'bg-purple-500', displayName: 'Purple' },
    { name: 'teal', value: 'bg-sky-500', displayName: 'Teal' },
    { name: 'indigo', value: 'bg-indigo-500', displayName: 'Indigo' },
    { name: 'amber', value: 'bg-amber-500', displayName: 'Amber' },
    { name: 'rose', value: 'bg-rose-500', displayName: 'Rose' },
    { name: 'cyan', value: 'bg-cyan-500', displayName: 'Cyan' },
    { name: 'lime', value: 'bg-lime-500', displayName: 'Lime' },
  ];

  useEffect(() => {
    if (selectedTime) {
      const [hourStr, minuteStr] = selectedTime.split(':');
      let hourNum = parseInt(hourStr, 10);
      const minuteNum = parseInt(minuteStr, 10);
      
      const isAm = hourNum < 12;
      if (hourNum === 0) hourNum = 12;
      if (hourNum > 12) hourNum = hourNum - 12;
      
      setHour(hourNum);
      setMinute(minuteNum);
      setAmPm(isAm ? 'AM' : 'PM');
    }
  }, [selectedTime]);

  useEffect(() => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setEndDate(formattedDate);
      setCalendarOpen(false);
    }
  }, [date]);

  const updateSelectedTime = () => {
    let hourIn24 = hour;
    if (ampm === 'PM' && hour < 12) hourIn24 = hour + 12;
    if (ampm === 'AM' && hour === 12) hourIn24 = 0;
    
    const formattedHour = hourIn24.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    setSelectedTime(`${formattedHour}:${formattedMinute}`);
    setTimePickerOpen(false);
  };

  const handleScheduleChange = (days: number[]) => {
    setSelectedDays(days);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Please enter a medication name", {
        duration: 3000,
      });
      return;
    }
    
    if (!dosage) {
      toast.error("Please enter a dosage amount", {
        duration: 3000,
      });
      return;
    }
    
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day for your schedule", {
        duration: 3000,
      });
      return;
    }
    
    toast.success(`${name} added to your medications`, {
      duration: 3000,
    });
    navigate('/dashboard');
  };

  const goToSearch = () => {
    navigate('/medicine-search');
  };

  const formatTimeDisplay = () => {
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDateDisplay = () => {
    if (date) {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }
    return 'Select end date';
  };

  return (
    <PageTransition className="app-container pb-20">
      {/* Enhanced Header with Gradient */}
      <div className="mb-8">
        <h1 className="page-title text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
          Add Medication
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter your medication details below to set up your reminders
        </p>
      </div>

      <Card className="border-none shadow-lg bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden mb-8">
        <CardContent className="p-0">
          {!medicationData ? (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Button 
                onClick={goToSearch} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 h-14 text-lg border-dashed border-2 hover:bg-secondary/50 transition-all"
              >
                <Search className="h-5 w-5" />
                Search FDA Database for Medications
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-medium">FDA Information for {medicationData.name}</h3>
                  <p className="text-sm text-muted-foreground">From the official FDA database</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {medicationData.usage && (
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <h4 className="text-sm font-medium flex items-center">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                      Usage:
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{medicationData.usage}</p>
                  </div>
                )}

                {medicationData.dosage && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <h4 className="text-sm font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Recommended Dosage:
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{medicationData.dosage}</p>
                  </div>
                )}

                {medicationData.warnings && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30">
                    <h4 className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center">
                      <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                      Warnings:
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{medicationData.warnings}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Medication Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aspirin, Lisinopril"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <label htmlFor="dosage" className="block text-sm font-medium">
                  Dosage
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-1/3 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <select 
                    className="w-2/3 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={dosageUnit}
                    onChange={(e) => setDosageUnit(e.target.value)}
                  >
                    <option value="mg">mg - Milligram</option>
                    <option value="mcg">mcg - Microgram</option>
                    <option value="g">g - Gram</option>
                    <option value="ml">ml - Milliliter</option>
                    <option value="IU">IU - International Unit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="amount" className="block text-sm font-medium">
                  Amount
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-1/3 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <select 
                    className="w-2/3 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={amountType}
                    onChange={(e) => setAmountType(e.target.value)}
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="pill">Pill</option>
                    <option value="injection">Injection</option>
                    <option value="drop">Drop</option>
                    <option value="puff">Puff</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Schedule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frequency
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Days of the Week
                </label>
                <ScheduleSelector 
                  className="mb-4" 
                  onChange={handleScheduleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Time
                </label>
                <div className="flex items-center space-x-3">
                  <Popover open={timePickerOpen} onOpenChange={setTimePickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={formatTimeDisplay()}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                          onClick={() => setTimePickerOpen(true)}
                        />
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-80 shadow-lg rounded-xl" align="start">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Hour</label>
                          <div className="flex items-center justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setHour(prev => prev === 1 ? 12 : prev - 1)}
                              className="h-8 w-8 p-0"
                            >-</Button>
                            <span className="text-2xl font-semibold w-12 text-center">{hour}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setHour(prev => prev === 12 ? 1 : prev + 1)}
                              className="h-8 w-8 p-0"
                            >+</Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Minute</label>
                          <div className="flex items-center justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setMinute(prev => prev === 0 ? 55 : prev - 5)}
                              className="h-8 w-8 p-0"
                            >-</Button>
                            <span className="text-2xl font-semibold w-12 text-center">{minute.toString().padStart(2, '0')}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setMinute(prev => prev === 55 ? 0 : prev + 5)}
                              className="h-8 w-8 p-0"
                            >+</Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <Button 
                            type="button" 
                            variant={ampm === 'AM' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setAmPm('AM')}
                          >
                            AM
                          </Button>
                          <Button 
                            type="button" 
                            variant={ampm === 'PM' ? 'default' : 'outline'}
                            className="flex-1"
                            onClick={() => setAmPm('PM')}
                          >
                            PM
                          </Button>
                        </div>
                        
                        <Button 
                          type="button" 
                          className="w-full mt-4" 
                          onClick={updateSelectedTime}
                        >
                          Confirm Time
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatDateDisplay()}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        onClick={() => setCalendarOpen(true)}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 shadow-lg rounded-xl" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Choose Color Tag</h3>
            <div className="grid grid-cols-5 gap-6 justify-items-center">
              {colors.map(color => (
                <div key={color.name} className="relative flex flex-col items-center">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full ${color.value} shadow-md flex items-center justify-center transition-all ${
                      selectedColor === color.name ? 'ring-4 ring-offset-2 ring-primary dark:ring-offset-gray-900' : ''
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select ${color.displayName} color`}
                  >
                    {selectedColor === color.name && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                  <span className="text-xs text-muted-foreground mt-2">
                    {color.displayName}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="pt-6 pb-10">
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              y: -2
            }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-xl font-medium hover:from-teal-600 hover:to-green-600 transition-all shadow-md"
          >
            Save Medication
          </motion.button>
        </div>
      </form>
    </PageTransition>
  );
};

export default AddMedication;
