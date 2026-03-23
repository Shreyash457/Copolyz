import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, Lock, Unlock, Plus, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin' && user.role !== 'doctor') {
        navigate('/patient/dashboard');
      } else {
        fetchAppointments();
        fetchAvailability();
        fetchBlockedSlots();
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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" data-testid="admin-dashboard-title">
              Admin <span className="font-semibold text-primary">Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">Manage appointments and time slots</p>
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

          {/* Tabs for Appointments and Time Slot Management */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="appointments" className="px-6">
                <FileText className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="timeslots" className="px-6">
                <Clock className="h-4 w-4 mr-2" />
                Time Slots
              </TabsTrigger>
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
          </Tabs>
        </div>
      </div>

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
    </div>
  );
}
