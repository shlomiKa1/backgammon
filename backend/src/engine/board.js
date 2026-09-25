function createEmptyBoard() {
  return Array(24)
    .fill(null)
    .map(() => ({ owner: null, checkers: 0 }));
}
