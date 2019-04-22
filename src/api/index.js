/**
 * Sends message to background script to call translation api
 * @param {object} - { text, source, target } - takes text to translate, source language and target language
 * @returns {Promise} - Promise object represents translations data
 */
const translateText = async ({ text, source, target = 'uk' }) => {
  try {
    const translated = await new Promise((resolve, reject) => {
      const requestOptions = { q: text, target }
      if (source) requestOptions.source = source

      chrome.runtime.sendMessage(
        {
          contentScriptQuery: 'translateText',
          options: requestOptions
        },
        response => {
          if (response.error) reject(response.error)
          else resolve(response.data)
        })
    })
    return translated.data.translations[0]
  } catch (err) {
    console.log('translateText error: ', err)
  }
}

/**
 * Sends message to background script to get languages
 * @param {object} - { target } - takes language to return names of languages
 * @returns {Promise} - Promise object represents list of available languages
 */
const getAvailableLanguages = async ({ target = 'uk' }) => {
  try {
    const availableLanguages = await new Promise((resolve, reject) => {
      let requestOptions = {}
      if (target) requestOptions.target = target
      
      chrome.runtime.sendMessage(
        {
          contentScriptQuery: 'getLanguages',
          options: requestOptions
        },
        response => {
          if (response.error) reject(response.error)
          else resolve(response.data)
        })
    })

    return availableLanguages.data.languages
  } catch (err) {
    console.log('getAvailableLanguages error: ', err)
  }
}

export default {
  translateText,
  getAvailableLanguages
}
