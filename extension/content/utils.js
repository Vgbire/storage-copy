function isError(websiteConfig) {
  return ['status', 'fromDomain', 'toDomain', 'storage', 'field'].some((item) => {
    if (!websiteConfig[item]) {
      return true
    }
  })
}
