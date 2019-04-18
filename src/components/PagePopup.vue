<template>
    <button
      :class="popupClasses"
      :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
      @click.stop="handlePopupClick"
    >POPUP
    </button>
</template>

<script>
  export default {
    name: 'PagePopup',
    props: {
      top: Number,
      left: Number,
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      top (newVal) {
        console.log('top change', newVal)
      }
    },
    computed: {
      popupClasses () {
        return this.visible ? 'visible urTranPopup' : 'hidden urTranPopup';
      }
    },
    methods: {
      handlePopupClick(event) {
        window.postMessage('popupClick', '*')
        console.log('click 2 inside component')
      }
    },
    created () {
      console.log('popup created')
    }
  }
</script>

<style scoped>
  .urTranPopup {
    position: absolute;
    background-color: red;
    cursor: pointer;
    border: none;
  }

  .urTranPopup:focus {
    outline: 1px auto darkred;
  }
</style>
