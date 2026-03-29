# Copolyz Deployment Guide

Complete guide to deploy your Coochbehar Polyclinic app for FREE.

---

## Overview

| Component | Service | Cost |
|-----------|---------|------|
| Frontend (React) | Netlify | Free |
| Backend (Python) | Render | Free |
| Database (MongoDB) | MongoDB Atlas | Free (512MB) |

---

## Step 1: Push Code to GitHub

1. Click **"Save to Github"** button in the Emergent chat
2. Follow the prompts to connect your GitHub account
3. Create a new repository named `copolyz-app`
4. Your code will be pushed automatically

---

## Step 2: Setup MongoDB Atlas (Free Cloud Database)

### 2.1 Create Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** and sign up

### 2.2 Create Cluster
1. Click **"Build a Database"**
2. Select **FREE - Shared** (M0 Sandbox)
3. Choose region closest to India (e.g., Mumbai)
4. Click **"Create Cluster"** (takes 1-3 minutes)

### 2.3 Setup Database Access
1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Enter:
   - Username: `copolyz_admin`
   - Password: (generate a strong password - **SAVE THIS!**)
4. Click **"Add User"**

### 2.4 Setup Network Access
1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 2.5 Get Connection String
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string, it looks like:
   ```
   mongodb+srv://copolyz_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name before `?`:
   ```
   mongodb+srv://copolyz_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/copolyz_db?retryWrites=true&w=majority
   ```

📝 **Save this connection string - you'll need it for the backend!**

---

## Step 3: Deploy Backend on Render (Free)

### 3.1 Create Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 3.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`copolyz-app`)
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `copolyz-backend` |
| **Region** | Singapore (closest to India) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 3.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `DB_NAME` | `copolyz_db` |
| `JWT_SECRET` | `your-secret-key-here-make-it-long-and-random` |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your Telegram group chat ID |

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL will be: `https://copolyz-backend.onrender.com`

📝 **Save this URL - you'll need it for the frontend!**

---

## Step 4: Deploy Frontend on Netlify (Free)

### 4.1 Create Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### 4.2 Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Select your `copolyz-app` repository

### 4.3 Configure Build Settings

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `yarn build` |
| **Publish directory** | `frontend/build` |

### 4.4 Add Environment Variable
Click **"Site configuration"** → **"Environment variables"** → **"Add a variable"**:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://copolyz-backend.onrender.com` |

⚠️ **Important**: Use your actual Render backend URL from Step 3!

### 4.5 Deploy
1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. Your site URL will be: `https://random-name.netlify.app`

### 4.6 (Optional) Custom Domain
1. Go to **"Domain management"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `copolyz.com`)
4. Follow DNS setup instructions

---

## Step 5: Initialize Database with Doctors

After deployment, you need to add your doctors to the new database.

### Option A: Use Admin Dashboard
1. Go to your deployed site
2. Login with admin credentials (you'll need to create the first admin via API)
3. Go to **Doctors** tab → **Add Doctor**

### Option B: Run Migration Script
Contact me and I can provide a script to migrate your existing doctor data to MongoDB Atlas.

---

## Step 6: Create Admin Account

Since the database is fresh, create the first admin account:

```bash
curl -X POST "https://YOUR-BACKEND-URL.onrender.com/api/auth/create-user" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Admin User",
    "email": "admin@coochbehar.com",
    "password": "your-secure-password",
    "role": "admin"
  }'
```

---

## Step 7: Test Everything

1. **Visit your site**: `https://your-site.netlify.app`
2. **Test login**: Use admin credentials
3. **Add doctors**: Via admin dashboard
4. **Test booking**: Book an appointment
5. **Check Telegram**: Verify notification is received

---

## Step 8: Publish to Play Store

Once everything works, follow the `/app/PLAYSTORE_GUIDE.md` to:
1. Build TWA with Bubblewrap
2. Submit to Google Play Store

**Important**: Update the manifest URLs to use your Netlify domain!

---

## Troubleshooting

### Backend not starting?
- Check Render logs for errors
- Verify MONGO_URL is correct
- Make sure MongoDB Atlas allows all IPs (0.0.0.0/0)

### Frontend shows "Network Error"?
- Check REACT_APP_BACKEND_URL is set correctly
- Make sure backend is running on Render
- Check browser console for CORS errors

### Telegram notifications not working?
- Verify TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
- Make sure bot is added to the group
- Check backend logs for errors

---

## Monthly Costs

| Service | Free Tier Limits |
|---------|------------------|
| **Netlify** | 100GB bandwidth/month |
| **Render** | 750 hours/month (spins down after 15 min inactivity) |
| **MongoDB Atlas** | 512MB storage |

⚠️ **Note**: Render free tier "sleeps" after 15 minutes of inactivity. First request after sleep takes ~30 seconds. For production, consider upgrading to paid tier ($7/month).

---

## Need Help?

If you get stuck at any step, let me know and I'll help you troubleshoot!
