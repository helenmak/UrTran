import Vue from 'vue'

const eventBus = new Vue({})

Object.defineProperty(Vue.prototype, 'eventBus', {
  get () {
    return this.$root.eventBus
  }
})

export default eventBus
