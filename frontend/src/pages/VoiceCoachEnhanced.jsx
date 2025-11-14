import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import WaveSurfer from 'wavesurfer.js';

export default function VoiceCoachEnhanced() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ✅ FIXED: Proper Kannada Word List
  const kannadaWords = [
    { word: 'ನಮಸ್ಕಾರ', phonetic: 'Namaskara', meaning: 'Hello', difficulty: 1 },
    { word: 'ಧನ್ಯವಾದ', phonetic: 'Dhanyavada', meaning: 'Thank you', difficulty: 2 },
    { word: 'ಕರ್ನಾಟಕ', phonetic: 'Karnataka', meaning: 'Karnataka', difficulty: 2 },
    { word: 'ಭಾಷೆ', phonetic: 'Bhashe', meaning: 'Language', difficulty: 3 }
  ];

  useEffect(() => {
    // Set default word
    setCurrentWord(kannadaWords[0]);

    // Initialize Wave Surfer
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#8B5CF6',
        progressColor: '#6366F1',
        cursorColor: '#EC4899',
        height: 100,
        barWidth: 3,
        barRadius: 3,
      });
    }

    return () => {
      if (wavesurfer.current) wavesurfer.current.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await analyzePronunciation(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Microphone Access Error:", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzePronunciation = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('expectedWord', currentWord.phonetic);

    const response = await fetch('/api/voice/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });

    const data = await response.json();
    setPronunciationScore(data.score);
    setFeedback(data.feedback);

    // Load waveform
    const audioUrl = URL.createObjectURL(audioBlob);
    wavesurfer.current?.load(audioUrl);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🌟';
    if (score >= 75) return '😊';
    if (score >= 60) return '😐';
    return '😢';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">

        <motion.h1
          className="text-5xl font-bold text-center mb-8 text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🎤 Pronunciation Coach
        </motion.h1>

        {/* Word Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{currentWord?.word}</div>
            <p className="text-2xl text-gray-600 mb-2">({currentWord?.phonetic})</p>
            <p className="text-lg text-gray-500">{currentWord?.meaning}</p>
          </div>

          <div ref={waveformRef} className="mb-6" />

          {/* Record Button */}
          <div className="text-center mb-6">
            <motion.button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-32 h-32 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-purple-500 to-indigo-600"
              } text-white font-bold text-2xl shadow-2xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? "⏺️" : "🎤"}
            </motion.button>

            <p className="mt-4 text-gray-300 font-semibold">
              {isRecording ? "Recording... Release to stop" : "Hold to record"}
            </p>
          </div>

          {/* Score */}
          {pronunciationScore !== null && (
            <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div className="text-6xl mb-2">{getScoreEmoji(pronunciationScore)}</div>
              <div className={`text-5xl font-bold mb-4 ${getScoreColor(pronunciationScore)}`}>
                {pronunciationScore}%
              </div>

              <div className="bg-gray-100 rounded-2xl p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Feedback</h3>
                <div className="space-y-2">
                  {feedback.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-left">
                      <span className={item.correct ? "text-green-500" : "text-red-500"}>
                        {item.correct ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-700">{item.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Word Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kannadaWords.map((w, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setCurrentWord(w);
                setPronunciationScore(null);
                setFeedback([]);
              }}
              className={`p-4 rounded-xl font-bold ${
                currentWord?.word === w.word
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-900"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {w.word}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
