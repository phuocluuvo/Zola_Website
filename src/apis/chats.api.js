import http from "../utils/http";

export const getChats = () => http.get("/api/chat");
export const accessToChat = (userId) => http.post("/api/chat", userId);
export const searchChats = (searchParam) =>
  http.get(`/api/user?search=${searchParam}`);
export const createChat = (chatInfo) => http.post("/api/chat/group", chatInfo);
export const removeUserFromChat = (chatId, userId) =>
  http.put(`/api/chat/groupremove`, {
    chatId: chatId,
    userId: userId,
  });
export const renameChat = (chatId, newName) =>
  http.put("/api/chat/rename", {
    chatId: chatId,
    chatName: newName,
  });
export const addUserToChat = (chatId, userID) =>
  http.put("/api/chat/groupadd", {
    chatId: chatId,
    userID: userID,
  });
export const changeAdmin = (chatId, newUserAdminId) =>
  http.put("/api/chat/changeAdmin", {
    chatId: chatId,
    userId: newUserAdminId,
  });
