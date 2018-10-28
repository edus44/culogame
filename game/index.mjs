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
          const deck = ctx.random.Shuffle(generateDeck())
          deck.forEach((card, i) => {
            const playerId = i % ctx.numPlayers
            G.players[playerId].hand.push(card)
          })
          ctx.events.endPhase()
        }),
      },
      {
        name: 'round',
        allowedMoves: ['play'],
      },
    ],
  },
})

export default game
