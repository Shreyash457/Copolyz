import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Activity, Droplet, Heart, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SERVICE_INFO = {
  'xray': {
    type: 'X-Ray',
    title: 'X-Ray',
    bengali: 'এক্স-রে',
    icon: Activity,
    color: 'from-red-600 to-red-700',
    description: 'Digital X-Ray imaging for accurate diagnosis',
    descBengali: 'সঠিক রোগ নির্ণয়ের জন্য ডিজিটাল এক্স-রে ইমেজিং'
  },
  'bloodtest': {
    type: 'Blood Test',
    title: 'Blood Test',
    bengali: 'রক্ত পরীক্ষা',
    icon: Droplet,
    color: 'from-red-600 to-red-700',
    description: 'Comprehensive blood analysis and lab tests',
    descBengali: 'সম্পূর্ণ রক্ত বিশ্লেষণ এবং ল্যাব পরীক্ষা'
  },
  'ecg': {
    type: 'ECG',
    title: 'ECG',
    bengali: 'ইসিজি',
    icon: Heart,
    color: 'from-red-600 to-red-700',
    description: 'Electrocardiogram for heart health monitoring',
    descBengali: 'হার্টের স্বাস্থ্য পর্যবেক্ষণের জন্য ইলেক্ট্রোকার্ডিওগ্রাম'
  }
};

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
];

export default function ServiceBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceType = searchParams.get('type') || 'xray';
  const service = SERVICE_INFO[serviceType] || SERVICE_INFO['xray'];
  const Icon = service.icon;
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    preferred_date: '',
    preferred_time: '',
    symptoms: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const appointmentData = {
        ...formData,
        doctor_id: 'general-services',
        appointment_type: service.type
      };
      
      await axios.post(`${API}/appointments`, appointmentData);
      setIsSuccess(true);
      toast.success('Appointment booked successfully! / অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to book appointment / অ্যাপয়েন্টমেন্ট বুক করতে ব্যর্থ');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="px-6 md:px-12 lg:px-24 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold mb-4" data-testid="booking-success-title">
              Booking Confirmed! / বুকিং নিশ্চিত!
            </h1>
            <p className="text-muted-foreground mb-2">
              Your {service.title} appointment has been submitted.
            </p>
            <p className="text-muted-foreground mb-6">
              আপনার {service.bengali} অ্যাপয়েন্টমেন্ট জমা দেওয়া হয়েছে।
            </p>
            <p className="text-sm text-muted-foreground mb-8 bg-secondary/50 p-4 rounded-xl">
              Our team will contact you shortly to confirm your appointment.
              <br />
              <span className="text-xs">আমাদের টিম শীঘ্রই আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করতে আপনার সাথে যোগাযোগ করবে।</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="rounded-full px-6"
                data-testid="back-home-btn"
              >
                Back to Home / হোমে ফিরে যান
              </Button>
              <Button 
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    patient_name: '',
                    patient_phone: '',
                    preferred_date: '',
                    preferred_time: '',
                    symptoms: ''
                  });
                }}
                className="rounded-full px-6"
                data-testid="book-another-btn"
              >
                Book Another / আরেকটি বুক করুন
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="px-6 md:px-12 lg:px-24 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 rounded-full" 
            onClick={() => navigate('/')}
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home / হোমে ফিরে যান
          </Button>

          {/* Service Header */}
          <div className={`bg-gradient-to-br ${service.color} text-white rounded-3xl p-6 md:p-8 mb-8`}>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold" data-testid="service-title">
                  {service.title} / {service.bengali}
                </h1>
                <p className="text-white/90 text-sm md:text-base mt-1">{service.description}</p>
                <p className="text-white/80 text-xs md:text-sm">{service.descBengali}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/40">
            <h2 className="text-xl md:text-2xl font-semibold mb-2" data-testid="booking-form-title">
              Book Your Appointment
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              আপনার অ্যাপয়েন্টমেন্ট বুক করুন
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  Clinic hours: 10:00 AM - 8:00 PM (Mon-Sat)
                </p>
              </div>
              
              <div>
                <Label htmlFor="symptoms">Additional Notes / অতিরিক্ত তথ্য</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  rows={3}
                  className="rounded-xl mt-2"
                  placeholder="Any specific requirements or notes (optional) / কোনো নির্দিষ্ট প্রয়োজনীয়তা বা নোট (ঐচ্ছিক)"
                  data-testid="input-symptoms"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full rounded-full"
                disabled={isSubmitting}
                data-testid="submit-booking-btn"
              >
                {isSubmitting ? 'Submitting... / জমা দেওয়া হচ্ছে...' : 'Book Appointment / অ্যাপয়েন্টমেন্ট বুক করুন'}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Our team will contact you to confirm your appointment
                <br />
                <span className="text-xs">আমাদের টিম আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করতে যোগাযোগ করবে</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
