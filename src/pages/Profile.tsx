import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/ui/PageTransition';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  Lock, 
  LogOut,
  ChevronRight,
  Stethoscope,
  Hospital,
  Heart,
  Shield,
  Pill,
  Moon,
  Sun,
  Camera,
  Edit3,
  BarChart3,
  Calendar,
  Clock,
  Bookmark,
  Share2,
  Download,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
  User2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DietPlanSection from '@/components/health/DietPlanSection';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." })
});

const healthInfoSchema = z.object({
  bloodType: z.string().min(1, { message: "Please select a blood type." }),
  allergies: z.string().optional(),
  emergencyContact: z.string().min(6, { message: "Please provide an emergency contact." })
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('userName') || "John Doe";
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem('profileImage') || null
  );
  
  const [userData, setUserData] = useState({
    name: username,
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "March 2023",
    notifications: {
      reminders: true,
      updates: false,
      tips: true
    },
    theme: theme,
    language: "English",
    healthInfo: {
      bloodType: "O+",
      allergies: "None",
      emergencyContact: "Jane Doe (555-123-4567)"
    },
    stats: {
      medicationAdherence: 92,
      completedAppointments: 8,
      healthRecords: 12
    }
  });

  const personalInfoForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    }
  });

  const healthInfoForm = useForm({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      bloodType: userData.healthInfo.bloodType,
      allergies: userData.healthInfo.allergies,
      emergencyContact: userData.healthInfo.emergencyContact
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    setUserData(prev => ({
      ...prev,
      name: username,
      theme: theme
    }));
    
    personalInfoForm.reset({
      name: username,
      email: userData.email,
      phone: userData.phone
    });
    
    healthInfoForm.reset({
      bloodType: userData.healthInfo.bloodType,
      allergies: userData.healthInfo.allergies,
      emergencyContact: userData.healthInfo.emergencyContact
    });
  }, [username, theme]);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account"
    });
    
    localStorage.removeItem("userSession");
    
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleSavePersonalInfo = (data: z.infer<typeof personalInfoSchema>) => {
    const newUserData = {
      ...userData,
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    
    setUserData(newUserData);
    
    if (data.name !== username) {
      setUsername(data.name);
      localStorage.setItem('userName', data.name);
    }
    
    setOpenDialog(null);
    
    toast({
      title: "Profile updated",
      description: "Your personal information has been saved successfully",
    });
  };

  const handleSaveHealthInfo = (data: z.infer<typeof healthInfoSchema>) => {
    setUserData({
      ...userData,
      healthInfo: {
        bloodType: data.bloodType,
        allergies: data.allergies || "None",
        emergencyContact: data.emergencyContact
      }
    });
    
    setOpenDialog(null);
    
    toast({
      title: "Health information updated",
      description: "Your health details have been saved successfully",
    });
  };

  const handleChangePassword = (data: z.infer<typeof passwordSchema>) => {
    console.log("Password change requested:", data);
    
    setOpenDialog(null);
    passwordForm.reset();
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully"
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setUserData({...userData, theme: newTheme});
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: "Your display preferences have been updated"
    });
  };

  const closeDialog = () => setOpenDialog(null);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setProfileImage(imageDataUrl);
      localStorage.setItem('profileImage', imageDataUrl);
      toast({
        title: "Profile image updated",
        description: "Your profile picture has been changed successfully"
      });
    };
    reader.readAsDataURL(file);
  };

  const menuItems = [
    { 
      icon: User, 
      title: 'Personal Information', 
      description: 'Manage your profile details', 
      action: () => setOpenDialog('personal'),
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    },
    { 
      icon: Bell, 
      title: 'Notification Settings', 
      description: 'Manage your notification preferences', 
      action: () => setOpenDialog('notifications'),
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    },
    { 
      icon: Stethoscope, 
      title: 'Health Information', 
      description: 'View and update your health details', 
      action: () => setOpenDialog('health'),
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    },
    { 
      icon: Settings, 
      title: 'App Settings', 
      description: 'Customize app appearance and behavior', 
      action: () => setOpenDialog('settings'),
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    },
    { 
      icon: HelpCircle, 
      title: 'Help & Support', 
      description: 'Get assistance with using the app', 
      action: () => navigate('/support'),
      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
    },
    { 
      icon: Lock, 
      title: 'Privacy & Security', 
      description: 'Manage your privacy settings', 
      action: () => setOpenDialog('privacy'),
      color: 'bg-primary/10 text-primary'
    },
    { 
      icon: LogOut, 
      title: 'Log Out', 
      description: 'Sign out of your account', 
      action: handleLogout,
      danger: true,
      color: 'bg-destructive/10 text-destructive'
    },
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <PageTransition className="app-container pb-32">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="diet">Diet Plans</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card className="overflow-hidden border-none shadow-md mt-6">
            <CardContent className="p-6 relative">
              <div className="flex justify-between items-end mb-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-xl cursor-pointer" onClick={handleProfileImageClick}>
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt={userData.name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {userData.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={handleProfileImageClick}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </Button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                
                <Button 
                  onClick={() => setOpenDialog('personal')}
                  variant="outline"
                  className="flex gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-muted-foreground">
                  <p className="text-sm flex items-center">
                    <Mail className="h-3.5 w-3.5 mr-1 inline" />
                    {userData.email}
                  </p>
                  <p className="text-sm flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1 inline" />
                    {userData.phone}
                  </p>
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>Member since {userData.joinDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{userData.stats.medicationAdherence}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Adherence</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{userData.stats.completedAppointments}</p>
                  <p className="text-xs text-muted-foreground mt-1">Appointments</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{userData.stats.healthRecords}</p>
                  <p className="text-xs text-muted-foreground mt-1">Records</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border border-border bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Blood Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-lg font-semibold">{userData.healthInfo.bloodType}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-lg font-semibold">{userData.healthInfo.allergies}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-border bg-white/50 dark:bg-gray-800/50">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-500" />
                      Emergency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-base font-medium">{userData.healthInfo.emergencyContact}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 space-y-1"
              onClick={() => navigate('/health-records')}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Records</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 space-y-1"
              onClick={() => navigate('/reminders')}
            >
              <Clock className="h-5 w-5" />
              <span className="text-xs">Reminders</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 space-y-1"
              onClick={() => navigate('/chatbot')}
            >
              <Stethoscope className="h-5 w-5" />
              <span className="text-xs">Assistant</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-20 space-y-1"
              onClick={() => setOpenDialog('settings')}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-none">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${i % 3 === 0 ? 'bg-blue-100 text-blue-700' : ''}
                      ${i % 3 === 1 ? 'bg-green-100 text-green-700' : ''}
                      ${i % 3 === 2 ? 'bg-amber-100 text-amber-700' : ''}
                    `}>
                      {i % 3 === 0 && <Pill className="h-5 w-5" />}
                      {i % 3 === 1 && <Calendar className="h-5 w-5" />}
                      {i % 3 === 2 && <Bookmark className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {i % 3 === 0 && 'Medication reminder completed'}
                        {i % 3 === 1 && 'Appointment scheduled'}
                        {i % 3 === 2 && 'Health record added'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {i * 2 + 1} {i === 0 ? 'hour' : 'days'} ago
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diet">
          <DietPlanSection />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                whileHover={{ x: 3, transition: { duration: 0.2 } }}
                onClick={item.action}
                className={`w-full p-5 border rounded-xl flex items-center justify-between hover:shadow-sm transition-all duration-300 overflow-hidden relative group ${
                  item.danger ? 'border-destructive/20 hover:bg-destructive/5' : 'border-primary/10 hover:bg-secondary/50'
                }`}
              >
                <div className={`absolute left-0 top-0 h-full w-1 ${item.color || 'bg-primary/30'} group-hover:w-full opacity-10 transition-all duration-500`}></div>
                
                <div className="flex items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    item.color || 'bg-secondary'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.danger ? 'text-destructive' : ''
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                
                {!item.danger && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
                )}
              </motion.button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog === 'profile-photo'} onOpenChange={(open) => {
        if (!open) closeDialog();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Choose a new profile photo
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={userData.name} />
              ) : (
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {userData.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <Input 
              type="file" 
              accept="image/*"
              id="profile-photo-upload"
              onChange={handleFileChange}
              className="max-w-xs"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={closeDialog}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'personal'} onOpenChange={(isOpen) => {
        if (!isOpen) closeDialog();
        if (isOpen) {
          personalInfoForm.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone
          });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-primary" />
              Personal Information
            </DialogTitle>
            <DialogDescription>
              Update your personal details and contact information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...personalInfoForm}>
            <form onSubmit={personalInfoForm.handleSubmit(handleSavePersonalInfo)} className="space-y-4 py-4">
              <FormField
                control={personalInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Mail className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input placeholder="your.email@example.com" type="email" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      We'll never share your email with anyone else.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={personalInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Phone className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'health'} onOpenChange={(isOpen) => {
        if (!isOpen) closeDialog();
        if (isOpen) {
          healthInfoForm.reset({
            bloodType: userData.healthInfo.bloodType,
            allergies: userData.healthInfo.allergies,
            emergencyContact: userData.healthInfo.emergencyContact
          });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Health Information
            </DialogTitle>
            <DialogDescription>
              Update your important medical information
            </DialogDescription>
          </DialogHeader>
          
          <Form {...healthInfoForm}>
            <form onSubmit={healthInfoForm.handleSubmit(handleSaveHealthInfo)} className="space-y-4 py-4">
              <FormField
                control={healthInfoForm.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={healthInfoForm.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <AlertCircle className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input 
                          placeholder="List your allergies or type 'None'" 
                          {...field} 
                          value={field.value === "None" ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value || "None")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={healthInfoForm.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Phone className="w-4 h-4 text-muted-foreground mr-2 self-center" />
                        <Input 
                          placeholder="Name and phone number" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      This person will be contacted in case of emergency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'notifications'} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Choose which notifications you'd like to receive
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(userData.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`notification-${key}`} className="capitalize">{key}</Label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id={`notification-${key}`}
                    className="sr-only peer" 
                    defaultChecked={value}
                    onChange={() => {
                      const notifications = {...userData.notifications};
                      notifications[key as keyof typeof userData.notifications] = 
                        !notifications[key as keyof typeof userData.notifications];
                      setUserData({...userData, notifications});
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:bg-gray-700"></div>
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveProfile({})}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'settings'} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              App Settings
            </DialogTitle>
            <DialogDescription>
              Customize your app experience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="theme" className="block mb-2">Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button" 
                  variant={theme === 'light' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button 
                  type="button" 
                  variant={theme === 'dark' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button 
                  type="button" 
                  variant={theme === 'system' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => handleThemeChange('system')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="language" className="block mb-2">Language</Label>
              <select 
                id="language" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={userData.language}
                onChange={(e) => {
                  setUserData({...userData, language: e.target.value});
                  toast({
                    title: "Language updated",
                    description: `Language changed to ${e.target.value}`
                  });
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={closeDialog}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'privacy'} onOpenChange={(isOpen) => {
        if (!isOpen) closeDialog();
        if (isOpen) {
          passwordForm.reset();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Privacy & Security
            </DialogTitle>
            <DialogDescription>
              Update your password and security settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Data Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Your medical data is securely stored and encrypted. We never share your information with third parties without your explicit consent.
              </p>
            </div>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                <h3 className="text-sm font-medium mb-2">Change Password</h3>
                
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="text-center mt-8 text-xs text-muted-foreground">
        <p>Medico+ v1.0</p>
        <p className="mt-1">© 2025 Medico+ Health. All rights reserved.</p>
      </div>
    </PageTransition>
  );
};

export default Profile;
