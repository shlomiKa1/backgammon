import { fail } from "../utils/helper.js";
import {
  allCheckersHome,
  distanceToExit,
  getBarDestination,
  hasFartherChecker,
  isValidStep,
} from "../utils/move.js";

function validateBar(game, to, die, player) {
  if (game.bar[player] === 0) return fail("empty_bar", "No checker on bar");

  const destination = getBarDestination(die, player);
  if (to !== destination)
    return fail("invalid_destination", "Destination does not match die");
  if (!isValidStep(game.board[destination], player))
    return fail("blocked_point", "Point is blocked");
  return null;
}

function validateOff(game, from, die, player) {
  if (!allCheckersHome(game, player)) {
    return fail("cannot_bear_off", "All checkers nust be home");
  }

  const distance = distanceToExit(from, player);
  if (die < distance) return fail("cannot_bear_off", "Die is too small");
  if (die > distance && hasFartherChecker(game.board, player, distance)) {
    return fail("cannot_bear_off", "A farther checker must move first");
  }

  return null;
}
