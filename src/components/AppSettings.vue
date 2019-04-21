<template>
  <div class="wrapper">
    <button @click="showDictionary">
      Show dictionary
    </button>

    <section
      v-if="dictionaryVisible"
      class="dictionaryWrapper"
    >

      <div
        v-for="(item, index) in dictionary"
        class="content"
      >
        <div class="item original">
          <span class="language">
            [ {{item.original.language | uppercase}} ]
          </span>
          <span class="text">
            {{item.original.text}}
          </span>
        </div>
        <div class="item translated">
          <span class="language">
            [ {{item.translated.language | uppercase}} ]
          </span>
          <span>
            {{item.translated.text}}
          </span>
        </div>

        <div
          class="action"
          @click="removeDictionaryItem(index)"
        >
          <remove-icon />
        </div>

      </div>

    </section>

  </div>
</template>

<script>
  import RemoveIcon from './RemoveIcon'

  export default {
    name: 'AppSettings',
    components: {RemoveIcon},
    data: () => ({
      dictionary: null,
      dictionaryVisible: false
    }),
    methods: {
      showDictionary() {
        this.dictionaryVisible = true
        this.getDictionary()
      },
      getDictionary() {
        console.log('dictionaryChange')
        const self = this
        if (this.dictionaryVisible) {
          chrome.storage.local.get(['dictionary'], function (result) {
            self.dictionary = result.dictionary
          })
        }
      },
      removeDictionaryItem(index) {
        this.dictionary.splice(index, 1);
        const self = this
        chrome.storage.local.set({ dictionary: self.dictionary })
      }
    },
    filters: {
      uppercase(value) {
        return value ? value.toUpperCase() : ''
      }
    },
    mounted() {
      this.eventBus.$on('dictionaryChange', this.getDictionary)
    }
  }
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    min-width: 500px;
    padding: 10px;
  }

  .dictionaryWrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .headerWrapper {
    display: flex;
    flex-direction: row;
  }

  .header {
    font-size: 18px;
    flex-basis: 50%;
  }

  .content {
    display: flex;
    flex-direction: row;
    margin: 5px 0;
  }

  .item {
    flex-basis: 48%;
    font-size: 16px;
    line-height: 1.3;
    text-align: left;
  }

  .item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .item.translated {
    border-left: 1px solid #c0bebe;
    padding-left: 6px;
  }

  .action {
    flex-basis: 4%;
    font-size: 16px;
    text-align: center;
  }

  .language {
    margin: 0 9px;
    color: #ff5252;
    display: inline-block;
  }
</style>
