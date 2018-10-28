import boardgame from 'boardgame.io/core'
import { generateDeck } from './deck.mjs'
import immer from 'immer'
import * as moves from './moves'
import _ from 'lodash'

const { produce } = immer

const game = boardgame.Game({
  setup: ctx => ({
    match: [],
    players: _.times(ctx.numPlayers, () => ({
      hand: [],
    })),
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
        allowedMoves: ['play'],
        onPhaseEnd: produce((G, ctx) => {
          G.match = []
        }),
      },
    ],
  },
})

export default game
