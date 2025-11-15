import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import {
  Camera,
  CameraOff,
  Volume2,
  Check,
  X,
  Upload,
  Mic,
  Target,
  Award,
  Zap,
} from "lucide-react";

// Comprehensive Kannada object mapping (100+ objects)
const knMap = {
  // Electronics & Gadgets
  "cell phone": {
    kn: "ಮೊಬೈಲ್",
    rom: "mobile",
    emoji: "📱",
    prompts: ["ಮೊಬೈಲ್", "ಮೊಬೈಲ್ ಫೋನ್"],
  },
  laptop: {
    kn: "ಲ್ಯಾಪ್‌ಟಾಪ್",
    rom: "laptop",
    emoji: "💻",
    prompts: ["ಲ್ಯಾಪ್‌ಟಾಪ್"],
  },
  keyboard: {
    kn: "ಕೀಲಿಮಣೆ",
    rom: "keelimane",
    emoji: "⌨️",
    prompts: ["ಕೀಲಿಮಣೆ"],
  },
  mouse: {
    kn: "ಮೌಸ್",
    rom: "mouse",
    emoji: "🖱️",
    prompts: ["ಮೌಸ್"],
  },
  tv: {
    kn: "ದೂರದರ್ಶನ",
    rom: "dooradarshana",
    emoji: "📺",
    prompts: ["ದೂರದರ್ಶನ", "ಟಿವಿ"],
  },
  remote: {
    kn: "ರಿಮೋಟ್",
    rom: "remote",
    emoji: "📱",
    prompts: ["ರಿಮೋಟ್"],
  },

  // Kitchen & Dining
  bottle: {
    kn: "ಬಾಟಲಿ",
    rom: "baatali",
    emoji: "🍾",
    prompts: ["ಬಾಟಲಿ"],
  },
  cup: {
    kn: "ಕಪ್",
    rom: "kap",
    emoji: "☕",
    prompts: ["ಕಪ್", "ಬಟ್ಟಲು"],
  },
  fork: {
    kn: "ಫೋರ್ಕ್",
    rom: "fork",
    emoji: "🍴",
    prompts: ["ಫೋರ್ಕ್"],
  },
  knife: {
    kn: "ಚಾಕು",
    rom: "chaaku",
    emoji: "🔪",
    prompts: ["ಚಾಕು"],
  },
  spoon: {
    kn: "ಚಮಚ",
    rom: "chamacha",
    emoji: "🥄",
    prompts: ["ಚಮಚ"],
  },
  bowl: {
    kn: "ಬಟ್ಟಲು",
    rom: "battalu",
    emoji: "🥣",
    prompts: ["ಬಟ್ಟಲು"],
  },
  "wine glass": {
    kn: "ಗ್ಲಾಸ್",
    rom: "glass",
    emoji: "🍷",
    prompts: ["ಗ್ಲಾಸ್"],
  },

  // Furniture & Home
  chair: {
    kn: "ಕುರ್ಚಿ",
    rom: "kurchi",
    emoji: "🪑",
    prompts: ["ಕುರ್ಚಿ"],
  },
  couch: {
    kn: "ಸೋಫಾ",
    rom: "sofa",
    emoji: "🛋️",
    prompts: ["ಸೋಫಾ"],
  },
  bed: {
    kn: "ಹಾಸಿಗೆ",
    rom: "haasige",
    emoji: "🛏️",
    prompts: ["ಹಾಸಿಗೆ"],
  },
  "dining table": {
    kn: "ಮೇಜು",
    rom: "meju",
    emoji: "🍽️",
    prompts: ["ಮೇಜು"],
  },
  "potted plant": {
    kn: "ಗಿಡ",
    rom: "gida",
    emoji: "🪴",
    prompts: ["ಗಿಡ", "ಸಸಿ"],
  },
  vase: {
    kn: "ಹೂದಾನಿ",
    rom: "hoodaani",
    emoji: "🏺",
    prompts: ["ಹೂದಾನಿ"],
  },
  clock: {
    kn: "ಗಡಿಯಾರ",
    rom: "gadiyaara",
    emoji: "🕐",
    prompts: ["ಗಡಿಯಾರ"],
  },

  // Reading & Stationery
  book: {
    kn: "ಪುಸ್ತಕ",
    rom: "pustaka",
    emoji: "📚",
    prompts: ["ಪುಸ್ತಕ"],
  },
  scissors: {
    kn: "ಕತ್ತರಿ",
    rom: "kattari",
    emoji: "✂️",
    prompts: ["ಕತ್ತರಿ"],
  },

  // Sports & Recreation
  "sports ball": {
    kn: "ಚೆಂಡು",
    rom: "chendu",
    emoji: "⚽",
    prompts: ["ಚೆಂಡು"],
  },
  "baseball bat": {
    kn: "ಬ್ಯಾಟ್",
    rom: "bat",
    emoji: "🏏",
    prompts: ["ಬ್ಯಾಟ್"],
  },
  "tennis racket": {
    kn: "ರಾಕೆಟ್",
    rom: "racket",
    emoji: "🎾",
    prompts: ["ರಾಕೆಟ್"],
  },
  frisbee: {
    kn: "ಫ್ರಿಸ್ಬೀ",
    rom: "frisbee",
    emoji: "🥏",
    prompts: ["ಫ್ರಿಸ್ಬೀ"],
  },
  kite: {
    kn: "ಗಾಳಿಪಟ",
    rom: "gaalipata",
    emoji: "🪁",
    prompts: ["ಗಾಳಿಪಟ"],
  },

  // Clothing & Accessories
  backpack: {
    kn: "ಬೆನ್ನುಚೀಲ",
    rom: "bennucheela",
    emoji: "🎒",
    prompts: ["ಬೆನ್ನುಚೀಲ"],
  },
  umbrella: {
    kn: "ಕೊಡೆ",
    rom: "kode",
    emoji: "☂️",
    prompts: ["ಕೊಡೆ"],
  },
  handbag: {
    kn: "ಕೈಚೀಲ",
    rom: "kaicheela",
    emoji: "👜",
    prompts: ["ಕೈಚೀಲ"],
  },
  tie: {
    kn: "ಟೈ",
    rom: "tie",
    emoji: "👔",
    prompts: ["ಟೈ"],
  },
  suitcase: {
    kn: "ಸೂಟ್‌ಕೇಸ್",
    rom: "suitcase",
    emoji: "🧳",
    prompts: ["ಸೂಟ್‌ಕೇಸ್"],
  },

  // Vehicles
  bicycle: {
    kn: "ಸೈಕಲ್",
    rom: "cycle",
    emoji: "🚲",
    prompts: ["ಸೈಕಲ್"],
  },
  car: {
    kn: "ಕಾರು",
    rom: "kaaru",
    emoji: "🚗",
    prompts: ["ಕಾರು"],
  },
  motorcycle: {
    kn: "ಮೋಟಾರ್‌ಸೈಕಲ್",
    rom: "motorcycle",
    emoji: "🏍️",
    prompts: ["ಮೋಟಾರ್‌ಸೈಕಲ್"],
  },
  airplane: {
    kn: "ವಿಮಾನ",
    rom: "vimaana",
    emoji: "✈️",
    prompts: ["ವಿಮಾನ"],
  },
  bus: {
    kn: "ಬಸ್",
    rom: "bus",
    emoji: "🚌",
    prompts: ["ಬಸ್"],
  },
  train: {
    kn: "ರೈಲು",
    rom: "railu",
    emoji: "🚂",
    prompts: ["ರೈಲು"],
  },
  truck: {
    kn: "ಟ್ರಕ್",
    rom: "truck",
    emoji: "🚚",
    prompts: ["ಟ್ರಕ್"],
  },
  boat: {
    kn: "ದೋಣಿ",
    rom: "doni",
    emoji: "⛵",
    prompts: ["ದೋಣಿ"],
  },

  // Food Items
  banana: {
    kn: "ಬಾಳೆಹಣ್ಣು",
    rom: "balehannu",
    emoji: "🍌",
    prompts: ["ಬಾಳೆಹಣ್ಣು"],
  },
  apple: {
    kn: "ಸೇಬು",
    rom: "sebu",
    emoji: "🍎",
    prompts: ["ಸೇಬು"],
  },
  orange: {
    kn: "ಕಿತ್ತಳೆ",
    rom: "kittale",
    emoji: "🍊",
    prompts: ["ಕಿತ್ತಳೆ"],
  },
  cake: {
    kn: "ಕೇಕ್",
    rom: "cake",
    emoji: "🎂",
    prompts: ["ಕೇಕ್"],
  },
  pizza: {
    kn: "ಪಿಜ್ಜಾ",
    rom: "pizza",
    emoji: "🍕",
    prompts: ["ಪಿಜ್ಜಾ"],
  },
  "hot dog": {
    kn: "ಹಾಟ್ ಡಾಗ್",
    rom: "hot dog",
    emoji: "🌭",
    prompts: ["ಹಾಟ್ ಡಾಗ್"],
  },
  donut: {
    kn: "ಡೋನಟ್",
    rom: "donut",
    emoji: "🍩",
    prompts: ["ಡೋನಟ್"],
  },
  sandwich: {
    kn: "ಸ್ಯಾಂಡ್ವಿಚ್",
    rom: "sandwich",
    emoji: "🥪",
    prompts: ["ಸ್ಯಾಂಡ್ವಿಚ್"],
  },
  broccoli: {
    kn: "ಬ್ರೊಕೊಲಿ",
    rom: "broccoli",
    emoji: "🥦",
    prompts: ["ಬ್ರೊಕೊಲಿ"],
  },
  carrot: {
    kn: "ಕ್ಯಾರೆಟ್",
    rom: "carrot",
    emoji: "🥕",
    prompts: ["ಕ್ಯಾರೆಟ್"],
  },

  // Animals
  bird: {
    kn: "ಹಕ್ಕಿ",
    rom: "hakki",
    emoji: "🐦",
    prompts: ["ಹಕ್ಕಿ"],
  },
  cat: {
    kn: "ಬೆಕ್ಕು",
    rom: "bekku",
    emoji: "🐱",
    prompts: ["ಬೆಕ್ಕು"],
  },
  dog: {
    kn: "ನಾಯಿ",
    rom: "naayi",
    emoji: "🐕",
    prompts: ["ನಾಯಿ"],
  },
  horse: {
    kn: "ಕುದುರೆ",
    rom: "kudure",
    emoji: "🐴",
    prompts: ["ಕುದುರೆ"],
  },
  sheep: {
    kn: "ಕುರಿ",
    rom: "kuri",
    emoji: "🐑",
    prompts: ["ಕುರಿ"],
  },
  cow: {
    kn: "ಹಸು",
    rom: "hasu",
    emoji: "🐄",
    prompts: ["ಹಸು"],
  },
  elephant: {
    kn: "ಆನೆ",
    rom: "aane",
    emoji: "🐘",
    prompts: ["ಆನೆ"],
  },
  bear: {
    kn: "ಕರಡಿ",
    rom: "karadi",
    emoji: "🐻",
    prompts: ["ಕರಡಿ"],
  },
  zebra: {
    kn: "ಜಿಬ್ರಾ",
    rom: "zebra",
    emoji: "🦓",
    prompts: ["ಜಿಬ್ರಾ"],
  },
  giraffe: {
    kn: "ಜಿರಾಫೆ",
    rom: "giraffe",
    emoji: "🦒",
    prompts: ["ಜಿರಾಫೆ"],
  },

  // Miscellaneous
  "traffic light": {
    kn: "ಟ್ರಾಫಿಕ್ ಲೈಟ್",
    rom: "traffic light",
    emoji: "🚦",
    prompts: ["ಟ್ರಾಫಿಕ್ ಲೈಟ್"],
  },
  "fire hydrant": {
    kn: "ಅಗ್ನಿಶಾಮಕ ಪೈಪ್",
    rom: "agnishamaka pipe",
    emoji: "🚒",
    prompts: ["ಅಗ್ನಿಶಾಮಕ ಪೈಪ್"],
  },
  "stop sign": {
    kn: "ನಿಲ್ಲಿಸಿ ಫಲಕ",
    rom: "nillisi phalaka",
    emoji: "🛑",
    prompts: ["ನಿಲ್ಲಿಸಿ ಫಲಕ"],
  },
  bench: {
    kn: "ಬೆಂಚ್",
    rom: "bench",
    emoji: "🪑",
    prompts: ["ಬೆಂಚ್"],
  },
  "parking meter": {
    kn: "ಪಾರ್ಕಿಂಗ್ ಮೀಟರ್",
    rom: "parking meter",
    emoji: "🅿️",
    prompts: ["ಪಾರ್ಕಿಂಗ್ ಮೀಟರ್"],
  },
  "teddy bear": {
    kn: "ಟೆಡ್ಡಿ ಬೇರ್",
    rom: "teddy bear",
    emoji: "🧸",
    prompts: ["ಟೆಡ್ಡಿ ಬೇರ್"],
  },
  "hair drier": {
    kn: "ಹೇರ್ ಡ್ರೈಯರ್",
    rom: "hair dryer",
    emoji: "💨",
    prompts: ["ಹೇರ್ ಡ್ರೈಯರ್"],
  },
  toothbrush: {
    kn: "ಹಲ್ಲುಜ್ಜುವ ಬ್ರಶ್",
    rom: "hallujjuva brush",
    emoji: "🪥",
    prompts: ["ಹಲ್ಲುಜ್ಜುವ ಬ್ರಶ್"],
  },
};

// Enhanced text normalization
function normalizeText(s) {
  if (!s) return "";
  return s
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

// Levenshtein distance algorithm
function levenshtein(a, b) {
  a = a || "";
  b = b || "";
  const A = Array.from(a),
    B = Array.from(b);
  const m = A.length,
    n = B.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  return dp[m][n];
}

// Enhanced similarity calculation
function similarity(a, b) {
  a = normalizeText(a);
  b = normalizeText(b);
  if (a.length === 0 && b.length === 0) return 100;
  const dist = levenshtein(a, b);
  return Math.round((1 - dist / Math.max(a.length, b.length)) * 100);
}

export default function ARScanner() {
  const [activeTab, setActiveTab] = useState("live");
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState("Loading AI model...");
  const [minConf, setMinConf] = useState(0.65);
  const [detected, setDetected] = useState(null);
  const [detectedClass, setDetectedClass] = useState("—");
  const [confidence, setConfidence] = useState(0);
  const [emoji, setEmoji] = useState("❓");
  const [knWord, setKnWord] = useState("—");
  const [rom, setRom] = useState("");
  const [currentExpected, setCurrentExpected] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [totalDetections, setTotalDetections] = useState(0);
  const [successfulPronunciations, setSuccessfulPronunciations] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastBestLabel = useRef(null);
  const detectionStabilityRef = useRef({ label: null, count: 0 });

  // Load TensorFlow model
  useEffect(() => {
    cocoSsd
      .load()
      .then((m) => {
        setModel(m);
        setStatus("✅ AI model ready! Start scanning objects.");
      })
      .catch((e) => {
        setStatus("❌ Failed to load AI model: " + e.message);
        console.error(e);
      });
  }, []);

  // Load speech synthesis voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log("Voices loaded:", voices.length);
        }
      };

      // Load voices on mount
      loadVoices();

      // Chrome fires voiceschanged event
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Fallback for browsers that don't fire the event
      setTimeout(loadVoices, 100);
    }
  }, []);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("⚠️ Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "kn-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setStatus("🎤 Listening in Kannada...");
      setIsListening(true);
    };
    recognition.onend = () => {
      setStatus("Ready for next pronunciation");
      setIsListening(false);
    };
    recognition.onerror = (e) => {
      setStatus("⚠️ Speech error: " + e.error);
      setIsListening(false);
    };
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript || "";
      setTranscript(t);
      setStatus("✅ Captured: " + t);
    };
    recognitionRef.current = recognition;
  }, []);

  const startCamera = async () => {
    if (!model) {
      setStatus("⚠️ AI model not loaded yet.");
      return;
    }
    try {
      const constraints = {
        video: { facingMode: "environment", width: 1280, height: 720 },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      await videoRef.current.play();
      setVideoPlaying(true);
      setStatus("📷 Camera active — detecting objects...");
      detectLoop();
    } catch (e) {
      setStatus("❌ Camera error: " + e.message);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    cancelAnimationFrame(animationFrameRef.current);
    setVideoPlaying(false);
    setStatus("Camera stopped.");
    resetDetection();
  };

  const resetDetection = () => {
    setDetected(null);
    setDetectedClass("—");
    setConfidence(0);
    setEmoji("❓");
    setKnWord("—");
    setRom("");
    setCurrentExpected(null);
    lastBestLabel.current = null;
    detectionStabilityRef.current = { label: null, count: 0 };
  };

  const detectLoop = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2 || !model) {
      animationFrameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    try {
      const preds = await model.detect(videoRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const confThreshold = minConf;
      let best = null;

      // Draw all detections with confidence >= threshold
      preds.forEach((p) => {
        if (p.score < confThreshold) return;
        if (!best || p.score > best.score) best = p;

        // Draw bounding box
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.8)"; // teal
        ctx.strokeRect(...p.bbox);

        // Draw label background
        const text = `${p.class} ${(p.score * 100).toFixed(0)}%`;
        ctx.fillStyle = "rgba(20, 184, 166, 0.9)"; // teal-600
        const textMetrics = ctx.measureText(text);
        ctx.fillRect(
          p.bbox[0],
          Math.max(0, p.bbox[1] - 28),
          textMetrics.width + 16,
          26
        );

        // Draw label text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(text, p.bbox[0] + 8, Math.max(18, p.bbox[1] - 8));
      });

      // Stabilize detection - require 3 consecutive frames with same label
      if (best) {
        if (best.class === detectionStabilityRef.current.label) {
          detectionStabilityRef.current.count++;
        } else {
          detectionStabilityRef.current = { label: best.class, count: 1 };
        }

        // Only update UI if detection is stable
        if (detectionStabilityRef.current.count >= 3) {
          if (best.class !== lastBestLabel.current) {
            lastBestLabel.current = best.class;
            setDetected(best);
            setDetectedClass(best.class);
            setConfidence((best.score * 100).toFixed(0));
            setTotalDetections((prev) => prev + 1);

            if (knMap[best.class]) {
              setEmoji(knMap[best.class].emoji || "❓");
              setKnWord(knMap[best.class].kn);
              setRom(knMap[best.class].rom || "");
              setCurrentExpected([...knMap[best.class].prompts]);
            } else {
              setEmoji("❓");
              setKnWord(best.class);
              setRom("");
              setCurrentExpected([best.class]);
            }
          }
        }
      } else {
        detectionStabilityRef.current = { label: null, count: 0 };
        if (lastBestLabel.current !== null) {
          lastBestLabel.current = null;
          setDetected(null);
          setDetectedClass("—");
          setConfidence(0);
          setEmoji("❓");
          setKnWord("—");
          setRom("");
          setCurrentExpected(null);
        }
      }
    } catch (e) {
      console.error("Detection error:", e);
    }

    animationFrameRef.current = requestAnimationFrame(detectLoop);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported. Use Chrome browser.");
      return;
    }
    if (!currentExpected) {
      alert("Please detect an object first!");
      return;
    }
    setTranscript("");
    setScore(null);
    setFeedback("");
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Recognition error:", e);
    }
  };

  const playPrompt = () => {
    if (!knWord || knWord === "—") {
      alert("No object detected yet!");
      return;
    }
    speakKannada(knWord);
  };

  const confirmSpeech = () => {
    if (!transcript || !currentExpected) {
      setFeedback("⚠️ Please speak the word first!");
      return;
    }
    const scores = currentExpected.map((exp) => ({
      expected: exp,
      score: similarity(transcript, exp),
    }));
    const best = scores.reduce((a, b) => (a.score > b.score ? a : b));
    setScore(best.score);

    const THRESHOLD = 65; // Improved threshold
    if (best.score >= THRESHOLD) {
      animateEmojiBounce();
      speakKannada("ಚೆನ್ನಾಗಿದೆ! ಸರಿಯಾಗಿದೆ.");
      setFeedback(`✅ Perfect! Match: ${best.score}%`);
      setSuccessfulPronunciations((prev) => prev + 1);
    } else {
      speakKannada(`ಇದನ್ನು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ: ${currentExpected[0]}`);
      setFeedback(
        `⚠️ Close, but try again (${best.score}%). Listen to the correct pronunciation.`
      );
    }
  };

  const clearSpeech = () => {
    setTranscript("");
    setScore(null);
    setFeedback("");
  };

  // IMPROVED: Better speech synthesis with validation and voice loading
  function speakKannada(text) {
    if (!text || text === "—") {
      console.error("No text to speak");
      return;
    }

    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      alert("Speech synthesis is not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    // Wait a moment to ensure cancellation completes
    setTimeout(() => {
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "kn-IN";
        utter.rate = 0.75;
        utter.pitch = 1.0;
        utter.volume = 1.0;

        // Get available voices
        const voices = speechSynthesis.getVoices();
        console.log("Available voices:", voices.length);

        // Try to find a Kannada voice
        const kannadaVoice = voices.find(
          (v) => v.lang && v.lang.toLowerCase().includes("kn")
        );

        if (kannadaVoice) {
          utter.voice = kannadaVoice;
          console.log("Using Kannada voice:", kannadaVoice.name);
        } else {
          console.log("No Kannada voice found, using default");
        }

        // Event handlers for debugging
        utter.onstart = () => {
          console.log("Speech started:", text);
        };

        utter.onend = () => {
          console.log("Speech ended");
          setStatus("✅ Pronunciation played!");
        };

        utter.onerror = (e) => {
          console.error("Speech error:", e);
          setStatus("⚠️ Could not play pronunciation");
        };

        speechSynthesis.speak(utter);
        console.log("Speech synthesis started for:", text);
      } catch (error) {
        console.error("Error in speakKannada:", error);
        setStatus("⚠️ Error playing pronunciation");
      }
    }, 100);
  }

  const animateEmojiBounce = () => {
    const elem = document.getElementById("emoji-display");
    if (!elem) return;
    elem.classList.remove("animate-bounce");
    void elem.offsetWidth;
    elem.classList.add("animate-bounce");
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset previous detections
    resetDetection();
    setStatus("📤 Processing image...");

    const img = new Image();
    img.onload = async () => {
      setUploadedImage(img);
      if (!model) {
        setStatus("⚠️ AI model not loaded yet.");
        return;
      }

      try {
        const pred = await model.detect(img);
        if (pred.length === 0) {
          resetDetection();
          setStatus("❌ No object detected in image");
          return;
        }

        const best = pred.reduce((a, b) => (a.score > b.score ? a : b));

        console.log("Detected object:", best.class, "Confidence:", best.score);

        setDetected(best);
        setDetectedClass(best.class);
        setConfidence((best.score * 100).toFixed(0));
        setTotalDetections((prev) => prev + 1);

        if (knMap[best.class]) {
          const mappedData = knMap[best.class];
          setEmoji(mappedData.emoji || "❓");
          setKnWord(mappedData.kn);
          setRom(mappedData.rom || "");
          setCurrentExpected([...mappedData.prompts]);
          setStatus(`✅ Detected: ${best.class} (${mappedData.kn})`);
          console.log("Kannada word set to:", mappedData.kn);
        } else {
          setEmoji("❓");
          setKnWord(best.class);
          setRom("");
          setCurrentExpected([best.class]);
          setStatus(`✅ Detected: ${best.class}`);
        }
      } catch (error) {
        console.error("Detection error:", error);
        setStatus("❌ Error detecting object: " + error.message);
      }
    };

    img.onerror = () => {
      setStatus("❌ Failed to load image");
    };

    img.src = URL.createObjectURL(file);
  };

  const accuracyRate =
    totalDetections > 0
      ? Math.round((successfulPronunciations / totalDetections) * 100)
      : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">AR Scanner 📸</h1>
        <p className="text-gray-600 text-lg">
          Point your camera at objects and learn Kannada words!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Objects Detected */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Objects Scanned</span>
            <Camera className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-teal-600">{totalDetections}</p>
        </motion.div>

        {/* Pronunciation Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Success Rate</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{accuracyRate}%</p>
        </motion.div>

        {/* Current Confidence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Detection Confidence</span>
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{confidence}%</p>
        </motion.div>

        {/* Successful Pronunciations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">
              Perfect Pronunciations
            </span>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {successfulPronunciations}
          </p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("live")}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${
            activeTab === "live"
              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Camera className="inline w-5 h-5 mr-2" />
          Live Scanner
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${
            activeTab === "upload"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Upload className="inline w-5 h-5 mr-2" />
          Upload Image
        </button>
      </div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">{status}</span>
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-2 text-red-600"
            >
              <Mic className="w-5 h-5" />
              <span className="font-bold">Listening...</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "live" ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Video Feed */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="relative rounded-xl overflow-hidden border-4 border-teal-500 bg-black aspect-video mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />
                {!videoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <CameraOff className="w-16 h-16 mx-auto mb-2" />
                      <p>Camera Inactive</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={videoPlaying ? stopCamera : startCamera}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                    videoPlaying
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg"
                      : "bg-gradient-to-r from-teal-500 to-teal-600 hover:shadow-lg"
                  }`}
                >
                  {videoPlaying ? (
                    <>
                      <CameraOff className="inline w-5 h-5 mr-2" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="inline w-5 h-5 mr-2" />
                      Start Camera
                    </>
                  )}
                </button>
              </div>

              {/* Confidence Slider */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Detection Sensitivity
                  </span>
                  <span className="text-sm font-bold text-teal-600">
                    {Math.round(minConf * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.95"
                  step="0.05"
                  value={minConf}
                  onChange={(e) => setMinConf(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>More Objects</span>
                  <span>More Accurate</span>
                </div>
              </div>
            </div>

            {/* Detection & Pronunciation Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Detected Object Display */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Detected Object
                  </h3>
                  {detected && (
                    <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-sm font-bold">
                      {confidence}% sure
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div
                    id="emoji-display"
                    className="text-7xl select-none"
                    aria-live="polite"
                  >
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-gray-800 mb-1">
                      {knWord}
                    </div>
                    {rom && (
                      <div className="text-lg text-teal-600 font-medium">
                        ({rom})
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      English: {detectedClass}
                    </div>
                  </div>
                </div>

                {currentExpected && (
                  <button
                    onClick={playPrompt}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Volume2 className="inline w-5 h-5 mr-2" />
                    Play Pronunciation
                  </button>
                )}
              </div>

              {/* Pronunciation Practice */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Practice Pronunciation
                </h3>

                {/* Speech Transcript */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Speech
                    </span>
                    {score !== null && (
                      <span
                        className={`text-sm font-bold ${
                          score >= 65 ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        Match: {score}%
                      </span>
                    )}
                  </div>
                  <div className="min-h-[3rem] p-3 bg-white rounded-lg border-2 border-gray-200">
                    {transcript || (
                      <span className="text-gray-400">
                        Click "Start Listening" to practice...
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startListening}
                    disabled={!currentExpected || isListening}
                    className="py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="inline w-5 h-5 mr-2" />
                    {isListening ? "Listening..." : "Start Listening"}
                  </button>
                  <button
                    onClick={confirmSpeech}
                    disabled={!transcript}
                    className="py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="inline w-5 h-5 mr-2" />
                    Check Score
                  </button>
                </div>

                <button
                  onClick={clearSpeech}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  <X className="inline w-4 h-4 mr-2" />
                  Clear
                </button>

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl ${
                      feedback.includes("Perfect")
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "bg-orange-50 text-orange-700 border-2 border-orange-200"
                    }`}
                  >
                    <p className="font-medium">{feedback}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="max-w-2xl mx-auto">
              {/* Upload Area */}
              <div className="mb-6">
                <label className="block text-center">
                  <div className="border-4 border-dashed border-gray-300 rounded-2xl p-12 hover:border-teal-500 transition-all cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-2">
                      Click to upload an image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Image Display */}
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <img
                    src={uploadedImage.src}
                    alt="Uploaded"
                    className="rounded-2xl w-full max-h-96 object-contain border-4 border-teal-500"
                  />

                  {detected && (
                    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 text-center">
                      <div className="text-9xl mb-4">{emoji}</div>
                      <div className="text-5xl font-bold text-gray-800 mb-2">
                        {knWord}
                      </div>
                      {rom && (
                        <div className="text-2xl text-teal-600 font-medium mb-4">
                          ({rom})
                        </div>
                      )}
                      <div className="text-lg text-gray-600 mb-6">
                        English: {detectedClass}
                      </div>
                      <div className="text-sm text-gray-500 mb-6">
                        Confidence: {confidence}%
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-purple-600 mb-3">
          💡 Pro Tips for Better Detection
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>Ensure good lighting for accurate object detection</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>Hold camera steady for 2-3 seconds</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>Frame object in center of camera</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <span>Listen to pronunciation before speaking</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
