import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Stethoscope, Heart, Users, Award } from 'lucide-react';
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
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 lg:px-24 py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjbGluaWMlMjB3YWl0aW5nJTIwcm9vbSUyMHdhcm0lMjBsaWdodGluZyUyMGNvbWZvcnRhYmxlfGVufDB8fHx8MTc3MzczNTI2M3ww&ixlib=rb-4.1.0&q=85&w=1920"
            alt="Clinic waiting room"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium tracking-wide uppercase text-primary mb-4" data-testid="hero-subtitle">Welcome to</p>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-[1.1] mb-6" data-testid="hero-title">
              Coochbehar <br />
              <span className="font-semibold text-primary">Polyclinic</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-xl" data-testid="hero-description">
              Experience comprehensive healthcare with our team of 20+ specialized doctors. 
              Your health and peace of mind are our priority.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/doctors">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  data-testid="book-appointment-btn"
                >
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:03582469726">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg border-2 hover:bg-secondary/50"
                  data-testid="call-now-btn"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block" />
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
