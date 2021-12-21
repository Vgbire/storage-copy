chrome.runtime.onMessage.addListener(function (content, sender) {
  let tokenWindowId = sender.tab.id
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((item) => {
      if (item.id !== tokenWindowId) {
        chrome.tabs.sendMessage(item.id, { websiteConfig: content.websiteConfig })
      }
    })
  })
})

function init() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((item) => {
      chrome.tabs.sendMessage(item.id, { type: 'init' })
    })
  })
}

init()
