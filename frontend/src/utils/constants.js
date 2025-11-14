// App Configuration
export const APP_NAME = 'ಕನ್ನಡ ಕಲಿಕೆ'; // Kannada Kalike (Kannada Learning)
export const APP_TAGLINE = 'Learn Kannada with Fun & AI';

// Gamification Constants
export const XP_PER_LESSON = 50;
export const XP_PER_EXERCISE = 10;
export const XP_PER_CORRECT_ANSWER = 5;
export const XP_PER_STREAK_DAY = 20;
export const XP_FOR_DAILY_GOAL = 100;

// Leveling System
export const XP_PER_LEVEL = 500;
export const MAX_LEVEL = 100;

// Streak System
export const STREAK_FREEZE_COST = 100; // Gems
export const MAX_STREAK_FREEZES = 2;

// Currency
export const GEMS_PER_LESSON = 5;
export const GEMS_PER_ACHIEVEMENT = 50;
export const GEMS_PER_LEVEL = 100;

// Lesson Structure
export const EXERCISES_PER_LESSON = 5;
export const LESSONS_PER_UNIT = 5;
export const UNITS_PER_SECTION = 3;

// Pronunciation Scoring
export const PRONUNCIATION_THRESHOLD = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 0,
};

// Daily Goals
export const DAILY_XP_GOAL = 50;
export const DAILY_LESSONS_GOAL = 3;

// Achievements Categories
export const ACHIEVEMENT_CATEGORIES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  MASTER: 'master',
  SPECIAL: 'special',
};

// Difficulty Levels
export const DIFFICULTY = {
  BEGINNER: 1,
  ELEMENTARY: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5,
};

// Exercise Types
export const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_IN_BLANK: 'fill_in_blank',
  MATCH_PAIRS: 'match_pairs',
  SPEAKING: 'speaking',
  LISTENING: 'listening',
  TRANSLATION: 'translation',
  STORY_CHOICE: 'story_choice',
};

// API Endpoints (relative to VITE_API_BASE_URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  USER_PROGRESS: '/user/progress',
  USER_STATS: '/user/stats',
  
  // Lessons
  GET_LESSONS: '/lessons',
  GET_LESSON: '/lessons/:id',
  SUBMIT_ANSWER: '/lessons/:id/submit',
  COMPLETE_LESSON: '/lessons/:id/complete',
  
  // Progress
  UPDATE_PROGRESS: '/progress/update',
  GET_WEAK_AREAS: '/progress/weak-areas',
  GET_RECOMMENDATIONS: '/progress/recommendations',
  
  // Gamification
  GET_ACHIEVEMENTS: '/achievements',
  UNLOCK_ACHIEVEMENT: '/achievements/unlock',
  GET_LEADERBOARD: '/leaderboard',
  UPDATE_STREAK: '/gamification/streak',
  
  // AI Features
  STT_WHISPER: '/ai/speech-to-text',
  TTS_ELEVENLABS: '/ai/text-to-speech',
  CHAT_GEMINI: '/ai/chat',
  PRONUNCIATION_CHECK: '/ai/pronunciation',
  
  // Stories
  GET_STORIES: '/stories',
  GET_STORY: '/stories/:id',
  SUBMIT_STORY_CHOICE: '/stories/:id/choice',
};

// Sound Effects URLs
export const SOUND_EFFECTS = {
  CORRECT: '/assets/audio/sfx/correct.mp3',
  WRONG: '/assets/audio/sfx/wrong.mp3',
  LEVEL_UP: '/assets/audio/sfx/levelup.mp3',
  ACHIEVEMENT: '/assets/audio/sfx/achievement.mp3',
  BUTTON_CLICK: '/assets/audio/sfx/click.mp3',
  XP_GAIN: '/assets/audio/sfx/xp-gain.mp3',
  STREAK: '/assets/audio/sfx/streak.mp3',
  PAGE_TRANSITION: '/assets/audio/sfx/swoosh.mp3',
};

// Background Music
export const BACKGROUND_MUSIC = {
  HOME: '/assets/audio/music/home.mp3',
  LESSON: '/assets/audio/music/lesson.mp3',
  STORY: '/assets/audio/music/story.mp3',
};

// Karnataka Districts for Leaderboard
export const KARNATAKA_DISTRICTS = [
  'Bangalore Urban',
  'Bangalore Rural',
  'Mysore',
  'Mangalore',
  'Hubli-Dharwad',
  'Belgaum',
  'Gulbarga',
  'Bellary',
  'Shimoga',
  'Tumkur',
  'Davangere',
  'Bijapur',
  'Hassan',
  'Chitradurga',
  'Udupi',
  'Raichur',
  'Bidar',
  'Mandya',
  'Kolar',
  'Chikmagalur',
  'Kodagu',
  'Bagalkot',
  'Gadag',
  'Haveri',
  'Koppal',
  'Yadgir',
  'Chamarajanagar',
  'Chikkaballapur',
  'Ramanagara',
  'Vijayanagara',
];

// Avatar Options
export const AVATAR_OPTIONS = [
  '🐘', // Elephant (Kannada mascot)
  '🎨', // Artist
  '📚', // Scholar
  '🌟', // Star
  '🎭', // Theater
  '🏛️', // Palace (Mysore)
  '☕', // Coffee (Coorg)
  '🎵', // Music
  '🌺', // Flower
  '🦚', // Peacock
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'kannada_auth_token',
  USER_DATA: 'kannada_user_data',
  THEME: 'kannada_theme',
  SOUND_ENABLED: 'kannada_sound_enabled',
  MUSIC_ENABLED: 'kannada_music_enabled',
  LANGUAGE: 'kannada_ui_language',
  STREAK_REMINDER: 'kannada_streak_reminder',
  LAST_LESSON: 'kannada_last_lesson',
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  CONFETTI: 3000,
  TOAST: 3000,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
  ULTRA: 1536,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please login again.',
  LESSON_LOAD_FAILED: 'Failed to load lesson. Please try again.',
  SAVE_FAILED: 'Failed to save progress. Please try again.',
  MICROPHONE_ERROR: 'Microphone access denied.',
  CAMERA_ERROR: 'Camera access denied.',
  API_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LESSON_COMPLETE: 'Lesson completed! Well done! 🎉',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked! 🏆',
  LEVEL_UP: 'Level up! Keep it going! 🚀',
  STREAK_MAINTAINED: 'Streak maintained! 🔥',
  PROFILE_UPDATED: 'Profile updated successfully! ✅',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LEARN: '/learn',
  LESSON: '/lesson/:id',
  PRACTICE: '/practice',
  STORIES: '/stories',
  STORY: '/story/:id',
  CHATBOT: '/chatbot',
  VOICE_COACH: '/voice-coach',
  AR_SCANNER: '/ar-scanner',
  DASHBOARD: '/dashboard',
  LEADERBOARD: '/leaderboard',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  LOGIN: '/login',
  SIGNUP: '/signup',
};

// Feature Flags (for demo)
export const FEATURES = {
  VOICE_COACH: true,
  AI_CHATBOT: true,
  AR_SCANNER: true,
  STORY_MODE: true,
  LEADERBOARD: true,
  SOCIAL_FEATURES: false, // For future
  MULTIPLAYER: false, // For future
};

// Demo Mode Settings (for hackathon)
export const DEMO_MODE = {
  ENABLED: false,
  AUTO_LOGIN: true,
  SKIP_ONBOARDING: false,
  SHOW_ALL_FEATURES: true,
  MOCK_API: false,
};

export default {
  APP_NAME,
  APP_TAGLINE,
  XP_PER_LESSON,
  ROUTES,
  API_ENDPOINTS,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
