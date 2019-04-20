<template>
  <div
    class="urTranPopup"
    :style="{
        position: 'absolute',
        top: top + 'px',
        left: left + 'px'
      }"
    @click.stop
    @selectstart.stop
  >
    <select
      class="selectLanguage"
      v-model="sourceLanguage"
    >
      <option
        v-for="language in languages"
        :value="language.language"
      >
        {{language.name}}
      </option>
    </select>

    <div class="original">
      {{selectionText}}
    </div>
    <div class="divider"></div>
    <select
      class="selectLanguage"
      v-model="targetLanguage"
    >
      <option
        v-for="language in languages"
        :value="language.language"
      >
        {{language.name}}
      </option>
    </select>
    <div class="translated">
      {{translatedText}}
    </div>
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
      translations: Object
    },
    data: () => ({
      languages: [],
      translatedText: '',
      sourceLanguage: '',
      browserLanguage: 'uk',
      targetLanguage: 'uk'
    }),
    watch: {
      sourceLanguage(newSource, oldSource) {
        if (oldSource && newSource) this.translateText()
      },
      targetLanguage() {
        this.translateText()
      }
    },
    methods: {
      async translateText() {
        const translations = await api.translateText({
          text: this.selectionText,
          target: this.targetLanguage,
          source: this.sourceLanguage
        })
        this.translatedText = translations.translatedText
        if (translations.detectedSourceLanguage) this.sourceLanguage = translations.detectedSourceLanguage
      },
      async getAvailableLanguages(target) {
        this.languages = await api.getAvailableLanguages({ target })
      },
      log() {
        console.log('clicked')
      }
    },
    created(){
      const browserLanguage = navigator.language.slice(0,2)
      if (browserLanguage) this.browserLanguage = browserLanguage;
      this.getAvailableLanguages(this.browserLanguage)
      this.translatedText = this.translations.translatedText
      this.sourceLanguage = this.translations.detectedSourceLanguage
      console.log('sourceLanguage', this.sourceLanguage)
    }
  }
</script>

<style scoped>
  .urTranPopup {
    position: absolute;
    display: flex;
    flex-direction: column;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.35);
    background-color: #F6F9FF;
    padding: 20px 15px;
  }

  .original {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #252525;
  }

  .translated {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #252525;
  }

  .divider {
    width: 100%;
    position: relative;
    margin: 15px 0;
    height: 1px;
    background-color: #C3C3C3;
  }

  .selectLanguage {
    align-self: flex-end;
    border: 1px solid #E7E9EC;
    background-color: #F6F9FF;
    min-width: 200px;
    width: 50%;
    font-size: 13px;
    padding: 5px;
    margin-bottom: 12px;
  }
</style>
