import axios from "axios";

class Http {
  instance;
  constructor() {
    if (JSON.parse(localStorage.getItem("userInfo")))
      this.instance = axios.create({
        baseURL: process.env.REACT_API_PORT,
        timeout: 60000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
        cancelToken: axios.CancelToken.source().token,
      });
    else {
     return null;
     
    }
  }
}

const http = new Http().instance;
export default http;
