# Copolyz - Coochbehar Polyclinic App PRD

## Original Problem Statement
Build a web application for "Coochbehar Polyclinic" that allows patients to book appointments with doctors or for specific services (X-ray, ECG, Blood Test). The app should:
- List all doctors with their specializations and availability
- Have a functional "Call Now" button
- Require manual appointment confirmation by clinic staff
- Include an admin/staff dashboard to view and manage bookings
- Notify clinic staff instantly when new appointments are booked
- Enforce daily limits for specific doctors (Dr. Mithun Das: 2 per day)
- Support multiple staff members (receptionist, proprietor) accessing admin dashboard
- Implement review and rating system for doctors
- Have professional look with good text contrast and Bengali translations

## App Name
**Copolyz** (formerly "Coochbehar Polyclinic")

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Notifications**: Telegram Bot API
- **Deployment Target**: PWA + Google Play Store (TWA)

---

## What's Been Implemented

### December 2025

#### Core Features
- [x] Guest appointment booking (no login required for patients)
- [x] Doctor listing with specializations and availability
- [x] Doctor detail pages with reviews and ratings
- [x] Direct service booking (X-Ray, ECG, Blood Test)
- [x] Call Now button with clinic phone number
- [x] Bengali translations throughout the app

#### Admin Dashboard
- [x] Multi-user staff access (Admin, Receptionist, Proprietor)
- [x] Appointment management (view, approve, reject, complete)
- [x] Time slot blocking for any date
- [x] Daily appointment limits per doctor (Dr. Mithun Das: 2/day)
- [x] Change password functionality

#### Notifications
- [x] Telegram bot integration for instant notifications
- [x] New appointment alerts sent to clinic group chat

#### PWA & Play Store Preparation
- [x] Progressive Web App (PWA) setup with service worker
- [x] App icons (192x192, 512x512) from clinic logo
- [x] Web app manifest with "Copolyz" branding
- [x] Privacy Policy page (`/privacy-policy`)
- [x] Digital Asset Links file for TWA verification
- [x] Comprehensive Play Store submission guide

---

## Prioritized Backlog

### P0 - Critical (Complete)
- ~~Telegram notifications~~
- ~~Multi-admin dashboard access~~
- ~~Play Store guide documentation~~

### P1 - High Priority
- [ ] Review sorting on Doctor Detail page (by date, rating)

### P2 - Medium Priority  
- [ ] Code cleanup: Remove unused patient auth routes
- [ ] Refactor backend code structure (routes, models, services)

### P3 - Future Enhancements
- [ ] Email/SMS appointment reminders
- [ ] Patient history tracking
- [ ] Doctor schedule management interface
- [ ] Analytics dashboard for admin

---

## Key Files Reference

### Frontend
- `/app/frontend/src/App.js` - Main routing
- `/app/frontend/src/pages/LandingPage.js` - Homepage
- `/app/frontend/src/pages/AdminDashboard.js` - Staff dashboard
- `/app/frontend/src/pages/DoctorDetailPage.js` - Doctor profiles
- `/app/frontend/src/pages/ServiceBookingPage.js` - Service booking
- `/app/frontend/src/pages/PrivacyPolicyPage.js` - Privacy policy
- `/app/frontend/public/manifest.json` - PWA manifest

### Backend
- `/app/backend/server.py` - All API endpoints
- `/app/backend/.env` - Environment variables (Telegram credentials)

### Documentation
- `/app/PLAYSTORE_GUIDE.md` - Complete Play Store submission guide

---

## Admin Credentials
| Email | Password | Role |
|-------|----------|------|
| admin@coochbehar.com | admin123 | Admin |
| asimabarai20@gmail.com | Ashima@123 | Receptionist |
| ankanbhadra1@gmail.com | Ankan@123 | Proprietor |

---

## Environment Variables
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
TELEGRAM_BOT_TOKEN=<configured>
TELEGRAM_CHAT_ID=<configured>
```

---

## Next Steps for User
1. Deploy app to production (Netlify/Vercel recommended)
2. Follow `/app/PLAYSTORE_GUIDE.md` to submit to Google Play Store
3. Update assetlinks.json with SHA-256 fingerprint from Bubblewrap
