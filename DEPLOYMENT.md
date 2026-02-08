# 🚀 NAVBAT Deployment Guide

## 📋 Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- A static hosting service (Vercel, Netlify, Cloudflare Pages, or any nginx/Apache server)

## 🏗️ Build Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
```

### Production Build
```bash
npm run build        # Create optimized production build
npm run preview      # Preview the production build locally
```

### Type Checking & Linting
```bash
npx tsc --noEmit     # Type check without emitting files
npm run lint         # Run ESLint (if configured)
```

## 📁 Build Output
After running `npm run build`, the output is in the `dist/` folder:
```
dist/
├── index.html       # Entry point
├── assets/          # JS, CSS, and other assets
│   ├── index-*.js   # Main JavaScript bundle
│   ├── index-*.css  # Compiled CSS
│   └── ...          # Other chunks (lazy-loaded)
└── sw.js            # Service Worker for PWA
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel auto-detects Vite and configures build settings
3. Set environment variables in Vercel dashboard if needed

```bash
# Or deploy directly via CLI
npm i -g vercel
vercel --prod
```

### Option 2: Netlify
1. Connect repository or drag-and-drop the `dist/` folder
2. Build command: `npm run build`
3. Publish directory: `dist`

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Cloudflare Pages
1. Connect to Git repository
2. Framework preset: None (or Vite)
3. Build command: `npm run build`
4. Build output directory: `dist`

### Option 4: Self-Hosted (nginx)
```nginx
server {
    listen 80;
    server_name navbat.uz www.navbat.uz;
    root /var/www/navbat/dist;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # GZIP compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

## 🔐 Environment Variables

Create a `.env.production` file for production settings:

```env
# API Configuration
VITE_API_URL=https://api.navbat.uz/v1
VITE_WS_URL=wss://api.navbat.uz/ws

# Feature Flags
VITE_USE_MOCK_API=false
VITE_ENABLE_ANALYTICS=true

# Third-party Services
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_GOOGLE_MAPS_KEY=your_key_here
```

## 📊 Performance Optimization Checklist

- [x] **Code Splitting:** Views are lazy-loaded via `React.lazy()`
- [x] **CSS Optimization:** Vite handles CSS minification
- [x] **Asset Optimization:** Images should be optimized before deployment
- [ ] **CDN:** Consider using a CDN for static assets
- [ ] **Service Worker:** Enable for offline support
- [ ] **HTTP/2:** Ensure your server supports HTTP/2

## 🧪 Pre-Deployment Checklist

1. **Run Type Check:**
   ```bash
   npx tsc --noEmit
   ```

2. **Build & Preview:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Lighthouse Audit:**
   - Open Chrome DevTools → Lighthouse
   - Run audit for Performance, Accessibility, Best Practices, SEO

4. **Test on Multiple Devices:**
   - Desktop browsers (Chrome, Firefox, Safari, Edge)
   - Mobile browsers (iOS Safari, Android Chrome)
   - Responsive breakpoints (sm, md, lg, xl)

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 📱 PWA Configuration

The app includes a service worker (`public/sw.js`). To enable full PWA functionality:

1. Ensure `manifest.json` exists in `public/`
2. Configure icons in multiple sizes (192x192, 512x512)
3. Set `start_url` and `display: standalone`

## 📞 Support

For deployment issues, contact the development team or open an issue on GitHub.

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-06
