import i18n from 'i18next'

const getLanguage = () => {
  const lng = navigator?.language || 'en_US'
  if (lng.includes('zh')) {
    return 'zh_CN'
  }
  if (lng.includes('en')) {
    return 'en_US'
  }
  return 'en_US'
}

i18n.init({
  lng: getLanguage(),
  resources: {
    zh_CN: {
      translation: {
        enabled: '是否启用',
        sourceSite: '源网站',
        sourceSiteTip: '从该网站复制存储数据',
        targetSite: '目标网站',
        targetSiteTip: '将存储数据粘贴到该网站',
        storage: '存储位置',
        storageField: '字段名',
        storageFieldTip: '获取单个字段的值，不填时将获取所有字段',
        storageValue: '字段值',
        storageValueTip: '点击可复制到粘贴板',
        operation: '操作',
        copySuccess: '复制成功！',
        save: '保存',
        openWay: '打开方式',
        popup: '弹窗',
        tab: '标签页',
        saveSuccess: '配置已生效！',
        autoRefresh: '自动刷新',
        autoRefreshTip: '当字段值发生变化时，目标网站是否自动刷新',
      },
    },
    en_US: {
      translation: {
        enabled: 'Enable status',
        sourceSite: 'Source site',
        sourceSiteTip: 'Copy storage data from this website',
        targetSite: 'Target site',
        targetSiteTip: 'Paste the storage data onto this website',
        storage: 'Storage location',
        storageField: 'Storage Field',
        storageFieldTip: 'Obtain the value of a single field, if empty, all fields will be obtained',
        storageValue: 'Storage Value',
        storageValueTip: 'Click to copy to clipboard',
        operation: 'Operation',
        copySuccess: 'Copy success!',
        save: 'Save',
        openWay: 'Open way',
        popup: 'Popup',
        tab: 'Tab',
        saveSuccess: 'Configuration has taken effect!',
        autoRefresh: 'Auto refresh',
        autoRefreshTip: 'When Storage Value changed, the target website automatically refreshes ',
      },
    },
  },
})

export default i18n
