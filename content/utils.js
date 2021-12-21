function isError(websiteConfig) {
  return ['fromDomain', 'toDomain', 'storage', 'field'].some((item) => {
    if (!websiteConfig[item]) {
      console.log(`-----------------${item} is Require(log by tokencv)-----------------`)
      return true
    }
  })
}
