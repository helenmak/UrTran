const apiv2 = 'https://translation.googleapis.com'

const translateText = async (text, source = 'en', target = 'ru') => {
  try {
    // const options = {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     q: text,
    //     target,
    //     source
    //   })
    // }
    // const response = await fetch(
    //   `${apiv2}/language/translate/v2?key=AIzaSyD9vAcdqFJ3PY2pKqsL_gqZgZfFHR7Ff68`,
    //   options)
    // console.log('response TRANSLATED', response)
    chrome.runtime.sendMessage(
      {contentScriptQuery: "translateText", options: {
          q: text,
          target,
          source
        }},
      response => console.log('response from background', response));
    // const json = await response.json()
    // console.log('json response TRANSLATED', json)
    // return json;
  } catch (err) {
    console.log('translateText error: ', err)
  }
}

export default {
  translateText
}
