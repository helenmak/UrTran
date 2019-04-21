<template>
  <div class="wrapper">
    <button
      v-if="!dictionaryVisible"
      class="dictionary-button"
      @click="showDictionary"
    >
      Show dictionary
    </button>
    <button
      v-else
      class="dictionary-button"
      @click="hideDictionary"
    >
      Hide dictionary
    </button>

    <section
      v-if="dictionaryVisible"
      class="dictionaryWrapper"
    >
      <div
        v-if="!dictionary.length"
        class="no-items"
      >
        Oops, no text yet.
        Add text from popups on page to dictionary and come back:)
      </div>

      <div
        v-else
        v-for="(item, index) in dictionary"
        class="content"
      >
        <div class="item original">
          <span class="language">
            [ {{item.original.language | uppercase}} ]
          </span>
          {{item.original.text}}
        </div>

        <div class="item translated">
          <span class="language">
            [ {{item.translated.language | uppercase}} ]
          </span>
          {{item.translated.text}}
        </div>

        <div
          class="action"
          @click="removeDictionaryItem(index)"
        >
          <remove-icon/>
        </div>

      </div>

    </section>

  </div>
</template>

<script>
  import RemoveIcon from '../shared/RemoveIcon'

  export default {
    name: 'AppSettings',
    components: {RemoveIcon},
    data: () => ({
      dictionary: null,
      dictionaryVisible: false
    }),
    methods: {
      /**
       * Fetches dictionary data and renders dictionary elements on page
       */
      showDictionary() {
        this.dictionaryVisible = true
        this.getDictionary()
      },
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
       * Removes dictionary data and hides dictionary elements on page
       */
      hideDictionary() {
        this.dictionaryVisible = false
        this.dictionary = null
      },
      /**
       * Removes item from dictionary and component dictionary data
       * @param {number} index - The index of item to remove.
       */
      removeDictionaryItem(index) {
        this.dictionary.splice(index, 1)
        const self = this
        chrome.storage.local.set({dictionary: self.dictionary})
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
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 500px;
    padding: 10px;
  }

  .dictionaryWrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
  }

  .content {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #c0bebe;
    padding: 10px 5px;
  }

  .item {
    flex-basis: 48%;
    font-size: 16px;
    line-height: 1.3;
    text-align: left;
    overflow-wrap: break-word;
  }

  .item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .item.translated {
    border-left: 1px solid #c0bebe;
    padding: 0 2px 0 6px;
  }

  .action {
    flex-basis: 4%;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }

  .language {
    margin: 0 9px;
    color: #ff5252;
    display: inline-block;
  }

  .dictionary-button {
    min-width: 150px;
    width: 100%;
    border: rgba(255, 82, 82, 0.4);
    background: none;
    color: #ff5252;
    font-size: 16px;
    font-weight: 600;
    padding: 4px;
    outline: rgba(255, 82, 82, 0.4);
    cursor: pointer;
  }

  .no-items {
    color: #787878;
    font-size: 14px;
  }
</style>
