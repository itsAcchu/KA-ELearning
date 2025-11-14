import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Vision Controller Loaded (Vocabulary-based)");

// Predefined Kannada vocabulary
const OBJECT_VOCABULARY = {
  bottle: { kannada: "ಬಾಟಲಿ", phonetic: "Batali", english: "Bottle" },
  book: { kannada: "ಪುಸ್ತಕ", phonetic: "Pustaka", english: "Book" },
  cup: { kannada: "ಕಪ್", phonetic: "Kap", english: "Cup" },
  phone: { kannada: "ಮೊಬೈಲ್", phonetic: "Mobile", english: "Phone" },
  mobile: { kannada: "ಮೊಬೈಲ್", phonetic: "Mobile", english: "Phone" },
  laptop: { kannada: "ಲ್ಯಾಪ್ಟಾಪ್", phonetic: "Laptop", english: "Laptop" },
  computer: { kannada: "ಲ್ಯಾಪ್ಟಾಪ್", phonetic: "Laptop", english: "Laptop" },
  pen: { kannada: "ಪೆನ್", phonetic: "Pen", english: "Pen" },
  chair: { kannada: "ಕುರ್ಚಿ", phonetic: "Kurchi", english: "Chair" },
  table: { kannada: "ಮೇಜು", phonetic: "Meju", english: "Table" },
  bag: { kannada: "ಚೀಲ", phonetic: "Chela", english: "Bag" },
  watch: { kannada: "ಗಡಿಯಾರ", phonetic: "Gadiyara", english: "Watch" },
  key: { kannada: "ಕೀಲಿ", phonetic: "Kili", english: "Key" },
  glass: { kannada: "ಗ್ಲಾಸ್", phonetic: "Glass", english: "Glass" },
  plate: { kannada: "ತಟ್ಟೆ", phonetic: "Tatte", english: "Plate" },
  spoon: { kannada: "ಚಮಚ", phonetic: "Chamacha", english: "Spoon" },
  knife: { kannada: "ಚಾಕು", phonetic: "Chaku", english: "Knife" },
  shoe: { kannada: "ಶೂ", phonetic: "Shoe", english: "Shoe" },
  hat: { kannada: "ಟೋಪಿ", phonetic: "Topi", english: "Hat" },
  clock: { kannada: "ಗಡಿಯಾರ", phonetic: "Gadiyara", english: "Clock" },
  mirror: { kannada: "ಕನ್ನಡಿ", phonetic: "Kannadi", english: "Mirror" },
  door: { kannada: "ಬಾಗಿಲು", phonetic: "Bagilu", english: "Door" },
};

// Simulated object detection (for demo purposes)
// In production, you would use a real computer vision API
function detectObjectFromImage(imageBase64) {
  // This is a simple demo implementation
  // For a real app, you'd use:
  // - Google Cloud Vision API
  // - AWS Rekognition
  // - Azure Computer Vision
  // - TensorFlow.js

  // For now, return a random object for demo
  const objects = Object.keys(OBJECT_VOCABULARY);
  const randomObject = objects[Math.floor(Math.random() * objects.length)];

  console.log(`🎲 Demo mode: Randomly selected "${randomObject}"`);
  return randomObject;
}

export const analyzeImage = async (req, res) => {
  try {
    console.log("📸 Received image analysis request");

    const { imageBase64 } = req.body;

    if (!imageBase64) {
      console.log("❌ No image provided");
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    console.log("✅ Image received, analyzing...");

    // Simulate object detection
    // NOTE: This is a DEMO implementation
    // Replace with real computer vision API in production
    const detectedObject = detectObjectFromImage(imageBase64);

    console.log("🎯 Detected object:", detectedObject);

    // Check if object is in vocabulary
    if (OBJECT_VOCABULARY[detectedObject]) {
      const translation = OBJECT_VOCABULARY[detectedObject];
      console.log("✅ Object found in vocabulary:", translation);

      return res.json({
        success: true,
        detected: detectedObject,
        english: translation.english,
        kannada: translation.kannada,
        phonetic: translation.phonetic,
        note: "Demo mode: Random object selection. Integrate real vision API for production.",
      });
    } else {
      console.log("❌ Object not in vocabulary");
      return res.json({
        success: false,
        message: "Object not recognized. Try: bottle, book, cup, phone, etc.",
      });
    }
  } catch (error) {
    console.error("❌ Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze image",
      error: error.message,
    });
  }
};

// Get list of supported objects
export const getSupportedObjects = async (req, res) => {
  try {
    const objects = Object.values(OBJECT_VOCABULARY).map((obj) => ({
      english: obj.english,
      kannada: obj.kannada,
      phonetic: obj.phonetic,
    }));

    res.json({ objects });
  } catch (error) {
    console.error("Error fetching objects:", error);
    res.status(500).json({ message: "Failed to fetch objects" });
  }
};
