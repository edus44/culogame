<template>
  <div id="app">
    <div 
      v-for="(player,id) in G.players" 
      :class="{active:id==ctx.currentPlayer}" 
      class="player">
      <h2>{{ id }}</h2>
      <button 
        v-for="card in player.hand"
        :class="{selected:selected.includes(card)}"
        @click="select(card)"
      >
        {{ card }}
      </button>
    </div>
    <p>match: {{ G.match }}</p>
    <p>current: {{ ctx.currentPlayer }}</p>
    <hr>
    <button @click="selected=[]">clear</button>
    <button @click="play">play {{ selected }}</button>
    <hr>
    <button @click="pass">pass</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    selected: [],
  }),
  computed: {
    ...mapState('game', ['G', 'ctx']),
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('game', ['init', 'move']),
    play() {
      this.move({ name: 'play', args: this.selected })
    },
    pass() {
      this.move({ name: 'pass' })
    },
    select(card) {
      if (this.selected.includes(card)) {
        this.selected = this.selected.filter(x => x !== card)
      } else {
        this.selected.push(card)
      }
    },
  },
}
</script>

<style lang="scss">
button.selected {
  font-weight: bold;
  font-size: 20px;
}
.player.active {
  background-color: #bada55;
}
</style>
