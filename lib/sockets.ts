import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url as Baseurl } from "./api";

let socket: Socket | null = null;

const url=`${Baseurl}/chat`
// const url = "https://assistry-backend.onrender.com/chat";

export const getSocket = async (): Promise<Socket> => {
  if (!socket) {
    const token = await AsyncStorage.getItem("token");

    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true, // 👈 disable autoConnect to control manually
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  // 👇 Ensure it's connected before returning
  if (!socket.connected) {
    socket.connect();

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket?.off("connect", onConnect);
        reject(new Error("Socket connection timed out"));
      }, 10000); // 10s timeout guard

      const onConnect = () => {
        clearTimeout(timeout);
        socket?.off("connect", onConnect);
        resolve();
      };

      socket?.on("connect", onConnect);
    });
  }

  return socket;
};
