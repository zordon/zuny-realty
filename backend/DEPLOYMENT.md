# Backend Deployment Guide

## 💰 **Cost Comparison (with SQLite)**

| Platform | Monthly Cost | Pros | Cons |
|----------|-------------|------|------|
| **DigitalOcean App Platform** | $5 | Easiest setup, auto-scaling | Limited to basic plan |
| **AWS Lightsail** | $3.50 | Cheapest, more control | Manual server management |
| **Railway** | $5 | Simple, good DX | Limited free tier |
| **Render** | $7 | Good free tier | More expensive paid plans |

## 🥇 **Recommended: DigitalOcean App Platform ($5/month)**

### Step 1: Prepare Environment Variables

Generate these secrets for production:
```bash
# Generate random secrets (run these commands)
node -p "require('crypto').randomBytes(32).toString('base64')"  # APP_KEYS
node -p "require('crypto').randomBytes(32).toString('base64')"  # API_TOKEN_SALT  
node -p "require('crypto').randomBytes(32).toString('base64')"  # ADMIN_JWT_SECRET
node -p "require('crypto').randomBytes(32).toString('base64')"  # TRANSFER_TOKEN_SALT
node -p "require('crypto').randomBytes(32).toString('base64')"  # JWT_SECRET
```

### Step 2: Deploy to DigitalOcean

1. **Push your code to GitHub**
2. **Go to DigitalOcean App Platform**
3. **Create new app from GitHub repo**
4. **Configure the app:**
   - **Source**: Select your repo and `main` branch
   - **Source Directory**: `/backend`
   - **Build Command**: `yarn install && yarn build`
   - **Run Command**: `yarn start`
   - **Port**: `1337`

5. **Set Environment Variables** in DO dashboard:
   ```
   NODE_ENV=production
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=<your-generated-secret>
   API_TOKEN_SALT=<your-generated-secret>
   ADMIN_JWT_SECRET=<your-generated-secret>
   TRANSFER_TOKEN_SALT=<your-generated-secret>
   JWT_SECRET=<your-generated-secret>
   ```

6. **Deploy!** - DigitalOcean will build and deploy automatically

### Step 3: Access Strapi Admin

1. Go to `https://your-app-name-xxxxx.ondigitalocean.app/admin`
2. Create your admin account
3. Start adding properties!

---

## 🏆 **Alternative: AWS Lightsail ($3.50/month)**

### Step 1: Create Lightsail Instance

1. **Create instance**: Ubuntu 20.04, $3.50/month plan
2. **Connect via SSH**

### Step 2: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Enable corepack and setup yarn
sudo corepack enable
sudo corepack prepare yarn@4.5.0 --activate

# Install PM2 globally
sudo npm install -g pm2

# Clone your repo
git clone https://github.com/your-username/zuny-real-estate.git
cd zuny-real-estate/backend

# Install dependencies
yarn install

# Create production environment file
sudo nano .env
```

### Step 3: Configure Environment (.env)

```bash
NODE_ENV=production
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-generated-secret
API_TOKEN_SALT=your-generated-secret
ADMIN_JWT_SECRET=your-generated-secret
TRANSFER_TOKEN_SALT=your-generated-secret
JWT_SECRET=your-generated-secret
```

### Step 4: Build and Start

```bash
# Build the application
yarn build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/strapi

# Add Nginx config:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔄 **Deployment Workflow**

### For DigitalOcean (Automatic)
- Push to GitHub → Automatic deployment

### For AWS Lightsail (Manual)
```bash
# SSH into server
ssh ubuntu@your-server-ip

# Update code
cd zuny-real-estate
git pull origin main
cd backend

# Install new dependencies (if any)
yarn install

# Rebuild
yarn build

# Restart application
pm2 restart zuny-real-estate-backend
```

---

## 🌐 **Update Frontend API URLs**

After backend deployment, update your frontend:

```typescript
// frontend/src/lib/api.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://your-backend-url.com'
```

Set in Cloudflare Pages environment variables:
```
NEXT_PUBLIC_STRAPI_URL=https://your-backend-domain.com
```

---

## 🔒 **Production Checklist**

- [ ] Environment variables set
- [ ] Admin account created
- [ ] API endpoints working
- [ ] Frontend connected to backend
- [ ] SSL certificate (automatic with DO/Cloudflare)
- [ ] Regular database backups (SQLite file)

**Total Monthly Cost**: $5 (DO) + $0 (Cloudflare Pages) = **$5/month** 