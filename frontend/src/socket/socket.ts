import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.SERVER_URL ?? "http://localhost:3000";
export const socket = io(SERVER_URL);

socket.onAny((event, ...args) => console.log("⬅️", event, args));
