<template>
  <div
    class="urTranPopup"
    :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
  >
      <div>
        {{selectionText}}
      </div>
    <div>-----------</div>
    <div>
      {{translatedText}}
    </div>
      <button @click.stop="translateText">
        Translate
      </button>

  </div>
</template>

<script>
  import api from '../api/'

  export default {
    name: 'Popup',
    props: {
      top: Number,
      left: Number,
      selectionText: String,
      selectionRect: Object
    },
    data: () => ({
      translatedText: '',
      sourceLanguage: '',
      targetLanguage: 'uk'
    }),
    methods: {
      async translateText() {
        const translations = await api.translateText({ text: this.selectionText, target: this.targetLanguage })
        console.log('translations', translations)
        this.translatedText = translations.translatedText
        this.sourceLanguage = translations.detectedSourceLanguage
      },
      async getAvailableLanguages(target) {
        this.languages = await api.getAvailableLanguages({ target })
      }
    },
    created(){
      this.getAvailableLanguages(this.targetLanguage)
      console.log('navigator.language', navigator.language)
    }
  }
</script>

<style scoped>
  .urTranPopup {
    position: absolute;
    background-color: mediumvioletred;
    cursor: pointer;
    border: none;
  }
</style>
