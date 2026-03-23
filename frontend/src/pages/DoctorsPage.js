import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from '../components/StarRating';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [ratings, setRatings] = useState({});
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const doctorsGridRef = useRef(null);
  
  // Get today's date for availability check
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      // Filter only doctors who accept online booking
      const onlineDoctors = response.data.filter(doc => doc.accepts_online_booking !== false);
      setDoctors(onlineDoctors);
      
      // Fetch ratings and availability for all doctors
      const ratingsData = {};
      const availabilityData = {};
      
      await Promise.all(
        onlineDoctors.map(async (doctor) => {
          try {
            const ratingRes = await axios.get(`${API}/doctors/${doctor.id}/rating`);
            ratingsData[doctor.id] = ratingRes.data;
          } catch (err) {
            ratingsData[doctor.id] = { average_rating: 0, total_reviews: 0 };
          }
          
          // Check availability for doctors with daily limits
          if (doctor.max_daily_appointments) {
            try {
              const availRes = await axios.get(`${API}/doctors/${doctor.id}/availability/${today}`);
              availabilityData[doctor.id] = availRes.data;
            } catch (err) {
              availabilityData[doctor.id] = { is_available: true };
            }
          }
        })
      );
      setRatings(ratingsData);
      setAvailability(availabilityData);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationClick = (spec) => {
    setSelectedSpecialization(spec);
    
    // Smooth scroll to doctors grid with offset
    setTimeout(() => {
      if (doctorsGridRef.current) {
        const yOffset = -100; // Offset from top
        const y = doctorsGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];
  const filteredDoctors = selectedSpecialization === 'all' 
    ? doctors 
    : doctors.filter(d => d.specialization === selectedSpecialization);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4" data-testid="doctors-page-title">
              Our <span className="font-semibold text-primary">Doctors</span>
            </h1>
            <p className="text-lg text-muted-foreground">Meet our team of experienced healthcare professionals</p>
          </div>

          {/* Specialization Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center sticky top-20 z-40 bg-background/95 backdrop-blur-sm py-4 rounded-2xl shadow-sm" data-testid="specialization-filter">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecializationClick(spec)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedSpecialization === spec
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white text-foreground border border-border hover:border-primary hover:shadow-md'
                }`}
                data-testid={`filter-${spec}`}
              >
                {spec === 'all' ? 'All Doctors' : spec}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          <div ref={doctorsGridRef} className="scroll-mt-32">
            {loading ? (
              <div className="text-center py-20" data-testid="loading-doctors">
                <p className="text-muted-foreground">Loading doctors...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doctor, index) => {
                  const doctorAvail = availability[doctor.id];
                  const isFullyBooked = doctorAvail && !doctorAvail.is_available;
                  
                  return (
                  <Link key={doctor.id} to={`/doctors/${doctor.id}`}>
                    <div 
                      className={`group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-border/40 animate-fadeIn ${isFullyBooked ? 'opacity-75' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`doctor-card-${doctor.id}`}
                    >
                      {/* Fully Booked Badge */}
                      {isFullyBooked && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10" data-testid={`fully-booked-${doctor.id}`}>
                          <AlertCircle className="h-3 w-3" />
                          Fully Booked Today
                        </div>
                      )}
                      
                      <div className="p-8">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="bg-primary/10 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <Stethoscope className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1" data-testid={`doctor-name-${doctor.id}`}>{doctor.name}</h3>
                            <p className="text-sm text-primary font-medium mb-2" data-testid={`doctor-spec-${doctor.id}`}>{doctor.specialization}</p>
                            {ratings[doctor.id] && ratings[doctor.id].total_reviews > 0 && (
                              <StarRating 
                                rating={ratings[doctor.id].average_rating} 
                                totalReviews={ratings[doctor.id].total_reviews}
                                size="sm"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4" data-testid={`doctor-qual-${doctor.id}`}>{doctor.qualifications}</p>
                        
                        {/* Availability info for limited doctors */}
                        {doctor.max_daily_appointments && doctorAvail && (
                          <p className={`text-xs mb-3 ${isFullyBooked ? 'text-red-600' : 'text-green-600'}`}>
                            {isFullyBooked 
                              ? `Fully booked for today (${doctorAvail.appointments_booked}/${doctor.max_daily_appointments} slots)`
                              : `${doctor.max_daily_appointments - doctorAvail.appointments_booked} slots available today`
                            }
                          </p>
                        )}
                        
                        <Button 
                          className={`w-full rounded-full group-hover:scale-105 transition-transform duration-300 ${isFullyBooked ? 'bg-gray-400 hover:bg-gray-500' : ''}`}
                          data-testid={`book-btn-${doctor.id}`}
                        >
                          {isFullyBooked ? 'View Details' : 'Book Appointment'}
                        </Button>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
