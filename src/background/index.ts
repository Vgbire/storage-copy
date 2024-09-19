/* TO DO 恭喜发财、步步高升。生活不易，投喂随意。小彩蛋 */
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "../index.html", active: true })
})
