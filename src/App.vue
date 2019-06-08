<template>
  <div id="app">
    <app-main />
  </div>
</template>

<script>
import AppMain from './components/Main'

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
    font-size: 14px;
    font-weight: 500;
    padding: 0;
    margin: 0;
    text-shadow: none;
    box-shadow: none;
    border: none;
  }
</style>
