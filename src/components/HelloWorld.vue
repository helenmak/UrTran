<template>
  <div>
    <app-settings />
    <div>{{msg}}</div>
  </div>

</template>

<script>
  import Vue from 'vue';
  import PopupIcon from './PopupIcon';
  import Popup from './Popup';
  import AppSettings from './AppSettings'

  import debounce from 'lodash.debounce';

  import api from '../api/'

  export default {
    name: 'HelloWorld',
    components: { PopupIcon, Popup, AppSettings },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        selectionText: '',
        selectionRect: null,
        pagePopupVisible: false,
        pagePopupIconTop: 0,
        pagePopupIconLeft: 0,
        popupVisible: false,
        trackSelection: false,
        translations: null
      }
    },
    methods: {
      log() {
        console.log('log click')
      },
      async handleSelectionChange() {
        const selection = window.getSelection()
        const selectionText = selection.toString()
        console.log('selectionText', selectionText.trim(), selectionText.trim().length)
        if (selectionText.trim().length) {
          console.log('set to true')
          this.trackSelection = true;
        }
        else this.trackSelection = false;
      },
      handleClick(event) {
        console.log('click target', event.target)
        if (this.trackSelection) {
          this.setIconCoordinates(event)
          this.showIcon()
          console.log('set to false')
          this.trackSelection = false
        } else {
          this.removeElements()
        }
      },
      setIconCoordinates(event) {
        this.pagePopupIconTop = event.pageY // selectionRect.top + window.scrollY
        this.pagePopupIconLeft = event.pageX// selectionRect.left + window.scrollX
      },
      showIcon() {
        const popupIconComponent = new Vue({
          ...PopupIcon,
          parent: this,
          propsData: {
            top: this.pagePopupIconTop,
            left: this.pagePopupIconLeft
          }
        }).$mount()
        popupIconComponent.$on('iconClick', this.handleIconClick)

        this.renderElement(popupIconComponent.$el)
      },
      handleSelectStart() {
        this.removeElements()
      },
      removeElements() {
        this.popupContainer.innerHTML = '';
        this.pagePopupVisible = false
        this.selectionText = ''
        this.pagePopupIconTop = 0
        this.pagePopupIconLeft = 0
      },
      getSelectionProperties() {
        const selection = window.getSelection()
        const selectionRange = selection.getRangeAt(0) //get the text range

        this.selectionText = selection.toString()
        this.selectionRect = selectionRange.getBoundingClientRect()
      },
      showPopup() {
        const popupComponent = new Vue({
          ...Popup,
          parent: this,
          propsData: {
            top: this.pagePopupIconTop + 32,
            left: this.pagePopupIconLeft,
            selectionText: this.selectionText,
            selectionRect: this.selectionRect,
            translations: this.translations
          }
        }).$mount()
        this.renderElement(popupComponent.$el)
      },
      renderElement(el) {
        this.popupContainer.innerHTML = '';
        this.popupContainer.insertAdjacentElement('afterbegin', el)
      },
      async translateText() {
        this.translations = await api.translateText({text: this.selectionText, target: 'uk'})
      },
      async handleIconClick() {
        this.getSelectionProperties()
        await this.translateText()
        this.showPopup()
      },
      async handleDoubleClick(event) {
        console.log('doubleclick', this.trackSelection)
        this.getSelectionProperties()
        if (this.selectionText) {
          this.setIconCoordinates(event) // just to know where to render poopup
          await this.translateText()
          this.showPopup()
          this.trackSelection = false
        } else {
          this.removeElements()
        }
      }
    },
    created() {
      const divEl = document.createElement('div')
      divEl.id = 'urTran'
      this.popupContainer = document.body.appendChild(divEl)
      document.addEventListener('selectionchange', debounce(this.handleSelectionChange))
      document.addEventListener('selectstart', this.handleSelectStart)
      document.addEventListener('click', this.handleClick)
      document.addEventListener('dblclick', this.handleDoubleClick)
    }
  }
</script>
