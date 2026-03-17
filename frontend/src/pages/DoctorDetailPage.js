import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Stethoscope, Award, ArrowLeft, Star, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';
import { APPOINTMENT_TYPES_INFO, AppointmentTypeCard } from '../components/AppointmentTypes';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const APPOINTMENT_TYPES = [
  'New Consultation',
  'Blood Test',
  'ECG',
  'X-Ray',
  'Injection',
  'Dressing',
  'Medicine'
];

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
];

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ average_rating: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient_name: user?.name || '',
    patient_email: user?.email || '',
    patient_phone: user?.phone || '',
    appointment_type: 'New Consultation',
    preferred_date: '',
    preferred_time: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchDoctor();
    fetchReviews();
    fetchRating();
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/doctors/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const fetchRating = async () => {
    try {
      const response = await axios.get(`${API}/doctors/${id}/rating`);
      setRating(response.data);
    } catch (error) {
      console.error('Failed to load rating:', error);
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
              <div className="bg-white rounded-3xl p-10 border border-border/40 mb-6">
                <div className="flex items-center justify-center bg-primary/10 w-24 h-24 rounded-full mb-6 mx-auto">
                  <Stethoscope className="h-12 w-12 text-primary" />
                </div>
                
                <div className="text-center">
                  <h1 className="text-3xl font-semibold mb-2" data-testid="doctor-detail-name">{doctor.name}</h1>
                  <p className="text-lg text-primary font-medium mb-4" data-testid="doctor-detail-spec">{doctor.specialization}</p>
                  
                  {rating.total_reviews > 0 && (
                    <div className="flex justify-center mb-4">
                      <StarRating 
                        rating={rating.average_rating} 
                        totalReviews={rating.total_reviews}
                        size="md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 border border-border/40 mb-6">
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

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-border/40">
                  <h3 className="text-xl font-semibold mb-6">Patient Reviews</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border/40 pb-4 last:border-0" data-testid={`review-${review.id}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{review.patient_name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-10">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Form */}
            <div className="bg-white rounded-2xl p-8 border border-border/40">
              <h2 className="text-2xl font-semibold mb-4" data-testid="appointment-form-title">
                Request Appointment / অ্যাপয়েন্টমেন্টের অনুরোধ
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill the form below to book your appointment / নিচের ফর্মটি পূরণ করুন
              </p>
              
              {!user && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6" data-testid="guest-notice">
                  <p className="text-sm text-accent-foreground">
                    <strong>Guest Booking / অতিথি বুকিং:</strong> You can book as a guest, but we recommend creating an account to track your appointments.
                    <br />
                    <span className="text-xs">আপনি অতিথি হিসেবে বুক করতে পারেন, তবে আমরা আপনার অ্যাপয়েন্টমেন্ট ট্র্যাক করতে একটি অ্যাকাউন্ট তৈরি করার পরামর্শ দিই।</span>
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="patient_name">Full Name / পুরো নাম *</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    placeholder="Enter your full name / আপনার পুরো নাম লিখুন"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="patient_email">Email / ইমেইল *</Label>
                  <Input
                    id="patient_email"
                    type="email"
                    value={formData.patient_email}
                    onChange={(e) => setFormData({...formData, patient_email: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    placeholder="example@email.com"
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="patient_phone">Phone Number / ফোন নম্বর *</Label>
                  <Input
                    id="patient_phone"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                    required
                    className="rounded-xl mt-2"
                    placeholder="10-digit mobile number / ১০ সংখ্যার মোবাইল নম্বর"
                    data-testid="input-phone"
                  />
                </div>
                
                <div>
                  <Label htmlFor="appointment_type">Appointment Type / অ্যাপয়েন্টমেন্ট ধরন *</Label>
                  <Select
                    value={formData.appointment_type}
                    onValueChange={(value) => setFormData({...formData, appointment_type: value})}
                  >
                    <SelectTrigger className="rounded-xl mt-2" data-testid="input-appointment-type">
                      <SelectValue placeholder="Select appointment type / ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPOINTMENT_TYPES.map((type) => {
                        const info = APPOINTMENT_TYPES_INFO[type];
                        return (
                          <SelectItem key={type} value={type}>
                            {info ? `${info.english} / ${info.bengali}` : type}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duration: 10-15 minutes / সময়কাল: ১০-১৫ মিনিট
                  </p>
                  
                  {/* Show appointment type details */}
                  {formData.appointment_type && (
                    <div className="mt-3">
                      <AppointmentTypeCard type={formData.appointment_type} />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="preferred_date">Preferred Date / পছন্দের তারিখ *</Label>
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
                  <Label htmlFor="preferred_time">Preferred Time / পছন্দের সময় *</Label>
                  <Select
                    value={formData.preferred_time}
                    onValueChange={(value) => setFormData({...formData, preferred_time: value})}
                  >
                    <SelectTrigger className="rounded-xl mt-2" data-testid="input-time">
                      <SelectValue placeholder="Select time slot / সময় নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Clinic hours: 10:00 AM - 8:00 PM (Mon-Sat) / ক্লিনিক সময়: সকাল ১০টা - রাত ৮টা (সোম-শনি)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="symptoms">Symptoms / Reason for Visit / লক্ষণ বা কারণ</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    rows={4}
                    className="rounded-xl mt-2"
                    placeholder="Please describe your symptoms or reason for consultation (optional) / আপনার লক্ষণ বা পরামর্শের কারণ বর্ণনা করুন (ঐচ্ছিক)"
                    data-testid="input-symptoms"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-full"
                  data-testid="submit-appointment-btn"
                >
                  Submit Appointment Request / অ্যাপয়েন্টমেন্ট জমা দিন
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Your appointment will be reviewed and confirmed by our team
                  <br />
                  <span className="text-xs">আপনার অ্যাপয়েন্টমেন্ট আমাদের টিম দ্বারা পর্যালোচনা এবং নিশ্চিত করা হবে</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
