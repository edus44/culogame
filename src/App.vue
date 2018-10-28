<template>
  <div id="app">
    <div v-for="player in G.players" class="player">
      {{ player }}
    </div>
    {{ G.match }}
    {{ ctx.currentPlayer }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('game', ['G', 'ctx']),
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('game', ['init']),
  },
}
</script>

<style lang="scss">
</style>
