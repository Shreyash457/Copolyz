#!/bin/bash

echo "🚀 Coochbehar Polyclinic - Netlify Deployment Helper"
echo "=================================================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "📦 Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI ready"
echo ""

# Build the frontend
echo "🔨 Building frontend..."
cd /app/frontend
yarn build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi

echo ""
echo "📤 Ready to deploy to Netlify!"
echo ""
echo "Choose deployment method:"
echo "1. Deploy via Netlify CLI (requires login)"
echo "2. Deploy via Git + Netlify website (recommended)"
echo ""

read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🔐 Logging into Netlify..."
    netlify login
    
    echo ""
    echo "🚀 Deploying to Netlify..."
    cd /app/frontend
    netlify deploy --prod --dir=build
    
    echo ""
    echo "✅ Deployment complete!"
    echo "Your site is now live!"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📋 Follow these steps:"
    echo ""
    echo "1. Push your code to GitHub:"
    echo "   cd /app"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo "   git push -u origin main"
    echo ""
    echo "2. Go to https://app.netlify.com"
    echo "3. Click 'Add new site' → 'Import from Git'"
    echo "4. Select your GitHub repo"
    echo "5. Build settings:"
    echo "   - Base directory: frontend"
    echo "   - Build command: yarn build"
    echo "   - Publish directory: frontend/build"
    echo "6. Add environment variable:"
    echo "   - REACT_APP_BACKEND_URL = YOUR_BACKEND_URL"
    echo "7. Click 'Deploy site'"
    echo ""
    echo "📖 Full guide: /app/NETLIFY_DEPLOYMENT.md"
else
    echo "Invalid choice. Exiting."
    exit 1
fi
