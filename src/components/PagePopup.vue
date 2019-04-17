<template>
    <div
      :class="popupClasses"
      :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
    >POPUP</div>
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
        return this.visible ? 'visible popup' : 'hidden popup';
      }
    },
    created () {
      console.log('popup created')
    }
  }
</script>

<style scoped>
  .popup {
    position: absolute;
    background-color: red;
  }
</style>
