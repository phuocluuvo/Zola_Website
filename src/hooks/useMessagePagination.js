import { useEffect, useState } from "react";
import axios from "axios";

export default function useMessagePagination(user, chat, pageNumber) {
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    async function loadMessage() {
      setLoadingMessage(true);
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      setError(false);

      await axios
        .get(`/api/message/${chat._id}/${pageNumber}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          cancelToken: source.CancelToken,
        })
        .then((res) => {
          setMessages([...new Set([...res.data, ...messages])]);
          setHasMore(res.data.length > 0);
          setLoadingMessage(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) console.log("successfully aborted");
          else setError(true);
        });
      return () => source.cancel();
    }
    loadMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, pageNumber]);

  return { loadingMessage, error, messages, hasMore, setMessages };
}
