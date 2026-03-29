import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, Lock, Unlock, Plus, Trash2, Key, Eye, EyeOff, UserPlus, Stethoscope, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
};

const SPECIALIZATIONS = [
  'Physician', 'Chest Specialist', 'Orthopaedic', 'Dental', 'ENT Surgeon',
  'Dermatologist', 'General & Laparoscopic Surgeon', 'Neuro Psychiatrist',
  'Paediatrics', 'Paediatrician & Neonatologist', 'Gynaecologist & Obstetrician',
  'Urologist', 'Rheumatologist', 'Oncologist', 'Infertility Specialist',
  'Nutritionist & Dietician'
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', admin_notes: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Time slot management state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState({ slots: [] });
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [blockReason, setBlockReason] = useState('');
  const [selectedSlotToBlock, setSelectedSlotToBlock] = useState('');
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  
  // Change password state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Doctor management state
  const [doctors, setDoctors] = useState([]);
  const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    qualifications: '',
    max_daily_appointments: '',
    categories: ''
  });

  // Staff management state
  const [staff, setStaff] = useState([]);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin' && user.role !== 'doctor' && user.role !== 'receptionist') {
        navigate('/patient/dashboard');
      } else {
        fetchAppointments();
        fetchAvailability();
        fetchBlockedSlots();
        fetchDoctors();
        if (user.role === 'admin') {
          fetchStaff();
        }
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'doctor')) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${API}/availability/${selectedDate}`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  const fetchBlockedSlots = async () => {
    try {
      const response = await axios.get(`${API}/blocked-slots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlockedSlots(response.data);
    } catch (error) {
      console.error('Failed to load blocked slots:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  // Doctor management functions
  const openDoctorDialog = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setDoctorForm({
        name: doctor.name,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        max_daily_appointments: doctor.max_daily_appointments || '',
        categories: doctor.categories?.join(', ') || ''
      });
    } else {
      setEditingDoctor(null);
      setDoctorForm({
        name: '',
        specialization: '',
        qualifications: '',
        max_daily_appointments: '',
        categories: ''
      });
    }
    setIsDoctorDialogOpen(true);
  };

  const handleSaveDoctor = async () => {
    if (!doctorForm.name || !doctorForm.specialization || !doctorForm.qualifications) {
      toast.error('Please fill in all required fields');
      return;
    }

    const doctorData = {
      name: doctorForm.name,
      specialization: doctorForm.specialization,
      qualifications: doctorForm.qualifications,
      max_daily_appointments: doctorForm.max_daily_appointments ? parseInt(doctorForm.max_daily_appointments) : null,
      categories: doctorForm.categories ? doctorForm.categories.split(',').map(c => c.trim()) : null
    };

    try {
      if (editingDoctor) {
        await axios.put(`${API}/doctors/${editingDoctor.id}`, doctorData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Doctor updated successfully');
      } else {
        await axios.post(`${API}/doctors`, doctorData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Doctor added successfully');
      }
      setIsDoctorDialogOpen(false);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;

    try {
      await axios.delete(`${API}/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete doctor');
    }
  };

  // Staff management functions
  const handleCreateStaff = async () => {
    if (!staffForm.username || !staffForm.email || !staffForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API}/staff`, staffForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Staff account created successfully');
      setIsStaffDialogOpen(false);
      setStaffForm({ username: '', email: '', password: '', role: 'admin' });
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create staff account');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff account?')) return;

    try {
      await axios.delete(`${API}/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Staff account deleted successfully');
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete staff account');
    }
  };

  const handleBlockSlot = async () => {
    if (!selectedSlotToBlock) {
      toast.error('Please select a time slot');
      return;
    }
    
    try {
      await axios.post(`${API}/blocked-slots`, {
        date: selectedDate,
        time_slot: selectedSlotToBlock,
        reason: blockReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Blocked ${selectedSlotToBlock} on ${selectedDate}`);
      setIsBlockDialogOpen(false);
      setSelectedSlotToBlock('');
      setBlockReason('');
      fetchAvailability();
      fetchBlockedSlots();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to block slot');
    }
  };

  const handleUnblockSlot = async (slotId) => {
    try {
      await axios.delete(`${API}/blocked-slots/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Slot unblocked successfully');
      fetchAvailability();
      fetchBlockedSlots();
    } catch (error) {
      toast.error('Failed to unblock slot');
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    setChangingPassword(true);
    try {
      await axios.post(`${API}/auth/change-password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Password changed successfully!');
      setIsPasswordDialogOpen(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      await axios.patch(
        `${API}/appointments/${selectedAppointment.id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Appointment updated successfully');
      setIsDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
      console.error(error);
    }
  };

  const openUpdateDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setUpdateData({
      status: appointment.status,
      admin_notes: appointment.admin_notes || ''
    });
    setIsDialogOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    rejected: appointments.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" data-testid="admin-dashboard-title">
                Admin <span className="font-semibold text-primary">Dashboard</span>
              </h1>
              <p className="text-lg text-muted-foreground">Welcome, {user?.name || 'Admin'}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(true)}
              className="rounded-full"
              data-testid="change-password-btn"
            >
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-border/40" data-testid="stat-total">
              <p className="text-sm text-muted-foreground mb-1">Total Appointments</p>
              <p className="text-3xl font-semibold">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200" data-testid="stat-pending">
              <p className="text-sm text-yellow-700 mb-1">Pending</p>
              <p className="text-3xl font-semibold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200" data-testid="stat-approved">
              <p className="text-sm text-green-700 mb-1">Approved</p>
              <p className="text-3xl font-semibold text-green-700">{stats.approved}</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200" data-testid="stat-rejected">
              <p className="text-sm text-red-700 mb-1">Rejected</p>
              <p className="text-3xl font-semibold text-red-700">{stats.rejected}</p>
            </div>
          </div>

          {/* Tabs for Appointments, Time Slots, Doctors, and Staff Management */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-6 flex flex-wrap gap-2">
              <TabsTrigger value="appointments" className="px-4">
                <FileText className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="timeslots" className="px-4">
                <Clock className="h-4 w-4 mr-2" />
                Time Slots
              </TabsTrigger>
              {user?.role === 'admin' && (
                <>
                  <TabsTrigger value="doctors" className="px-4">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Doctors
                  </TabsTrigger>
                  <TabsTrigger value="staff" className="px-4">
                    <Users className="h-4 w-4 mr-2" />
                    Staff
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="bg-white rounded-3xl p-8 border border-border/40">
                <h2 className="text-2xl font-semibold mb-6" data-testid="appointments-management-title">Appointment Requests</h2>
                
                {appointments.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-appointments-admin">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No appointments to manage</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="border border-border rounded-2xl p-6 hover:shadow-md transition-all"
                        data-testid={`admin-appointment-${appointment.id}`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appointment.status]}`}
                                data-testid={`admin-status-${appointment.id}`}>
                                {appointment.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Patient</p>
                                <p className="font-medium" data-testid={`patient-name-${appointment.id}`}>{appointment.patient_name}</p>
                                <p className="text-sm text-muted-foreground">{appointment.patient_email}</p>
                                <p className="text-sm text-muted-foreground">{appointment.patient_phone}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                                <p className="font-medium" data-testid={`admin-doctor-${appointment.id}`}>{appointment.doctor_name}</p>
                                <p className="text-sm text-primary">{appointment.doctor_specialization}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {appointment.preferred_date}
                                {appointment.preferred_time && ` at ${appointment.preferred_time}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {appointment.appointment_type || 'Consultation'} (15 mins)
                              </span>
                            </div>
                            
                            <div className="bg-muted rounded-xl p-4">
                              <p className="text-xs text-muted-foreground mb-1">Symptoms</p>
                              <p className="text-sm" data-testid={`admin-symptoms-${appointment.id}`}>{appointment.symptoms}</p>
                            </div>
                            
                            {appointment.admin_notes && (
                              <div className="bg-primary/5 rounded-xl p-4">
                                <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                                <p className="text-sm" data-testid={`admin-notes-${appointment.id}`}>{appointment.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 lg:w-48">
                            <Button 
                              onClick={() => openUpdateDialog(appointment)}
                              className="rounded-full w-full"
                              data-testid={`manage-btn-${appointment.id}`}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Time Slots Tab */}
            <TabsContent value="timeslots">
              <div className="bg-white rounded-3xl p-8 border border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-semibold" data-testid="timeslots-management-title">
                    Time Slot Management
                  </h2>
                  <div className="flex items-center gap-4">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-xl w-48"
                      data-testid="date-picker"
                    />
                    <Button 
                      onClick={() => setIsBlockDialogOpen(true)}
                      className="rounded-full"
                      data-testid="block-slot-btn"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Block Slot
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  View and manage available time slots for {selectedDate}. Block slots that should not be available for booking.
                </p>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {availability.slots?.map((slot) => (
                    <div 
                      key={slot.time}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        slot.status === 'available' 
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : slot.status === 'blocked'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      }`}
                      data-testid={`slot-${slot.time.replace(/[: ]/g, '-')}`}
                    >
                      <p className="font-medium">{slot.time}</p>
                      <p className="text-xs mt-1 capitalize">{slot.status}</p>
                    </div>
                  ))}
                </div>

                {/* Blocked Slots List */}
                {blockedSlots.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">All Blocked Slots</h3>
                    <div className="space-y-2">
                      {blockedSlots.map((slot) => (
                        <div 
                          key={slot.id}
                          className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200"
                          data-testid={`blocked-slot-${slot.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <Lock className="h-4 w-4 text-red-600" />
                            <div>
                              <p className="font-medium text-red-700">{slot.date} at {slot.time_slot}</p>
                              {slot.reason && <p className="text-sm text-red-600">{slot.reason}</p>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnblockSlot(slot.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            data-testid={`unblock-btn-${slot.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Doctors Management Tab */}
            {user?.role === 'admin' && (
              <TabsContent value="doctors">
                <div className="bg-white rounded-3xl p-6 border border-border/40">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Manage Doctors</h2>
                    <Button onClick={() => openDoctorDialog()} className="rounded-full bg-black hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Doctor
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <div 
                        key={doctor.id}
                        className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{doctor.name}</p>
                          <p className="text-sm text-primary">{doctor.specialization}</p>
                          <p className="text-xs text-muted-foreground truncate">{doctor.qualifications}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDoctorDialog(doctor)}
                            className="rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Staff Management Tab */}
            {user?.role === 'admin' && (
              <TabsContent value="staff">
                <div className="bg-white rounded-3xl p-6 border border-border/40">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Manage Staff</h2>
                    <Button onClick={() => setIsStaffDialogOpen(true)} className="rounded-full bg-black hover:bg-gray-800">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {staff.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{member.username}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {member.role}
                            </span>
                          </div>
                        </div>
                        {member.id !== user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStaff(member.id)}
                            className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Doctor Dialog */}
      <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            <DialogDescription>
              {editingDoctor ? 'Update doctor information' : 'Add a new doctor to the system'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="Dr. Full Name"
              />
            </div>
            
            <div>
              <Label>Specialization *</Label>
              <Select
                value={doctorForm.specialization}
                onValueChange={(value) => setDoctorForm({...doctorForm, specialization: value})}
              >
                <SelectTrigger className="rounded-lg mt-1">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Qualifications *</Label>
              <Textarea
                value={doctorForm.qualifications}
                onChange={(e) => setDoctorForm({...doctorForm, qualifications: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="MBBS, MD, etc."
                rows={2}
              />
            </div>
            
            <div>
              <Label>Daily Appointment Limit (optional)</Label>
              <Input
                type="number"
                value={doctorForm.max_daily_appointments}
                onChange={(e) => setDoctorForm({...doctorForm, max_daily_appointments: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="Leave empty for unlimited"
              />
            </div>
            
            <div>
              <Label>Categories (comma separated)</Label>
              <Input
                value={doctorForm.categories}
                onChange={(e) => setDoctorForm({...doctorForm, categories: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="e.g., Physician, Chest Specialist"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDoctorDialogOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor} className="rounded-full bg-black hover:bg-gray-800">
              {editingDoctor ? 'Update' : 'Add'} Doctor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Dialog */}
      <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Create a new staff account for receptionist or admin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>Username *</Label>
              <Input
                value={staffForm.username}
                onChange={(e) => setStaffForm({...staffForm, username: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="Full name"
              />
            </div>
            
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="email@example.com"
              />
            </div>
            
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={staffForm.password}
                onChange={(e) => setStaffForm({...staffForm, password: e.target.value})}
                className="rounded-lg mt-1"
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <div>
              <Label>Role</Label>
              <Select
                value={staffForm.role}
                onValueChange={(value) => setStaffForm({...staffForm, role: value})}
              >
                <SelectTrigger className="rounded-lg mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsStaffDialogOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleCreateStaff} className="rounded-full bg-black hover:bg-gray-800">
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="block-dialog">
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>
              Block a time slot on {selectedDate} to prevent new bookings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Time Slot</label>
              <Select
                value={selectedSlotToBlock}
                onValueChange={setSelectedSlotToBlock}
              >
                <SelectTrigger className="rounded-xl" data-testid="slot-select">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availability.slots?.filter(s => s.status === 'available').map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>{slot.time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Reason (Optional)</label>
              <Input
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="rounded-xl"
                placeholder="e.g., Doctor unavailable, Lunch break"
                data-testid="block-reason-input"
              />
            </div>
            
            <Button 
              onClick={handleBlockSlot} 
              className="w-full rounded-full"
              data-testid="confirm-block-btn"
            >
              <Lock className="h-4 w-4 mr-2" />
              Block This Slot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="update-dialog">
          <DialogHeader>
            <DialogTitle>Manage Appointment</DialogTitle>
            <DialogDescription>
              Update appointment status and add notes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={updateData.status}
                onValueChange={(value) => setUpdateData({...updateData, status: value})}
              >
                <SelectTrigger className="rounded-xl" data-testid="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Notes</label>
              <Textarea
                value={updateData.admin_notes}
                onChange={(e) => setUpdateData({...updateData, admin_notes: e.target.value})}
                rows={4}
                className="rounded-xl"
                placeholder="Add notes for the patient..."
                data-testid="admin-notes-input"
              />
            </div>
            
            <Button 
              onClick={handleUpdateAppointment} 
              className="w-full rounded-full"
              data-testid="update-submit-btn"
            >
              Update Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="password-dialog">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  className="rounded-xl pr-10"
                  placeholder="Enter current password"
                  data-testid="current-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  className="rounded-xl pr-10"
                  placeholder="Enter new password (min 6 characters)"
                  data-testid="new-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                className="rounded-xl"
                placeholder="Confirm new password"
                data-testid="confirm-password-input"
              />
            </div>
            
            <Button 
              onClick={handleChangePassword} 
              className="w-full rounded-full"
              disabled={changingPassword}
              data-testid="change-password-submit-btn"
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
