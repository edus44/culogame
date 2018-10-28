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
        allowedMoves: ['play', 'pass'],
        onPhaseEnd: produce((G, ctx) => {
          debug('round finished')
          G.match = []
        }),
      },
    ],
  },
})

export default game
