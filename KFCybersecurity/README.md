# KF Cybersecurity Service Management Platform

A production-ready Next.js application for managing cybersecurity services with role-based access control, authentication, and a PostgreSQL database backend.

## Features

- 🔐 **Authentication** - NextAuth.js v5 with credentials provider
- 👥 **Role-Based Access Control** - Admin and client user roles
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 🎨 **Modern UI** - Tailwind CSS with custom design system
- 🔒 **Secure API** - Protected routes with middleware
- 📊 **Service Management** - Deploy and manage cybersecurity services
- 🏢 **Multi-Tenant** - Support for multiple client organizations

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 20+ 
- PostgreSQL database (local or cloud)
- npm or yarn

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd kfcybersecurity
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
# Database - Update with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/kfcybersecurity?schema=public"

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev --name init

# Seed database with initial data
npx prisma db seed
```

The seed script creates:
- 1 admin user
- 3 client organizations
- 3 client users (one per organization)
- 8 cybersecurity services
- Sample deployments

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the login page.

## Default Credentials

After seeding, use these credentials to log in:

**Admin Account:**
- Email: `admin@kfcyber.com`
- Password: `admin123`

**Client Accounts:**
- Acme Corp: `acme@example.com` / `password123`
- Globex Inc: `globex@example.com` / `password123`
- Soylent Corp: `soylent@example.com` / `password123`

## User Roles

### Admin
- View and manage all clients
- Deploy/remove services for any client
- Create new clients and services
- Full system access

### Client
- View only their organization's services
- Deploy/remove services for their account
- Cannot access other clients' data

## API Routes

All API routes require authentication. Admin-only routes are marked with 🔒.

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Clients 🔒
- `GET /api/clients` - List all clients (admin only)
- `POST /api/clients` - Create client (admin only)

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service (admin only) 🔒

### Deployments
- `GET /api/deployments?clientId={id}` - Get deployments (filtered by role)
- `POST /api/deployments` - Deploy service
- `DELETE /api/deployments?clientId={id}&serviceId={id}` - Remove deployment

## Database Schema

### User
- Authentication credentials
- Role (ADMIN or CLIENT)
- Linked to a client organization (for client users)

### Client
- Organization information
- Has multiple users and deployments

### Service
- Cybersecurity service details
- Organized by NIST vertical (Identify, Protect, Detect, Respond, Recover, Govern)

### Deployment
- Junction table linking clients to services
- Tracks which services are deployed for each client

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create new migration
npx prisma db seed         # Seed database
npx prisma generate        # Regenerate Prisma client
```

## Production Deployment

### Prerequisites
1. PostgreSQL database (e.g., Supabase, Railway, Neon)
2. Set environment variables on hosting platform
3. Run database migrations

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configure environment variables in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `NODE_ENV=production`

### Post-Deployment

1. Run migrations on production database:
```bash
npx prisma migrate deploy
```

2. Seed production database (optional):
```bash
npx prisma db seed
```

3. Update admin password immediately after first login

## Security Considerations

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT-based session management
- ✅ Protected API routes with middleware
- ✅ Role-based authorization on all endpoints
- ✅ CSRF protection (NextAuth built-in)
- ⚠️ Change default credentials immediately
- ⚠️ Use strong `NEXTAUTH_SECRET` in production
- ⚠️ Enable HTTPS in production

## Project Structure

```
kfcybersecurity/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── clients/      # Client management
│   │   ├── services/     # Service management
│   │   └── deployments/  # Deployment management
│   ├── dashboard/        # Dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── api-auth.ts      # API authorization utilities
│   ├── prisma.ts        # Prisma client
│   └── useAppState.ts   # State management hook
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
├── types/               # TypeScript types
└── middleware.ts        # Route protection
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
