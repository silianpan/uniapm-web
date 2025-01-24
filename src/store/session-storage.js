export function getFromSessionStorage(key, defaultValue, isParse) {
  let value = sessionStorage.getItem(key)
  if (isParse && value) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return defaultValue
    }
  }
  if (!value && defaultValue) {
    return defaultValue
  }
  return value
}
