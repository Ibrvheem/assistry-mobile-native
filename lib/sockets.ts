import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url as Baseurl } from "./api";
import { database } from "@/database";
import { Message } from "@/database/models";

let socket: Socket | null = null;

const url = `${Baseurl}/chat`;

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
    // Trigger sync or queue processing here
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("message", async (payload: any) => {
    console.log("Received message:", payload);
    try {
      await database.write(async () => {
        const messageCollection = database.get<Message>("messages");
        
        // Check if message already exists (deduplication)
        try {
          const existing = await messageCollection.find(payload._id);
          if (existing) return;
        } catch (e) {
          // Not found, proceed to create
        }

        await messageCollection.create((message) => {
          message._raw.id = payload._id; // Use backend ID
          message.conversationId = payload.roomId;
          message.senderId = payload.sender;
          message.content = payload.text;
          message.type = payload.type || "text";
          message.status = "delivered";
          message.createdAt = new Date(payload.createdAt).getTime();
        });
      });
    } catch (error) {
      console.error("Error saving incoming message:", error);
    }
  });
};

export const sendMessage = async (payload: any) => {
  const socket = await getSocket();
  return new Promise((resolve, reject) => {
    socket.emit("sendMessage", payload, async (ack: any) => {
      if (ack?.status === "ok") {
        // Update local message with server ID and status
        try {
          await database.write(async () => {
            const messageCollection = database.get<Message>("messages");
            const message = await messageCollection.find(payload.tempId);
            await message.update((m) => {
              m._raw.id = ack.data.id; // Replace temp ID with real ID
              m.status = "sent";
            });
          });
          resolve(ack.data);
        } catch (e) {
          console.error("Failed to update message after ack:", e);
          resolve(ack.data); // Resolve anyway
        }
      } else {
        reject(new Error("Message send failed"));
      }
    });
  });
};
