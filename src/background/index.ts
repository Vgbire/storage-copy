let websiteConfigs
/* TO DO 恭喜发财、步步高升。生活不易，投喂随意。小彩蛋
 * TO DO 监控storage的window.addEventListener('storage',(e)=>{
 *    console.log('x',e)
 *  })
 * cookieStore.onchange = (event) => { }
 */
chrome.runtime.onMessage.addListener(function (content, sender, sendResponse) {
  const tokenWindowId = sender?.tab?.id
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((item) => {
      if (item.id !== tokenWindowId) {
        chrome.tabs.sendMessage(item.id as number, {
          websiteConfig: content.websiteConfig,
        })
      }
    })
  })
  // this line seems meaningless but you have to invoke it to avoid error.
  sendResponse({ damn: true })
})

function init() {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((item) => {
      chrome.tabs.sendMessage(item.id as number, { type: "init" })
    })
  })
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup-background-link") {
    port.onMessage.addListener((configs) => {
      websiteConfigs = configs
      chrome.storage.local.set({ websiteConfigs }, () => {
        init()
      })
    })
  }
})

init()

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "../index.html", active: true })
})
