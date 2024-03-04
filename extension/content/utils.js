function isError(websiteConfig) {
  return ['status', 'fromDomain', 'toDomain', 'storage'].some((item) => {
    if (!websiteConfig[item]) {
      return true
    }
  })
}
