<template>
    <button
      class="urTranPopupIcon"
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
    name: 'PopupIcon',
    props: {
      top: Number,
      left: Number
    },
    watch: {
      top (newVal) {
        console.log('top change', newVal)
      }
    },
    methods: {
      handlePopupClick() {
        this.$emit('iconClick')
        console.log('iconClick')
      }
    }
  }
</script>

<style scoped>
  .urTranPopupIcon {
    position: absolute;
    background-color: red;
    cursor: pointer;
    border: none;
  }

  .urTranPopupIcon:focus {
    outline: 1px auto darkred;
  }
</style>
