# Support Ticket Management System

A full-stack support ticket management application built with Laravel 13 (backend), React (frontend), and Filament (admin interface).


## Features

### Customer Interface (React)
- User authentication (register/login)
- View personal support tickets
- Create new support tickets
- View ticket details and status
- Add comments to tickets
- Real-time updates

### Admin Interface (Filament)
- Comprehensive ticket management
- View all support tickets
- Assign tickets to support staff
- Update ticket status and priority
- View and manage customer accounts
- Dashboard with ticket metrics

### Backend API (Laravel)
- RESTful API endpoints
- Sanctum token-based authentication
- Role-based access control (customer, support, admin)
- Ticket management with CRUD operations
- Comment system with nested relationships
- Comprehensive validation and authorization
- Database migrations and factories

## Setup Instructions

### Prerequisites
- PHP 8.3+
- Node.js 18+
- SQLite or MySQL
- Composer
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
composer install
```

3. **Create environment file:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Run migrations:**
```bash
php artisan migrate:fresh
```

5. **Create test users (optional):**
```bash
php artisan tinker
# In tinker shell:
User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password'), 'role' => 'admin']);
User::create(['name' => 'Customer', 'email' => 'customer@example.com', 'password' => bcrypt('password'), 'role' => 'customer']);
```

6. **Start Laravel server:**
```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Start development server:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Admin Setup (Filament)

The admin interface requires additional Filament setup:

```bash
cd backend
php artisan filament:install --panels=admin
php artisan migrate
```

Access admin at: `http://localhost:8000/admin`

## API Endpoints

### Authentication
- `POST /api/register` - Register new customer
- `POST /api/login` - Login user
- `GET /api/me` - Get current user
- `POST /api/logout` - Logout user

### Tickets
- `GET /api/tickets` - List tickets (customers see own, admins see all)
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get ticket details
- `PUT /api/tickets/{id}` - Update ticket (admin/support only)

### Comments
- `POST /api/tickets/{id}/comments` - Add comment to ticket
- `DELETE /api/comments/{id}` - Delete comment

## Testing

### Run Backend Tests

```bash
cd backend
php artisan test
```

Test files are located in `backend/tests/Feature/`:
- `AuthTest.php` - Authentication endpoints
- `TicketTest.php` - Ticket management and authorization

To run specific tests:
```bash
php artisan test tests/Feature/TicketTest.php
```

### Test Coverage

The test suite covers:
- **Authentication**: Registration, login, profile access
- **Authorization**: Customer ticket isolation, admin access
- **Ticket Operations**: Create, read, update with role-based access
- **Comments**: Adding comments, user isolation
- **Error Handling**: Invalid credentials, unauthorized access

## Architecture & Design Decisions

### Backend Architecture

1. **Models**: User, Ticket, Comment with proper relationships
2. **Controllers**: Thin controllers focused on HTTP concerns
3. **Authentication**: Sanctum tokens for stateless API auth
4. **Authorization**: Model-based authorization checks
5. **Validation**: Form requests for data validation (recommended pattern)
6. **Testing**: Feature tests with RefreshDatabase trait

### Frontend Architecture

1. **Context API**: Authentication state management
2. **Hooks**: Custom hooks for API communication
3. **Routing**: React Router for SPA navigation
4. **Styling**: CSS custom properties for theming
5. **Components**: Modular, reusable components
6. **API Integration**: Axios with centralized configuration

### Database Schema

- **users**: Authentication and role management
- **tickets**: Main ticket entity with status/priority
- **comments**: Nested comments under tickets
- **Foreign keys**: Cascading deletes for data integrity

## Security Considerations

1. **Authentication**: Token-based with Sanctum
2. **Authorization**: Model-based access control
3. **Input Validation**: Server-side validation on all endpoints
4. **CORS**: Configured to accept frontend origin
5. **SQL Injection**: Protected by Laravel's query builder
6. **XSS**: React's built-in XSS protection
7. **Password Hashing**: bcrypt via Laravel
8. **HTTPS**: Recommended for production

## Performance Optimization

1. **Eager Loading**: Relations loaded to prevent N+1 queries
2. **Pagination**: Tickets paginated with 20 per page
3. **Caching**: Configured for session management
4. **Lazy Loading**: React components for code splitting
5. **Database Indexing**: Recommended on foreign keys (migrations include)

## Deployment

### Backend (Laravel)

```bash
# Install production dependencies
composer install --no-dev

# Set production environment
APP_ENV=production
APP_DEBUG=false

# Generate key if not done
php artisan key:generate

# Run migrations
php artisan migrate

# Clear caches
php artisan config:cache
php artisan route:cache
```

### Frontend (React)

```bash
# Build for production
npm run build

# Serve static files from /build directory
```

## Troubleshooting

### CORS Issues
Ensure Laravel `cors.php` config includes frontend URL:
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')]
```

### Database Errors
Check SQLite file permissions:
```bash
chmod 666 database/database.sqlite
chmod 755 database/
```

### Authentication Issues
- Verify token in browser localStorage
- Check API `Authorization` headers
- Ensure `.env` has correct API_URL

## Time Investment

- **Total Development Time**: ~2.5 hours
- **Backend Setup**: ~30 minutes (models, migrations, controllers)
- **Frontend Setup**: ~45 minutes (components, pages, styling)
- **Testing**: ~20 minutes (test suite)
- **Documentation**: ~15 minutes (README, comments)

## Future Enhancements

1. Real-time updates with WebSockets
2. File attachments to tickets
3. Email notifications
4. Advanced search and filtering
5. SLA tracking and reporting
6. Knowledge base integration
7. Multi-language support
8. Mobile app
