function copy(websiteConfig, needFresh) {
  const token = websiteConfig.token

  if (['sessionStorage', 'localStorage'].includes(websiteConfig.storage)) {
    const isNotSame = window[websiteConfig.storage].getItem(websiteConfig.field) !== token
    window[websiteConfig.storage].setItem(websiteConfig.field, token)
    if (needFresh && isNotSame) window.location.reload()
  } else if (websiteConfig.storage === 'cookie') {
    const isNotSame = getCookie(websiteConfig.field) !== token
    setCookie(websiteConfig.field, token, 365)
    if (needFresh && isNotSame) window.location.reload()
  }
}

function init() {
  chrome.storage.local.get(['websiteConfigs'], (data) => {
    if (!data?.websiteConfigs) return
    const websiteConfigs = data.websiteConfigs
    const currentHref = location.href
    const handledDomain = {}
    websiteConfigs.forEach((websiteConfig) => {
      if (isError(websiteConfig)) return
      if (currentHref.includes(websiteConfig.fromDomain)) {
        let id = websiteConfig.fromDomain + websiteConfig.storage + websiteConfig.field
        // 跳过已经拿到token的域名
        if (handledDomain[id]) {
          websiteConfig.token = handledDomain[id]
          return
        }

        let token
        if (['sessionStorage', 'localStorage'].includes(websiteConfig.storage)) {
          token = window[websiteConfig.storage].getItem(websiteConfig.field)
        } else if (websiteConfig.storage === 'cookie') {
          token = getCookie(websiteConfig.field)
        }
        if (token) {
          handledDomain[id] = token
          websiteConfig.token = token
          chrome.runtime.sendMessage({ websiteConfig })
        }
      } else if (currentHref.includes(websiteConfig.toDomain)) {
        copy(websiteConfig)
        chrome.runtime.onMessage.addListener((content) => {
          if (currentHref.includes(content.websiteConfig.toDomain)) {
            let needFresh = true
            copy(content.websiteConfig, needFresh)
          }
        })
      }
    })
    chrome.storage.local.set({ websiteConfigs: websiteConfigs })
  })
}

chrome.runtime.onMessage.addListener(({ type }) => {
  if (type === 'init') init()
})

init()
