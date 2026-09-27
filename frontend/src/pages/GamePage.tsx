import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { ActionResult, Move } from "../types";
import {
  leaveRoom,
  moveChecker,
  requestRematch,
  rollDice,
} from "../socket/actions";
import type { Source, Target } from "../components/Board";
import GameHeader from "../components/GameHeader";
import DiceArea from "../components/DiceArea";
import Board from "../components/Board";
import FinishPanel from "../components/FinishPanel";

const GamePage = () => {
  const room = useGameStore((state) => state.room);
  const game = useGameStore((state) => state.game);
  const yourColor = useGameStore((state) => state.yourColor);
  const winner = useGameStore((state) => state.winner);
  const reset = useGameStore((state) => state.reset);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<Source | null>(null);

  if (!room || !game || !yourColor) return null;

  const isMyTurn = game.currentPlayer === yourColor;
  const canRoll = isMyTurn && game.status === "waiting-for-roll";

  const myMoves: Move[] = isMyTurn && !pending ? game.legalMoves : [];
  const sources = new Set<Source>(myMoves.map((m) => m.from));

  const activeFrom =
    selectedFrom !== null && sources.has(selectedFrom) ? selectedFrom : null;

  const movesFromSelected = myMoves.filter((m) => m.from === activeFrom);
  const destinations = new Set<Target>(movesFromSelected.map((m) => m.to));

  const run = async (action: () => Promise<ActionResult>) => {
    setPending(true);
    setError(null);
    const res = await action();
    setPending(false);
    if (!res.success) return null;
  };

  const handleRoll = () => run(rollDice);
  const handleRematch = () => run(requestRematch);

  const handleLeave = async () => {
    await leaveRoom();
    reset();
  };

  const moveTo = (to: Target) => {
    const options = movesFromSelected.filter((m) => m.to === to);
    if (options.length === 0) return;

    const move = options.reduce((a, b) => (a.die <= b.die ? a : b));

    setSelectedFrom(null);
    run(() => moveChecker(move));
  };

  const handlePointClick = (index: number) => {
    if (activeFrom !== null && destinations.has(index)) return moveTo(index);
    if (activeFrom === index) return setSelectedFrom(null);
    if (sources.has(index)) setSelectedFrom(index);
  };

  const handleBarClick = () => {
    setSelectedFrom(activeFrom === "bar" ? null : "bar");
  };

  const handleOffClick = () => moveTo("off");

  //   const handleMove = (move: Move) => {};
  //   const describeMove = (move: Move) => {};

  return (
    <div>
      <GameHeader
        players={room.players}
        currentPlayer={game.currentPlayer}
        yourColor={yourColor}
      />

      <DiceArea
        dice={game.dice}
        remainingDice={game.remainingDice}
        canRoll={canRoll}
        disabled={pending}
        onRoll={handleRoll}
      />

      <Board
        board={game.board}
        bar={game.bar}
        borneOff={game.borneOff}
        yourColor={yourColor}
        selectedFrom={activeFrom}
        sources={sources}
        destinations={destinations}
        onPointClick={handlePointClick}
        onBarClick={handleBarClick}
        onOffClick={handleOffClick}
      />

      {winner && (
        <FinishPanel
          winner={winner}
          yourColor={yourColor}
          rematchColors={room.rematchColors}
          disabled={pending}
          onRematch={handleRematch}
        />
      )}

      <button onClick={handleLeave}>Leave game</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default GamePage;
