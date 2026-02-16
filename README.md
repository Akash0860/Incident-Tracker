# Incident Tracker Mini App

A full-stack web application for managing production incidents with server-side pagination, filtering, sorting, and CRUD operations.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: React, React Router
- **HTTP Client**: Axios

## Features

✅ Create incidents with validation  
✅ Browse incidents with server-side pagination  
✅ Search incidents by title/summary (debounced)  
✅ Filter by service and status  
✅ Sort by title, severity, status, created date, and owner  
✅ View and edit incident details  
✅ Database seeding with 200+ records  
✅ Responsive UI matching design mockups

## Project Structure

```
incident-tracker/
├── backend/
│   ├── config/
│   │   └── database.js              # PostgreSQL connection and table setup
│   ├── controllers/
│   │   └── incidentController.js    # Business logic for incidents
│   ├── middleware/
│   │   └── validation.js            # Request validation middleware
│   ├── routes/
│   │   └── incidents.js             # API route definitions
│   ├── scripts/
│   │   └── seed.js                  # Database seeding script
│   ├── server.js                    # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IncidentList.js      # Main list view with pagination
│   │   │   ├── IncidentDetail.js    # Detail/edit view
│   │   │   └── CreateIncident.js    # Create new incident form
│   │   ├── App.js
│   │   ├── App.css
│   │   └── api.js                   # API client
│   └── package.json
└── README.md
```

## API Overview

### Endpoints

#### `POST /api/incidents`
Create a new incident.

**Request Body:**
```json
{
  "title": "string (required)",
  "service": "string (required)",
  "severity": "SEV1 | SEV2 | SEV3 | SEV4 (required)",
  "status": "OPEN | MITIGATED | RESOLVED (required)",
  "owner": "string (optional)",
  "summary": "string (optional)"
}
```

**Response:** `201 Created` with incident object

---

#### `GET /api/incidents`
Fetch paginated incidents with filtering and sorting.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `search` (string) - Search in title and summary
- `services` (comma-separated) - Filter by services (e.g., "Auth,Backend")
- `statuses` (comma-separated) - Filter by statuses (e.g., "OPEN,RESOLVED")
- `sortBy` (string, default: "created_at") - Column to sort by
- `sortOrder` (string, default: "DESC") - Sort direction (ASC/DESC)

**Response:**
```json
{
  "incidents": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 200,
    "totalPages": 20
  }
}
```

---

#### `GET /api/incidents/:id`
Get a single incident by ID.

**Response:** `200 OK` with incident object

---

#### `PATCH /api/incidents/:id`
Update an incident.

**Request Body:** (all fields optional)
```json
{
  "title": "string",
  "service": "string",
  "severity": "SEV1 | SEV2 | SEV3 | SEV4",
  "status": "OPEN | MITIGATED | RESOLVED",
  "owner": "string",
  "summary": "string"
}
```

**Response:** `200 OK` with updated incident object

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```bash
psql -U postgres
CREATE DATABASE incident_tracker;
\q
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL credentials:
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=incident_tracker
DB_PASSWORD=your_password
DB_PORT=5432
```

5. The server will automatically create the `incidents` table on startup

6. Seed the database with sample data:
```bash
npm run seed
```

7. Start the backend server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## Design Decisions & Tradeoffs

### Backend

**1. Architecture**
- MVC pattern with separation of concerns
- Controllers handle business logic
- Routes define API endpoints
- Middleware for validation and error handling
- Config folder for database and environment setup

**2. Database Design**
- Used UUID for primary keys to ensure uniqueness across distributed systems
- Added indexes on `service`, `status`, `severity`, and `created_at` for faster queries
- Enforced data integrity with CHECK constraints for severity and status values
- Separate `created_at` and `updated_at` timestamps for audit trail

**3. API Design**
- RESTful endpoints following standard conventions
- Server-side pagination to handle large datasets efficiently
- Parameterized queries ($1, $2, etc.) to prevent SQL injection
- Dynamic WHERE clause building for flexible filtering
- Validation middleware to ensure data integrity
- Whitelisted sortBy columns for additional security

**4. Performance Optimizations**
- Database indexes on frequently queried columns
- Efficient pagination using LIMIT and OFFSET
- Connection pooling with pg module
- Query parameter validation

**Tradeoffs:**
- Used raw SQL instead of an ORM for better performance and control
- Simple validation instead of a schema validation library (like Joi)
- No authentication/authorization (out of scope for mini app)
- Monolithic structure (could be microservices at scale)

### Frontend

**1. Component Structure**
- Separated concerns: List, Detail, and Create components
- Reusable API service layer
- CSS modules for component-specific styles

**2. User Experience**
- Debounced search (500ms) to reduce API calls
- Loading states for better feedback
- Clickable table rows for easy navigation
- Responsive design for various screen sizes
- Real-time filter updates

**3. State Management**
- Used React hooks (useState, useEffect, useCallback)
- No Redux/Context needed for this scale
- Local state management sufficient for current requirements

**Tradeoffs:**
- Inline styles in some places for quick styling
- No advanced error handling/retry logic
- Basic form validation (could use Formik/React Hook Form)
- No optimistic updates

---

## Improvements with More Time

### Backend
1. **Advanced Features**
   - Implement authentication/authorization (JWT)
   - Add role-based access control (RBAC)
   - Implement rate limiting
   - Add request logging and monitoring
   - Set up error tracking (Sentry)

2. **Performance**
   - Implement Redis caching for frequently accessed data
   - Add database query optimization and query plan analysis
   - Implement connection pooling tuning
   - Add API response compression

3. **Testing**
   - Unit tests for API endpoints
   - Integration tests with test database
   - Load testing for pagination endpoints
   - API documentation with Swagger/OpenAPI

4. **Data Management**
   - Soft delete instead of hard delete
   - Audit log for all changes
   - Bulk operations support
   - Export functionality (CSV, Excel)

### Frontend
1. **UX Enhancements**
   - Advanced filtering UI (date range picker)
   - Bulk actions (select multiple incidents)
   - Inline editing in table view
   - Drag-and-drop for priority management
   - Real-time updates with WebSockets

2. **Performance**
   - Implement virtual scrolling for large lists
   - Add skeleton loaders
   - Optimize re-renders with React.memo
   - Lazy loading for routes

3. **Features**
   - Comments/activity feed on incidents
   - File attachments
   - Notifications system
   - Dark mode support
   - Keyboard shortcuts

4. **Testing**
   - Unit tests with Jest
   - Component tests with React Testing Library
   - E2E tests with Cypress/Playwright
   - Accessibility testing

### DevOps
1. **Deployment**
   - Docker containerization
   - CI/CD pipeline (GitHub Actions)
   - Environment-specific configurations
   - Automated database migrations

2. **Monitoring**
   - Application performance monitoring (APM)
   - Error tracking and alerting
   - Database query performance monitoring
   - User analytics

---

## Database Schema

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  service VARCHAR(100) NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('SEV1', 'SEV2', 'SEV3', 'SEV4')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('OPEN', 'MITIGATED', 'RESOLVED')),
  owner VARCHAR(255),
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_incidents_service ON incidents(service);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
```

---

## License

MIT

---

## Author

Built as a technical assessment project demonstrating full-stack development skills.
