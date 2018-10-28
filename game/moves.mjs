import immer from 'immer'
import _ from 'lodash'
const { produce } = immer

export const play = produce((G, ctx, ...cards) => {
  const player = G.players[ctx.currentPlayer]
  const join = _.intersection(player.hand, cards)
  if (join.length !== cards.length) return

  player.hand = player.hand.filter(card => !cards.includes(card))
  G.match.push(cards)
  ctx.events.endTurn()
})
