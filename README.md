# Job Board API

A RESTful API for managing job postings built with Express.js, TypeScript, and MySQL.

## Prerequisites

- Node.js (v18 or higher)
- Docker
- npm

## Local Development Setup

### 1. Start MySQL Container

```bash
docker run --name mysql-job-board \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=jobsdb \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=password \
  -p 3306:3306 \
  -d mysql:8.0
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql://user:password@localhost:3306/jobsdb"
PORT=3000
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Start Development Server

```bash
ts-node index.ts
```

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api-docs`

## Available API Endpoints

- `GET /api/v1/jobs` - List all jobs
- `POST /api/v1/jobs` - Create a new job
- `GET /api/v1/jobs/:id` - Get a specific job
- `PUT /api/v1/jobs/:id` - Update a job
- `DELETE /api/v1/jobs/:id` - Delete a job
- `GET /api/v1/jobs/latest` - Get latest jobs
- `GET /api/v1/jobs/search` - Search jobs
- `GET /api/v1/jobs/stats` - Get job statistics

## Development Commands

- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
