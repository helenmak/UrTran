<template>
  <section
    v-if="visible"
    class="urtran-dictionary-wrapper"
  >
    <div
      v-if="isDictionaryEmpty"
      class="urtran-no-items"
    >
      Oops, no text yet.
      Add text from popups on page to dictionary and come back:)
    </div>

    <div
      v-else
      v-for="(item, index) in dictionary"
      class="urtran-dictionary-content"
    >
      <div class="urtran-dictionary-item original">
        <span class="urtran-language">
          [ {{item.original.language | uppercase}} ]
        </span>
        {{item.original.text}}
      </div>

      <div class="urtran-dictionary-item translated">
        <span class="urtran-language">
          [ {{item.translated.language | uppercase}} ]
        </span>
        {{item.translated.text}}
      </div>

      <div
        class="urtran-dictionary-action action-icon"
        @click="removeDictionaryItem(index)"
      >
        <remove-icon/>
      </div>

      <div
        v-if="!item.learning"
        class="urtran-dictionary-action action-icon"
        @click="addToLearning(item, index)"
      >
        <learn-icon/>
      </div>
      <div
        v-else
        class="urtran-dictionary-action action-icon checked-icon"
      >
        <success-icon/>
      </div>

    </div>

  </section>
</template>

<script>
  import RemoveIcon from '../shared/RemoveIcon'
  import LearnIcon from '../shared/LearnIcon'
  import SuccessIcon from '../shared/SuccessIcon'

  export default {
    name: 'AppPopup',
    components: {RemoveIcon, LearnIcon, SuccessIcon},
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      dictionary: null
    }),
    computed: {
      isDictionaryEmpty() {
        return !this.dictionary || !this.dictionary.length
      }
    },
    methods: {
      /**
       * Gets dictionary from storage and set to component data.
       */
      getDictionary() {
        const self = this
        chrome.storage.local.get(['dictionary'], function (result) {
          self.dictionary = result.dictionary
        })
      },
      /**
       * Add original-translated pair of texts to storage learning list.
       * Marks corresponding item in dictionary as learning
       * @param {object} item - item to add to list
       * @param {number} index - item index in list
       */
      addToLearning(item, index) {
        console.log('item', item, index, this.dictionary)
        this.markDictionaryItemLearned(index)

        chrome.storage.local.get(['learning'], function (result) {
          const prevLearning = result.learning || []
          const newLearning = [...prevLearning, item]
          
          console.log('newLearning', item, newLearning)

          chrome.storage.local.set({learning: newLearning})

        })
      },
      /**
       * Marks dictionary item as learning
       * @param {number} index - item index in list
       */
      markDictionaryItemLearned(index) {
        const self = this
        chrome.storage.local.get(['dictionary'], function (result) {
          const dictionary = result.dictionary
          dictionary[index].learning = true

          chrome.storage.local.set({dictionary},
            function () {
              self.dictionary = dictionary
            })
        })
      },
      /**
       * Removes item from dictionary and component dictionary data
       * @param {string} index - The index of item in dictionary list.
       */
      removeDictionaryItem(index) {
        const self = this
        this.dictionary.splice(index, 1)
        chrome.storage.local.set({dictionary: self.dictionary})
      }
    },
    watch: {
      visible (isVisible) {
        if (isVisible) this.getDictionary()
        else this.dictionary = null
      }
    },
    filters: {
      /**
       * Converts string to uppercased string
       * @param {string} value - String to uppercase.
       */
      uppercase(value) {
        return value ? value.toUpperCase() : ''
      }
    }
  }
</script>

<style scoped>
  .urtran-dictionary-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    border-top: 1px dashed rgba(242, 242, 242, 0.86);
  }

  .urtran-dictionary-content {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #c0bebe;
    padding: 10px 5px;
  }

  .urtran-dictionary-item {
    flex-basis: 45%;
    font-size: 16px;
    line-height: 1.3;
    text-align: left;
    overflow-wrap: break-word;
    color: #f2f2f2db;
  }

  .urtran-dictionary-item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .urtran-dictionary-item.translated {
    border-left: 1px solid #c0bebe;
    padding: 0 2px 0 6px;
  }

  .urtran-dictionary-action {
    text-align: center;
    cursor: pointer;
  }

  .urtran-dictionary-action.action-icon {
    width: 24px;
    height: 24px;
    margin: 0 2px;
  }

  .urtran-dictionary-action.checked-icon {
    cursor: auto;
  }

  .urtran-language {
    margin: 0 9px;
    color: #e0d1ce;
    display: inline-block;
  }

  .urtran-no-items {
    color: #a3a2a2;
    font-size: 14px;
    margin-top: 5px;
  }

  .hidden .urtran-text {
    visibility: hidden;
    color: #f2f2f2db;
  }

  .hidden .urtran-language {
    opacity: 0.8;
  }

  .urtran-learning-action .checked-icon {
    width: 22px;
    height: 22px;
    margin: 0 3px;
    cursor: pointer;
  }
</style>
