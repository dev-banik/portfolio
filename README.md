# Parthib Banik — Full-Stack Portfolio

A production-ready portfolio website built with **Next.js 15** (frontend) and **ASP.NET Core 8** (backend), featuring a full admin dashboard and PostgreSQL via Neon.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | ASP.NET Core 8, Clean Architecture, EF Core 9 |
| Database | PostgreSQL (Neon free tier) |
| Auth | JWT + Refresh Tokens, BCrypt |
| ORM | Entity Framework Core + Npgsql |
| State | Zustand (client), AutoMapper (server) |
| Validation | FluentValidation |
| Logging | Serilog |

## Project Structure

```
Portfolio/
├── backend/
│   └── src/
│       ├── Portfolio.Domain/        # Entities, base classes
│       ├── Portfolio.Application/   # DTOs, interfaces, services
│       ├── Portfolio.Infrastructure/# EF Core, repositories, migrations
│       └── Portfolio.API/           # Controllers, middleware, Program.cs
├── frontend/
│   └── src/
│       ├── app/                     # Next.js App Router pages
│       │   ├── page.tsx             # Home (all sections)
│       │   ├── projects/            # Public projects listing + detail
│       │   ├── blog/                # Public blog listing + detail
│       │   └── admin/               # Admin dashboard (CRUD all sections)
│       ├── components/
│       │   ├── public/              # Hero, About, Skills, Experience, etc.
│       │   └── shared/              # Navbar, Footer
│       ├── hooks/                   # useData generic fetch hook
│       ├── lib/                     # api.ts (Axios), utils.ts
│       ├── store/                   # Zustand auth store
│       └── types/                   # TypeScript interfaces
├── docker-compose.yml
└── .env.example
```

## Quick Start (Local Development)

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- PostgreSQL (or a [Neon](https://neon.tech) account)

### 1. Clone and configure

```bash
git clone <repo-url>
cd Portfolio
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL=postgresql://user:pass@host/portfolio?sslmode=require
JWT_SECRET=your-32-char-minimum-secret-key
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Backend setup

```bash
cd backend

# Update appsettings.json with your Neon connection string
# Or set environment variables

# Run migrations (creates all tables + seeds data)
dotnet ef database update -p src/Portfolio.Infrastructure -s src/Portfolio.API

# Start the API
dotnet run --project src/Portfolio.API
# → Runs on http://localhost:5000
# → Swagger UI: http://localhost:5000/swagger
```

### 3. Frontend setup

```bash
cd frontend
cp .env.local.example .env.local  # or create manually
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

npm install
npm run dev
# → Runs on http://localhost:3000
```

### 4. Admin access

Default admin credentials (seeded):
- **Email:** `admin@portfolio.com`
- **Password:** `Admin@123456`

Navigate to `http://localhost:3000/admin` to access the dashboard.

> **Important:** Change the admin password immediately after first login via Settings → Change Password.

## Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string from the dashboard
4. Update `ConnectionStrings:DefaultConnection` in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=ep-xxxx.us-east-1.aws.neon.tech;Database=portfolio;Username=user;Password=pass;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

The app auto-migrates and seeds on startup.

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-api.railway.app`
4. Deploy

### Backend → Railway

1. Create new project at [Railway](https://railway.app)
2. Connect GitHub repo, select `/backend` as root
3. Set environment variables:
   ```
   ConnectionStrings__DefaultConnection=<neon-connection-string>
   JwtSettings__Secret=<32-char-secret>
   AllowedOrigins__0=https://your-portfolio.vercel.app
   ```
4. Railway auto-detects the Dockerfile and deploys

### Docker Compose (Self-hosted)

```bash
cp .env.example .env
# Edit .env with your values

docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## API Endpoints

| Resource | Public | Admin |
|---|---|---|
| Profile | GET /profile | PUT /profile |
| Skills | GET /skills, /skills/categories | POST/PUT/DELETE |
| Experience | GET /experience | POST/PUT/DELETE |
| Education | GET /education | POST/PUT/DELETE |
| Projects | GET /projects, /projects/{slug} | POST/PUT/DELETE |
| Blog | GET /blog, /blog/{slug} | POST/PUT/DELETE |
| Certifications | GET /certifications | POST/PUT/DELETE |
| Testimonials | GET /testimonials | POST/PUT/DELETE |
| Contact | POST /contact | GET /contact |
| Navigation | GET /navigation | POST/PUT/DELETE |
| Site Config | GET /site-config/public | GET/PUT /site-config |
| Auth | POST /auth/login, /auth/refresh | POST /auth/logout, /auth/change-password |
| Upload | — | POST /upload, DELETE /upload/{filename} |

Full API documentation available at `/swagger` when running in Development mode.

## Admin Dashboard Sections

- **Dashboard** — Stats overview (projects, blogs, messages, certifications)
- **Profile** — Personal info, bio, SEO metadata, availability
- **Skills** — Categories and skills with percentage/icon
- **Experience** — Work history timeline
- **Education** — Academic background
- **Projects** — Portfolio projects with categories, tech stack, links
- **Blog** — Write and publish articles (Markdown supported)
- **Certifications** — Professional certifications
- **Testimonials** — Client reviews with star ratings
- **Contact** — View and manage contact messages
- **Navigation** — Site menu structure with ordering
- **Settings** — Site config, social links, change password

## Environment Variables Reference

### Backend (`appsettings.json` / environment)

| Variable | Description |
|---|---|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `JwtSettings__Secret` | JWT signing key (min 32 chars) |
| `JwtSettings__Issuer` | Token issuer (default: `portfolio-api`) |
| `JwtSettings__Audience` | Token audience (default: `portfolio-client`) |
| `JwtSettings__ExpiryMinutes` | Access token lifetime (default: `60`) |
| `AllowedOrigins__0` | Frontend URL for CORS |

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## License

MIT
