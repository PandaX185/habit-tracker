# 🎯 Gamified Habit Tracker API<p align="center">

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

A comprehensive REST API for a gamified habit tracking application built with NestJS, featuring user authentication, habit management, XP rewards, streak tracking, and background job scheduling.</p>

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)[circleci-url]: https://circleci.com/gh/nestjs/nest

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) <p align="center">

![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

## 📋 Table of Contents<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- [Features](#features)<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

- [Tech Stack](#tech-stack)<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

- [Prerequisites](#prerequisites)<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

- [Installation](#installation)<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

- [Environment Setup](#environment-setup) <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

- [Database Setup](#database-setup) <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

- [Running the Application](#running-the-application) <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

- [API Documentation](#api-documentation)</p>

- [Testing](#testing) <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- [Project Structure](#project-structure) [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- [Gamification System](#gamification-system)

- [Background Jobs](#background-jobs)## Description

- [Contributing](#contributing)

- [License](#license)[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## ✨ Features## Project setup

### 🔐 Authentication & Authorization```bash

- **JWT-based authentication** with secure token management$ npm install

- **Google OAuth 2.0 integration** for seamless login```

- **Dual authentication** - support both traditional and OAuth login

- **Account linking** - automatically link Google accounts to existing users## Compile and run the project

### 🎯 Habit Management```bash

- **CRUD operations** for habits with full user isolation# development

- **Custom repetition intervals** (days, weeks, months)$ npm run start

- **Flexible scheduling** with intelligent deadline calculation

- **Habit completion tracking** with timestamp recording# watch mode

$ npm run start:dev

### 🎮 Gamification System

- **XP rewards** for completed habits# production mode

- **Streak tracking** with intelligent reset logic$ npm run start:prod

- **User leveling** system```

- **Difficulty-based scoring** for habits

## Run tests

### ⚡ Background Processing

- **BullMQ job scheduling** for habit reactivation```bash

- **Redis-backed queues** for reliable job processing# unit tests

- **Automatic habit reactivation** after completion cooldown$ npm run test

- **Job cancellation** when habits are deleted

# e2e tests

### 🛡️ Security & Validation$ npm run test:e2e

- **Input validation** with class-validator

- **Password hashing** with bcryptjs# test coverage

- **CORS support** for cross-origin requests$ npm run test:cov

- **Request rate limiting** ready```

## 🛠 Tech Stack## Deployment

### Backend FrameworkWhen you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

- **NestJS** - Progressive Node.js framework for building efficient and scalable server-side applications

- **TypeScript** - Typed superset of JavaScript for better development experienceIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

### Database & ORM```bash

- **PostgreSQL** - Advanced open-source relational database$ npm install -g mau

- **Prisma** - Next-generation ORM for TypeScript & Node.js$ mau deploy

````

### Authentication & Security

- **Passport.js** - Authentication middleware for Node.jsWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

- **JWT (JSON Web Tokens)** - Secure token-based authentication

- **Google OAuth 2.0** - Social authentication## Resources

- **bcryptjs** - Password hashing

Check out a few resources that may come in handy when working with NestJS:

### Job Scheduling & Caching

- **BullMQ** - Premium message queue for Node.js- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- **Redis** - In-memory data structure store for caching and queues- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

### Testing & Quality- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- **Jest** - Delightful JavaScript testing framework- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

- **Supertest** - HTTP assertions library- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

- **ESLint** - Pluggable JavaScript linter- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

- **Prettier** - Opinionated code formatter- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



## 📋 Prerequisites## Support



Before running this application, make sure you have the following installed:Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).



- **Node.js** (v18 or higher)## Stay in touch

- **npm** or **yarn** package manager

- **PostgreSQL** database- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

- **Redis** server- Website - [https://nestjs.com](https://nestjs.com/)

- **Google Cloud Console** account (for OAuth setup)- Twitter - [@nestframework](https://twitter.com/nestframework)



## 🚀 Installation## License



1. **Clone the repository**Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

   ```bash
   git clone <repository-url>
   cd habit-tracker
````

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
│   ├── app.controller.ts       # Main application controller
│   ├── app.module.ts           # Root application module
│   ├── app.service.ts          # Main application service
│   ├── main.ts                 # Application entry point
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.utils.ts
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── dto/
│   ├── habit/                  # Habit management module
│   │   ├── habit.controller.ts
│   │   ├── habit.module.ts
│   │   ├── habit.service.ts
│   │   ├── habit.processor.ts  # BullMQ job processor
│   │   └── dto/
│   └── prisma/                 # Database module
│       └── prisma.service.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── test/                       # Test files
├── .env                        # Environment variables
├── .env.example               # Environment template
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
- **Streak Bonuses**: Future enhancement for consecutive completions

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

**Happy Habit Tracking! 🎯✨**
