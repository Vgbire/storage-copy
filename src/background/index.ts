const POPUP_URL = chrome.runtime.getURL('index.html')

// cb关闭成功之后打开popue的回调
const removePopupTab = (cb?) => {
  chrome.action.setPopup({ popup: '' })
  chrome.storage.local.get('POPUP_TAB_ID_KEY', (data: any) => {
    chrome.tabs.query({}, (tabs) => {
      let popupTab = tabs.find((tab) => tab.id === data.POPUP_TAB_ID_KEY)
      if (popupTab) {
        chrome.tabs.remove(popupTab.id, cb)
      } else {
        cb?.()
      }
    })
  })
}

const openPopupTab = () => {
  removePopupTab()
  chrome.tabs.create({ url: POPUP_URL, active: true }, (newTab) => {
    chrome.storage.local.set({ POPUP_TAB_ID_KEY: newTab.id })
  })
}

const openPopup = () => {
  removePopupTab(() => {
    chrome.action.setPopup({ popup: POPUP_URL }, () => {
      chrome.action.openPopup()
    })
  })
}

let openWay = 'popup'
chrome.storage.local.get('openWay', (data) => {
  openWay = data.openWay || 'popup'
})

chrome.action.onClicked.addListener(() => {
  openWay === 'popup' ? openPopup() : openPopupTab()
})

chrome.storage.onChanged.addListener((data) => {
  if (data.openWay) {
    const newValue = data.openWay.newValue
    openWay = newValue
    openWay === 'popup' ? openPopup() : openPopupTab()
  }
})
