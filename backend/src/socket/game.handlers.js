import {
  playMove,
  requestRematch,
  rollTurn,
  startMatch,
  toPublicGame,
} from "../rooms/game.service.js";
import { broadcastRoom, safe } from "../utils/socket.js";

function broadcastGame(io, room) {
  io.to(room.id).emit("game:state", toPublicGame(room.game));
}

export function registerGameHandlers(io, socket) {
  socket.on("game:start", (callback) => {
    const reply = safe(callback);

    const result = startMatch(socket.id);
    if (!result.ok) return reply({ success: false, error: result.error });

    broadcastRoom(io, result.room);
    broadcastGame(io, result.room);
    reply({ success: true });
  });

  socket.on("game:roll", (callback) => {
    const reply = safe(callback);

    const result = rollTurn(socket.id);
    if (!result.ok) return reply({ success: false, error: result.error });

    broadcastGame(io, result.room);
    reply({ success: true });
  });

  socket.on("game:move", (move, callback) => {
    const reply = safe(callback);

    const result = playMove(socket.id, move);
    if (!result.ok) return reply({ success: false, error: result.error });

    broadcastGame(io, result.room);
    if (result.winner) {
      io.to(result.room.id).emit("game:finished", {
        winnerColor: result.winner.color,
        winnerName: result.winner.name,
      });
    }
    reply({ success: true });
  });

  socket.on("game:request-rematch", (callback) => {
    const reply = safe(callback);

    const result = requestRematch(socket.id);
    if (!result.ok) return reply({ success: false, error: result.error });

    broadcastRoom(io, result.room);
    if (result.started) broadcastGame(io, result.room);
    reply({ success: true });
  });
}
