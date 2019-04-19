<template>
  <div class="hello"></div>
</template>

<script>
  import Vue from 'vue';
  import PopupIcon from './PopupIcon';
  import Popup from './Popup';

  import debounce from 'lodash.debounce';

  export default {
    name: 'HelloWorld',
    components: { PopupIcon, Popup },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        selectionText: '',
        selectionRect: null,
        pagePopupVisible: false,
        pagePopupTop: 0,
        pagePopupLeft: 0,
        popupVisible: false,
        trackSelection: false
      }
    },
    methods: {
      log() {
        console.log('log click')
      },
      handleSelectionChange() {
        const selection = window.getSelection()
        const selectionText = selection.toString()
        console.log('selectionText', selectionText, Boolean(selectionText.trim()))
        if (selectionText.trim()) this.trackSelection = true;
      },
      handleDocumentClick(event) {
        console.log('click target', event.target)
        if (this.trackSelection) {
          console.log('clickif')

          this.pagePopupTop = event.pageY // selectionRect.top + window.scrollY
          this.pagePopupLeft = event.pageX// selectionRect.left + window.scrollX
          this.popupIconVisible = true

          const popupIconComponent = new Vue({
            ...PopupIcon,
            parent: this,
            propsData: {
              top: this.pagePopupTop,
              left: this.pagePopupLeft
            }
          }).$mount()
          popupIconComponent.$on('iconClick', this.handleIconClick)

          this.popupContainer.innerHTML = '';
          this.popupContainer.insertAdjacentElement('afterbegin', popupIconComponent.$el)

          this.trackSelection = false
        } else {
          console.log('clickelse')
          this.removePopupIcon()
        }
      },
      removePopupIcon() {
        this.popupContainer.innerHTML = '';
        this.pagePopupVisible = false
        this.selectionText = ''
        this.pagePopupTop = 0
        this.pagePopupLeft = 0
      },
      getSelectionProperties() {
        const selection = window.getSelection()
        const selectionRange = selection.getRangeAt(0) //get the text range

        this.selectionText = selection.toString()
        this.selectionRect = selectionRange.getBoundingClientRect()

        console.log('selection1', this.selectionText)
      },
      showPopup() {
        const popupComponent = new Vue({
          ...Popup,
          parent: this,
          propsData: {
            top: this.pagePopupTop + 32,
            left: this.pagePopupLeft,
            selectionText: this.selectionText,
            selectionRect: this.selectionRect
          }
        }).$mount()
        // popupComponent.$on('iconClick', this.handleIconClick)

        this.popupContainer.innerHTML = '';
        this.popupContainer.insertAdjacentElement('afterbegin', popupComponent.$el)
      },
      handleIconClick() {
        this.getSelectionProperties()
        this.showPopup();
      }
    },
    created() {
      const divEl = document.createElement('div')
      divEl.id = 'urTran'
      this.popupContainer = document.body.appendChild(divEl)
      document.addEventListener('selectionchange', debounce(this.handleSelectionChange))
      document.addEventListener('selectstart', this.removePopupIcon)
      document.addEventListener('click', this.handleDocumentClick)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
