import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Stethoscope, Award, ArrowLeft, Star, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
    patient_phone: user?.phone || '',
    preferred_date: '',
    preferred_time: ''
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

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        ...formData,
        doctor_id: doctor.id,
        patient_id: user?.id || null,
        appointment_type: 'New Consultation'
      };
      
      await axios.post(`${API}/appointments`, appointmentData);
      toast.success('Appointment booked successfully! We will contact you shortly.');
      setBookingSuccess(true);
      
      // Reset form
      setFormData({
        patient_name: '',
        patient_phone: '',
        preferred_date: '',
        preferred_time: ''
      });
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
    <div className="min-h-screen overflow-x-hidden">
      <Navigation />
      
      <div className="px-4 py-6 w-full max-w-full">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4 rounded-full" 
            onClick={() => navigate('/doctors')}
            data-testid="back-to-doctors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>

          {/* Doctor Info */}
          <div className="bg-white rounded-2xl p-5 border border-border/40 mb-4">
            <div className="flex items-center justify-center bg-primary/10 w-16 h-16 rounded-full mb-3 mx-auto">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold mb-1" data-testid="doctor-detail-name">{doctor.name}</h1>
              <p className="text-sm text-primary font-medium mb-3" data-testid="doctor-detail-spec">{doctor.specialization}</p>
              
              {rating.total_reviews > 0 && (
                <div className="flex justify-center mb-2">
                  <StarRating 
                    rating={rating.average_rating} 
                    totalReviews={rating.total_reviews}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-border/40 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Award className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm mb-1">Qualifications</h3>
                <p className="text-xs text-muted-foreground" data-testid="doctor-detail-qual">{doctor.qualifications}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm mb-1">Available Days</h3>
                <p className="text-xs text-muted-foreground">
                  Mon - Sat, 10:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-border/40 mb-4">
              <h3 className="text-sm font-semibold mb-3">Patient Reviews</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border/40 pb-3 last:border-0" data-testid={`review-${review.id}`}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-xs">{review.patient_name}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-8">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointment Form */}
          <div className="bg-white rounded-xl p-4 border border-border/40">
            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">Appointment Booked!</h3>
                <p className="text-sm text-gray-600 mb-1">অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে!</p>
                <p className="text-xs text-gray-500 mb-4">We will contact you shortly to confirm.</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setBookingSuccess(false)}
                    className="text-sm"
                  >
                    Book Another
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    className="text-sm bg-primary"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold mb-2" data-testid="appointment-form-title">
                  Request Appointment
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  অ্যাপয়েন্টমেন্টের জন্য ফর্মটি পূরণ করুন
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="patient_name" className="text-sm">Full Name / পুরো নাম *</Label>
                    <Input
                      id="patient_name"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                      required
                      className="rounded-lg mt-1 h-9 text-sm"
                      placeholder="আপনার পুরো নাম"
                      data-testid="input-name"
                    />
              </div>
              
              <div>
                <Label htmlFor="patient_phone" className="text-sm">Phone / ফোন নম্বর *</Label>
                <Input
                  id="patient_phone"
                  value={formData.patient_phone}
                  onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                  required
                  className="rounded-lg mt-1 h-9 text-sm"
                  placeholder="মোবাইল নম্বর"
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <Label htmlFor="preferred_date" className="text-sm">Date / তারিখ *</Label>
                <Input
                  id="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-lg mt-1 h-9 text-sm"
                  data-testid="input-date"
                />
              </div>
              
              <div>
                <Label htmlFor="preferred_time" className="text-sm">Time / সময় *</Label>
                <Select
                  value={formData.preferred_time}
                  onValueChange={(value) => setFormData({...formData, preferred_time: value})}
                >
                  <SelectTrigger className="rounded-lg mt-1 h-9 text-sm" data-testid="input-time">
                    <SelectValue placeholder="সময় নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ক্লিনিক সময়: সকাল ১০টা - রাত ৮টা
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full rounded-lg bg-black hover:bg-gray-800 text-white font-bold h-10 mt-2"
                data-testid="submit-appointment"
              >
                Book Appointment
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Our staff will confirm your appointment
              </p>
            </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
