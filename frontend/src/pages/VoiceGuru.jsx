import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// 3D Guru Avatar Component
function GuruAvatar({ isSpeaking }) {
  const groupRef = useRef();
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (groupRef.current) {
      // Idle floating animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;

      // Speaking pulse animation
      if (isSpeaking) {
        const pulse = Math.sin(state.clock.elapsedTime * 10) * 0.05 + 1;
        setScale(pulse);
      } else {
        setScale(1);
      }
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 32]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>

      {/* Traditional Turban */}
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.6, 0.3, 32]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Mustache */}
      <mesh position={[0, 1.4, 0.45]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>
      <mesh position={[0.5, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>

      {/* Glowing aura */}
      {isSpeaking && (
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function VoiceGuru() {
  const [sessionId, setSessionId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [guruResponse, setGuruResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    startSession();
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const startSession = async () => {
    const response = await fetch('/api/voice-guru/session/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ sessionType: 'conversation' }),
    });

    const data = await response.json();
    setSessionId(data.sessionId);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToGuru(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToGuru = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('sessionId', sessionId);

    try {
      const response = await fetch('/api/voice-guru/session/input', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      setTranscript(data.transcript);
      setGuruResponse(data.response);

      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', content: data.transcript },
        { role: 'guru', content: data.response },
      ]);

      if (data.audioUrl) playAudioResponse(data.audioUrl);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const playAudioResponse = (audioUrl) => {
    setIsSpeaking(true);
    audioRef.current.src = audioUrl;
    audioRef.current.play();

    audioRef.current.onended = () => {
      setIsSpeaking(false);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-5xl font-bold text-center mb-8 text-orange-900"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          🙏 AI Voice ಗುರು (Guru)
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Avatar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
              <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[3, 3, 3]} intensity={1} />
                <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} />
                <GuruAvatar isSpeaking={isSpeaking} />
                <OrbitControls
                  enableZoom={false}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3}
                />
              </Canvas>
            </div>

            {/* Recording Button */}
            <div className="mt-6 text-center">
              <motion.button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`w-24 h-24 rounded-full ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-orange-500 to-red-500'
                } text-white font-bold text-xl shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isRecording ? '🔴' : '🎤'}
              </motion.button>
              <p className="mt-4 text-gray-600 font-semibold">
                {isRecording ? 'Recording... Release to send' : 'Hold to speak'}
              </p>
            </div>
          </div>

          {/* Conversation */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-orange-900">Conversation</h2>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
              {conversationHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ x: msg.role === 'user' ? 50 : -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-orange-100 text-gray-900'
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {msg.role === 'user' ? 'You' : 'ಗುರು (Guru)'}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isSpeaking && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-start">
                  <div className="bg-orange-100 p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" />
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100" />
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                📝 Generate Quiz
              </button>
              <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                💡 Explain Concept
              </button>
              <button className="bg-gradient-to-r from-purple-400 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                🎯 Practice Pronunciation
              </button>
              <button className="bg-gradient-to-r from-pink-400 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                📖 Tell a Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
