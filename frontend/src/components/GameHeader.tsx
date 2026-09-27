import type { Color, PublicPlayer } from "../types";

interface GameHeaderProps {
  players: PublicPlayer[];
  currentPlayer: Color;
  yourColor: Color;
}

const GameHeader = ({ players, currentPlayer, yourColor }: GameHeaderProps) => {
  const isMyTurn = currentPlayer === yourColor;
  return (
    <header>
      {players.map((player) => (
        <p key={player.color}>
          {player.name} ({player.color}){player.color === yourColor && " (you)"}
        </p>
      ))}

      <p>{isMyTurn ? "Your turn" : "Opponent's turn"}</p>
    </header>
  );
};

export default GameHeader;
