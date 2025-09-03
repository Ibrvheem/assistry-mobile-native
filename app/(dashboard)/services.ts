import api from "@/lib/api";
import {Deposit,} from "./types";

export async function getByYou() {
  const response = await api.get("tasks/by-you");
  console.log("BY YOU RAW RESPONSE", response.data);
  console.log('BY YOU RESPONSE', response);
  return response;
}
export async function getForYou() {
  const response = await api.get("tasks/for-you");
  return response;
}
export async function getYourToDO() {
  const response = await api.get("tasks/to-do");
  return response;
}
export async function getYourTaskAcceptedByOthers() {
  const response = await api.get("tasks/accepted");
  return response;
}
export async function getAvailable() {
  const response = await api.get("tasks/available");
  return response;
}
export async function getWallet() {
  console.log('GETTING WALLET');
  const response = await api.get("wallet");
  console.log('WALLET RESPONSE', response);
  return response;
}

export async function deposit(payload: Deposit) {
  const response = await api.post("wallet/deposit", payload);
  return response;
}
export async function getUsers() {
  const response = await api.get("users");
  return response;
}
