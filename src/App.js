import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import ChatProvider from "./providers/ChatProvider";
import ScreenRoutes from "./ScreenRoutes";

function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <ScreenRoutes />
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
