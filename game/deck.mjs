import _ from 'lodash'

const SUITS = ['O', 'C', 'E', 'B']

const RANKS = ['1', '2', '3', '4', '5', '6', '7', 'S', 'C', 'R']

const MIN_CARDS_IN_HAND = 6

function generateDeck() {
  return SUITS.reduce(
    (deck, suit) => RANKS.reduce((deck, rank) => deck.concat(rank + suit), deck),
    []
  )
}

function sortPlayerHand(hand) {
  return _.orderBy(hand, ['rankV'], ['asc'])
}

function cardEqualTo(a, b) {
  return a.rankV === b.rankV && a.suitV === b.suitV
}

export { generateDeck, cardEqualTo, sortPlayerHand, SUITS, RANKS, MIN_CARDS_IN_HAND }
