import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from '../components/StarRating';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API}/doctors`);
      setDoctors(response.data);
      
      // Fetch ratings for all doctors
      const ratingsData = {};
      await Promise.all(
        response.data.map(async (doctor) => {
          try {
            const ratingRes = await axios.get(`${API}/doctors/${doctor.id}/rating`);
            ratingsData[doctor.id] = ratingRes.data;
          } catch (err) {
            ratingsData[doctor.id] = { average_rating: 0, total_reviews: 0 };
          }
        })
      );
      setRatings(ratingsData);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <div className="flex flex-wrap gap-3 mb-12 justify-center" data-testid="specialization-filter">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSpecialization === spec
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-white text-foreground border border-border hover:border-primary'
                }`}
                data-testid={`filter-${spec}`}
              >
                {spec === 'all' ? 'All Doctors' : spec}
              </button>
            ))}
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="text-center py-20" data-testid="loading-doctors">
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor) => (
                <Link key={doctor.id} to={`/doctors/${doctor.id}`}>
                  <div 
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all cursor-pointer border border-border/40"
                    data-testid={`doctor-card-${doctor.id}`}
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
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
                      <Button 
                        className="w-full rounded-full"
                        data-testid={`book-btn-${doctor.id}`}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
