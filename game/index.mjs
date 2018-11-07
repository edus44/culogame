import boardgame from 'boardgame.io/core'
import { generateDeck } from './deck.mjs'
import immer from 'immer'
import * as moves from './moves'
import _ from 'lodash'
import Debug from 'debug'

const debug = Debug('app:game')
const { produce } = immer

const game = boardgame.Game({
  setup: ctx => ({
    lastPlayed: null,
    match: [],
    podium: [],
    players: _.times(ctx.numPlayers, () => ({
      hand: [],
    })),
  }),
  playerView: produce((G, ctx, playerID) => {
    G.players.forEach((player, id) => {
      if (id === (playerID | 0)) return player
      player.hand = player.hand.map(card => null)
    })
  }),
  moves: { ...moves },
  flow: {
    phases: [
      {
        name: 'deal',
        onPhaseBegin: produce((G, ctx) => {
          // Get shuffled deck
          const deck = ctx.random.Shuffle(generateDeck())

          // Deal cards
          deck.forEach((card, i) => {
            const playerId = i % ctx.numPlayers
            G.players[playerId].hand.push(card)
          })

          // TODO: Sort by rank
          G.players.forEach(player => player.hand.sort())

          // Go next phase
          ctx.events.endPhase()
        }),
      },
      {
        name: 'round',
        allowedMoves: ['play', 'pass'],
        onPhaseBegin: produce((G, ctx) => {
          debug('round begin')
          G.match = []
          G.lastPlayed = null
        }),
        onTurnBegin: produce((G, ctx) => {
          // Finish game if alone in active players
          if (G.podium.length === ctx.numPlayers - 1) {
            G.podium.push(ctx.currentPlayer)
            return ctx.events.endPhase('finish')
          }
          // End turn if current is in podium
          if (G.podium.includes(ctx.currentPlayer)) {
            return ctx.events.endTurn()
          }
          // Ends phase if current is the last who played
          if (G.lastPlayed === ctx.currentPlayer) {
            return ctx.events.endPhase('round')
          }
          // If last played is in podium, assign it to current
          if (G.podium.includes(G.lastPlayed)) {
            G.lastPlayed = ctx.currentPlayer
          }
        }),
      },
      {
        name: 'finish',
      },
    ],
  },
})

export default game
