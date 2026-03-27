import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Stethoscope, Heart, Users, Award, Activity, Droplet } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function LandingPage() {
  const specializations = [
    { name: 'Medicine', icon: Stethoscope },
    { name: 'Orthopaedic', icon: Heart },
    { name: 'Dental', icon: Users },
    { name: 'ENT', icon: Award },
    { name: 'Dermatology', icon: Heart },
    { name: 'Surgery', icon: Stethoscope },
    { name: 'Psychiatry', icon: Users },
    { name: 'Paediatrics', icon: Heart },
    { name: 'Gynaecology', icon: Award },
    { name: 'Urology', icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-100 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight mb-3" data-testid="hero-title">
              <span className="font-semibold text-primary">Coochbehar Polyclinic</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Quality Healthcare Services
            </p>
          </div>

          {/* 4 Major Service Sections - Red & Eye-catching */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* X-Ray - Direct to booking */}
            <Link to="/book?type=xray">
              <div className="group relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden" data-testid="service-xray">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Activity className="h-7 w-7 md:h-9 md:w-9" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">X-Ray</h3>
                  <p className="text-sm md:text-base text-white/90">এক্স-রে</p>
                  <p className="text-xs md:text-sm text-white/80 mt-2">Book Now</p>
                </div>
              </div>
            </Link>

            {/* Blood Test - Direct to booking */}
            <Link to="/book?type=bloodtest">
              <div className="group relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden" data-testid="service-bloodtest">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Droplet className="h-7 w-7 md:h-9 md:w-9" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Blood Test</h3>
                  <p className="text-sm md:text-base text-white/90">রক্ত পরীক্ষা</p>
                  <p className="text-xs md:text-sm text-white/80 mt-2">Book Now</p>
                </div>
              </div>
            </Link>

            {/* ECG - Direct to booking */}
            <Link to="/book?type=ecg">
              <div className="group relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden" data-testid="service-ecg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-7 w-7 md:h-9 md:w-9" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">ECG</h3>
                  <p className="text-sm md:text-base text-white/90">ইসিজি</p>
                  <p className="text-xs md:text-sm text-white/80 mt-2">Book Now</p>
                </div>
              </div>
            </Link>

            {/* Doctor Booking */}
            <Link to="/doctors">
              <div className="group relative bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden" data-testid="service-doctor">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-7 w-7 md:h-9 md:w-9" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Doctor</h3>
                  <p className="text-sm md:text-base text-white/90">ডাক্তার</p>
                  <p className="text-xs md:text-sm text-white/80 mt-2">Book Now</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Call Now Button */}
          <div className="text-center">
            <Button 
              asChild
              size="lg" 
              className="rounded-full px-8 py-6 text-base md:text-lg border-2 border-primary bg-white text-primary hover:bg-primary hover:text-white transition-colors shadow-lg"
              data-testid="call-now-btn"
            >
              <a href="tel:03582469726">
                <Phone className="mr-2 h-5 w-5" />
                Call Now / কল করুন
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-y border-border py-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4" data-testid="info-location">
            <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101</p>
            </div>
          </div>
          <div className="flex items-start gap-4" data-testid="info-hours">
            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium mb-1">Working Hours</h3>
              <p className="text-sm text-muted-foreground">Mon-Sat: 10:00 AM - 8:00 PM<br />Sunday: Closed</p>
            </div>
          </div>
          <div className="flex items-start gap-4" data-testid="info-contact">
            <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium mb-1">Contact Us</h3>
              <p className="text-sm text-muted-foreground">03582-469726<br />7384092221</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-wide uppercase text-primary mb-3">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Medical Specializations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare services across multiple specialties
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {specializations.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-border/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  data-testid={`specialization-${spec.name.toLowerCase()}`}
                >
                  <Icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-sm">{spec.name}</h3>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/doctors">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 py-6 border-2 hover:bg-secondary/50"
                data-testid="view-all-doctors-btn"
              >
                View All Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">Trusted healthcare for the community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-3xl p-8 hover:shadow-xl transition-all" data-testid="feature-specialists">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-3">20+ Specialists</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert doctors across all major medical specializations under one roof.
              </p>
            </div>
            
            <div className="bg-background rounded-3xl p-8 hover:shadow-xl transition-all" data-testid="feature-care">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-3">Quality Care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Patient-centered approach with modern facilities and compassionate care.
              </p>
            </div>
            
            <div className="bg-background rounded-3xl p-8 hover:shadow-xl transition-all" data-testid="feature-booking">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-3">Easy Booking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simple appointment request system with quick confirmation from our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Book your appointment today and experience quality healthcare
          </p>
          <Link to="/doctors">
            <Button 
              size="lg" 
              variant="secondary" 
              className="rounded-full px-8 py-6 text-lg"
              data-testid="cta-book-now-btn"
            >
              Book Appointment Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p className="mb-2">© 2026 Coochbehar Polyclinic. All rights reserved.</p>
          <p className="text-sm">PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101</p>
        </div>
      </footer>
    </div>
  );
}
