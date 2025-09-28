# Store Rating App - Backend

This is the backend service for the Store Rating Application, built with Node.js, Express, and MySQL using Sequelize ORM.

## Features

- User authentication (JWT)
- Role-based access control (Admin, Store Owner, Regular User)
- RESTful API endpoints
- Input validation
- Database migrations and seeding
- Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-app/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_db
   DB_PORT=3306
   ```

4. **Set up the database**
   ```bash
   # Create the database
   npm run db:create
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data (optional)
   npm run db:seed
   ```

## Running the Application

### Development
```bash
# Start the development server with hot-reload
npm run dev
```

### Production
```bash
# Build the application
npm install --production

# Start the production server
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/update-password` - Update user password

### Admin Endpoints
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/add-user` - Add a new user (Admin only)
- `GET /api/admin/users` - List all users with pagination
- `POST /api/admin/add-store` - Add a new store
- `GET /api/admin/stores` - List all stores with filtering and pagination

### User Endpoints
- `GET /api/user/stores` - List all stores with search and pagination
- `GET /api/user/stores/search` - Search stores by name or address
- `POST /api/user/ratings` - Submit a new rating
- `PUT /api/user/ratings/:id` - Update a rating

### Store Owner Endpoints
- `GET /api/owner/my-store` - Get store details and ratings
- `PUT /api/owner/my-store` - Update store information
- `GET /api/owner/my-store/statistics` - Get rating statistics

## Database Schema

### Users
- id (PK)
- name
- email (unique)
- password (hashed)
- address
- role (enum: 'admin', 'owner', 'user')
- createdAt
- updatedAt

### Stores
- id (PK)
- name
- email (unique)
- address
- avg_rating
- owner_id (FK to Users)
- createdAt
- updatedAt

### Ratings
- id (PK)
- user_id (FK to Users)
- store_id (FK to Stores)
- rating_value (1-5)
- comment
- createdAt
- updatedAt

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Deployment

1. Set up a production database
2. Update environment variables in production
3. Build the application
4. Use a process manager like PM2 to run the application

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.
