import { useGameStore } from "../store/useGameStore";

const GameHeader = () => {
  const room = useGameStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const yourColor = useGameStore((state) => state.yourColor);

  if (!room || !game) return null;

  const isMyTurn = game.currentPlayer === yourColor;

  return (
    <header>
      {room.players.map((player) => (
        <p key={player.color}>
          {player.name} {player.color}
          {player.color === yourColor && " (you)"}
        </p>
      ))}

      <p>{isMyTurn ? "Your turn" : "Opponent's turn"}</p>
    </header>
  );
};

export default GameHeader;
