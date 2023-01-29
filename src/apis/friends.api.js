import http from "../utils/http";

export const getFriendRequest = () => http.get("/api/friendRequest/request");
export const getFriends = () => http.get("/api/friends");
export const acceptFriendRequest = (friendRequestId) =>
  http.post("/api/friendRequest/accept/" + friendRequestId, {
    friendRequestId: friendRequestId,
  });
export const cancelSendRequest = (friendRequestId) =>
  http.post("/api/friendRequest/deleteSended/" + friendRequestId, {
    friendRequestId: friendRequestId,
  });
export const getUserFriendRequests = () =>
  http.get("/api/friendRequest/sended");
export const denyFriendRequest = (friendRequestId) =>
  http.post("/api/friendRequest/denied/" + friendRequestId, {
    friendRequestId: friendRequestId,
  });
export const unfriend = (friendId) =>
  http.post("/api/friend/deletefriend/" + friendId, {
    friendRequestId: friendId,
  });
