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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery === "translateText") {
      var url = `${apiv2}/language/translate/v2?key=AIzaSyD9vAcdqFJ3PY2pKqsL_gqZgZfFHR7Ff68`
      fetch(url, { method: 'POST', body: JSON.stringify(request.options) })
        .then(response => response.json())
        .then(price => sendResponse(price))
        .catch(error => console.log('fetch error', error))
      return true;  // Will respond asynchronously.
    }
});
