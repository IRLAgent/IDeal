# CarMarket.ie - Car Marketplace

A responsive car marketplace for buying and selling vehicles in Ireland.

## Project Structure

```
carmarket-ie/
├── frontend/        # Next.js React app
├── backend/         # Express.js API
└── docs/           # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Frontend
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Hosting**: Vercel (frontend), Railway (backend)

## Development

### Frontend Structure
```
frontend/src/
├── app/
│   ├── auth/          # Login/Signup pages
│   ├── search/        # Search results
│   ├── listing/       # Car listing details
│   ├── dashboard/     # Seller dashboard
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Homepage
├── components/        # Reusable components
└── lib/              # Utilities
```

### Backend Structure
```
backend/src/
├── routes/           # API routes
├── controllers/      # Business logic
├── middleware/       # Auth, validation
├── models/          # Data models
└── index.ts         # Entry point
```

## License

MIT
