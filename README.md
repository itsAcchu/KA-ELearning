# Kannada Quest - AI-Powered Language Learning Platform

<div align="center">

[Kannada Quest Banner](./screenshots/banner.png)

**A modern, gamified Kannada learning platform powered by AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen.svg)](https://www.mongodb.com/)

[Features](./screenshots/quick-actions.jpg) 

</div>

---

## Overview

Kannada Quest is a comprehensive language learning platform that combines traditional education methods with cutting-edge AI technology. The platform offers an immersive learning experience through voice recognition, augmented reality, gamification, and intelligent tutoring systems.

### Key Highlights

- **AI-Powered Tutoring**: Personalized learning assistance using Groq AI and Google Gemini
- **Voice Recognition**: Real-time pronunciation feedback and scoring
- **AR Object Detection**: Learn vocabulary through real-world object recognition
- **Gamification**: Earn XP, badges, and compete with friends
- **Progress Tracking**: Comprehensive analytics and personalized recommendations

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

---

## Features

### Core Learning Modules

#### 📚 Structured Lessons
- Progressive curriculum from beginner to advanced
- Interactive exercises and quizzes
- Story-based contextual learning
- Vocabulary builder with spaced repetition

#### 🎤 Voice Coach
- Browser-based speech recognition
- Real-time pronunciation analysis
- Accuracy scoring with instant feedback
- Native speaker comparison

#### 🤖 AI Kannada Tutor
- Intelligent chatbot for conversational practice
- Grammar explanations and corrections
- Bidirectional translation support
- Context-aware learning suggestions

#### 📸 AR Object Scanner
- Real-time object detection via camera
- Learn Kannada words for everyday objects
- Visual association for better retention
- Pronunciation guide for detected objects

### Engagement Features

#### 🏆 Gamification System
- Experience points (XP) and leveling system
- Daily streaks and goals
- Achievement badges and milestones
- In-app currency (Gems)
- Leaderboards and challenges

#### 📊 Progress Analytics
- Detailed learning statistics
- Lesson completion tracking
- Streak monitoring
- Personalized learning recommendations
- Performance insights and trends

---

## Screenshots

<div align="center">

### Dashboard
![Dashboard](./screenshots/dashboard.jpg)
*Main learning dashboard with progress tracking and quick actions*

### Quick Actions Panel
![Quick Actions](./screenshots/quick-actions.jpg)
*Easy access to all learning modules and features*

</div>

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Zustand | State management |
| Framer Motion | Animations |
| Axios | HTTP client |
| Lucide Icons | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Socket.io | Real-time communication |

### AI & APIs
- **Groq AI**: Natural language processing
- **Google Gemini**: Advanced language understanding
- **Web Speech API**: Browser-based voice recognition

---

## Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher) or **yarn**
- **MongoDB** (v6.0 or higher)
- **Git**

You'll also need API keys for:
- MongoDB Atlas (or local MongoDB instance)
- Groq AI API
- Google Gemini API

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/itsAcchu/kannada-quest.git
cd kannada-quest
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Configuration

### Environment Variables

#### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRE` | Token expiration time | No (default: 7d) |
| `GROQ_API_KEY` | Groq AI API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

#### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

---

## Usage

### Getting Started

1. **Create an Account**: Sign up with your email and password
2. **Complete Profile**: Set your learning goals and preferences
3. **Start Learning**: Begin with introductory lessons
4. **Explore Features**: Try Voice Coach, AI Tutor, and AR Scanner
5. **Track Progress**: Monitor your XP, streaks, and achievements

### Feature Guide

#### Voice Coach
1. Navigate to Voice Coach from Quick Actions
2. Allow microphone permissions when prompted
3. Listen to the native pronunciation
4. Repeat the word or phrase
5. Receive instant feedback and scoring

#### AI Tutor
1. Access the AI Tutor chatbot
2. Ask questions in English or Kannada
3. Get explanations, translations, and practice exercises
4. Use conversation mode for interactive learning

#### AR Object Scanner
1. Open the AR Scanner
2. Allow camera permissions
3. Point camera at objects around you
4. Learn Kannada words for detected objects
5. Practice pronunciation

---

## Project Structure

```
kannada-quest/
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── lessons/
│   │   │   └── voice-coach/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── VoiceCoach.jsx
│   │   │   └── ARScanner.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── progressStore.js
│   │   │   └── lessonStore.js
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── lesson.controller.js
│   │   ├── progress.controller.js
│   │   └── ai.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Progress.js
│   │   ├── Achievement.js
│   │   └── Story.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── lesson.routes.js
│   │   ├── progress.routes.js
│   │   └── ai.routes.js
│   ├── utils/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── screenshots/
│   ├── dashboard.jpg
│   └── quick-actions.jpg
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Lesson Endpoints

#### Get All Lessons
```http
GET /api/lessons
Authorization: Bearer {token}
```

#### Get Lesson by ID
```http
GET /api/lessons/:id
Authorization: Bearer {token}
```

### Progress Endpoints

#### Update Progress
```http
POST /api/progress/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "lessonId": "lesson_id",
  "xpEarned": 50,
  "completed": true
}
```

For complete API documentation, visit `/api/docs` when running the development server.

---

## Troubleshooting

### Common Issues

#### Voice Coach Not Working

**Issue**: Microphone not detected or speech recognition fails

**Solutions**:
- Use **Google Chrome** (recommended browser)
- Ensure microphone permissions are granted
- Check browser console for errors
- Verify microphone is working in system settings
- Try using HTTPS (required for some browsers)

#### Backend Connection Errors

**Issue**: Frontend cannot connect to backend

**Solutions**:
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify MongoDB connection
mongosh your_connection_string

# Check environment variables
cat backend/.env

# Restart both servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

#### Database Issues

**Issue**: MongoDB connection errors

**Solutions**:
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Ensure network access in MongoDB Atlas
- Verify database user permissions

#### Build Errors

**Issue**: npm install or build failures

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Use specific Node version (via nvm)
nvm use 18
```

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/kannada-quest.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Commit with descriptive messages**
   ```bash
   git commit -m "Add: Feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Style

- Use ESLint and Prettier configurations
- Follow React best practices
- Write clean, readable code
- Add comments for complex logic

---

## Team

### Quantum X Team

This project is developed and maintained by **Team Quantum X** for the Karnataka State Level Hackathon.

| Name | Role | Contact |
|------|------|---------|
| **Harish Reddy S** | Team Lead & Data Engineer | [GitHub](https://github.com/itsAcchu) • harishreddy.workmail@gmail.com |
| **Sai Prasanth Reddy** | Backend Developer | - |
| **Lokesh L** | Frontend Developer | - |
| **Syed Furqan** | QA & Testing | - |

**Faculty Guide**: Dr. Sapna M K

---

## Acknowledgments

- **Vemana Institute of Technology** - AI & ML Department
- **Groq AI** - Language processing capabilities
- **Google Gemini** - Advanced AI features
- **Open Source Community** - Various libraries and tools

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Team Quantum X

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions...
```

---

## Support

If you encounter any issues or have questions:

- 📧 Email: harishreddy.workmail@gmail.com
- 🐛 [Report Bug](https://github.com/itsAcchu/kannada-quest/issues)
- 💡 [Request Feature](https://github.com/itsAcchu/kannada-quest/issues)

---

<div align="center">

**Made with ❤️ by Team Quantum X**

⭐ Star this repository if you find it helpful!

[Back to Top](#kannada-quest---ai-powered-language-learning-platform)

</div>

