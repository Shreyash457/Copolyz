# Coochbehar Polyclinic - Netlify Deployment Guide

## 🚀 Deploy to Netlify in 5 Minutes

### Prerequisites:
- GitHub/GitLab account (free)
- Netlify account (free - create at netlify.com)

---

## Step 1: Prepare Your Backend

Your backend (FastAPI) needs to be deployed separately. Options:

### A) Deploy Backend to Railway (Recommended - Free tier available)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend folder
5. Railway will auto-detect FastAPI and deploy
6. Copy your backend URL: `https://your-app.railway.app`

### B) Deploy Backend to Render (Free)
1. Go to https://render.com
2. Sign up
3. New → Web Service
4. Connect GitHub repo
5. Root directory: `backend`
6. Build: `pip install -r requirements.txt`
7. Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
8. Copy your backend URL

---

## Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
cd /app
git init
git add .
git commit -m "Initial commit - Coochbehar Polyclinic"

# Create a new repo on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/coochbehar-polyclinic.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Frontend to Netlify

### Method 1: Via Netlify Website (Easiest)

1. **Go to Netlify**
   - Visit https://app.netlify.com
   - Sign up/Login with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository

3. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `yarn build`
   - Publish directory: `frontend/build`

4. **Add Environment Variables**
   - Click "Site settings" → "Environment variables"
   - Add: `REACT_APP_BACKEND_URL` = `https://your-backend-url.railway.app`

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site is live! 🎉

### Method 2: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the frontend
cd /app/frontend
yarn build

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create new site or link existing
# - Choose team
# - Site name: coochbehar-polyclinic
# - Publish directory: build

# Your site is live!
```

---

## Step 4: Configure Custom Domain (Optional)

1. **Buy Domain**
   - GoDaddy, Namecheap, or any domain registrar
   - Example: `coochbeharpolyclinic.com` (₹500-800/year)

2. **Add to Netlify**
   - Netlify Dashboard → Domain settings
   - Click "Add custom domain"
   - Enter your domain: `coochbeharpolyclinic.com`

3. **Update DNS**
   - Go to your domain registrar
   - Add Netlify nameservers:
     ```
     dns1.p08.nsone.net
     dns2.p08.nsone.net
     dns3.p08.nsone.net
     dns4.p08.nsone.net
     ```
   - Or add A record: `75.2.60.5`

4. **Wait for DNS** (15 minutes - 48 hours)
   - Netlify will auto-configure SSL (HTTPS)
   - Your site will be live at `https://coochbeharpolyclinic.com`

---

## Step 5: Test the Mobile App

1. **Visit your Netlify URL** on phone
   - Example: `https://coochbehar-polyclinic.netlify.app`

2. **Install as App**
   - **Android**: Chrome menu → "Add to Home screen"
   - **iPhone**: Safari → Share → "Add to Home Screen"

3. **Test Features**
   - Book appointment
   - Login/Signup
   - View doctors
   - Admin dashboard

---

## 📋 Complete Deployment Checklist

### Backend:
- [ ] Deploy FastAPI to Railway/Render
- [ ] Copy backend URL
- [ ] Test API: `curl https://your-backend.railway.app/api/`
- [ ] Ensure MongoDB connected

### Frontend:
- [ ] Push code to GitHub
- [ ] Connect Netlify to GitHub repo
- [ ] Set `REACT_APP_BACKEND_URL` environment variable
- [ ] Deploy to Netlify
- [ ] Test frontend loads

### Database:
- [ ] MongoDB connection working
- [ ] Doctors seeded (19 doctors)
- [ ] Admin account created (admin@coochbehar.com)

### Domain (Optional):
- [ ] Buy domain
- [ ] Configure DNS
- [ ] SSL certificate auto-configured by Netlify

### Final Testing:
- [ ] Visit site on mobile
- [ ] Install as app ("Add to Home Screen")
- [ ] Book test appointment
- [ ] Login as admin
- [ ] Verify all features work

---

## 🆘 Common Issues & Fixes

### Issue: "Site can't be reached"
**Fix:** Check backend URL in Netlify environment variables

### Issue: "API calls failing"
**Fix:** Ensure backend is deployed and running. Check CORS settings in backend.

### Issue: "White screen after deploy"
**Fix:** Check build logs. Ensure `yarn build` succeeds. Check for console errors.

### Issue: "Can't add to home screen"
**Fix:** Must use HTTPS (Netlify provides this automatically)

---

## 💰 Costs

### Free Tier (Sufficient for starting):
- Netlify: 100GB bandwidth/month (FREE)
- Railway Backend: 500 hours/month (FREE)
- MongoDB Atlas: 512MB storage (FREE)
- **Total: ₹0/month**

### With Domain:
- Domain: ₹500-800/year
- Everything else: FREE
- **Total: ~₹500-800/year**

### Paid (If you need more):
- Netlify Pro: $19/month (~₹1,600/month)
- Railway Pro: $5/month (~₹400/month)
- **Total: ~₹2,000/month**

---

## 🎯 Next Steps After Deployment

1. **Share with patients**
   - Create QR code for website
   - Print posters with QR code
   - Share link on WhatsApp
   - Add to Google Business listing

2. **Monitor usage**
   - Check Netlify analytics
   - Monitor appointment bookings
   - Gather patient feedback

3. **Promote app installation**
   - Staff can help patients install
   - "Add to Home Screen" instructions at reception
   - SMS to existing patients with link

---

## 📞 Need Help?

If you face any issues during deployment:
1. Check build logs in Netlify dashboard
2. Verify environment variables are set correctly
3. Test backend URL separately before frontend
4. Contact Netlify support (very responsive)

**Your app will be live in ~10 minutes!** 🚀
