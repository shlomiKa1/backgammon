import { fail } from "../utils/helper.js";
import { getBarDestination, isValidStep } from "../utils/move.js";

function validateBar(game, to, die, player) {
  if (game.bar[player] === 0) return fail("empty_bar", "No checker on bar");

  const destination = getBarDestination(die, player);
  if (to !== destination)
    return fail("invalid_destination", "Destination does not match die");
  if (!isValidStep(game.board[destination], player))
    return fail("blocked_point", "Point is blocked");
  return null;
}
