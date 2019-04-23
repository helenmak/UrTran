#UrTran

> Chrome extension for translations


### Run extension
If you haven`t application built ('dist' folder is empty), build application::

``` bash
# install dependencies
npm install

# build for production with minification
npm run build
```
1) Open Chrome and go to chrome://extensions/
2) Turn on 'Developer mode' in top right corner of page
3) Click "Load Unpacked Extension" and select directory with this project
4) Application must appear on browser`s toolbar. 
5) Go to page you want to translate. 
6) (!) Important: if your page was already opened, reload the page in order for extension to work properly (cause extension context can be invalidated)
7) Try to select some word to see translation.

When learning cards on main extension popup, you have to press 3 times 'Mark as learned' in order for card to be removed.

###### This extension was published to Goggle Chrome Store, but currently it's on moderation. If it pass moderation quickly, you`ll see it in Chrome Store as UrTran. 

###### I recommend to turn off Google Translate extension, when you run UrTran, cause it feels a little uncomfortable to have both running.

