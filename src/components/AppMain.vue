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
    name: 'AppMain',
    components: {AppPopupIcon, AppPopup, AppOptions},
    data() {
      return {
        selectionText: '',
        selectionRect: null,
        pagePopupVisible: false,
        popupTop: 0,
        popupLeft: 0,
        popupVisible: false,
        trackSelection: false,
        translations: null,
        doubleClicked: false
      }
    },
    methods: {
      /**
       * Gets window selection and marks the presence of selection content
       */
      async setTrackSelection() {
        const selection = window.getSelection()
        const selectionText = selection.toString()
        this.trackSelection = Boolean(selectionText.trim())
      },
      /**
       * Handles click event. Gets popup coordinates and show icon if selection present, or removes popup if no selection
       */
      handleClick(event) {
        const self = this
        const clickTimer = setTimeout(() => { // hack to prevent race with doubleclick event after selection
          if (!self.doubleClicked) {
            if (self.trackSelection) {
              self.getPopupCoordinates(event)
              self.showIcon()
              self.trackSelection = false
            } else {
              clearTimeout(clickTimer)
              self.removeElements()
            }
          }
        }, 250)
      },
      /**
       * Gets popup coordinates from click event data and sets them component data
       */
      getPopupCoordinates(event) {
        this.popupTop = event.pageY // selectionRect.top + window.scrollY
        this.popupLeft = event.pageX // selectionRect.left + window.scrollX
      },
      /**
       * Creates popup icon element and renders it on page
       */
      showIcon() {
        const popupIconComponent = new Vue({
          ...AppPopupIcon,
          parent: this,
          propsData: {
            top: this.popupTop,
            left: this.popupLeft
          }
        }).$mount()
        popupIconComponent.$on('iconClick', this.handleIconClick)
        this.renderElement(popupIconComponent.$el)
      },
      /**
       * Removes popup from page and clear component data
       */
      removeElements() {
        this.popupContainer.innerHTML = ''
        this.pagePopupVisible = false
        this.selectionText = ''
        this.selectionText = null
        this.popupTop = 0
        this.popupLeft = 0
      },
      /**
       * Gets selection text and position properties and sets them to component data
       */
      getSelectionProperties() {
        const selection = window.getSelection()
        const selectionRange = selection.getRangeAt(0) //get the text range

        this.selectionText = selection.toString().trim()
        this.selectionRect = selectionRange.getBoundingClientRect()
      },
      /**
       * Computes optimal popup placement, creates popup element and renders it on page
       */
      showPopup() {
        const left = this.selectionRect.left + this.selectionRect.width / 2
        const popupElementsHeight = 215
        const distanceToPopup = 10
        const selectionHeight = this.selectionRect.height
        const possiblePopupHeight = selectionHeight * 3 + popupElementsHeight
        // getClientBoundingRect sometimes returns incorrect bottom value
        const selectionBottom = window.innerHeight - selectionHeight - this.selectionRect.top
        const canPopupBePlacedInBottom = possiblePopupHeight < selectionBottom
        const canPopupBePlacedInTop = possiblePopupHeight < this.selectionRect.top

        let top
        let placement

        if (
          canPopupBePlacedInBottom && canPopupBePlacedInTop ||
          !canPopupBePlacedInBottom && !canPopupBePlacedInTop ||
          !canPopupBePlacedInTop
        ) {
          top = this.selectionRect.top + selectionHeight + distanceToPopup + window.scrollY
          placement = 'bottom'
        } else if (!canPopupBePlacedInBottom) {
          top = this.selectionRect.top + window.scrollY - distanceToPopup
          placement = 'top'
        }
        const popupComponent = new Vue({
          ...AppPopup,
          parent: this,
          propsData: {
            top,
            placement,
            left,
            selectionText: this.selectionText,
            translations: this.translations
          }
        }).$mount()
        this.renderElement(popupComponent.$el)
      },
      /**
       * Insert elements (icon and popup) on page
       */
      renderElement(el) {
        this.popupContainer.innerHTML = ''
        this.popupContainer.insertAdjacentElement('afterbegin', el)
      },
      /**
       * Calls api to translate text, set translations to component data
       */
      async translateText() {
        this.translations = await api.translateText({text: this.selectionText, target: 'uk'})
      },
      /**
       * Handles popup icon click. Gets selection properties, translates selection and call function to show popup
       */
      async handleIconClick() {
        this.getSelectionProperties()
        await this.translateText()
        this.showPopup()
      },
      /**
       * Handles double click. Gets selection properties, translates selection and call function to show popup.
       * Remove popup and clears component data if there are no selection.
       */
      async handleDoubleClick(event) {
        this.doubleClicked = true
        this.getSelectionProperties()
        if (this.selectionText.trim()) {
          this.getPopupCoordinates(event)
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
