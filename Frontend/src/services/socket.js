import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  withCredentials: true,
  transports: ["websocket"], // 🔥 force websocket (prevents polling issues)
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

export default socket;
