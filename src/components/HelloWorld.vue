<template>
  <div class="hello">
    <button ref="changeColor" @click="changeColor">{{msg}}</button>
  </div>
</template>

<script>
  import Vue from 'vue';
  import PagePopup from './PagePopup';

  import debounce from 'lodash.debounce';

  export default {
    name: 'HelloWorld',
    components: { PagePopup },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        selectionText: '',
        pagePopupVisible: false,
        pagePopupTop: 0,
        pagePopupLeft: 0,
        trackSelection: false
      }
    },
    methods: {
      changeColor(element) {
        let color = '#3aa757'
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //   chrome.tabs.executeScript(
        //     tabs[0].id,
        //     // {code: 'document.body.style.backgroundColor = "' + color + '";'});
        //     {code: './SelectionPopup.js'})
        // });
      },
      log() {
        console.log('log click')
      },
      handleSelectionChange() {
        const selection = window.getSelection()
        const selectionText = selection.toString()
        console.log('selectionText', selectionText, Boolean(selectionText.trim()))
        if (selectionText.trim()) this.trackSelection = true;
      },
      handleClick(event) {
        console.log('click target', event.target)
        if (this.trackSelection) {
          console.log('clickif')
          const selection = window.getSelection()
          const selectionText = selection.toString()
          console.log('selection1', selectionText)
          const selectionRange = selection.getRangeAt(0) //get the text range
          const selectionRect = selectionRange.getBoundingClientRect()

          console.log('selectionRect', selectionRect.top)
          this.selectionText = selectionText
          this.pagePopupTop = event.pageY // selectionRect.top + window.scrollY
          this.pagePopupLeft = event.pageX// selectionRect.left + window.scrollX
          this.pagePopupVisible = true

          const popupComponent = new Vue({
            ...PagePopup,
            parent: this,
            propsData: {
              visible: this.pagePopupVisible,
              top: this.pagePopupTop,
              left: this.pagePopupLeft
            }
          }).$mount()
          this.popupContainer.innerHTML = '';
          this.popupContainer.insertAdjacentElement('afterbegin', popupComponent.$el)

          this.trackSelection = false
        } else {
          console.log('clickelse')
          this.hidePopup()
        }
      },
      hidePopup() {
        this.popupContainer.innerHTML = '';
        this.pagePopupVisible = false
        this.selectionText = ''
        this.pagePopupTop = 0
        this.pagePopupLeft = 0
      }
    },
    created() {
      const divEl = document.createElement('div')
      divEl.id = 'urTran'
      this.popupContainer = document.body.appendChild(divEl)
      document.addEventListener('selectionchange', debounce(this.handleSelectionChange))
      document.addEventListener('selectstart', this.hidePopup)
      document.addEventListener('click', this.handleClick)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
