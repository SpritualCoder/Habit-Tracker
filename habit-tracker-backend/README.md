# Backend API

A Node.js backend application built with Express.js and MongoDB.

# Backend Deployed of Render

The application is deployed on Render and can be accessed here: https://habit-tracker-4j22.onrender.com

---

### 📝 Important Note on Performance

This backend is deployed on **Render's free plan**. Please note the following:

- **Initial Startup Time:** Render's free services "spin down" after 15 minutes of inactivity. If you are the first person to make a request after a period of inactivity, the server may take **50-60 seconds to wake up** and process your request.
- **Subsequent Requests:** Once the server is active, subsequent requests will be much faster.

Please be patient on the first request! The server will start up automatically.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- RESTful API endpoints
- MongoDB database integration
- Environment-based configuration
- Error handling middleware
- CORS enabled
- JSON request/response handling

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)

## Installation

1. Navigate to the backend directory:

   ```bash
   cd habit-tracker-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the backend root directory and add the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your-database-name
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/database-name

# Server Configuration
PORT=5000
NODE_ENV=production

# Add other environment variables as needed
# JWT_SECRET=your-jwt-secret-key
# API_KEY=your-api-key
```

### Environment Variables Description:

- `MONGODB_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET` : Your JWT secret key
- `PORT`: Port number for the server (default: 5000)
- `NODE_ENV`: Application environment (development/production)

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start running at `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Available Endpoints

### Authentication Endpoints

```
POST   /api/auth/register   - Register a new user
POST   /api/auth/login      - Login user and get token
GET    /api/auth/me         - Get current authenticated user
PUT    /api/auth/profile    - Update user profile
```

### Habit Management Endpoints

```
GET    /api/habits          - Get all habits for authenticated user
GET    /api/habits/:id      - Get single habit by ID
POST   /api/habits          - Create a new habit
PUT    /api/habits/:id      - Update existing habit
DELETE /api/habits/:id      - Delete a habit
POST   /api/habits/:id/complete - Mark habit as complete for today
```

### Friends/Social Endpoints

```
GET    /api/friends/search          - Search users by name or email
POST   /api/friends/follow/:userId  - Follow a user
DELETE /api/friends/unfollow/:userId - Unfollow a user
GET    /api/friends/following       - Get list of users current user follows
GET    /api/friends/followers       - Get list of current user's followers
```

### Feed/Activity Endpoints

```
GET    /api/feed               - Get activity feed of followed users
GET    /api/feed/leaderboard   - Get leaderboard ranking by streaks
GET    /api/feed/stats         - Get overall statistics
```

### System Endpoints

```
GET    /                       - API welcome message
```

## Project Structure

```
habit-tracker-backend/
├── config/                 # Configuration files
│   └── db.js              # Database connection configuration
├── middleware/             # Custom middleware
│   └── auth.js            # JWT authentication middleware
├── models/                # Database models (Mongoose schemas)
│   ├── User.js            # User model with authentication
│   ├── Habit.js           # Habit model with categories and streaks
│   └── HabitCompletion.js # Habit completion tracking model
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   ├── habits.js          # Habit management routes
│   ├── friends.js         # Social features routes
│   └── feed.js            # Activity feed and leaderboard routes
├── .env                   # Environment variables (not in git)
├── .gitignore             # Git ignore file
├── package.json           # NPM package configuration
├── package-lock.json      # NPM lock file
└── server.js              # Main server file and app configuration
```

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **nodemon** - Development server (dev dependency)

## Contact

For any questions or issues, please contact [adityarajmathur@gmail.com]

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. The `.env` file should be listed in your `.gitignore` file.
