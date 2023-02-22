import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
export default function createFastContext(initialState) {
  function useStoreData() {
    const store = useRef(initialState);
    const get = useCallback(() => store.current, []);
    const subscribers = useRef(new Set());
    const set = useCallback((value) => {
      store.current = Object.assign(Object.assign({}, store.current), value);
      subscribers.current.forEach((callback) => callback());
    }, []);
    const subscribe = useCallback((callback) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);
    return {
      get,
      set,
      subscribe,
    };
  }
  const StoreContext = createContext(null);
  function Provider({ children }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }
  function useStore(selector) {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }
    const state = useSyncExternalStore(
      store.subscribe,
      () => selector(store.get()),
      () => selector(initialState)
    );
    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
}
// useEffect(() => {
//   //fecth local storage
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   setUser(userInfo);
//   if (!userInfo) navigator("/");
// }, [navigator]);
export const Store = createFastContext({
  selectedChat: {},
  user: {},
  chats: [],
  closeSideBar: false,
  notification: {},
  response: {},
  userInfo: null,
});
