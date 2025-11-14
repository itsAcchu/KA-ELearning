import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
    );

    this.socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Battle Royale methods
  joinBattleRoom(roomId, userData) {
    this.socket.emit("join-battle", { roomId, userData });
  }

  submitAnswer(data) {
    this.socket.emit("battle-answer", data);
  }

  onPlayerJoined(callback) {
    this.socket.on("player-joined", callback);
  }

  onQuestionStart(callback) {
    this.socket.on("question-start", callback);
  }

  onPlayerEliminated(callback) {
    this.socket.on("player-eliminated", callback);
  }

  onBattleEnd(callback) {
    this.socket.on("battle-end", callback);
  }
}

export default new SocketService();
