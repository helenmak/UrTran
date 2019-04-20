const apiv2 = 'https://translation.googleapis.com'

chrome.runtime.onInstalled.addListener(function(data) {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'developer.chrome.com'},
        })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
});

chrome.runtime.onMessage.addListener( // TODO: redo
  function(request, sender, sendResponse) {
    switch(request.contentScriptQuery) {
      case "translateText":
        const translateUrl = `${apiv2}/language/translate/v2?key=AIzaSyD9vAcdqFJ3PY2pKqsL_gqZgZfFHR7Ff68`
        const translateFetchOptions = {
          method: 'POST',
          body: JSON.stringify(request.options)
        }
        fetch(translateUrl, translateFetchOptions)
          .then(response => response.json())
          .then(translated => sendResponse({ data: translated }))
          .catch(error => sendResponse({ error }))
        return true;  // Will respond asynchronously.
      case "getLanguages":
        let languagesUrl = `${apiv2}/language/translate/v2/languages?key=AIzaSyD9vAcdqFJ3PY2pKqsL_gqZgZfFHR7Ff68`
        const target = request.options.target;
        if (target) languagesUrl = `${languagesUrl}&target=${target}`
        fetch(languagesUrl)
          .then(response => response.json())
          .then(languages => sendResponse({ data: languages }))
          .catch(error => sendResponse({ error }))
        return true;  // Will respond asynchronously.
    }
});

