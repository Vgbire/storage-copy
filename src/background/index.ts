const POPUP_URL = chrome.runtime.getURL('../index.html')
const POPUP_TAB_ID_KEY = 'popupTabId'

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('POPUP_TAB_ID_KEY', (data: any) => {
    chrome.tabs.query({}, (tabs) => {
      let popupTab = tabs.find((tab) => tab.id === data.POPUP_TAB_ID_KEY)

      if (popupTab) {
        chrome.tabs.update(popupTab.id, { active: true })
      } else {
        chrome.tabs.create({ url: POPUP_URL, active: true }, (newTab) => {
          chrome.storage.local.set({ POPUP_TAB_ID_KEY: newTab.id })
        })
      }
    })
  })
})
