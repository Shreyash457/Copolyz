import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'patient') {
        navigate('/admin/dashboard');
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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4" data-testid="dashboard-title">
              Welcome, <span className="font-semibold text-primary">{user?.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground">Manage your appointments and health records</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Button 
              onClick={() => navigate('/doctors')} 
              className="h-24 rounded-2xl text-lg"
              data-testid="new-appointment-btn"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book New Appointment
            </Button>
            <div className="bg-white rounded-2xl p-6 border border-border/40" data-testid="total-appointments-card">
              <p className="text-sm text-muted-foreground mb-1">Total Appointments</p>
              <p className="text-3xl font-semibold">{appointments.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-border/40" data-testid="pending-appointments-card">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-semibold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-3xl p-8 border border-border/40">
            <h2 className="text-2xl font-semibold mb-6" data-testid="appointments-list-title">Your Appointments</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12" data-testid="no-appointments">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No appointments yet</p>
                <Button onClick={() => navigate('/doctors')} className="rounded-full" data-testid="book-first-appointment">
                  Book Your First Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="border border-border rounded-2xl p-6 hover:shadow-md transition-all"
                    data-testid={`appointment-${appointment.id}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appointment.status]}`}
                            data-testid={`status-${appointment.id}`}>
                            {appointment.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1" data-testid={`doctor-${appointment.id}`}>
                          {appointment.doctor_name}
                        </h3>
                        <p className="text-sm text-primary font-medium mb-2" data-testid={`spec-${appointment.id}`}>
                          {appointment.doctor_specialization}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {appointment.preferred_date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(appointment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="bg-muted rounded-xl p-4">
                          <p className="text-xs text-muted-foreground mb-1">Symptoms</p>
                          <p className="text-sm" data-testid={`symptoms-${appointment.id}`}>{appointment.symptoms}</p>
                        </div>
                        {appointment.admin_notes && (
                          <div className="bg-primary/5 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                            <p className="text-sm" data-testid={`notes-${appointment.id}`}>{appointment.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
