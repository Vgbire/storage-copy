import { xCookie } from '../utils/cookie'
import { isError } from '../utils'

export interface IWebsiteConfig {
  fromDomain: string
  toDomain: string
  token: string
  storage: 'localStorage' | 'sessionStorage' | 'cookie'
  field?: string
}

const copy = (websiteConfig: IWebsiteConfig, handledDomain: any, websiteConfigs: IWebsiteConfig[]) => {
  const id = websiteConfig.fromDomain + websiteConfig.storage + websiteConfig.field
  // 跳过已经拿到token的域名
  if (handledDomain[id]) {
    websiteConfig.token = handledDomain[id]
    return
  }

  let token
  if (['sessionStorage', 'localStorage'].includes(websiteConfig.storage)) {
    // 如果field存在则获取单个localStorage,如果不存在，则获取所有的localStorage
    const browserStorage = window[websiteConfig.storage]
    if (websiteConfig.field) {
      token = browserStorage.getItem(websiteConfig.field)
    } else {
      const storageObj = {}
      for (let i = 0; i < browserStorage.length; i++) {
        const key = browserStorage.key(i)
        const value = browserStorage.getItem(key)
        storageObj[key] = value
      }
      token = storageObj
    }
  } else if (websiteConfig.storage === 'cookie') {
    // 如果field存在则获取单个cookie,如果不存在，则获取所有的localStorage
    if (websiteConfig.field) {
      token = xCookie.get(websiteConfig.field)
    } else {
      token = window.document.cookie
    }
  }
  handledDomain[id] = token
  if (token !== websiteConfig.token) {
    websiteConfig.token = token
    chrome.storage.local.set({ websiteConfigs: websiteConfigs })
  }
}

const paste = (websiteConfig: IWebsiteConfig) => {
  const token = websiteConfig.token

  if (['sessionStorage', 'localStorage'].includes(websiteConfig.storage)) {
    let isNotSame = false
    // 如果field存在则获取单个localStorage,如果不存在，则获取所有的localStorage
    if (websiteConfig.field) {
      isNotSame = window[websiteConfig.storage].getItem(websiteConfig.field) !== token
      window[websiteConfig.storage].setItem(websiteConfig.field, token)
    } else {
      isNotSame = Object.keys(token).some((key) => {
        return window[websiteConfig.storage].getItem(key) !== token[key]
      })
      Object.keys(token).forEach((key) => {
        window[websiteConfig.storage].setItem(key, token[key])
      })
    }
    if (isNotSame) window.location.reload()
  } else if (websiteConfig.storage === 'cookie') {
    let isNotSame = false

    // 如果field存在则获取单个cookie,如果不存在，则获取所有的localStorage
    if (websiteConfig.field) {
      isNotSame = xCookie.get(websiteConfig.field) !== token
      xCookie.remove(websiteConfig.field)
      xCookie.remove(websiteConfig.field)
      if (token) {
        xCookie.set(websiteConfig.field, token, 9999999, '/', location.hostname)
      }
    } else {
      isNotSame = xCookie.keys(token).some((item) => {
        return xCookie.get(item) !== xCookie.get(item, token)
      })
      xCookie.keys(token).forEach((item) => {
        xCookie.set(item, xCookie.get(item), 9999999, '/', location.hostname)
      })
    }
    if (isNotSame) window.location.reload()
  }
}

const init = () => {
  chrome.storage.local.get('websiteConfigs', (data: { websiteConfigs?: IWebsiteConfig[] }) => {
    if (!data?.websiteConfigs) return
    const websiteConfigs = data.websiteConfigs
    const currentHref = location.href
    const handledDomain = {}
    websiteConfigs.forEach((websiteConfig) => {
      if (isError(websiteConfig)) {
        return
      }
      if (currentHref.includes(websiteConfig.fromDomain)) {
        copy(websiteConfig, handledDomain, websiteConfigs)
      } else if (currentHref.includes(websiteConfig.toDomain)) {
        paste(websiteConfig)
      }
    })
  })
}

chrome.storage.onChanged.addListener(() => {
  init()
})

init()
