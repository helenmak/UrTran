<template>
  <div
    class="urTranPopup"
    :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
  >
      <div>
        {{selectionText}}
      </div>
      <button @click="translateText">
        Translate
      </button>
  </div>
</template>

<script>
  import api from '../api/'

  export default {
    name: 'Popup',
    props: {
      top: Number,
      left: Number,
      selectionText: String,
      selectionRect: Object
    },
    methods: {
      translateText() {
        api.translateText(this.selectionText, 'en')
      }
    }
  }
</script>

<style scoped>
  .urTranPopup {
    position: absolute;
    background-color: mediumvioletred;
    cursor: pointer;
    border: none;
  }
</style>
