import immer from 'immer'
import _ from 'lodash'
import Debug from 'debug'
import { getRankFromCards } from './deck'
const { produce } = immer

const debug = Debug('app:moves')

export const play = produce((G, ctx, ...cards) => {
  debug('play', ctx.currentPlayer, cards)
  const player = G.players[ctx.currentPlayer]

  // Check min and max
  if (cards.length < 1 || cards.length > 4) {
    return debug('Num cards should be between 1-4')
  }

  // Check player has these cards
  const join = _.intersection(player.hand, cards)
  if (join.length !== cards.length) {
    return debug('Player do not have these cards in hand')
  }

  // Get rank
  const rank = getRankFromCards(cards)
  if (rank === null) {
    return debug('Cards are not same rank')
  }

  // Check against match
  if (G.match.length) {
    const lastCards = G.match[G.match.length - 1]
    const lastRank = getRankFromCards(lastCards)
    if (rank <= lastRank) {
      return debug('Rank is not bigger than match')
    }
    if (lastCards.length !== cards.length) {
      return debug('Num cards is not same as match')
    }
  }

  // Remove cards from player hands
  player.hand = player.hand.filter(card => !cards.includes(card))

  // Add cards to match
  G.match.push(cards)

  // Save last player
  G.lastPlayed = ctx.currentPlayer

  // Save in podium if not cards in hand
  if (!player.hand.length) {
    G.podium.push(ctx.currentPlayer)
  }

  // Ends player turn
  ctx.events.endTurn()

  debug('played OK')
})

export const pass = produce((G, ctx, ...cards) => {
  if (!G.match.length) return

  ctx.events.endTurn()
})
