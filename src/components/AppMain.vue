<template>
  <div>
    <app-options/>
  </div>

</template>

<script>
  import Vue from 'vue'
  import AppPopupIcon from './AppPopupIcon'
  import AppPopup from './AppPopup'
  import AppOptions from './AppOptions'

  import debounce from 'lodash.debounce'

  import api from '../api/'

  export default {
    name: 'HelloWorld',
    components: {AppPopupIcon, AppPopup, AppOptions},
    data() {
      return {
        selectionText: '',
        selectionRect: null,
        pagePopupVisible: false,
        pagePopupIconTop: 0,
        pagePopupIconLeft: 0,
        popupVisible: false,
        trackSelection: false,
        translations: null,
        doubleClicked: false,
        windowHeight: 0
      }
    },
    methods: {
      async setTrackSelection() {
        const selection = window.getSelection()
        const selectionText = selection.toString()
        this.trackSelection = Boolean(selectionText.trim())
      },
      handleClick(event) {
        const self = this
        const clickTimer = setTimeout(() => { // hack to prevent race with doubleclick event after selection
          if (!self.doubleClicked) {
            if (self.trackSelection) {
              self.setIconCoordinates(event)
              self.showIcon()
              self.trackSelection = false
            } else {
              clearTimeout(clickTimer)
              self.removeElements()
            }
          }
        }, 250)
      },
      setIconCoordinates(event) {
        this.pagePopupIconTop = event.pageY // selectionRect.top + window.scrollY
        this.pagePopupIconLeft = event.pageX // selectionRect.left + window.scrollX
      },
      showIcon() {
        const popupIconComponent = new Vue({
          ...AppPopupIcon,
          parent: this,
          propsData: {
            top: this.pagePopupIconTop,
            left: this.pagePopupIconLeft
          }
        }).$mount()
        popupIconComponent.$on('iconClick', this.handleIconClick)
        this.renderElement(popupIconComponent.$el)
      },
      removeElements() {
        this.popupContainer.innerHTML = ''
        this.pagePopupVisible = false
        this.selectionText = ''
        this.pagePopupIconTop = 0
        this.pagePopupIconLeft = 0
      },
      getSelectionProperties() {
        const selection = window.getSelection()
        const selectionRange = selection.getRangeAt(0) //get the text range

        this.selectionText = selection.toString().trim()
        this.selectionRect = selectionRange.getBoundingClientRect()
      },
      showPopup() {
        const popupElementsHeight = 215
        const distanceToPopup = 5
        const selectionHeight = this.selectionRect.height
        const possiblePopupHeight = selectionHeight * 3 + popupElementsHeight
        // getClientBoundingRect bottom sometimes is incorrect
        const selectionBottom = window.innerHeight - selectionHeight - this.selectionRect.top
        const canPopupBePlacedInBottom = possiblePopupHeight < selectionBottom
        const canPopupBePlacedInTop = possiblePopupHeight < this.selectionRect.top

        let top
        let bottom

        if (
          canPopupBePlacedInBottom && canPopupBePlacedInTop ||
          !canPopupBePlacedInBottom && !canPopupBePlacedInTop ||
          !canPopupBePlacedInTop
        ) {
          top = this.selectionRect.top + selectionHeight + distanceToPopup + window.scrollY
        } else if (!canPopupBePlacedInBottom) {
          bottom = selectionBottom + + selectionHeight + distanceToPopup + window.scrollY
        }
        const popupComponent = new Vue({
          ...AppPopup,
          parent: this,
          propsData: {
            top,
            bottom,
            left: this.pagePopupIconLeft,
            selectionText: this.selectionText,
            selectionRect: this.selectionRect,
            translations: this.translations
          }
        }).$mount()
        this.renderElement(popupComponent.$el)
      },
      renderElement(el) {
        this.popupContainer.innerHTML = ''
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
        this.doubleClicked = true
        this.getSelectionProperties()
        if (this.selectionText.trim()) {
          this.setIconCoordinates(event) // just to know where to render popup
          await this.translateText()
          this.showPopup()
        } else {
          this.removeElements()
        }
        const self = this
        setTimeout(() => self.doubleClicked = false, 500) // hack to prevent race with click event after selection
      }
    },
    created() {
      const popupElement = document.createElement('div')
      popupElement.id = 'urTran'
      this.popupContainer = document.body.appendChild(popupElement)
      document.addEventListener('selectionchange', debounce(this.setTrackSelection))
      document.addEventListener('selectstart', this.removeElements)
      document.addEventListener('click', this.handleClick)
      document.addEventListener('dblclick', this.handleDoubleClick)
    }
  }
</script>
