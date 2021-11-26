function getCookie(cname) {
  let name = cname + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim()
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

function setCookie(cname, cvalue, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  let expires = 'expires=' + d.toGMTString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

function copy(token, websiteConfigs) {
  if (['sessionStorage', 'localStorage'].includes(websiteConfigs.storage)) {
    window[websiteConfigs.storage].setItem(websiteConfigs.field, token)
    // window.location.reload() // 是否自动刷新可配置
    console.log('-----------------token paste complete-----------------')
  } else if (websiteConfigs.storage === 'cookie') {
    setCookie(websiteConfigs.field, token, 365)
    // window.location.reload() // 是否自动刷新可配置
    console.log('-----------------token paste complete-----------------')
  }
}

chrome.storage.sync.get('websiteConfigs', (data) => {
  const websiteConfigs = data.websiteConfigs
  const currentHref = location.href
  if (currentHref.includes(websiteConfigs.fromDomain)) {
    let token
    if (['sessionStorage', 'localStorage'].includes(websiteConfigs.storage)) {
      token = window[websiteConfigs.storage].getItem(websiteConfigs.field)
    } else if (websiteConfigs.storage === 'cookie') {
      token = getCookie(websiteConfigs.field)
    }
    if (token) {
      chrome.runtime.sendMessage({ type: 'copy', token })
      console.log('-----------------token copy complete-----------------')
    } else {
      console.log('--------------------token is empty-------------------')
    }
  } else if (currentHref.includes(websiteConfigs.toDomain)) {
    chrome.runtime.sendMessage({ type: 'paste' })
    chrome.runtime.onMessage.addListener((token) => {
      copy(token, websiteConfigs)
    })
  }
})
