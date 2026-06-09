# Resumics — Complete Development & Production Deployment Guide

> India's #1 AI-powered resume builder. ATS-optimized. ₹49 per download.

---

## 📁 Project Structure

```
resumics/
├── frontend/                   # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── resume/        # Builder steps, templates, ATS panel
│   │   │   └── ui/            # Popups, loaders
│   │   ├── pages/             # All route pages
│   │   ├── store/             # Zustand global state
│   │   ├── lib/               # API client, AI service, PDF generator
│   │   └── styles/            # Global CSS + Tailwind
│   ├── public/                # favicon.svg (replace with your own)
│   ├── vercel.json            # Vercel deployment config
│   └── package.json
│
├── backend/                    # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/            # auth, resume, payment, ai, admin
│   │   ├── middleware/        # JWT auth
│   │   └── services/          # email service
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── railway.json           # Railway deployment config
│   └── package.json
│
└── package.json               # Root monorepo config
```

---

## ⚡ Quick Start — Local Development

### Prerequisites
- Node.js 18+ (LTS)
- npm 9+
- Git

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourusername/resumics.git
cd resumics

# Install root deps
npm install

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps
cd backend && npm install && cd ..
```

### Step 2 — Set Up Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values (see **Environment Variables** section below).

### Step 3 — Set Up Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Step 4 — Set Up Database (Neon)

1. Go to [neon.tech](https://neon.tech) → Create a free account
2. Create a new project → Copy the connection string
3. Paste it as `DATABASE_URL` in `backend/.env`

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to Neon (creates tables)
npx prisma db push
```

### Step 5 — Run Development Servers

From the **root** directory:

```bash
npm run dev
```

This starts:
- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:5000

Or run separately:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## 🔑 Environment Variables (Complete Reference)

### Backend — `backend/.env`

```env
# ── DATABASE ─────────────────────────────────────────────────────
# Get from neon.tech (free tier available)
DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# ── JWT ───────────────────────────────────────────────────────────
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-64-char-hex-secret-here"
JWT_EXPIRES_IN="7d"

# ── SERVER ────────────────────────────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ── GOOGLE OAUTH ──────────────────────────────────────────────────
# Setup at: console.cloud.google.com → APIs → Credentials → OAuth 2.0
# Authorized redirect URIs: http://localhost:5173, https://yourdomain.com
GOOGLE_CLIENT_ID="123456789-xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxx"

# ── RAZORPAY ─────────────────────────────────────────────────────
# Get from: dashboard.razorpay.com → Settings → API Keys
# Use test keys for development, live keys for production
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# ── ANTHROPIC (Claude AI) ─────────────────────────────────────────
# Get from: console.anthropic.com → API Keys
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxx"

# ── EMAIL (SMTP) ──────────────────────────────────────────────────
# Option A: Gmail App Password (easy for dev)
#   → Gmail → Security → 2FA → App Passwords → Generate
# Option B: Resend.com (recommended for production — free 3000/month)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=noreply@resumeaipro.in
FROM_NAME="Resumics"

# ── ADMIN ─────────────────────────────────────────────────────────
ADMIN_EMAIL=admin@resumeaipro.in
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
VITE_GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
```

---

## 🌐 Third-Party Service Setup

### 1. Neon (PostgreSQL Database) — FREE
1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create Project → Choose region closest to your server
3. Copy the **connection string** (Pooled connection)
4. Paste into `DATABASE_URL`

### 2. Anthropic Claude AI
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account → API Keys → Create Key
3. Paste into `ANTHROPIC_API_KEY`
4. Add credits (minimum $5 for development)
   - Cost estimate: ~$0.003 per resume generation (Claude Sonnet)
   - 1000 resumes ≈ $3 AI cost

### 3. Razorpay — Payment Gateway
1. Go to [razorpay.com](https://razorpay.com) → Create account
2. Complete KYC (required for live payments)
3. Dashboard → Settings → API Keys
4. For testing: Use **Test Mode** keys (no real money)
5. Test cards:
   - Card: `4111 1111 1111 1111` | CVV: `123` | Expiry: any future
   - UPI: `success@razorpay`

### 4. Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web Application
4. Authorized JavaScript origins:
   - `http://localhost:5173` (dev)
   - `https://yourdomain.com` (prod)
5. Copy Client ID and Secret

### 5. Gmail App Password (for emails)
1. Gmail → Account → Security → 2-Step Verification (enable it)
2. Security → App Passwords → Select app: Mail → Generate
3. Copy 16-char password → paste as `SMTP_PASS`

---

## 🗄️ Database Management

### Push schema changes:
```bash
cd backend
npx prisma db push
```

### View data in browser:
```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Reset database (⚠️ deletes all data):
```bash
npx prisma db push --force-reset
```

### Make yourself admin:
```bash
# After registering your account, run:
cd backend
npx prisma studio
# Find your user → change role to "ADMIN" → Save
```

Or via command:
```bash
node -e "
import('./src/index.js').then(({ prisma }) => 
  prisma.user.update({ 
    where: { email: 'your@email.com' }, 
    data: { role: 'ADMIN' } 
  }).then(console.log)
)
"
```

---

## 🚀 Production Deployment

### Frontend → Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → Select your repo
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Vite`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
6. Deploy → Vercel gives you `https://resumeaipro.vercel.app`

### Backend → Railway (Free $5 credit/month)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo → Set **Root Directory** to `backend`
3. Add all environment variables from `backend/.env`
4. Set `NODE_ENV=production`
5. Set `FRONTEND_URL=https://your-vercel-url.vercel.app`
6. Deploy → Railway gives you `https://resumeai-backend.railway.app`

### Connect Frontend → Backend
After deploying backend, update Vercel env var:
```
VITE_API_URL=https://resumeai-backend.railway.app/api
```

Redeploy frontend.

### Custom Domain (Optional)
1. Vercel: Settings → Domains → Add `resumeaipro.in`
2. Add DNS records at your registrar (GoDaddy/Namecheap):
   - `A` record → Vercel IP
   - `CNAME www` → `cname.vercel-dns.com`

---

## 🔧 Razorpay — Go Live Checklist

Before switching to live payments:

1. **Complete KYC** at Razorpay dashboard
2. **Switch to Live keys** (replace `rzp_test_` with `rzp_live_`)
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Railway env vars
4. Update `VITE_RAZORPAY_KEY_ID` in Vercel env vars
5. Test a real ₹49 payment
6. Set up **Razorpay Webhooks** (optional but recommended):
   - Dashboard → Webhooks → Add webhook
   - URL: `https://your-backend.railway.app/api/payment/webhook`
   - Events: `payment.captured`, `payment.failed`

---

## 📱 Features Implemented

### Core Features ✅
- [x] Multi-step resume builder (7 steps)
- [x] Personal info, education, experience, projects, skills, extras
- [x] 5 ATS-optimized templates (Modern, Software, Fresher, Corporate, Analyst)
- [x] Live ATS score calculation (0-100)
- [x] AI content enhancement via Claude
- [x] Job description matching
- [x] Watermarked preview
- [x] Razorpay payment (₹49)
- [x] PDF download after payment
- [x] User authentication (Email + Google OAuth)
- [x] Dashboard with resume management
- [x] Admin dashboard with stats

### AI Tools ✅
- [x] Cover letter generator
- [x] LinkedIn headline generator
- [x] Interview question predictor

### Marketing ✅
- [x] Urgency popup (shows after 8 seconds)
- [x] Exit-intent popup (on mouse leave)
- [x] Live user counter
- [x] Social proof testimonials
- [x] Countdown timer
- [x] FAQ section
- [x] Mobile responsive

---

## 🛡️ Security Checklist (Production)

- [ ] Change `JWT_SECRET` to a strong 64-char random string
- [ ] Enable HTTPS only (Vercel/Railway do this automatically)
- [ ] Add Razorpay webhook signature verification
- [ ] Set `NODE_ENV=production`
- [ ] Enable CORS only for your frontend domain
- [ ] Rate limiting is already configured
- [ ] Never commit `.env` files to Git

---

## 💰 Revenue Calculation

| Metric | Numbers |
|--------|---------|
| Price per resume | ₹49 |
| AI cost per resume | ~₹0.25 (Claude API) |
| Razorpay fee | ~₹1.47 (2% + ₹0) |
| **Net per resume** | **~₹47.28** |
| 100 downloads/day | ₹4,728/day |
| 3,000 downloads/month | **₹1,41,840/month** |

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify `DATABASE_URL` is correct
- Check Neon dashboard — database may be sleeping (free tier)
- Add `?connect_timeout=60` to the connection string

### "AI generation failing"
- Check `ANTHROPIC_API_KEY` is valid
- Verify you have credits at console.anthropic.com
- Check backend logs: Railway → Deployments → View Logs

### "Payment not working"
- Ensure you're using test keys in development
- Check Razorpay dashboard for failed orders
- Verify webhook URL is accessible

### "Google login not working"
- Check authorized origins include your exact URL (with/without www)
- Ensure `GOOGLE_CLIENT_ID` matches exactly

### CORS errors in browser
- Set `FRONTEND_URL` in backend env to match your exact frontend URL
- No trailing slash

### PDF download blank
- Resume preview element must have `id="resume-preview"`
- Check browser console for html2canvas errors

---

## 📞 Support

- Email: support@resumeaipro.in
- GitHub Issues: github.com/yourusername/resumics/issues

---

## 🗺️ Roadmap

- [ ] Resume version history
- [ ] LinkedIn auto-fill
- [ ] Bulk download
- [ ] Resume analytics (views, clicks)
- [ ] Referral system
- [ ] Mobile app (React Native)
- [ ] WhatsApp bot integration

---

*Built with ❤️ in India | Resumics © 2024*
# resumicsV2
