import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Award, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CategoryDoctorsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedCategory = decodeURIComponent(category);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API}/doctors`);
        // Filter doctors by category (check both specialization and categories array)
        const filtered = response.data.filter(doc => {
          const specMatch = doc.specialization?.toLowerCase().includes(decodedCategory.toLowerCase());
          const catMatch = doc.categories?.some(cat => 
            cat.toLowerCase().includes(decodedCategory.toLowerCase())
          );
          return specMatch || catMatch;
        });
        setDoctors(filtered);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [decodedCategory]);

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#2D5A27] text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold" data-testid="category-title">
            {decodedCategory}
          </h1>
          <p className="text-white/80 mt-1">
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D5A27]"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors found in this category.</p>
            <Button 
              onClick={() => navigate('/doctors')}
              className="mt-4 bg-[#2D5A27] hover:bg-[#234620]"
            >
              View All Doctors
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <Link 
                key={doctor.id} 
                to={`/doctors/${doctor.id}`}
                className="block"
                data-testid={`doctor-card-${doctor.id}`}
              >
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-[#2D5A27]/20">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#4a7c43] flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {doctor.name}
                      </h3>
                      <p className="text-[#2D5A27] font-medium text-sm">
                        {doctor.specialization}
                      </p>
                      
                      {doctor.qualifications && (
                        <div className="flex items-start gap-1.5 mt-2 text-gray-600 text-sm">
                          <Award className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{doctor.qualifications}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Mon - Sat</span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <Button 
                      size="sm"
                      className="bg-[#2D5A27] hover:bg-[#234620] rounded-full px-4 flex-shrink-0"
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
