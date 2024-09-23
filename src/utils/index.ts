import { message } from 'antd'
import { IWebsiteConfig } from '../content'
import i18n from '../i18n'

export const copy = (value: string) => {
  // 动态创建 textarea 标签
  const textarea = document.createElement('textarea')
  // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
  textarea.readOnly = true
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = value
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea)
  // 选中值并复制
  textarea.select()
  const result = document.execCommand('Copy')
  if (result) {
    message.success(i18n.t('copySuccess')) // 可根据项目UI仔细设计
  }
  document.body.removeChild(textarea)
}

/**
 * 生成UUID v4
 * @return {*}  {string}
 */
export const uuid = () => {
  let d = Date.now()

  const d2 = (performance && performance.now && performance.now() * 1000) || 0

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16

    if (d > 0) {
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      r = (d2 + r) % 16 | 0
      d = Math.floor(d2 / 16)
    }

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const isError = (websiteConfig: IWebsiteConfig) => {
  return ['status', 'fromDomain', 'toDomain', 'storage'].some((item) => {
    if (!websiteConfig[item]) {
      return true
    }
  })
}

export const isEqual = (obj1, obj2) => {
  // 首先检查是否都是null或undefined，或者是否为同一个引用
  if (obj1 === obj2) {
    return true
  }

  // 检查类型是否相同
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  // 处理基本数据类型
  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2
  }

  // 处理数组和对象
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // 如果键的数量不同，则对象不相等
  if (keys1.length !== keys2.length) {
    return false
  }

  // 检查所有键是否存在于两个对象中，并递归检查值是否相等
  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
