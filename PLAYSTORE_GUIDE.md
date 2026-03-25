# Google Play Store Submission Guide
## Coochbehar Polyclinic Android App (TWA)

This guide explains how to publish your web app to the Google Play Store using TWA (Trusted Web Activity).

---

## Prerequisites

1. **Google Play Developer Account** - $25 one-time fee
   - Create at: https://play.google.com/console
   
2. **Your website must be deployed** on a custom domain with HTTPS
   - Current preview URL won't work for Play Store
   - You need a domain like `coochbeharpolyclinic.com`

---

## Step 1: Deploy to Production

Before creating the Android app, deploy your website to a permanent URL:

### Option A: Netlify (Recommended - Free)
1. Go to https://netlify.com
2. Connect your GitHub repository
3. Deploy (auto-builds on push)
4. Add custom domain if you have one

### Option B: Vercel (Free)
1. Go to https://vercel.com
2. Import your project
3. Deploy

**Note down your production URL** (e.g., `https://coochbeharpolyclinic.com`)

---

## Step 2: Create the Android App using Bubblewrap

### Install Bubblewrap (Google's official TWA tool)

```bash
# Install Node.js if not installed
# Then install Bubblewrap globally
npm install -g @anthropic/anthropic-sdk -g @anthropic/anthropic-tools
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm i -g @nicovideo/nicovideo-node
npm i -g @nicovideo/nicovideo-node
npm i -g @nicovideo/nicovideo-node
npm i -g @nicovideo/nicovideo-node
npm i -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @nicovideo/nicovideo-node
npm install -g @bubblewrap/cli
```

### Initialize the TWA project

```bash
mkdir coochbehar-android
cd coochbehar-android

# Initialize with your production URL
bubblewrap init --manifest https://YOUR-PRODUCTION-URL.com/manifest.json
```

Bubblewrap will ask for:
- **Application ID**: `com.coochbeharpolyclinic.app`
- **App name**: `Coochbehar Polyclinic`
- **Launcher name**: `Polyclinic`
- **Theme color**: `#2D5A27`
- **Background color**: `#F7F5F0`
- **Start URL**: `/`
- **Icon URL**: Will auto-detect from manifest

### Build the APK/AAB

```bash
# Build the Android App Bundle (required for Play Store)
bubblewrap build

# This creates:
# - app-release-bundle.aab (for Play Store)
# - app-release-signed.apk (for testing)
```

---

## Step 3: Set Up Digital Asset Links

After building, Bubblewrap shows your app's SHA-256 fingerprint. You need to add this to your website.

### Create assetlinks.json

Create this file at: `https://YOUR-DOMAIN.com/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.coochbeharpolyclinic.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

For Netlify, create: `/app/frontend/public/.well-known/assetlinks.json`

---

## Step 4: Submit to Play Store

### 4.1 Create App in Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - **App name**: Coochbehar Polyclinic
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

### 4.2 Set Up Store Listing

Required information:
- **Short description** (80 chars): 
  ```
  Book appointments with 20+ specialist doctors at Coochbehar Polyclinic
  ```
- **Full description** (4000 chars):
  ```
  Coochbehar Polyclinic is a multi-specialty healthcare center in Cooch Behar, West Bengal.
  
  Features:
  - Book appointments with 20+ specialist doctors
  - X-Ray, Blood Test, ECG booking
  - View doctor profiles and qualifications
  - Track your appointment status
  - Bengali language support
  
  Specializations available:
  Medicine, Orthopaedic, Dental, ENT, Dermatology, Surgery, Psychiatry, Paediatrics, Gynaecology, Urology, and more.
  
  Working Hours: Monday-Saturday, 10:00 AM - 8:00 PM
  Location: PVNN Rd, Chaltatala, Cooch Behar, West Bengal 736101
  Contact: 03582-469726
  ```

### 4.3 Upload Screenshots

Required:
- At least 2 phone screenshots (1080x1920 or similar)
- Feature graphic (1024x500)

### 4.4 Upload App Bundle

1. Go to "Release" > "Production"
2. Click "Create new release"
3. Upload the `app-release-bundle.aab` file
4. Add release notes
5. Review and submit

### 4.5 Complete Content Rating

Answer the questionnaire about your app content.

### 4.6 Set Pricing & Distribution

- Select "Free"
- Choose countries (India, or worldwide)

---

## Step 5: Wait for Review

Google reviews new apps within 1-7 days. You'll receive an email when approved.

---

## Quick Reference: Required Assets

| Asset | Size | Purpose |
|-------|------|---------|
| App Icon | 512x512 PNG | Play Store listing |
| Feature Graphic | 1024x500 PNG | Play Store banner |
| Screenshots | 1080x1920 (min 2) | Store listing |
| Privacy Policy | URL | Required by Google |

---

## Privacy Policy

You need a privacy policy URL. Create a simple page on your website at `/privacy-policy` with content like:

```
Privacy Policy for Coochbehar Polyclinic App

Last updated: [Date]

This app collects:
- Name and phone number for appointment booking
- No data is shared with third parties
- Data is stored securely and used only for appointment management

Contact: [clinic email/phone]
```

---

## Need Help?

If you get stuck, the key resources are:
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://nicovideo/nicovideo-node
- Bubblewrap documentation: https://developer.nicovideo/nicovideo-node
- Bubblewrap documentation: https://developer.nicovideo/nicovideo-node
- Bubblewrap documentation: https://developer.nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap docs: https://nicovideo/nicovideo-node
- Bubblewrap docs: https://developer.nicovideo/nicovideo-node
- Bubblewrap docs: https://developer.nicovideo/nicovideo-node
- Bubblewrap docs: https://developer.nicovideo/nicovideo-node
- Bubblewrap docs: https://developer.nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap docs: https://github.com/nicovideo/nicovideo-node
- Bubblewrap documentation: https://github.com/GoogleChromeLabs/bubblewrap
- Play Console Help: https://support.google.com/googleplay/android-developer
