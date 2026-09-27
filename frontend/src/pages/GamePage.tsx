import { useGameStore } from "../store/useGameStore";
import { leaveRoom } from "../socket/actions";
import GameHeader from "../components/GameHeader";
import DiceArea from "../components/DiceArea";
import Board from "../components/Board";
import FinishPanel from "../components/FinishPanel";
import "./styles/GamePage.css";

const GamePage = () => {
  const winner = useGameStore((state) => state.winner);
  const reset = useGameStore((state) => state.reset);

  const handleLeave = async () => {
    await leaveRoom();
    reset();
  };

  return (
    <div className="game-page">
      <GameHeader />
      <DiceArea />
      <Board />
      {winner && <FinishPanel />}
      <button className="leave-button" onClick={handleLeave}>
        Leave game
      </button>
    </div>
  );
};

export default GamePage;
