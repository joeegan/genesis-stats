import { keys, replace, reduce } from 'ramda'

const stringMerge = (str, obj) =>
  reduce(
    (str, key) => replace(`{${key}}`, obj[key])(str),
    str,
    keys(obj)
  )

export { stringMerge }
