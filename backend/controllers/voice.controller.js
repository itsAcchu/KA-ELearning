import FormData from "form-data";

// Lazy initialization - only create OpenAI instance when needed
let openaiInstance = null;

const getOpenAI = async () => {
  if (!openaiInstance && process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import("openai");
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
};

// Kannada pronunciation exercises
const exercises = [
  {
    id: 1,
    word: "ನಮಸ್ಕಾರ",
    translation: "Namaskāra",
    meaning: "Hello",
    difficulty: "easy",
  },
  {
    id: 2,
    word: "ಧನ್ಯವಾದ",
    translation: "Dhanyavāda",
    meaning: "Thank you",
    difficulty: "easy",
  },
  {
    id: 3,
    word: "ಹೇಗಿದೀರಿ",
    translation: "Hēgidīri",
    meaning: "How are you",
    difficulty: "medium",
  },
  {
    id: 4,
    word: "ಶುಭೋದಯ",
    translation: "Śubhōdaya",
    meaning: "Good morning",
    difficulty: "medium",
  },
  {
    id: 5,
    word: "ಕರ್ನಾಟಕ",
    translation: "Karnāṭaka",
    meaning: "Karnataka",
    difficulty: "easy",
  },
  {
    id: 6,
    word: "ಬೆಂಗಳೂರು",
    translation: "Bengaḷūru",
    meaning: "Bangalore",
    difficulty: "medium",
  },
  {
    id: 7,
    word: "ವಿದ್ಯಾರ್ಥಿ",
    translation: "Vidyārthi",
    meaning: "Student",
    difficulty: "hard",
  },
  {
    id: 8,
    word: "ಅಂತರಾಷ್ಟ್ರೀಯ",
    translation: "Antarāṣṭrīya",
    meaning: "International",
    difficulty: "hard",
  },
];

export const getVoiceExercises = async (req, res) => {
  try {
    const { difficulty } = req.query;

    let filteredExercises = exercises;
    if (difficulty) {
      filteredExercises = exercises.filter(
        (ex) => ex.difficulty === difficulty
      );
    }

    res.json(filteredExercises);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkPronunciation = async (req, res) => {
  try {
    const { expectedWord, expectedTranslation } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        message: "Voice recognition temporarily unavailable",
        error: "OpenAI API key not configured",
      });
    }

    const openai = await getOpenAI();

    if (!openai) {
      return res.status(503).json({
        message: "Voice recognition temporarily unavailable",
      });
    }

    // Create a proper File object for OpenAI
    const audioBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const audioFile = new File([audioBlob], "audio.webm", {
      type: req.file.mimetype,
    });

    // Step 1: Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "kn", // Kannada
      response_format: "text",
    });

    const spokenText = transcription.trim().toLowerCase();
    const expected = expectedTranslation.toLowerCase();

    // Step 2: Calculate similarity score
    const score = calculateSimilarity(spokenText, expected);
    const isCorrect = score >= 7;

    // Step 3: Get AI feedback
    const feedback = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a Kannada language pronunciation teacher. Provide brief, encouraging feedback.",
        },
        {
          role: "user",
          content: `Student tried to say "${expectedTranslation}" (${expectedWord}) but said "${spokenText}". Score: ${score}/10. Give brief feedback in 1-2 sentences.`,
        },
      ],
      max_tokens: 100,
    });

    res.json({
      isCorrect,
      score,
      transcription: spokenText,
      expected: expectedTranslation,
      feedback: feedback.choices.message.content,
      kannadaWord: expectedWord,
    });
  } catch (error) {
    console.error("Pronunciation check error:", error);
    res.status(500).json({
      message: "Failed to check pronunciation",
      error: error.message,
    });
  }
};

// Helper: Calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 10;

  const editDistance = levenshteinDistance(longer, shorter);
  const similarity = (longer.length - editDistance) / longer.length;

  return Math.round(similarity * 10);
}

// Levenshtein distance algorithm
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
