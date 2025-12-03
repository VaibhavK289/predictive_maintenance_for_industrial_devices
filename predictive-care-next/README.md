# PredictiveCare - Next.js

A beautiful, modern **predictive maintenance dashboard** built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. This application provides real-time monitoring, ML-powered analytics, and smart alerts for industrial equipment maintenance.

## ✨ Features

- 🏠 **Beautiful Landing Page** - Modern hero section with animated elements and statistics
- 📊 **Real-time Dashboard** - Live sensor data visualization with Chart.js
- 🔔 **Smart Alerts** - Categorized alert system with severity levels
- 📈 **ML-Powered Analytics** - Prediction scores and failure risk indicators
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🎨 **Modern UI/UX** - Glassmorphism effects, smooth animations with Framer Motion
- 🌐 **API Routes** - Built-in backend with Next.js API routes
- 🗄️ **PostgreSQL Integration** - Ready for production database connection

## 🚀 Pages

| Page | Description |
|------|-------------|
| `/` | Home page with hero, features, and CTA sections |
| `/features` | Detailed feature showcase with specifications |
| `/about` | Company information, team, and timeline |
| `/dashboard` | Real-time machine monitoring dashboard |
| `/contact` | Contact form and company information |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Database**: PostgreSQL (via `pg`)

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd predictive_maintenance/predictive-care-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   # Option 1: Connection string (recommended)
   DATABASE_URL=postgresql://user:password@host:5432/database
   
   # Option 2: Individual credentials
   PG_HOST=your-host
   PG_USER=your-user
   PG_DATABASE=your-database
   PG_PASSWORD=your-password
   PG_PORT=5432
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
predictive-care-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sensors/      # Sensor data API
│   │   │   └── stats/        # Statistics API
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   ├── dashboard/        # Dashboard page
│   │   ├── features/         # Features page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AlertPanel.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── LiveChart.tsx
│   │   │   ├── MachineSelector.tsx
│   │   │   └── MachineStatus.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── lib/
│       └── db.ts             # Database connection & queries
├── public/
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sensors` | GET | Fetch all sensor data |
| `/api/stats` | GET | Fetch dashboard statistics |

## 🎨 Design System

### Colors
- **Primary**: Blue-600 (#3B82F6) to Indigo-600 (#4F46E5)
- **Success**: Emerald-500 (#10B981)
- **Warning**: Amber-500 (#F59E0B)
- **Error**: Red-500 (#EF4444)

### Typography
- Font: Geist Sans (system font)
- Headings: Bold, gradient text effects
- Body: Regular, gray-600

## 🗃️ Database Schema

The application expects a PostgreSQL table called `process_data`:

```sql
CREATE TABLE process_data (
  id SERIAL PRIMARY KEY,
  type_h INTEGER,
  type_l INTEGER,
  type_m INTEGER,
  tool_wear INTEGER,
  rotation_speed INTEGER,
  torque DECIMAL,
  air_temp DECIMAL,
  process_temp DECIMAL,
  temp_diff DECIMAL,
  power DECIMAL,
  prediction_label INTEGER,
  prediction_score DECIMAL
);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📈 Performance

- ⚡ Turbopack for fast development
- 🖼️ Optimized images with Next.js Image
- 📦 Code splitting by default
- 🎯 Server-side rendering for SEO

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by the PredictiveCare Team
