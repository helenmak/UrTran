<template>
  <div id="app">
    <app-main />
  </div>
</template>

<script>
import AppMain from './components/AppMain'

export default {
  name: 'App',
  components: { AppMain }
}
</script>

<style>
  #app {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  * {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
  }
</style>
