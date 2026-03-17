import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Stethoscope, Award, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient_name: user?.name || '',
    patient_email: user?.email || '',
    patient_phone: user?.phone || '',
    preferred_date: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patient_name: user.name,
        patient_email: user.email,
        patient_phone: user.phone
      }));
    }
  }, [user]);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`${API}/doctors/${id}`);
      setDoctor(response.data);
    } catch (error) {
      toast.error('Failed to load doctor details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        doctor_id: doctor.id,
        patient_id: user?.id || null
      };
      
      await axios.post(`${API}/appointments`, appointmentData);
      toast.success('Appointment request submitted successfully!');
      
      if (!user) {
        toast.info('Create an account to track your appointments');
        setTimeout(() => navigate('/signup'), 2000);
      } else {
        setTimeout(() => navigate('/patient/dashboard'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to book appointment');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Doctor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-8 rounded-full" 
            onClick={() => navigate('/doctors')}
            data-testid="back-to-doctors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Doctor Info */}
            <div>
              <div className="rounded-3xl overflow-hidden bg-primary/5 mb-6">
                <img 
                  src={doctor.image_url} 
                  alt={doctor.name}
                  className="w-full aspect-square object-cover"
                  data-testid="doctor-detail-image"
                />
              </div>
              
              <div className="bg-white rounded-2xl p-8 border border-border/40">
                <div className="flex items-start gap-3 mb-4">
                  <Stethoscope className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h1 className="text-3xl font-semibold mb-2" data-testid="doctor-detail-name">{doctor.name}</h1>
                    <p className="text-lg text-primary font-medium" data-testid="doctor-detail-spec">{doctor.specialization}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 mb-6">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Qualifications</h3>
                    <p className="text-sm text-muted-foreground" data-testid="doctor-detail-qual">{doctor.qualifications}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Available Days</h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.available_days?.join(', ') || 'Monday - Saturday'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Form */}
            <div className="bg-white rounded-2xl p-8 border border-border/40">
              <h2 className="text-2xl font-semibold mb-6" data-testid="appointment-form-title">Request Appointment</h2>
              
              {!user && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6" data-testid="guest-notice">
                  <p className="text-sm text-accent-foreground">
                    <strong>Guest Booking:</strong> You can book as a guest, but we recommend creating an account to track your appointments.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="patient_name">Full Name *</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="patient_email">Email *</Label>
                  <Input
                    id="patient_email"
                    type="email"
                    value={formData.patient_email}
                    onChange={(e) => setFormData({...formData, patient_email: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="patient_phone">Phone Number *</Label>
                  <Input
                    id="patient_phone"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    data-testid="input-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="preferred_date">Preferred Date *</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="rounded-xl mt-2"
                    data-testid="input-date"
                  />
                </div>
                
                <div>
                  <Label htmlFor="symptoms">Symptoms / Reason for Visit *</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    required
                    rows={4}
                    className="rounded-xl mt-2"
                    placeholder="Please describe your symptoms or reason for consultation"
                    data-testid="input-symptoms"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-full"
                  data-testid="submit-appointment-btn"
                >
                  Submit Appointment Request
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Your appointment will be reviewed and confirmed by our team
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
