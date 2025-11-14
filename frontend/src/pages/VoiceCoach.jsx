import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Mic,
  Volume2,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function VoiceCoach() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchExercises();

    // Cleanup on unmount
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("kannada_auth_token");
      const response = await fetch(`${API_BASE_URL}/voice/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Loaded exercises:", data);
        setExercises(data);
      } else {
        console.error("Failed to fetch exercises:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    }
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio chunk received:", event.data.size, "bytes");
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log(
          "Recording stopped, chunks:",
          audioChunksRef.current.length
        );
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        console.log("Audio blob created:", audioBlob.size, "bytes");

        if (audioBlob.size > 0) {
          await checkPronunciation(audioBlob);
        } else {
          setResult({
            isCorrect: false,
            score: 0,
            feedback: "No audio recorded. Please try again and speak clearly.",
          });
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setResult(null);

      // Auto-stop after 3 seconds
      recordingTimeoutRef.current = setTimeout(() => {
        console.log("Auto-stopping recording...");
        stopRecording();
      }, 3000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "Microphone access denied. Please allow microphone access in your browser settings."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Stopping recording manually...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    }
  };

  const checkPronunciation = async (audioBlob) => {
    setLoading(true);
    console.log("Checking pronunciation...", { audioSize: audioBlob.size });

    try {
      const token = localStorage.getItem("kannada_auth_token");
      const formData = new FormData();

      // Create a proper File object for the audio
      const audioFile = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
        lastModified: Date.now(),
      });

      formData.append("audio", audioFile, "recording.webm");
      formData.append("expectedWord", exercises[currentIndex].word);
      formData.append(
        "expectedTranslation",
        exercises[currentIndex].translation
      );

      console.log("Sending to backend:", {
        expectedWord: exercises[currentIndex].word,
        expectedTranslation: exercises[currentIndex].translation,
        audioSize: audioBlob.size,
      });

      const response = await fetch(`${API_BASE_URL}/voice/check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok) {
        setResult(data);

        if (data.isCorrect) {
          setScore((prevScore) => prevScore + data.score);
        }
      } else {
        console.error("Backend error:", data);
        setResult({
          isCorrect: false,
          score: 0,
          feedback:
            data.message ||
            data.error ||
            "Failed to process audio. Please try again.",
          error: data.error,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setResult({
        isCorrect: false,
        score: 0,
        feedback:
          "Network error. Please check if the backend is running at " +
          API_BASE_URL,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResult(null);
    } else {
      navigate("/dashboard", {
        state: {
          voiceScore: score,
          voiceCompleted: true,
        },
      });
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "kn-IN";
      utterance.rate = 0.8; // Slower for learning
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported");
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercises...</p>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Voice Coach</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary-600" />
              <span className="font-bold">{score} points</span>
            </div>
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {exercises.length}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-gradient-to-r from-accent-purple to-accent-pink h-2 rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Card */}
      <Card className="mb-6">
        <div className="text-center mb-8">
          <div
            className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
              currentExercise.difficulty === "easy"
                ? "bg-success/20 text-success"
                : currentExercise.difficulty === "medium"
                ? "bg-secondary-100 text-secondary-700"
                : "bg-error/20 text-error"
            }`}
          >
            {currentExercise.difficulty.toUpperCase()}
          </div>

          <h3 className="text-6xl font-bold text-primary-600 mb-4">
            {currentExercise.word}
          </h3>

          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="text-2xl text-gray-700">
              {currentExercise.translation}
            </p>
            <button
              onClick={() => speak(currentExercise.word)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Listen to pronunciation"
            >
              <Volume2 className="w-6 h-6 text-primary-600" />
            </button>
          </div>

          <p className="text-gray-600">Meaning: {currentExercise.meaning}</p>
        </div>

        {/* Recording Button */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRecording
                ? "bg-error animate-pulse"
                : loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-br from-accent-purple to-accent-pink hover:shadow-xl"
            }`}
          >
            <Mic className="w-16 h-16 text-white" />
          </motion.button>

          <p className="text-sm text-gray-600 font-medium">
            {isRecording
              ? "🔴 Recording... (Auto-stops in 3s)"
              : loading
              ? "⏳ Analyzing your pronunciation..."
              : "🎤 Tap to record your pronunciation"}
          </p>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mt-6 p-6 rounded-xl ${
                result.isCorrect
                  ? "bg-success/10 border-2 border-success"
                  : "bg-error/10 border-2 border-error"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-error flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-lg">
                      {result.isCorrect
                        ? "✨ Excellent!"
                        : "💪 Keep Practicing!"}
                    </h4>
                    {result.transcription && (
                      <p className="text-sm text-gray-600">
                        You said: "
                        <span className="font-medium">
                          {result.transcription}
                        </span>
                        "
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{result.score}/10</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{result.feedback}</p>

              {result.error && (
                <p className="text-xs text-gray-500 mb-4">
                  Debug: {result.error}
                </p>
              )}

              <Button onClick={handleNext} className="w-full">
                {currentIndex < exercises.length - 1
                  ? "Next Word →"
                  : "Finish 🎉"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Tips */}
      <Card className="bg-primary-50 border-primary-200">
        <h4 className="font-bold mb-2">💡 Tips for Better Pronunciation:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>- Speak clearly and at a normal pace</li>
          <li>- Listen to the example first by clicking the speaker icon</li>
          <li>- Practice in a quiet environment</li>
          <li>- Hold your microphone close to your mouth</li>
          <li>- Try to match the pronunciation you hear</li>
        </ul>
      </Card>
    </div>
  );
}
