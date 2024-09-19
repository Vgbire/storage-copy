import { xCookie } from "./cookie"
import { isError } from "./utils"

interface IWebsiteConfig {
  fromDomain: string
  toDomain: string
  token: string
  storage: "localStorage" | "sessionStorage" | "cookie"
  field?: string
}

function copy(websiteConfig: IWebsiteConfig, needFresh?: boolean) {
  const token = websiteConfig.token

  if (["sessionStorage", "localStorage"].includes(websiteConfig.storage)) {
    const isNotSame =
      window[websiteConfig.storage].getItem(websiteConfig.field) !== token
    // 如果field存在则获取单个localStorage,如果不存在，则获取所有的localStorage
    if (websiteConfig.field) {
      window[websiteConfig.storage].setItem(websiteConfig.field, token)
    } else {
      Object.keys(websiteConfig.token).forEach((key) => {
        window[websiteConfig.storage].setItem(key, websiteConfig.token[key])
      })
    }
    if (needFresh && isNotSame) window.location.reload()
  } else if (websiteConfig.storage === "cookie") {
    const isNotSame = xCookie.get(websiteConfig.field) !== token
    // 如果field存在则获取单个cookie,如果不存在，则获取所有的localStorage
    if (websiteConfig.field) {
      xCookie.remove(websiteConfig.field)
      xCookie.remove(websiteConfig.field)
      if (token) {
        xCookie.set(websiteConfig.field, token, 9999999, "/", location.hostname)
      }
    } else {
      xCookie.keys().forEach((item) => {
        xCookie.set(item, xCookie.get(item), 9999999, "/", location.hostname)
      })
    }
    if (needFresh && isNotSame) window.location.reload()
  }
}

function init() {
  chrome.storage.local.get(
    ["websiteConfigs"],
    (data: { websiteConfigs?: IWebsiteConfig[] }) => {
      if (!data?.websiteConfigs) return
      const websiteConfigs = data.websiteConfigs
      const currentHref = location.href
      const handledDomain = {}
      websiteConfigs.forEach((websiteConfig) => {
        if (isError(websiteConfig)) {
          return
        }
        if (currentHref.includes(websiteConfig.fromDomain)) {
          const id =
            websiteConfig.fromDomain +
            websiteConfig.storage +
            websiteConfig.field
          // 跳过已经拿到token的域名
          if (handledDomain[id]) {
            websiteConfig.token = handledDomain[id]
            return
          }

          let token
          if (
            ["sessionStorage", "localStorage"].includes(websiteConfig.storage)
          ) {
            // 如果field存在则获取单个localStorage,如果不存在，则获取所有的localStorage
            if (websiteConfig.field) {
              token = window[websiteConfig.storage].getItem(websiteConfig.field)
            } else {
              const localStorageObj = {}
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                const value = localStorage.getItem(key)
                localStorageObj[key] = value
              }
              token = localStorageObj
            }
          } else if (websiteConfig.storage === "cookie") {
            // 如果field存在则获取单个cookie,如果不存在，则获取所有的localStorage
            if (websiteConfig.field) {
              token = xCookie.get(websiteConfig.field)
            } else {
              token = window.document.cookie
            }
          }
          handledDomain[id] = token
          websiteConfig.token = token
          chrome.runtime.sendMessage({ websiteConfig })
        } else if (currentHref.includes(websiteConfig.toDomain)) {
          copy(websiteConfig)
          chrome.runtime.onMessage.addListener((content) => {
            if (currentHref.includes(content.websiteConfig?.toDomain)) {
              const needFresh = true
              copy(content.websiteConfig, needFresh)
            }
          })
        }
      })
      chrome.storage.local.set({ websiteConfigs: websiteConfigs })
    }
  )
}

chrome.runtime.onMessage.addListener(({ type }) => {
  if (type === "init") init()
})

init()
