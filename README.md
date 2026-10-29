# MessMatch

MessMatch is a modern campus and corporate dining marketplace designed to bridge educational institutions, universities, and corporate enterprises with verified commercial mess contractors.

The platform streamlines institutional dining procurement through competitive tender auctions, interactive culinary menu showcases, real-time messaging, and bilateral digital contract workflows.

---

## Key Features

- **Tender Bidding & Reverse Auctions**: Institutions publish dining specifications; verified contractors submit competitive per-meal bids with real-time bid tracking and winner selection.
- **Contractor Menu & Service Showcase**: Commercial caterers showcase custom breakfast, lunch, and dinner menus, dietary classifications (Veg, Non-Veg, Both), team capacity, and regional service categories.
- **Bilateral Digital Contract Management**: Issue digital contracts upon tender award, negotiate terms, execute bilateral electronic acceptances, and manage lifecycle states.
- **Real-Time Direct Messaging**: Instant private communication powered by WebSockets for direct discussions between institutions and catering vendors.
- **Role-Based Access Control (RBAC)**: Strict role separation between Institutions and Contractors, with shared viewing routes for tenders and menus.
- **Demo Evaluation Mode**: Integrated one-click evaluation access with protected credential safety guards for reviewers.

---

## System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (Next.js 15)"]
        UI["Tailwind CSS + Framer Motion UI"]
        AuthClient["NextAuth.js (Session & JWT)"]
        WSClient["WebSocket Client (Socket.io)"]
    end

    subgraph Server["Backend API (Express & TypeScript)"]
        Endpoints["REST API Controllers (/api/v1)"]
        AuthMiddleware["JWT Authentication & RBAC Middleware"]
        WSServer["WebSocket Server (Socket.io)"]
    end

    subgraph Database["Persistence Layer"]
        Prisma["Prisma ORM"]
        Postgres[("PostgreSQL Database")]
    end

    UI --> Endpoints
    AuthClient -. Token Exchange .-> AuthMiddleware
    WSClient <--> WSServer
    Endpoints --> AuthMiddleware
    AuthMiddleware --> Prisma
    Prisma --> Postgres
```

### Procurement & Contract Lifecycle

```mermaid
flowchart LR
    A["1. Institution Publishes Tender"] --> B["2. Contractors Submit Bids"]
    B --> C["3. Institution Declares Winner"]
    C --> D["4. Draft Digital Contract"]
    D --> E["5. Mutual Bilateral Acceptance"]
    E --> F["6. Active Dining Agreement"]
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js (JWT-based credentials strategy)
- **Networking & Real-Time**: Axios, Socket.io-client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-Time Engine**: Socket.io
- **Validation**: Zod
- **Security**: Bcrypt, JSON Web Tokens (JWT)

### Database & Infrastructure
- **Database**: PostgreSQL
- **ORM**: Prisma ORM

---

## Project Structure

```text
MessMatch/
├── client/                     # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App Router pages and API routes
│   │   ├── components/         # Reusable UI, chat, and dashboard components
│   │   ├── context/            # WebSocket and Toast contexts
│   │   ├── lib/                # Utility helpers and demo account rules
│   │   └── middleware.ts       # Route protection & role-based redirects
│   └── package.json
│
├── server/                     # Express.js REST & WebSocket backend
│   ├── prisma/                 # Prisma schema and database migrations
│   ├── src/
│   │   ├── controllers/        # Request handlers (auctions, contracts, chat, etc.)
│   │   ├── middlewares/        # Authentication, authorization, and role guards
│   │   ├── routes/             # API route definitions
│   │   ├── utils/              # Password hashing, Prisma client, demo helpers
│   │   └── index.ts            # Application bootstrap & Socket.io server
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18.18.0 or higher recommended)
- npm, pnpm, or yarn
- PostgreSQL database instance (local or hosted like Neon / Supabase)

---

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   PORT=4000
   BASE_URL=/api/v1
   DATABASE_URL="postgresql://username:password@localhost:5432/messmatch?sslmode=prefer"
   FRONTEND_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_jwt_secret_key_here
   ```

4. Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will be available at `http://localhost:4000/api/v1`.

---

### 2. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `client` directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_jwt_secret_key_here
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/api/v1
   NEXT_PUBLIC_WS_URL=http://localhost:4000

   DEMO_CONTRACTOR_EMAIL=testcontractor@gmail.com
   DEMO_CONTRACTOR_PASSWORD=DemoPassword123
   DEMO_INSTITUTION_EMAIL=testinstitution@gmail.com
   DEMO_INSTITUTION_PASSWORD=DemoPassword123
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

### 3. Production Build

To verify production builds:

```bash
# Build server
cd server
npm run build

# Build client
cd ../client
npm run build
```

---

## Demo Accounts

For demonstration and reviewer evaluation, the platform includes preconfigured demo credentials accessible via the login interface:

- **Institution Demo**: Experience publishing dining tenders, reviewing contractor bids, declaring winners, and drafting contracts.
- **Contractor Demo**: Experience browsing open institutional tenders, submitting meal bids, managing multi-course menus, and accepting contract agreements.

*Note: Demo accounts operate in a protected read-only state for profile credentials to preserve access for all reviewers.*

---

## License

This project is licensed under the MIT License.
