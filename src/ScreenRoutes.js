import { AnimatePresence } from "framer-motion";
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LoadingPage from "./Components/loading/LoadingPage";
import CallPage from "./pages/CallPage";
const ChatPage = lazy(() => import("./pages/ChatPage"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));

function ScreenRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<LoadingPage />}>
        <Routes location={location} key={location.pathname}>
          <Route exact path="/chats" element={<ChatPage />} />
          <Route exact path="/" element={<WelcomePage />} />
          <Route exact path="/call/:id/:user" element={<CallPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default ScreenRoutes;
