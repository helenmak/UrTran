<template>
    <button
      class="urtran-icon-wrapper"
      :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
      @click.stop="handlePopupClick"
    >
      <worlwide-icon class="urtran-icon" />
    </button>
</template>

<script>
  import WorlwideIcon from '../shared/WorlwideIcon'

  export default {
    name: 'PagePopupIcon',
    components: {WorlwideIcon},
    props: {
      top: Number,
      left: Number
    },
    methods: {
      /**
       * Emits icon click event to parent component
       */
      handlePopupClick() {
        this.$emit('iconClick')
      }
    }
  }
</script>

<style scoped>
  .urtran-icon-wrapper {
    height: 28px;
    width: 28px;
    padding: 2px;
    position: absolute;
    background-color: #343753;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: none;
    z-index: 2000;
  }

  .urtran-icon-wrapper:focus, .urtran-icon-wrapper:hover, .urtran-icon-wrapper:active {
    outline: none;
    background-color: #343753;
    border: none;
    box-shadow: #343753 0 0 0 2px;
  }

  .urtran-icon {
    height: 24px;
    width: 24px;
  }
</style>
