<template>
  <div class="wrapper">
    <button
      v-if="!isDictionaryVisible"
      class="urtran-main-button"
      @click="showDictionary"
    >
      Show dictionary
    </button>
    <button
      v-else
      class="urtran-main-button"
      @click="hideDictionary"
    >
      Hide dictionary
    </button>

    <button
      v-if="!isLearningCardsVisible"
      class="urtran-main-button"
      @click="showLearningCards"
    >
      Learn cards
    </button>
    <button
      v-else
      class="urtran-main-button"
      @click="hideLearningCards"
    >
      End learning
    </button>

    <section
      v-if="isDictionaryVisible"
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


    <section
      v-if="isLearningCardsVisible"
      class="urtran-learning-wrapper"
    >
      <div
        v-if="isLearningEmpty"
        class="urtran-no-items"
      >
        Oops, no learning cards yet.
        Add words and phrases from dictionary and come back:)
      </div>

      <div v-else>

        <div
          v-if="!learningMode"
          class="choose-mode-wrapper"
        >
          Choose what version you want to see:
          <button
            class="choose-mode-button"
            @click="setLearningMode('original')"
          >
            Original
          </button>

          or

          <button
            class="choose-mode-button"
            @click="setLearningMode('translated')"
          >
            Translated
          </button>
        </div>


        <div
          v-else
          v-for="(item, index) in learning"
          class="urtran-learning-content"
        >
          <div class="urtran-learning-cards-wrapper">
            <div
              class="urtran-learning-item original"
              :class="getOriginalLearningClass(index)"
            >
            <span class="urtran-language">
              [ {{item.original.language | uppercase}} ]
            </span>
              {{item.original.text}}
            </div>

            <div
              class="urtran-learning-item translated"
              :class="getTranslatedLearningClass(index)"
            >
          <span class="urtran-language">
            [ {{item.translated.language | uppercase}} ]
          </span>
              {{item.translated.text}}
            </div>
          </div>

          <div class="urtran-learning-actions-wrapper">
            <div v-if="!visibleLearningCards[index]">
              <button
                class="urtran-learning-action"
                @click="showHiddenLearningCard(index)"
              >
                Show {{hiddenCardName}} card
              </button>
            </div>
            <div v-else>
              <button
                class="urtran-learning-action"
                @click="hideLearningCard(index)"
              >
                Hide {{hiddenCardName}} card
              </button>
            </div>

            <div
              class="urtran-learning-action"
              @click="markAsLearned(index)"
            >
              <success-icon class="checked-icon"/>
              Mark as learned
            </div>
          </div>

        </div>
      </div>


    </section>

  </div>
</template>

<script>
  import RemoveIcon from '../shared/RemoveIcon'
  import LearnIcon from '../shared/LearnIcon'
  import SuccessIcon from '../shared/SuccessIcon'

  export default {
    name: 'AppOptions',
    components: {RemoveIcon, LearnIcon, SuccessIcon},
    data: () => ({
      dictionary: null,
      isDictionaryVisible: false,
      learning: null,
      isLearningCardsVisible: false,
      learningMode: '',
      visibleLearningCards: []
    }),
    computed: {
      isDictionaryEmpty() {
        return !this.dictionary || !this.dictionary.length
      },
      isLearningEmpty() {
        return !this.learning || !this.learning.length
      },
      hiddenCardName() {
        return this.learningMode === 'original' ? 'translated' : 'original'
      }
    },
    methods: {
      /**
       * Fetches dictionary data and renders dictionary elements on page
       */
      showDictionary() {
        this.hideLearningCards()
        this.isDictionaryVisible = true
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
        this.isDictionaryVisible = false
        this.dictionary = null
      },
      addToLearning(item, index) {
        this.markDictionaryItemLearned(index)

        chrome.storage.local.get(['learning'], function (result) {
          const prevLearning = result.learning || []
          const newLearning = [...prevLearning, item]

          chrome.storage.local.set({learning: newLearning})

        })
      },
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
      },
      showLearningCards() {
        this.hideDictionary()
        this.isLearningCardsVisible = true
        this.getLearningCards()
      },
      getLearningCards() {
        const self = this
        chrome.storage.local.get(['learning'], function (result) {
          self.learning = result.learning

          const learningLength = result.learning ? result.learning.length : 0
          self.visibleLearningCards = [ ...Array.from(Array(learningLength), () => false) ]
        })
      },
      hideLearningCards() {
        this.isLearningCardsVisible = false
        this.learning = null
        this.visibleLearningCards = []
        this.learningMode = ''
      },
      setLearningMode(mode) {
        this.learningMode = mode
      },
      showHiddenLearningCard(index) {
        this.$set(this.visibleLearningCards, index, true)
      },
      hideLearningCard(index) {
        this.$set(this.visibleLearningCards, index, false)
      },
      markAsLearned(index) {
        const self = this
        chrome.storage.local.get(['learning'], function (result) {
          const learning = result.learning
          const timesLearnt = learning[index].timesLearnt

          if (timesLearnt === 2) {
            console.log(timesLearnt, 'timesLearnt')
            self.removeLearningItem(index)
          } else {
            learning[index].timesLearnt = timesLearnt ? timesLearnt + 1 : 1

            chrome.storage.local.set({learning},
              function () {
                self.learning = learning
              })
          }
        })
      },
      removeLearningItem(index) {
        const self = this
        this.visibleLearningCards.splice(index, 1)
        this.learning.splice(index, 1)
        chrome.storage.local.set({learning: self.learning})
      },
      getOriginalLearningClass(index) {
        return (this.learningMode === 'original' || this.visibleLearningCards[index]) ? 'visible' : 'hidden'
      },
      getTranslatedLearningClass(index) {
        return (this.learningMode === 'translated' || this.visibleLearningCards[index]) ? 'visible' : 'hidden'
      },
    },
    filters: {
      /**
       * Converts string to uppercased string
       * @param {string} value - String to uppercase.
       */
      uppercase(value) {
        return value ? value.toUpperCase() : ''
      }
    },
    updated() {
      console.log('updates')
    }
  }
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 500px;
    padding: 8px;
  }

  .urtran-dictionary-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    border-top: 1px solid #c0bebe;
  }

  .urtran-learning-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    border-top: 1px solid #c0bebe;
  }

  .urtran-dictionary-content {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #c0bebe;
    padding: 10px 5px;
  }

  .urtran-learning-content {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #c0bebe;
    padding: 10px 5px;
  }

  .urtran-learning-item {
    flex-basis: 50%;
    font-size: 16px;
    line-height: 1.3;
    text-align: left;
    overflow-wrap: break-word;
  }

  .urtran-dictionary-item {
    flex-basis: 45%;
    font-size: 16px;
    line-height: 1.3;
    text-align: left;
    overflow-wrap: break-word;
  }

  .urtran-dictionary-item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .urtran-dictionary-item.translated {
    border-left: 1px solid #c0bebe;
    padding: 0 2px 0 6px;
  }

  .urtran-learning-item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .urtran-learning-item.translated {
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
    color: #ff5252;
    display: inline-block;
  }

  .urtran-main-button {
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

  .urtran-no-items {
    color: #787878;
    font-size: 14px;
    margin-top: 5px;
  }

  .hidden {
    visibility: hidden;
  }

  .choose-mode-button {
    border: rgba(255, 82, 82, 0.4);
    background: none;
    color: #ff5252;
    font-size: 14px;
    font-weight: 600;
    padding: 4px;
    outline: rgba(255, 82, 82, 0.4);
    cursor: pointer;
  }

  .urtran-learning-cards-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .urtran-learning-actions-wrapper {
    display: flex;
    justify-content: space-evenly;
    margin: 8px 0;
    align-items: center;
  }

  .urtran-learning-action {
    display: flex;
    align-items: center;
    border: rgba(255,82,82,.4);
    background: none;
    color: #ff5252;
    font-size: 16px;
    font-weight: 600;
    padding: 4px;
    outline: rgba(255,82,82,.4);
    cursor: pointer;
  }

  .urtran-learning-action .checked-icon {
    width: 22px;
    height: 22px;
    margin: 0 3px;
    cursor: pointer;
  }
</style>
