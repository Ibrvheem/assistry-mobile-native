import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url as Baseurl } from "./api";

let socket: Socket | null = null;
const url = `${Baseurl}/chat`;

type MessageCallback = (message: any) => void;
const messageListeners: MessageCallback[] = [];

export const onMessageReceived = (callback: MessageCallback) => {
  messageListeners.push(callback);
  return () => {
    const index = messageListeners.indexOf(callback);
    if (index > -1) {
      messageListeners.splice(index, 1);
    }
  };
};

export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    const token = await AsyncStorage.getItem("token");

    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true,
      auth: { token },
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    setupSocketListeners(socket);
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

const setupSocketListeners = (socket: Socket) => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("message", async (payload: any) => {
    console.log("Received message:", payload);
    messageListeners.forEach(listener => listener(payload));
  });
};

export const sendMessage = async (payload: any) => {
  const socket = await getSocket();
  return new Promise((resolve, reject) => {
    socket.emit("sendMessage", payload, (ack: any) => {
      if (ack?.status === "ok") {
        resolve(ack.data);
      } else {
        reject(new Error("Message send failed"));
      }
    });
  });
};

