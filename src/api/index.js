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
          if (response.error) {
            console.log('rejecting')
            reject(response.error)
          }
          else resolve(response.data)
        })
    })
    console.log('translated', translated, 'translated.data', translated.data)
    return translated.data.translations[0]
  } catch (err) {
    console.log('translateText error: ', err)
  }
}

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
