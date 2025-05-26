export const GAME_STATES = {
  ROLE_DISTRIBUTION: "game.state.role.distribution",
  CHECKING_CARDS: "game.state.checking.cards",
  PLAYER_TURN: "game.state.player_turn",
  CHECKING_OTHER_PLAYER_CARDS: "game.state.checking.other.player.cards",
  OTHER_PLAYER_CARD_DRAW: "game.state.other.player.card.draw",
  RECAP_ROUND: "game.state.recap.round",
  GAME_FINISHED: "game.state.finished",
} as const;
