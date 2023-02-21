function isError(websiteConfig) {
  return ['fromDomain', 'toDomain', 'storage', 'field'].some((item) => {
    if (!websiteConfig[item]) {
      return true
    }
  })
}
