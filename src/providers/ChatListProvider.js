const { createContext, useContext, useState } = require("react");

const ChatListContext = createContext();

const ChatListProvider = ({ children }) => {
  const [fetchListChatAgain, setFetchListChatAgain] = useState(false); // có hiệu refresh chat list
  console.log("ChatList is called");
  return (
    <ChatListContext.Provider
      value={{ fetchListChatAgain, setFetchListChatAgain }}
    >
      {children}
    </ChatListContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatListContext);
};
export default ChatListProvider;
