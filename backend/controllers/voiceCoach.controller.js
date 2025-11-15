import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Kannada vocabulary database for practice
const kannadaPhrases = {
  beginner: [
    { kannada: "ನಮಸ್ಕಾರ", english: "Hello", pronunciation: "namaskara" },
    { kannada: "ಧನ್ಯವಾದ", english: "Thank you", pronunciation: "dhanyavaada" },
    {
      kannada: "ನನ್ನ ಹೆಸರು",
      english: "My name is",
      pronunciation: "nanna hesaru",
    },
    {
      kannada: "ಹೇಗಿದ್ದೀರಿ",
      english: "How are you",
      pronunciation: "heegiddeeri",
    },
    {
      kannada: "ಚೆನ್ನಾಗಿದೆ",
      english: "I'm fine",
      pronunciation: "chennaagide",
    },
  ],
  intermediate: [
    {
      kannada: "ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ",
      english: "I am learning Kannada",
      pronunciation: "naanu kannada kaliyuttideene",
    },
    {
      kannada: "ಇದು ಎಲ್ಲಿದೆ",
      english: "Where is this",
      pronunciation: "idu ellide",
    },
    {
      kannada: "ನಿಮ್ಮ ಹೆಸರೇನು",
      english: "What is your name",
      pronunciation: "nimma hesarenu",
    },
    {
      kannada: "ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ",
      english: "I don't understand",
      pronunciation: "nanage arthavaaguttilla",
    },
  ],
  advanced: [
    {
      kannada: "ನೀವು ಯಾವ ಭಾಷೆ ಮಾತನಾಡುತ್ತೀರಿ",
      english: "Which language do you speak",
      pronunciation: "neevu yaava bhaashe maatanaaduttiri",
    },
    {
      kannada: "ಬೆಂಗಳೂರು ತುಂಬಾ ಸುಂದರವಾಗಿದೆ",
      english: "Bangalore is very beautiful",
      pronunciation: "bengalooru tumbaa sundaravaagide",
    },
  ],
};

// Analyze pronunciation using Groq
export const analyzePronunciation = async (req, res) => {
  try {
    const {
      userTranscript,
      confidence,
      targetPhrase,
      currentXP = 0,
      currentLevel = 1,
    } = req.body;

    console.log("🎙️ Analyzing pronunciation...");
    console.log("User said:", userTranscript);
    console.log("Target:", targetPhrase);

    const prompt = `You are "VoiceCoach", a real-time Kannada pronunciation coach.
Analyze the user's pronunciation and provide detailed feedback.

USER INPUT:
- User said: "${userTranscript}"
- Confidence: ${confidence}
- Target phrase: "${targetPhrase}"
- Current XP: ${currentXP}
- Current Level: ${currentLevel}

ANALYZE:
1. Compare pronunciation accuracy (0-100)
2. Identify correct phonemes
3. Identify incorrect phonemes
4. Provide IPA transcription
5. Break into syllables
6. Give actionable tips
7. Calculate XP gained (accuracyScore / 10)
8. Determine if repeat is required (score < 70)
9. Provide next conversational prompt

RESPOND WITH VALID JSON ONLY (no markdown, no explanations):
{
  "accuracyScore": 85,
  "analysis": {
    "correctPhonemes": ["na", "ma"],
    "incorrectPhonemes": ["ska"],
    "explanation": "The 's' sound was slightly soft. Good try!",
    "slowMode": "na-ma-ska-ra",
    "ipa": "nə.məs.kaː.ra",
    "syllables": "na-ma-ska-ra"
  },
  "correction": {
    "correctKannada": "${targetPhrase}",
    "englishMeaning": "Hello/Greetings",
    "tips": "Emphasize the 'ska' cluster. Stretch the final 'ra' sound."
  },
  "xpUpdate": {
    "xpGained": 8,
    "totalXP": ${currentXP + 8},
    "newLevel": ${Math.floor((currentXP + 8) / 100) + 1}
  },
  "nextPrompt": "Great! Now try saying: 'Dhanyavaada' (Thank you)",
  "repeatRequired": false
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a Kannada pronunciation expert. Respond ONLY with valid JSON. No markdown, no explanations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    let analysisData = chatCompletion.choices[0]?.message?.content;

    // Clean up response
    analysisData = analysisData.replace(/```\n?/g, "").trim();

    const analysis = JSON.parse(analysisData);

    console.log("✅ Pronunciation analysis complete!");

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("❌ Error analyzing pronunciation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze pronunciation",
      error: error.message,
    });
  }
};

// Get practice phrase
export const getPracticePhrase = async (req, res) => {
  try {
    const { difficulty = "beginner" } = req.query;

    const phrases = kannadaPhrases[difficulty] || kannadaPhrases.beginner;
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    res.json({
      success: true,
      phrase: randomPhrase,
    });
  } catch (error) {
    console.error("Error getting practice phrase:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get practice phrase",
    });
  }
};

// Start voice session
export const startVoiceSession = async (req, res) => {
  try {
    const { userId, difficulty = "beginner" } = req.body;

    res.json({
      success: true,
      message: "Voice session started!",
      initialPrompt:
        "नमस्कार! Welcome to Voice Coach! Let's start with a simple greeting. Say: 'Namaskara' (Hello)",
      xp: 0,
      level: 1,
    });
  } catch (error) {
    console.error("Error starting voice session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start voice session",
    });
  }
};
