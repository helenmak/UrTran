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
      v-if="!isLearningVisible"
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
    
    <app-popup-dictionary :visible="isDictionaryVisible" />
    
    <app-popup-learning :visible="isLearningVisible" />

  </div>
</template>

<script>
  import AppPopupDictionary from './AppPopupDictionary'
  import AppPopupLearning from './AppPopupLearning'

  export default {
    name: 'AppPopup',
    components: {
      AppPopupDictionary,
      AppPopupLearning
    },
    data: () => ({
      isDictionaryVisible: false,
      isLearningVisible: false
    }),
    methods: {
      /**
       * Fetches dictionary data and renders dictionary elements on page. Hides learning cards area.
       */
      showDictionary() {
        console.log('handle show dict')
        this.hideLearningCards()
        this.isDictionaryVisible = true
      },
      /**
       * Hides dictionary elements on page
       */
      hideDictionary() {
        console.log('handle hide dict')
        this.isDictionaryVisible = false
      },
      /**
       * Fetches learning cards and renders them on page. Hides dictionary area.
       */
      showLearningCards() {
        console.log('show learning cards')
        this.hideDictionary()
        this.isLearningVisible = true
      },
      /**
       * Hides learning cards from page
       */
      hideLearningCards() {
        this.isLearningVisible = false
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 500px;
    padding: 8px;
    background-color: #343753;
  }

  .urtran-main-button {
    min-width: 150px;
    border: 1px solid #e0d1ce;
    background: none;
    color: #f2f2f2db;
    font-size: 16px;
    font-weight: 500;
    padding: 4px;
    margin: 8px;
    outline: #e0d1ce;
    cursor: pointer;
  }
</style>
