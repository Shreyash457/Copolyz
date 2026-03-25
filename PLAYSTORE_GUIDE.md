# Copolyz - Google Play Store Submission Guide

A complete guide to publish your **Copolyz** app (Coochbehar Polyclinic) to the Google Play Store using TWA (Trusted Web Activity).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Deploy to Production](#step-1-deploy-to-production)
3. [Step 2: Create Android App with Bubblewrap](#step-2-create-android-app-with-bubblewrap)
4. [Step 3: Configure Digital Asset Links](#step-3-configure-digital-asset-links)
5. [Step 4: Submit to Play Store](#step-4-submit-to-play-store)
6. [Required Assets Checklist](#required-assets-checklist)

---

## Prerequisites

Before starting, you need:

| Requirement | Details |
|-------------|---------|
| **Google Play Developer Account** | $25 one-time fee → [Create Account](https://play.google.com/console) |
| **Production Website** | Your app must be deployed on HTTPS with a custom domain |
| **Node.js** | v16 or higher installed on your computer |
| **Java JDK** | JDK 11 or higher (for Android build tools) |

> ⚠️ **Important**: The preview URL won't work for Play Store. You need a real domain like `copolyz.com` or `coochbeharpolyclinic.com`

---

## Step 1: Deploy to Production

Your website must be live on HTTPS before creating the Android app.

### Option A: Netlify (Recommended - Free)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `yarn build`
   - **Publish directory**: `frontend/build`
5. Click **Deploy site**
6. (Optional) Add custom domain in Site settings → Domain management

### Option B: Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: Create React App
4. Deploy

**📝 Note your production URL** (e.g., `https://copolyz.netlify.app` or `https://copolyz.com`)

---

## Step 2: Create Android App with Bubblewrap

### 2.1 Install Bubblewrap

Open your terminal and run:

```bash
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @bubblewrap/cli
```

### 2.2 Initialize the TWA Project

```bash
# Create project folder
mkdir copolyz-android
cd copolyz-android

# Initialize with your production URL
bubblewrap init --manifest https://YOUR-PRODUCTION-URL/manifest.json
```

When Bubblewrap prompts you, enter these values:

| Prompt | Value |
|--------|-------|
| **Application ID** | `com.copolyz.app` |
| **App name** | `Copolyz` |
| **Short name** | `Copolyz` |
| **Launcher name** | `Copolyz` |
| **Display mode** | `standalone` |
| **Theme color** | `#2D5A27` |
| **Background color** | `#F7F5F0` |
| **Start URL** | `/` |
| **Signing key alias** | `copolyz-key` |
| **Signing key password** | (create a secure password - **save this!**) |

### 2.3 Build the Android App Bundle

```bash
bubblewrap build
```

This creates two files:
- `app-release-bundle.aab` → **Upload this to Play Store**
- `app-release-signed.apk` → For testing on your phone

> 💡 **Testing**: Transfer the `.apk` file to your Android phone and install it to test before uploading to Play Store.

---

## Step 3: Configure Digital Asset Links

This step verifies that your website owns the Android app. After building, Bubblewrap shows your app's **SHA-256 fingerprint**.

### 3.1 Create the Asset Links File

Create a file at `frontend/public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.copolyz.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_FROM_BUBBLEWRAP"
      ]
    }
  }
]
```

### 3.2 Configure Netlify Redirects

If using Netlify, ensure your `frontend/public/_redirects` file includes:

```
/.well-known/*  /.well-known/:splat  200
```

### 3.3 Verify Asset Links

After deploying, verify at:
```
https://YOUR-DOMAIN/.well-known/assetlinks.json
```

---

## Step 4: Submit to Play Store

### 4.1 Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **"Create app"**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **App name** | Copolyz |
| **Default language** | English (India) |
| **App or game** | App |
| **Free or paid** | Free |
| **Declarations** | Check both boxes |

### 4.2 Complete Store Listing

Navigate to **Grow** → **Store presence** → **Main store listing**

#### App Details

**Short description** (80 characters max):
```
Book doctor appointments at Coochbehar Polyclinic - 20+ specialists
```

**Full description** (4000 characters max):
```
Copolyz is the official app of Coochbehar Polyclinic, a premier multi-specialty healthcare center in Cooch Behar, West Bengal.

📱 KEY FEATURES:
• Book appointments with 20+ specialist doctors
• Schedule X-Ray, Blood Tests, ECG online
• View doctor profiles, qualifications, and availability
• Track your appointment status
• Bengali language support

👨‍⚕️ SPECIALIZATIONS AVAILABLE:
Medicine, Orthopaedic, Dental, ENT, Dermatology, Surgery, Psychiatry, Paediatrics, Gynaecology, Urology, Cardiology, Neurology, and more.

🏥 ABOUT COOCHBEHAR POLYCLINIC:
Serving Cooch Behar for over 25 years with quality healthcare.

⏰ Working Hours: Monday-Saturday, 10:00 AM - 8:00 PM
📍 Location: PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101
📞 Contact: 03582-469726

Download now and book your appointment in just a few taps!
```

### 4.3 Upload Graphics

| Asset | Specifications |
|-------|---------------|
| **App icon** | 512 x 512 PNG (already in `public/logo512.png`) |
| **Feature graphic** | 1024 x 500 PNG |
| **Phone screenshots** | Minimum 2, size 1080 x 1920 (or similar) |

> 💡 Take screenshots of your deployed website on mobile for the phone screenshots.

### 4.4 Create Privacy Policy Page

Google requires a privacy policy. Add this page to your app at `/privacy-policy`:

```
Privacy Policy for Copolyz App

Last updated: December 2025

INFORMATION WE COLLECT:
- Name and phone number for appointment booking
- Email address (optional)

HOW WE USE YOUR INFORMATION:
- To schedule and manage your appointments
- To send appointment confirmations and reminders

DATA SECURITY:
- Your data is stored securely and encrypted
- We do not share your data with third parties

CONTACT US:
Coochbehar Polyclinic
PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101
Phone: 03582-469726
```

Enter the URL in Play Console: `https://YOUR-DOMAIN/privacy-policy`

### 4.5 Upload the App Bundle

1. Go to **Release** → **Production**
2. Click **"Create new release"**
3. Upload your `app-release-bundle.aab` file
4. Add release notes:
   ```
   Initial release of Copolyz - Coochbehar Polyclinic appointment booking app.
   ```
5. Click **"Review release"** → **"Start rollout to Production"**

### 4.6 Complete Content Rating

1. Go to **Policy** → **App content** → **Content rating**
2. Start the questionnaire
3. Answer honestly (medical apps are typically rated "Everyone")
4. Submit

### 4.7 Set Target Audience and Content

1. Go to **Policy** → **App content** → **Target audience**
2. Select age groups (18 and older recommended for medical apps)
3. Answer "No" to questions about children

### 4.8 Review and Submit

1. Check the dashboard for any remaining items
2. Resolve all issues/warnings
3. Submit for review

---

## Required Assets Checklist

Before submission, ensure you have:

- [ ] Production website deployed and working
- [ ] `assetlinks.json` configured and accessible
- [ ] App icon (512x512) ✅ Already created
- [ ] Feature graphic (1024x500)
- [ ] At least 2 phone screenshots
- [ ] Privacy policy page
- [ ] `.aab` file built with Bubblewrap
- [ ] Google Play Developer account ($25)

---

## Timeline

| Stage | Duration |
|-------|----------|
| Deploy to production | 30 minutes |
| Build TWA with Bubblewrap | 30 minutes |
| Complete Play Store listing | 1-2 hours |
| Google review | 1-7 days |

---

## Troubleshooting

### "App not found in manifest"
- Make sure your production URL is correct
- Verify `manifest.json` is accessible at `https://YOUR-URL/manifest.json`

### "Digital Asset Links validation failed"
- Check `assetlinks.json` is at `/.well-known/assetlinks.json`
- Verify the SHA-256 fingerprint matches
- Wait a few minutes for DNS/CDN to propagate

### "Signing key issues"
- Keep your signing key password safe - you'll need it for updates
- If lost, you'll need to create a new app

---

## Need Help?

- **Bubblewrap Documentation**: https://github.com/nicovideo/nicovideo-node
- **Bubblewrap Documentation**: https://github.com/nicovideo/nicovideo-node
- **Bubblewrap Documentation**: https://github.com/nicovideo/nicovideo-node
- **Bubblewrap Documentation**: https://github.com/nicovideo/nicovideo-node
- **Bubblewrap Documentation**: https://github.com/GoogleChromeLabs/bubblewrap
- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **TWA Documentation**: https://developer.chrome.com/docs/android/trusted-web-activity

---

**Congratulations!** Once approved, your **Copolyz** app will be available on the Google Play Store! 🎉
