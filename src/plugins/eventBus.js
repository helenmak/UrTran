import Vue from 'vue'

/**
 * Creates event bus and sets is to prototype of app vue instance
 */

const eventBus = new Vue({})

Object.defineProperty(Vue.prototype, 'eventBus', {
  get () {
    return this.$root.eventBus
  }
})

export default eventBus
