<template>
  <div
    class="urtran-popup"
    :class="popupClass"
    :style="popupPosition"
    @click.stop
    @selectstart.stop
  >

    <div class="urtran-arrow" :class="arrowClass"></div>

    <div class="urtran-source-header">
      <select
        class="urtran-select-language source"
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
        class="urtran-flag"
        v-for="flag in sourceCountriesFlags"
        :src="flag"
      >
    </div>

    <div class="urtran-original">
      {{selectionText}}
    </div>

    <div class="urtran-divider"></div>

    <div class="urtran-translated">
      {{translatedText}}
    </div>

    <div class="urtran-target-header">
      <select
        class="urtran-select-language target"
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
        class="urtran-flag"
        v-for="flag in targetCountriesFlags"
        :src="flag"
      >
    </div>

    <button
      v-if="!addedToDictionary"
      class="urtran-dictionary-button"
      @click="addToDictionary"
    >
      Add text to dictionary
    </button>

    <div
      v-else
      class="urtran-dictionary-text"
    >
      Text added to dictionary!
    </div>

  </div>
</template>

<script>
  import api from '../api/'
  import languagesToCountries from '../languagesToCountries'

  export default {
    name: 'AppPopup',
    props: {
      top: Number,
      left: Number,
      selectionText: String,
      translations: Object,
      placement: String
    },
    data: () => ({
      languages: [],
      translatedText: '',
      sourceLanguage: '',
      browserLanguage: 'uk',
      targetLanguage: 'uk',
      sourceCountriesFlags: null,
      targetCountriesFlags: null,
      addedToDictionary: false
    }),
    computed: {
      /**
       * Computes popupPosition from top/bottom and left props
       * @returns {object} - object with absolute popup coordinates
       */
      popupPosition() {
        return {top: `${this.top}px`, left: `${this.left}px`}
      },
      /**
       * Computes popup class based on 'placement' props
       * @returns {string} - class to add in popup styles
       */
      popupClass() {
        return this.placement
      },
      /**
       * Computes popup arrow class based on placement props
       * @returns {string} - class to add in arrow styles
       */
      arrowClass() {
        return this.placement === 'top' ? 'bottom' : 'top'
      }
    },
    watch: {
      /**
       * Watches for source language changes and fetch translation and source country flag on change
       * @param {string} newSource - New selected source language.
       * @param {string} oldSource - Previous source language
       */
      sourceLanguage(newSource, oldSource) {
        if (oldSource && newSource) this.translateText()
        this.getSourceCountriesFlag()
      },
      /**
       * Watches for target language changes and fetch translation and target country flag on change
       */
      targetLanguage() {
        this.translateText()
        this.getTargetCountriesFlag()
      }
    },
    methods: {
      /**
       * Calls api to translate text. Set translated text and detected source language to component data
       */
      async translateText() {
        const translations = await api.translateText({
          text: this.selectionText,
          target: this.targetLanguage,
          source: this.sourceLanguage
        })
        this.translatedText = translations.translatedText
        if (translations.detectedSourceLanguage) this.sourceLanguage = translations.detectedSourceLanguage
      },
      /**
       * Calls api to get available languages. Set languages to component data
       */
      async getAvailableLanguages(target) {
        this.languages = await api.getAvailableLanguages({target})
      },
      /**
       * Adds current source language, original text, target language and translated text to dictionary.
       * Saves dictionary in storage
       */
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
            },
            function () {
              self.addedToDictionary = true
            })
        })
      },
      /**
       * Builds src to get flag images
       */
      getFlagSrc(countryCode) {
        return `https://www.countryflags.io/${countryCode}/flat/64.png`
      },
      /**
       * Search for country code for source language and get sources of flag images
       */
      getSourceCountriesFlag() {
        const sourceCountries = languagesToCountries[this.sourceLanguage] || []
        this.sourceCountriesFlags = sourceCountries.map(this.getFlagSrc)
      },
      /**
       * Search for country code for target language and get sources of flag images
       */
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
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.35);
    background-color: #fff;
    padding: 20px 15px;
    max-width: 500px;
    transform: translateX(-50%);
    z-index: 1001;
  }

  .urtran-popup.top {
    transform: translateX(-50%) translateY(-100%);
  }

  /*.urtran-popup::before {*/
    /*content: '';*/
    /*position: absolute;*/
    /*top: -8px;*/
    /*left: 50%;*/
    /*width: 13px;*/
    /*height: 13px;*/
    /*z-index: 1;*/
    /*background-color: #fff;*/
    /*transform: translateX(-50%) rotate(45deg);*/
    /*border-top: 1px solid #E0E0E0;*/
    /*border-left: 1px solid #E0E0E0;*/
    /*box-shadow: -1px -1px 2px 0 rgba(0, 0, 0, 0.25);*/
  /*}*/

  /*.urtran-popup::after {*/
    /*content: '';*/
    /*position: absolute;*/
    /*top: -8px;*/
    /*left: 50%;*/
    /*width: 13px;*/
    /*height: 13px;*/
    /*z-index: 1;*/
    /*background-color: #fff;*/
    /*transform: translateX(-50%) rotate(45deg);*/
    /*border-top: 1px solid #E0E0E0;*/
    /*border-left: 1px solid #E0E0E0;*/
    /*box-shadow: -1px -1px 2px 0 rgba(0, 0, 0, 0.25);*/
  /*}*/

  .urtran-arrow {
    position: absolute;
    left: 50%;
    width: 13px;
    height: 13px;
    z-index: 1;
    background-color: #fff;
    transform: translateX(-50%) rotate(45deg);
  }

  .urtran-arrow.top {
    top: -7px;
    border-top: 1px solid #E0E0E0;
    border-left: 1px solid #E0E0E0;
    box-shadow: -1px -1px 2px 0 rgba(0, 0, 0, 0.25);
  }

  .urtran-arrow.bottom {
    bottom: -7px;
    transform: translateX(-50%) rotate(45deg);
    border-bottom: 1px solid #E0E0E0;
    border-right: 1px solid #E0E0E0;
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.25);
  }

  .urtran-original {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #252525;
  }

  .urtran-translated {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #252525;
  }

  .urtran-divider {
    width: 100%;
    position: relative;
    margin: 15px 0;
    border-bottom: 1px dashed #ff5252;
  }

  .urtran-select-language {
    background-color: #fff;
    min-width: 150px;
    width: 50%;
    font-size: 14px;
    padding-left: 8px;
    height: 28px;
    border-style: solid;
    border-width: 1px;
  }

  .urtran-select-language.source {
    border-color: rgb(255, 82, 82) rgba(255, 82, 82, 0.6) rgba(255, 82, 82, 0.6) rgb(255, 82, 82);
  }

  .urtran-select-language.target {
    border-color: rgba(255, 82, 82, 0.6) rgba(255, 82, 82, 0.6) rgb(255, 82, 82) rgb(255, 82, 82);
  }

  .urtran-source-header, .urtran-target-header {
    display: flex;
    height: 32px;
    align-items: center;
  }

  .urtran-source-header {
    margin: 0 0 16px;
  }

  .urtran-target-header {
    margin: 16px 0 0;
  }

  .urtran-flag {
    height: 100%;
    margin-left: 20px;
  }

  .urtran-dictionary-button {
    min-width: 200px;
    width: 100%;
    margin-top: 20px;
    border: none;
    background: none;
    color: #ff5252;
    font-size: 14px;
    font-weight: 600;
    padding: 4px;
    outline: rgba(255, 82, 82, 0.4);
    cursor: pointer;
    box-shadow: none;
  }

  .urtran-dictionary-text {
    min-width: 200px;
    width: 100%;
    margin-top: 20px;
    border: none;
    background: none;
    color: #ff5252;
    font-size: 14px;
    font-weight: 600;
    padding: 4px;
    text-align: center;
  }
</style>
