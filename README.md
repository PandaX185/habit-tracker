# 🎯 Gamified Habit Tracker API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A comprehensive REST API for a gamified habit tracking application built with NestJS, featuring user authentication, habit management, XP rewards, streak tracking, badge system, competitive challenges, and background job scheduling.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google OAuth">
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Gamification System](#gamification-system)
- [Background Jobs](#background-jobs)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Google OAuth 2.0 integration** for seamless login
- **Dual authentication** - support both traditional and OAuth login
- **Account linking** - automatically link Google accounts to existing users

### 🎯 Habit Management

- **CRUD operations** for habits with full user isolation
- **Custom repetition intervals** (days, weeks, months)
- **Flexible scheduling** with intelligent deadline calculation
- **Habit completion tracking** with timestamp recording

### 🏆 Badge System

- **Achievement badges** with different rarities (Common, Rare, Epic, Legendary)
- **Multiple badge types**: Streak, Level, Habit Count, Category, Social, Consistency, Competitive
- **XP rewards** for earning badges
- **Progress tracking** for unearned badges
- **Automatic badge checking** on relevant actions

### ⚔️ Competitive Habits

- **Create competitive habits** with multiple participants
- **Challenge friends** to habit competitions
- **Leaderboards** showing participant rankings
- **Winner detection** and competitive badges
- **Invitation system** for joining challenges

### 👥 Social Features

- **Friend system** with friend requests and acceptance
- **Friend search** by username
- **Social leaderboards** comparing with friends
- **Competitive habit invitations** restricted to friends

### 📊 Statistics & Analytics

- **Personal statistics** with detailed habit metrics
- **Friends leaderboard** with XP and level comparisons
- **Competitive progress** tracking wins and participation
- **Comprehensive user stats** including streaks and completion rates

### 🎮 Gamification System

- **XP rewards** for completed habits
- **Streak tracking** with intelligent reset logic
- **User leveling** system
- **Difficulty-based scoring** for habits
- **Badge achievements** with rarity system

### ⚡ Background Processing

- **BullMQ job scheduling** for habit reactivation
- **Redis-backed queues** for reliable job processing
- **Automatic habit reactivation** after completion cooldown
- **Job cancellation** when habits are deleted

### 🛡️ Security & Validation

- **Input validation** with class-validator
- **Password hashing** with bcryptjs
- **CORS support** for cross-origin requests
- **Request rate limiting** ready

## 🛠 Tech Stack

### Backend Framework

- **NestJS** - Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript** - Typed superset of JavaScript for better development experience

### Database & ORM

- **PostgreSQL** - Advanced open-source relational database
- **Prisma** - Next-generation ORM for TypeScript & Node.js

### Authentication & Security

- **Passport.js** - Authentication middleware for Node.js
- **JWT (JSON Web Tokens)** - Secure token-based authentication
- **Google OAuth 2.0** - Social authentication
- **bcryptjs** - Password hashing

### Job Scheduling & Caching

- **BullMQ** - Premium message queue for Node.js
- **Redis** - In-memory data structure store for caching and queues

### Testing & Quality

- **Jest** - Delightful JavaScript testing framework
- **Supertest** - HTTP assertions library
- **ESLint** - Pluggable JavaScript linter
- **Prettier** - Opinionated code formatter

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Redis** server
- **Google Cloud Console** account (for OAuth setup)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/habit_tracker"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Server
PORT=8000

# Redis (for job queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your-redis-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
```

## 🗄️ Database Setup

1. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

2. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

3. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

The application will be available at `http://localhost:8000`

## 📚 API Documentation

The API documentation is available via Swagger at `http://localhost:8000/api/docs`

### Authentication Endpoints

#### Traditional Authentication

```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "fullname": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Google OAuth Authentication

```http
GET /auth/google
# Redirects to Google OAuth consent screen

GET /auth/google/callback
# Handles OAuth callback and returns JWT token
```

### Habit Management Endpoints

All habit endpoints require JWT authentication via `Authorization: Bearer <token>` header.

```http
GET /habit
# Get all habits for authenticated user

POST /habit
Content-Type: application/json

{
  "title": "Drink 8 glasses of water",
  "description": "Stay hydrated throughout the day",
  "repetitionInterval": 1,
  "repetitionUnit": "days",
  "points": 10,
  "difficulty": 2
}

GET /habit/:id
# Get specific habit details

PATCH /habit/:id
Content-Type: application/json

{
  "title": "Updated habit title",
  "points": 15
}

DELETE /habit/:id
# Delete a habit

POST /habit/:id/complete
# Mark habit as completed (awards XP, updates streak, schedules reactivation)
```

### Badge System Endpoints

```http
GET /badges
# Get all available badges

GET /badges/my-badges
# Get current user's earned badges

GET /badges/progress
# Get progress for unearned badges

POST /badges/check-badges
# Manually trigger badge checking and award any earned badges
```

### Competitive Habit Endpoints

```http
POST /competitive/habits
# Create a new competitive habit

GET /competitive/habits
# Get user's competitive habits

POST /competitive/habits/:habitId/invite/:userId
# Invite a friend to join a competitive habit

POST /competitive/invitations/:participantId/accept
# Accept a competitive habit invitation

POST /competitive/invitations/:participantId/decline
# Decline a competitive habit invitation

GET /competitive/invitations/pending
# Get pending competitive habit invitations

GET /competitive/habits/:habitId/leaderboard
# Get leaderboard for a competitive habit

POST /competitive/habits/:habitId/complete
# Complete a competitive habit

GET /competitive/habits/:habitId/check-winner
# Check if current user is the winner of a competitive habit

GET /competitive/progress
# Get user's competitive progress statistics
```

### Social Features Endpoints

```http
POST /friendship/request/:userId
# Send a friend request

POST /friendship/accept/:requestId
# Accept a friend request

POST /friendship/decline/:requestId
# Decline a friend request

GET /friendship/friends
# Get user's friends list

GET /friendship/requests
# Get pending friend requests

DELETE /friendship/friends/:userId
# Remove a friend

GET /friendship/search/:username
# Search for users by username
```

### Statistics Endpoints

```http
GET /stats/me
# Get detailed user statistics

GET /stats/leaderboard
# Get friends leaderboard
```

### Response Examples

#### Successful Habit Completion

```json
{
  "id": "habit-uuid",
  "title": "Drink 8 glasses of water",
  "streak": 5,
  "isActive": false,
  "lastCompletedAt": "2025-09-23T10:30:00.000Z"
}
```

#### User Profile with XP

```json
{
  "id": "user-uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "fullname": "John Doe",
  "xpPoints": 150,
  "level": 2,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### Badge Progress

```json
[
  {
    "badgeId": "badge-uuid",
    "currentProgress": 5,
    "targetProgress": 7,
    "progressData": {
      "currentStreak": 5
    }
  }
]
```

#### Competitive Progress

```json
{
  "totalCompetitiveHabits": 3,
  "totalWins": 2,
  "totalCompletions": 45,
  "winRate": 66.67
}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:cov
```

### Run Specific Test Suite

```bash
npm test -- --testPathPattern=habit.service.spec.ts
```

### Debug Tests

```bash
npm run test:debug
```

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── app.controller.ts           # Main application controller
│   ├── app.module.ts               # Root application module
│   ├── app.service.ts              # Main application service
│   ├── main.ts                     # Application entry point
│   ├── auth/                       # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.utils.ts
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── dto/
│   ├── habit/                      # Habit management module
│   │   ├── habit.controller.ts
│   │   ├── habit.module.ts
│   │   ├── habit.service.ts
│   │   ├── habit.processor.ts      # BullMQ job processor
│   │   └── dto/
│   ├── badges/                     # Badge system module
│   │   ├── badge.controller.ts
│   │   ├── badge.module.ts
│   │   ├── badge.service.ts
│   │   └── dto/
│   ├── competitive/                # Competitive habits module
│   │   ├── competitive.controller.ts
│   │   ├── competitive.module.ts
│   │   ├── competitive.service.ts
│   │   └── dto/
│   ├── friendship/                 # Social features module
│   │   ├── friendship.controller.ts
│   │   ├── friendship.module.ts
│   │   ├── friendship.service.ts
│   │   └── dto/
│   ├── stats/                      # Statistics module
│   │   ├── stats.controller.ts
│   │   ├── stats.module.ts
│   │   ├── stats.service.ts
│   │   └── dto/
│   └── prisma/                     # Database module
│       └── prisma.service.ts
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── test/                           # Test files
├── .env                            # Environment variables
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🎮 Gamification System

### XP & Leveling

- **Base XP**: Earned from completing habits
- **Difficulty Multiplier**: Harder habits award more XP
- **Level Progression**: XP thresholds determine user levels
- **Badge Bonuses**: Additional XP rewards for achievements

### Badge System

- **Achievement Types**: Streak, Level, Habit Count, Category, Social, Consistency, Competitive
- **Rarity Levels**: Common, Rare, Epic, Legendary
- **Progress Tracking**: See progress toward unearned badges
- **Automatic Awarding**: Badges earned through relevant actions

### Competitive Challenges

- **Multiplayer Habits**: Challenge friends to habit competitions
- **Leaderboards**: Track participant progress and rankings
- **Winner Badges**: Special badges for competitive achievements
- **Social Engagement**: Build habits with friends

### Habit Streaks

- **Automatic Tracking**: Increments on successful completion
- **Smart Reset Logic**: Resets only after missing the deadline
- **Flexible Deadlines**: Accounts for real-life variations

### Difficulty Levels

- **1-5 Scale**: Easy to Expert difficulty ratings
- **XP Scaling**: Higher difficulty = more XP rewards
- **Personalization**: Users can set appropriate challenge levels

## ⏰ Background Jobs

### Habit Reactivation System

- **Delayed Execution**: Habits reactivate after their repetition interval
- **Persistent Queues**: Jobs survive server restarts via Redis
- **Automatic Cleanup**: Completed jobs are removed from queue
- **Cancellation Support**: Jobs cancelled when habits are deleted

### Job Processing

- **BullMQ Workers**: Dedicated processors for habit reactivation
- **Error Handling**: Failed jobs are retried with exponential backoff
- **Monitoring**: Job status tracking and logging
- **Scalability**: Multiple worker instances supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR
- Use conventional commit messages

### Code Quality

```bash
# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm test

# Build project
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [BullMQ](https://docs.bullmq.io/) - Premium message queue
- [Passport.js](http://www.passportjs.org/) - Authentication middleware

## 📞 Support

If you have any questions or need help with the project:

- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the API examples above

---

**Happy Habit Tracking! ???**
