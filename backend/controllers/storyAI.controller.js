import Groq from "groq-sdk";
import Story from "../models/Story.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate AI Story
export const generateAIStory = async (req, res) => {
  try {
    const { mode, difficulty, location, topic } = req.body;

    console.log("🎭 Generating AI Story with Groq...");

    const prompt = `You are the Kannada Interactive Story Learning Engine.
Generate an interactive Kannada story with the following specifications:

Mode: ${mode} (child/adult/parent)
Difficulty: ${difficulty}
Location: ${location} (Karnataka)
Topic: ${topic || "daily life adventure"}

Requirements:

Create a mission-based story with 3 scenes (keep it short for better JSON generation)

Each scene must have:

Engaging narrative in English AND Kannada

A clear mission/objective

2 choices for the user

2-3 vocabulary words with translations and pronunciation

Learning outcome (what user learns)

Grammar tip

XP rewards

Mode-specific rules:

Child Mode: Simple sentences, playful tone, emojis

Adult Mode: Complex vocabulary, deeper storytelling

Parent Mode: Educational insights

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Just pure JSON.

Format (example):
{
"title": "Adventure in Bangalore",
"titleKannada": "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಸಾಹಸ",
"description": "Learn Kannada while exploring Bangalore",
"coverEmoji": "🌆",
"scenes": [
{
"order": 1,
"title": "At the Bus Stop",
"content": "Raju wants to go to the market.",
"contentKannada": "ರಾಜು ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗಬೇಕು.",
"mission": "Ask for directions to the market",
"imageEmoji": "🚌",
"vocabulary": [
{
"word": "market",
"kannada": "ಮಾರುಕಟ್ಟೆ",
"english": "Market",
"pronunciation": "maarukatte"
}
],
"choices": [
{
"text": "Ask the conductor",
"textKannada": "ನಡುವಣ ಕೇಳು",
"nextScene": 2,
"xpReward": 10,
"correctChoice": true
},
{
"text": "Read the signboard",
"textKannada": "ಫಲಕ ಓದು",
"nextScene": 2,
"xpReward": 5,
"correctChoice": false
}
],
"learningOutcome": "You learned how to ask for directions",
"grammarTip": "Use 'ಎಲ್ಲಿದೆ?' to ask where something is"
}
]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a Kannada language expert. Generate ONLY valid JSON. No markdown, no code blocks, no explanations. Pure JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    let storyData = chatCompletion.choices?.[0]?.message?.content;

    console.log("📝 Raw AI Response (first 500 chars):");
    console.log(storyData?.substring(0, 500));

    // Clean up response
    storyData = storyData
      .replace(/```json\n?/g, "")
      .replace(/```/g, "")
      .replace(/^[\s\n]+/, "")
      .trim();

    // Validate JSON start
    if (!storyData.startsWith("{")) {
      throw new Error("AI response does not start with JSON object");
    }

    let parsedStory;
    try {
      parsedStory = JSON.parse(storyData);
    } catch (jsonError) {
      console.error("❌ JSON Parse Error:", jsonError.message);
      console.error("📄 Problematic JSON (first 1000 chars):");
      console.error(storyData.substring(0, 1000));

      // Attempt auto-fix
      storyData = storyData
        .replace(/\n/g, " ")
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .replace(/\\'/g, "'");

      parsedStory = JSON.parse(storyData);
    }

    // Required fields
    if (
      !parsedStory.title ||
      !parsedStory.scenes ||
      parsedStory.scenes.length === 0
    ) {
      throw new Error("Generated story missing required fields");
    }

    // Create story in DB
    const story = await Story.create({
      ...parsedStory,
      mode,
      difficulty,
      location,
      totalVocabulary: parsedStory.scenes.reduce(
        (sum, scene) => sum + (scene.vocabulary?.length || 0),
        0
      ),
      estimatedTime: parsedStory.scenes.length * 3,
      xpReward: parsedStory.scenes.length * 30,
      generatedByAI: true,
    });

    console.log("✅ AI Story generated successfully!");
    console.log(`📖 Title: ${story.title}`);
    console.log(`🎯 Scenes: ${story.scenes.length}`);

    res.json({
      success: true,
      story,
      message: "Story generated successfully!",
    });
  } catch (error) {
    console.error("❌ Error generating story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate story",
      error: error.message,
    });
  }
};

// Get all stories
export const getAllStories = async (req, res) => {
  try {
    const { mode, difficulty, location } = req.query;

    const filter = { isPublished: true };
    if (mode) filter.mode = mode;
    if (difficulty) filter.difficulty = difficulty;
    if (location) filter.location = location;

    const stories = await Story.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stories.length,
      stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stories",
    });
  }
};

// Get story by ID
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.json({
      success: true,
      story,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch story",
    });
  }
};

// Complete story
export const completeStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    story.completionCount += 1;
    await story.save();

    res.json({
      success: true,
      xpEarned: story.xpReward,
      message: "Story completed!",
    });
  } catch (error) {
    console.error("Error completing story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete story",
    });
  }
};
