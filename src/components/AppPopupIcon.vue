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
    name: 'AppPopupIcon',
    components: {WorlwideIcon},
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
    background: #EA7A87;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .urtran-icon-wrapper:focus {
    outline: none;
    box-shadow: rgba(240, 132, 146, 0.68) 0 0 0 2px;
  }

  .urtran-icon {
    height: 24px;
    width: 24px;
  }
</style>
