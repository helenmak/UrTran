<template>
  <section
    v-if="visible"
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
              <span class="urtran-text">
              {{item.original.text}}
              </span>
            </div>

            <div
              class="urtran-learning-item translated"
              :class="getTranslatedLearningClass(index)"
            >
          <span class="urtran-language">
            [ {{item.translated.language | uppercase}} ]
          </span>
              <span class="urtran-text">
                {{item.translated.text}}
              </span>
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
</template>

<script>
  import SuccessIcon from '../shared/SuccessIcon'

  export default {
    name: 'AppPopupLearning',
    components: {SuccessIcon},
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      learning: null,
      learningMode: '',
      visibleLearningCards: []
    }),
    computed: {
      isLearningEmpty() {
        return !this.learning || !this.learning.length
      },
      hiddenCardName() {
        return this.learningMode === 'original' ? 'translated' : 'original'
      }
    },
    methods: {
      /**
       * Gets learning items from storage and set to component data.
       * Also set corresponding initial cards visibility component data to false.
       */
      getLearningCards() {
        const self = this
        console.log('getLearningCards')
        chrome.storage.local.get(['learning'], function (result) {
          self.learning = result.learning
          console.log('after storage getLearningCards')

          const learningLength = result.learning ? result.learning.length : 0
          self.visibleLearningCards = [ ...Array.from(Array(learningLength), () => false) ]
        })
      },
      /**
       * Sets learning cards mode
       * @param {string} mode - determines show original or translated card
       */
      setLearningMode(mode) {
        this.learningMode = mode
        console.log('set learning mode', this.learningMode, mode)
      },
      /**
       * Shows hidden card. Sets card visibility data to true
       * @param {number} index - index of current learning cards
       */
      showHiddenLearningCard(index) {
        this.$set(this.visibleLearningCards, index, true)
      },
      /**
       * Hides previously opened learning card. Sets card visibility data to false
       * @param {number} index - index of current learning cards
       */
      hideLearningCard(index) {
        this.$set(this.visibleLearningCards, index, false)
      },
      /**
       * Marks learning card as learned.
       * Removes card if item was learned 3 times.
       * @param {number} index - index of cards to mark as learned
       */
      markAsLearned(index) {
        const self = this
        chrome.storage.local.get(['learning'], function (result) {
          const learning = result.learning
          const timesLearnt = learning[index].timesLearnt

          if (timesLearnt === 2) {
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
      /**
       * Removes an original-translated pair of learning cards from storage and component data.
       * @param {number} index - index of cards to remove
       */
      removeLearningItem(index) {
        const self = this
        this.visibleLearningCards.splice(index, 1)
        this.learning.splice(index, 1)
        chrome.storage.local.set({learning: self.learning})
      },
      /**
       * Computes original learning card class based on learning mode and visibility
       * @param {number} index - index of card
       */
      getOriginalLearningClass(index) {
        return (this.learningMode === 'original' || this.visibleLearningCards[index]) ? 'visible' : 'hidden'
      },
      /**
       * Computes translated learning card class based on learning mode and visibility
       * @param {number} index - index of card
       */
      getTranslatedLearningClass(index) {
        return (this.learningMode === 'translated' || this.visibleLearningCards[index]) ? 'visible' : 'hidden'
      },
    },
    watch: {
      visible (isVisible) {
        if (isVisible) {
          this.getLearningCards()
        } else {
          this.learning = null
          this.visibleLearningCards = []
          this.learningMode = ''
        }
        
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
  .urtran-learning-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    border-top: 1px dashed rgba(242, 242, 242, 0.86);
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
    color: #f2f2f2db;
  }

  .urtran-learning-item.original {
    border-right: 1px solid #c0bebe;
    padding-right: 6px;
  }

  .urtran-learning-item.translated {
    border-left: 1px solid #c0bebe;
    padding: 0 2px 0 6px;
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
  
  .choose-mode-wrapper {
    color: #f2f2f2db;
    font-size: 14px;
    font-weight: 500;
  }

  .choose-mode-button {
    border: #e0d1ce;
    background: none;
    color: #e0d1ce;
    font-size: 14px;
    font-weight: 500;
    padding: 4px;
    outline: #e0d1ce;
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
    border: #e0d1ce;
    background: none;
    color: #e0d1ce;
    font-size: 16px;
    font-weight: 500;
    padding: 4px;
    outline: #e0d1ce;
    cursor: pointer;
  }

  .urtran-learning-action .checked-icon {
    width: 22px;
    height: 22px;
    margin: 0 3px;
    cursor: pointer;
  }
</style>
