<template>
  <div
    class="urtran-popup"
    :style="popupPosition"
    @click.stop
    @selectstart.stop
  >

    <div class="source-header">
      <select
        class="select-language source"
        v-model="sourceLanguage"
      >
        <option
          v-for="language in languages"
          :value="language.language"
        >
          {{language.name}}
        </option>
      </select>

      <img
        class="flag"
        v-for="flag in sourceCountriesFlags"
        :src="flag"
      >
    </div>

    <div class="original">
      {{selectionText}}
    </div>

    <div class="divider"></div>

    <div class="translated">
      {{translatedText}}
    </div>

    <div class="target-header">
      <select
        class="select-language target"
        v-model="targetLanguage"
      >
        <option
          v-for="language in languages"
          :value="language.language"
        >
          {{language.name}}
        </option>
      </select>

      <img
        class="flag"
        v-for="flag in targetCountriesFlags"
        :src="flag"
      >
    </div>

    <button
      class="dictionary-button"
      @click="addToDictionary"
    >
      Add text to dictionary
    </button>

  </div>
</template>

<script>
  import api from '../api/'
  import languagesToCountries from '../languagesToCountries'

  export default {
    name: 'AppPopup',
    props: {
      top: Number,
      bottom: Number,
      left: Number,
      selectionText: String,
      translations: Object
    },
    data: () => ({
      languages: [],
      translatedText: '',
      sourceLanguage: '',
      browserLanguage: 'uk',
      targetLanguage: 'uk',
      sourceCountriesFlags: null,
      targetCountriesFlags: null
    }),
    computed: {
      popupPosition() {
        if (this.top) return { top: `${this.top}px`, left: `${this.left}px` }
        if (this.bottom) return { bottom: `${this.bottom}px`, left: `${this.left}px` }
      }
    },
    watch: {
      sourceLanguage(newSource, oldSource) {
        if (oldSource && newSource) {
          this.translateText()
        }
        this.getSourceCountriesFlag()
      },
      targetLanguage() {
        this.translateText()
        this.getTargetCountriesFlag()
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
        this.languages = await api.getAvailableLanguages({target})
      },
      addToDictionary() {
        const self = this
        chrome.storage.local.get(['dictionary'], function (result) {
          const prevDictionary = result.dictionary || []
          chrome.storage.local.set(
            {
              dictionary: [...prevDictionary,
                {
                  original: {text: self.selectionText, language: self.sourceLanguage},
                  translated: {text: self.translatedText, language: self.targetLanguage}
                }
              ]
            })
        })
      },
      getFlagSrc(countryCode) {
        return `https://www.countryflags.io/${countryCode}/flat/64.png`
      },
      getSourceCountriesFlag() {
        const sourceCountries = languagesToCountries[this.sourceLanguage] || []
        this.sourceCountriesFlags = sourceCountries.map(this.getFlagSrc)
      },
      getTargetCountriesFlag() {
        const targetCountries = languagesToCountries[this.targetLanguage] || []
        this.targetCountriesFlags = targetCountries.map(this.getFlagSrc)
      }
    },
    created() {
      const browserLanguage = navigator.language.slice(0, 2)
      this.getAvailableLanguages(browserLanguage)
      this.translatedText = this.translations.translatedText
      this.sourceLanguage = this.translations.detectedSourceLanguage
      this.getTargetCountriesFlag()
    }
  }
</script>

<style scoped>
  .urtran-popup {
    position: absolute;
    display: flex;
    flex-direction: column;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.35);
    background-color: #fff;
    padding: 20px 15px;
    max-width: 500px;
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
    border-bottom: 1px dashed #ff5252;
  }

  .select-language {
    background-color: #fff;
    min-width: 200px;
    width: 50%;
    font-size: 14px;
    padding-left: 8px;
    height: 28px;
    border-style: solid;
    border-width: 1px;
  }

  .select-language.source {
    border-color: rgb(255, 82, 82) rgba(255, 82, 82, 0.6) rgba(255, 82, 82, 0.6) rgb(255, 82, 82);
  }

  .select-language.target {
    border-color: rgba(255, 82, 82, 0.6) rgba(255, 82, 82, 0.6) rgb(255, 82, 82) rgb(255, 82, 82);
  }

  .source-header, .target-header {
    display: flex;
    height: 32px;
    align-items: center;
  }

  .source-header {
    margin: 0 0 16px;
  }

  .target-header {
    margin: 16px 0 0;
  }

  .flag {
    height: 100%;
    margin-left: 20px;
  }

  .dictionary-button {
    min-width: 200px;
    width: 100%;
    margin-top: 20px;
    border: none;
    background: none;
    color: #ff5252;
    font-size: 14px;
    font-weight: 600;
    padding: 4px;
    outline: black;
  }
</style>
