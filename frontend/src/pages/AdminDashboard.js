import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin' && user.role !== 'doctor') {
        navigate('/patient/dashboard');
      } else {
        fetchAppointments();
      }
    }
  }, [user, authLoading]);

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
            <p className="text-lg text-muted-foreground">Manage appointments and patient requests</p>
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

          {/* Appointments List */}
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
        </div>
      </div>

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
