# Zuny Real Estate Website

A modern, professional real estate website built with Next.js and Strapi CMS, designed for Zuny Real Estate in Panama.

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Yarn 4** - Package manager

### Backend
- **Strapi** - Headless CMS
- **SQLite** - Database (development)

### Deployment
- **Cloudflare Pages** - Frontend hosting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Features

- 🏡 Modern real estate property listings
- 📱 Fully responsive design
- 🔍 Property search and filtering
- 📧 Contact forms and agent information
- 🌐 Spanish language support
- ⚡ Fast static site generation
- 🔒 SEO optimized

## 📁 Project Structure

```
zuny-real-estate/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   │   └── types.ts   # TypeScript definitions
│   │   ├── components/ # React components
│   │   └── types.ts   # TypeScript definitions
├── backend/           # Strapi CMS
├── .github/
│   └── workflows/     # GitHub Actions
└── README.md
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 22+
- Yarn 4.5.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zuny-real-estate
   ```

2. **Setup Node.js version**
   ```bash
   nvm use 22
   nvm alias default 22
   ```

3. **Enable Yarn 4**
   ```bash
   corepack enable
   corepack prepare yarn@4.5.0 --activate
   ```

4. **Install dependencies**
   ```bash
   # Install all workspace dependencies
   yarn install
   ```

### Running the Development Server

1. **Start the frontend**
   ```bash
   yarn dev
   # or
   cd frontend && yarn dev
   ```

2. **Start the backend (when ready)**
   ```bash
   yarn backend:dev
   # or
   cd backend && yarn develop
   ```

The frontend will be available at `http://localhost:3000`

## 🏢 Property Data Structure

Properties include the following information:
- Title and description
- Address and location
- Price and currency
- Bedrooms and bathrooms
- Area in square feet/meters
- Property type (Sale/Rent)
- Features and amenities
- Agent contact information
- Image gallery

## 🚀 Deployment

### Cloudflare Pages Setup

1. **Create a Cloudflare Pages project**
   - Connect your GitHub repository
   - Set build command: `yarn build`
   - Set build output directory: `frontend/out`

2. **Configure GitHub Secrets**
   ```
   CLOUDFLARE_API_TOKEN=your_api_token
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

3. **Deploy**
   - Push to `main` branch triggers automatic deployment
   - Pull requests create preview deployments

### Manual Deployment

```bash
# Build the frontend
cd frontend
yarn build

# The static files will be in the 'out' directory
# Upload the contents to your hosting provider
```

## 🎨 Customization

### Branding
- Update logo and colors in `frontend/src/components/Header.tsx`
- Modify theme colors in `frontend/tailwind.config.js`
- Update contact information throughout the components

### Content
- Property data is currently hardcoded in `frontend/src/app/page.tsx`
- Agent information in components can be updated
- SEO metadata in `frontend/src/app/layout.tsx`

## 📞 Contact Information

**Zuny Real Estate**
- Phone: +507 6273-5027
- Email: admin@zunyrealty.com
- Location: San Francisco, Ciudad de Panamá

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved by Zuny Real Estate.

---

Built with ❤️ for Zuny Real Estate in Panama 🇵🇦
