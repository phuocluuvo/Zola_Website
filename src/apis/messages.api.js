import http from "../utils/http";
export const getMessages = (chatId) => http.get(`/api/message/${chatId}`);
export const getMessagesPagination = (chatId, pageNum) =>
  http.get(`/api/message/${chatId}/${pageNum}`);
export const deleteMessage = (messageId) =>
  http.put("/api/message/delete", { messageId: messageId });
export const sendNewMessage = (message) => http.post("/api/message", message);
/**
 *
 * @param {LocalMediaURL} media
 * @param {string} type must be one of these option [image | video | raw (other type of file)]
 * @returns {Promise<AxiosResponse<any, any>>}
 */
export const sendMedia = (media, type) => {
  const data = new FormData();
  data.append("file", media);
  data.append("upload_preset", "chat-chit");
  data.append("cloud_name", "voluu");
  return fetch(`https://api.cloudinary.com/v1_1/voluu/${type}/upload`, {
    method: "POST",
    body: data,
  });
};
