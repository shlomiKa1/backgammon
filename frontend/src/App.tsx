import { BrowserRouter, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import WaitingRoomPage from "./pages/WaitingRoomPage";
import RoomGuard from "./routes/RoomGuard";
import { useSocketEvents } from "./hooks/useSocketEvents";

function App() {
  useSocketEvents();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RoomGuard />}>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/waiting" element={<WaitingRoomPage />} />
          <Route path="/game" element={<GamePage />} />
        </Route>
        <Route path="*" element={<RoomGuard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
