import http from "../utils/http";

export const searchUser = (config, searchParam) =>
  http.get(`/api/user?search=${searchParam}`);
export const getUsersFriends = () => http.get("/api/friends");
export const sendAddFriendRequest = (friendRequestId) =>
  http.post("/api/friendRequest/" + friendRequestId, {
    friendRequestId: friendRequestId,
  });
export const updateUserInfomation = (newUserInfo) =>
  http.put("/api/user/update", newUserInfo);
