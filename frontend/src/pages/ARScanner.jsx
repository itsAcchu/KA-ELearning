import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Volume2,
  Loader,
  X,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// TensorFlow.js imports
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// Kannada vocabulary database
const VOCABULARY = {
  bottle: { kannada: "ಬಾಟಲಿ", phonetic: "Batali", english: "Bottle" },
  book: { kannada: "ಪುಸ್ತಕ", phonetic: "Pustaka", english: "Book" },
  cup: { kannada: "ಕಪ್", phonetic: "Kap", english: "Cup" },
  "cell phone": { kannada: "ಮೊಬೈಲ್", phonetic: "Mobile", english: "Phone" },
  phone: { kannada: "ಮೊಬೈಲ್", phonetic: "Mobile", english: "Phone" },
  laptop: { kannada: "ಲ್ಯಾಪ್ಟಾಪ್", phonetic: "Laptop", english: "Laptop" },
  keyboard: { kannada: "ಕೀಬೋರ್ಡ್", phonetic: "Keyboard", english: "Keyboard" },
  mouse: { kannada: "ಮೌಸ್", phonetic: "Mouse", english: "Mouse" },
  chair: { kannada: "ಕುರ್ಚಿ", phonetic: "Kurchi", english: "Chair" },
  "dining table": { kannada: "ಮೇಜು", phonetic: "Meju", english: "Table" },
  backpack: { kannada: "ಚೀಲ", phonetic: "Chela", english: "Bag" },
  handbag: { kannada: "ಚೀಲ", phonetic: "Chela", english: "Bag" },
  clock: { kannada: "ಗಡಿಯಾರ", phonetic: "Gadiyara", english: "Clock" },
  "wine glass": { kannada: "ಗ್ಲಾಸ್", phonetic: "Glass", english: "Glass" },
  fork: { kannada: "ಫೋರ್ಕ್", phonetic: "Fork", english: "Fork" },
  knife: { kannada: "ಚಾಕು", phonetic: "Chaku", english: "Knife" },
  spoon: { kannada: "ಚಮಚ", phonetic: "Chamacha", english: "Spoon" },
  bowl: { kannada: "ಬಟ್ಟಲು", phonetic: "Battalu", english: "Bowl" },
  banana: { kannada: "ಬಾಳೆಹಣ್ಣು", phonetic: "Balehannu", english: "Banana" },
  apple: { kannada: "ಸೇಬು", phonetic: "Sebu", english: "Apple" },
  orange: { kannada: "ಕಿತ್ತಳೆ", phonetic: "Kittale", english: "Orange" },
  car: { kannada: "ಕಾರು", phonetic: "Karu", english: "Car" },
  bicycle: { kannada: "ಸೈಕಲ್", phonetic: "Cycle", english: "Bicycle" },
  motorcycle: { kannada: "ಬೈಕ್", phonetic: "Bike", english: "Motorcycle" },
  umbrella: { kannada: "ಛತ್ರಿ", phonetic: "Chatri", english: "Umbrella" },
};

export default function ARScanner() {
  // State management
  const [model, setModel] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [modelProgress, setModelProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Load AI model on mount
  useEffect(() => {
    loadAIModel();
  }, []);

  const loadAIModel = async () => {
    try {
      console.log("🤖 Loading TensorFlow.js COCO-SSD model...");
      setModelProgress(20);

      // Set backend
      await tf.setBackend("webgl");
      setModelProgress(40);

      // Load COCO-SSD model
      const loadedModel = await cocoSsd.load();
      setModelProgress(100);

      setModel(loadedModel);
      setIsLoadingModel(false);
      console.log("✅ Model loaded successfully!");
    } catch (err) {
      console.error("❌ Model loading error:", err);
      setError("Failed to load AI model. Please refresh the page.");
      setIsLoadingModel(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!model || !uploadedImage || !imageRef.current) {
      setError("Please wait for model to load and upload an image.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log("🔍 Analyzing image...");

      // Wait for image to load
      if (!imageRef.current.complete) {
        await new Promise((resolve) => {
          imageRef.current.onload = resolve;
        });
      }

      // Detect objects
      const predictions = await model.detect(imageRef.current);
      console.log("📊 Predictions:", predictions);

      if (!predictions || predictions.length === 0) {
        setError("No objects detected. Try a clearer image.");
        setIsAnalyzing(false);
        return;
      }

      // Get best prediction
      const topPrediction = predictions[0];
      const detectedClass = topPrediction.class.toLowerCase();
      const confidence = (topPrediction.score * 100).toFixed(1);

      console.log(
        "🎯 Detected:",
        detectedClass,
        "Confidence:",
        confidence + "%"
      );

      // Check vocabulary
      if (VOCABULARY[detectedClass]) {
        const translation = VOCABULARY[detectedClass];
        const resultData = {
          english: translation.english,
          kannada: translation.kannada,
          phonetic: translation.phonetic,
          confidence: confidence,
        };

        setResult(resultData);
        setTimeout(() => speakResult(resultData), 500);
      } else {
        setError(
          `Detected "${detectedClass}" (${confidence}% confidence), but it's not in our vocabulary. Try: book, bottle, cup, phone, laptop, chair, bag, etc.`
        );
      }
    } catch (err) {
      console.error("❌ Analysis error:", err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speakResult = (data) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const englishUtterance = new SpeechSynthesisUtterance(data.english);
    englishUtterance.lang = "en-US";
    englishUtterance.rate = 0.9;

    englishUtterance.onend = () => {
      setTimeout(() => {
        const kannadaUtterance = new SpeechSynthesisUtterance(data.phonetic);
        kannadaUtterance.lang = "en-IN";
        kannadaUtterance.rate = 0.8;
        window.speechSynthesis.speak(kannadaUtterance);
      }, 300);
    };

    window.speechSynthesis.speak(englishUtterance);
  };

  const reset = () => {
    setUploadedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Loading screen
  if (isLoadingModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <Loader className="w-16 h-16 mx-auto text-purple-600 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Loading AI Model
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${modelProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-gray-600 text-center text-sm">
            Downloading TensorFlow.js COCO-SSD (~2MB)
          </p>
          <p className="text-gray-500 text-center text-xs mt-2">
            This happens once per session
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
              <Camera className="w-10 h-10" />
              AR Object Scanner
            </h1>
            <p className="text-gray-600 mb-2">
              Upload photos to learn Kannada words instantly!
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Real AI Detection Powered by TensorFlow.js
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              /* Upload Section */
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Camera className="w-24 h-24 mx-auto text-purple-400 mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Upload an Image
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Take a photo of everyday objects and learn their Kannada names
                  with AI!
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all">
                    <Upload className="w-6 h-6" />
                    Choose Image
                  </div>
                </label>
              </motion.div>
            ) : (
              /* Image Analysis Section */
              <motion.div
                key="analyze"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Image Preview */}
                <div className="relative mb-6">
                  <img
                    ref={imageRef}
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full max-h-96 object-contain rounded-xl border-4 border-purple-200 bg-gray-50"
                    crossOrigin="anonymous"
                  />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Analyze Button */}
                {!result && !isAnalyzing && !error && (
                  <button
                    onClick={analyzeImage}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-6 h-6" />
                    Analyze with AI
                  </button>
                )}

                {/* Loading */}
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <Loader className="w-16 h-16 mx-auto text-purple-600 animate-spin mb-4" />
                    <p className="text-xl font-semibold text-gray-700">
                      Detecting objects...
                    </p>
                    <p className="text-gray-500 mt-2">Using TensorFlow.js AI</p>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl border-2 border-purple-300"
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-3">
                        ✓ Detected with {result.confidence}% confidence
                      </p>
                      <h3 className="text-4xl font-bold text-purple-600 mb-4">
                        {result.english}
                      </h3>
                      <p className="text-6xl font-bold text-pink-600 mb-3">
                        {result.kannada}
                      </p>
                      <p className="text-2xl text-gray-700">
                        ({result.phonetic})
                      </p>
                    </div>

                    <button
                      onClick={() => speakResult(result)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 mb-3"
                    >
                      <Volume2 className="w-5 h-5" />
                      Play Audio Again
                    </button>

                    <button
                      onClick={reset}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                    >
                      Try Another Image
                    </button>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-xl"
                  >
                    <p className="font-bold text-lg mb-2">⚠️ Error</p>
                    <p className="mb-4">{error}</p>
                    <button
                      onClick={reset}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Supported Objects */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📋 Supported Objects ({Object.keys(VOCABULARY).length} items)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(VOCABULARY)
              .filter(
                (v, i, arr) =>
                  arr.findIndex((t) => t.english === v.english) === i
              )
              .map((obj) => (
                <div
                  key={obj.english}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-3 rounded-lg text-center font-medium text-gray-700 hover:shadow-md transition"
                >
                  {obj.english}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
