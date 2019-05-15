const apiv2 = 'https://translation.googleapis.com'
const key = 'ENTER_GOOGLE_API_KEY_HERE'

/**
 * Listen to events from content script and send api calls to google translation api
 * Sends response back to content script
 */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.contentScriptQuery) {
      case "translateText":
        const translateUrl = `${apiv2}/language/translate/v2?key=${key}`
        const translateFetchOptions = {
          method: 'POST',
          body: JSON.stringify(request.options)
        }
        fetch(translateUrl, translateFetchOptions)
          .then(response => response.json())
          .then(translated => sendResponse({ data: translated }))
          .catch(error => sendResponse({ error }))
        return true;
        
      case "getLanguages":
        let languagesUrl = `${apiv2}/language/translate/v2/languages?key=${key}`
        const target = request.options.target;
        if (target) languagesUrl = `${languagesUrl}&target=${target}`
        fetch(languagesUrl)
          .then(response => response.json())
          .then(languages => sendResponse({ data: languages }))
          .catch(error => sendResponse({ error }))
        return true;  // Will respond asynchronously.
    }
});

