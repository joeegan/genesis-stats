const stringMerge = (str, obj) =>
  Object.keys(obj).reduce(
    (str, key) => str.replace(`{${key}}`, obj[key]),
    str
  )

export { stringMerge }
