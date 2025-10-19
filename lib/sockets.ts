// lib/socket.ts
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
const token = await AsyncStorage.getItem("token");
let socket: Socket | null = null;

export const getSocket = () => {
  
  if (!socket) {
    socket = io("https://9cbee0fd7663.ngrok-free.app", {
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token: token, // pass your auth token if required
      },
    });
  }
  return socket;
};
