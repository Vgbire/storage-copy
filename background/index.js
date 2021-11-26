let token = ''
chrome.runtime.onMessage.addListener(function (content, sender) {
  const type = {
    copy: () => {
      let tokenWindowId = sender.tab.id
      token = content.token
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((item) => {
          if (item.id !== tokenWindowId) {
            chrome.tabs.sendMessage(item.id, token)
          }
        })
      })
    },
    paste: () => {
      chrome.tabs.sendMessage(sender.tab.id, token)
    },
  }
  type[content.type]()
})
