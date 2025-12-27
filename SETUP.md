# CarMarket.ie - Setup & Installation Guide

## ✅ Project Created

Your complete car marketplace project has been created at:
```
C:\Local\IDeal\carmarket-ie\
```

## 📁 Project Structure

```
carmarket-ie/
├── frontend/                 # Next.js React app (Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── layout.tsx    # Main layout
│   │   │   ├── globals.css   # Global styles
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── search/       # Search results page
│   │   │   ├── listing/
│   │   │   │   └── [id]/     # Individual listing detail
│   │   │   └── dashboard/    # Seller dashboard
│   │   └── components/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                  # Express.js API (Port 5000)
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── routes/
│   │   │   ├── auth.ts       # Auth endpoints
│   │   │   ├── cars.ts       # Car CRUD endpoints
│   │   │   └── messages.ts   # Messaging endpoints
│   │   ├── controllers/
│   │   │   ├── auth.ts       # Auth logic
│   │   │   ├── car.ts        # Car logic
│   │   │   └── message.ts    # Message logic
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT authentication
│   │   └── models/
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Step 1: Navigate to Project

```powershell
cd C:\Local\IDeal\carmarket-ie
```

### Step 2: Install Frontend Dependencies

```powershell
cd frontend
npm install
```

This will install:
- Next.js
- React 18
- TypeScript
- Tailwind CSS
- ESLint

### Step 3: Start Frontend

```powershell
npm run dev
```

✅ Frontend will be available at: **http://localhost:3000**

### Step 4: Install Backend Dependencies (New Terminal)

```powershell
cd backend
npm install
```

This will install:
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL driver
- JWT authentication
- CORS

### Step 5: Start Backend

```powershell
npm run dev
```

✅ Backend will be available at: **http://localhost:5000**
✅ Health check: **http://localhost:5000/api/health**

---

## 🗄️ Database Setup

The project uses **PostgreSQL** with **Prisma ORM**.

### Option A: Use Railway (Recommended for MVP)

1. Sign up at [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host:port/database"
   ```

### Option B: Local PostgreSQL

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. Create a database:
   ```sql
   CREATE DATABASE carmarket_dev;
   ```
3. Update `backend/.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/carmarket_dev"
   ```

### Run Database Migrations

```powershell
cd backend
npm run prisma:migrate
```

This will create all tables from the schema.

### View Database (Optional)

```powershell
npm run prisma:studio
```

Opens a visual database browser at http://localhost:5555

---

## 📝 Frontend Pages Created

### Homepage (`/`)
- Search bar with Make, Model, Price, Location
- Quick links to browse categories
- Featured listings grid
- Responsive mobile design

### Search (`/search`)
- Advanced filtering sidebar
- Listing results grid
- Sorting options (price, newest, mileage)
- Pagination

### Listing Detail (`/listing/[id]`)
- Image gallery
- Full car specifications
- Seller information
- Messaging form
- Similar listings

### Authentication
- **Sign Up** (`/auth/signup`): Create buyer/seller account
- **Sign In** (`/auth/login`): Login with email/password

### Dashboard (`/dashboard`)
- Seller statistics (views, messages, listings)
- My Listings management
- Messages inbox
- Account settings

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### Cars
```
GET    /api/cars                  # List all cars with filters
GET    /api/cars/:id              # Get single car
POST   /api/cars                  # Create car (auth required)
PUT    /api/cars/:id              # Update car (auth required)
DELETE /api/cars/:id              # Delete car (auth required)
GET    /api/cars/user/listings    # Get user's listings (auth required)
```

### Messages
```
POST   /api/messages              # Send message (auth required)
GET    /api/messages              # Get user's messages (auth required)
GET    /api/messages/:userId      # Get conversation (auth required)
PATCH  /api/messages/:id/read     # Mark as read (auth required)
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

### How it Works:
1. User registers/logs in
2. Backend returns a JWT token
3. Client stores token (localStorage)
4. For protected routes, send: `Authorization: Bearer <token>`
5. Backend validates token in middleware

### Token Expiry: 24 hours

---

## 🛠️ Available Scripts

### Frontend
```powershell
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Backend
```powershell
npm run dev                    # Start dev server (port 5000)
npm run build                  # Compile TypeScript to JavaScript
npm start                      # Run compiled code
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Run migrations
npm run prisma:studio          # Open database UI
```

---

## 📦 Environment Variables

### Backend (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/database"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
```

### Frontend (.env.local - optional)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ✨ Features Implemented

### MVP Phase 1 Features:
- ✅ User registration & login (with JWT)
- ✅ Create/edit/delete car listings
- ✅ Search & filter cars (make, model, price, location)
- ✅ View listing details
- ✅ Messaging system between buyers/sellers
- ✅ Seller dashboard
- ✅ Responsive mobile design (Tailwind CSS)
- ✅ Database schema (Prisma)
- ✅ API endpoints
- ✅ Error handling

### TODO (Next Phase):
- [ ] Connect frontend to backend API
- [ ] Image upload (Cloudinary)
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced filters
- [ ] Seller reviews/ratings
- [ ] Vehicle history check
- [ ] Deployment (Vercel + Railway)

---

## 🐛 Troubleshooting

### Frontend won't start
```powershell
# Clear cache
rm -r .next
rm -r node_modules
npm install
npm run dev
```

### Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill process: taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Database connection error
```
DATABASE_URL is invalid or database is not running
- Check PostgreSQL is installed and running
- Verify connection string in .env
- Try local database first
```

### TypeScript errors
```powershell
npm install --save-dev @types/node
npm run prisma:generate
```

---

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Railway](https://railway.app)
- [Vercel](https://vercel.com)

---

## 🚀 Next Steps

1. **Install dependencies** (follow Quick Start above)
2. **Set up database** (PostgreSQL local or Railway)
3. **Connect Frontend to Backend** (create API service layer)
4. **Implement authentication flow** (localStorage, context)
5. **Add image upload** (Cloudinary integration)
6. **Test API endpoints** (Postman/Insomnia)
7. **Deploy to production** (Vercel + Railway)

---

## 💡 Development Tips

- Keep backend running in one terminal
- Keep frontend running in another terminal
- Use browser DevTools to debug
- Check Network tab for API calls
- Use Prisma Studio to view database
- Test API with Postman before frontend

---

**You're ready to start building! 🎉**

For questions or issues, check the docs links above or create a GitHub issue.
