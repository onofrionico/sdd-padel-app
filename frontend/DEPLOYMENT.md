# Deployment Guide - Padel Tournament Frontend

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Backend API running and accessible

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Padel Tournament
```

For local development, use `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Build

```bash
npm install
npm run build
```

The build output will be in the `dist/` directory.

## Deployment Options

### Option 1: Netlify

1. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

2. **Via Git Integration:**
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configuration:**
   - The `netlify.toml` file is already configured
   - Includes SPA routing, security headers, and caching

### Option 2: Vercel

1. **Via Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Via Git Integration:**
   - Import your repository in Vercel dashboard
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add environment variables in Vercel dashboard

3. **Configuration:**
   - The `vercel.json` file is already configured
   - Includes SPA routing and security headers

### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t padel-frontend .
docker run -p 80:80 padel-frontend
```

### Option 4: AWS S3 + CloudFront

1. Build the application
2. Create an S3 bucket with static website hosting
3. Upload `dist/` contents to S3
4. Create CloudFront distribution pointing to S3
5. Configure CloudFront for SPA routing (custom error page 404 → /index.html)

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml`:

- Runs on push to `main` and `develop` branches
- Tests on Node.js 18.x and 20.x
- Runs linter, unit tests, build, and E2E tests
- Uploads Playwright test reports

## Performance Checklist

- [x] Code splitting implemented (lazy loading routes)
- [x] Vendor chunks separated for better caching
- [x] Console logs removed in production build
- [x] Source maps disabled for production
- [x] Assets cached with long expiry
- [x] Security headers configured
- [x] Gzip/Brotli compression enabled (via hosting platform)

## Security Checklist

- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-XSS-Protection enabled
- [x] Referrer-Policy configured
- [ ] HTTPS enforced (configure on hosting platform)
- [ ] CSP headers (configure based on your needs)
- [ ] Environment variables never committed to git

## Monitoring

Consider adding:

- Error tracking (Sentry, Rollbar)
- Analytics (Google Analytics, Plausible)
- Performance monitoring (Web Vitals)
- Uptime monitoring (UptimeRobot, Pingdom)

## Post-Deployment Verification

1. Check all routes work correctly
2. Verify API connectivity
3. Test authentication flow
4. Check responsive design on mobile
5. Verify offline detection works
6. Test tournament enrollment flow
7. Check notifications are received
8. Verify organizer features (if applicable)

## Troubleshooting

### Build Fails

- Check Node.js version (18.x or 20.x required)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### API Connection Issues

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration on backend
- Verify API is accessible from deployment environment

### Routing Issues (404 on refresh)

- Ensure SPA routing is configured on hosting platform
- Check `netlify.toml` or `vercel.json` is present
- For custom servers, configure fallback to `index.html`

### Performance Issues

- Run `npm run build` and check bundle sizes
- Use browser DevTools to identify large chunks
- Consider lazy loading more components
- Optimize images and assets

## Support

For issues or questions, contact the development team or create an issue in the repository.
