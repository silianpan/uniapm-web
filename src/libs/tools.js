import moment from 'moment'
export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (target, arr) => {
  return target.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = exp => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断元素是否在数组中
 * @param {Object} value
 * @param {Array} arr
 */
export const isInArray = (value, arr) => {
  for (let i = 0; i < arr.length; ++i) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}

/**
 * 拆分解析字段
 */
export const parseSplitFields = function f(needParseField, data) {
  let t = {}
  for (let key in needParseField) {
    try {
      let d = JSON.parse(data[key] || null)
      needParseField[key].forEach(key2 => {
        if (d[key2]) {
          t[key2] = d[key2]
        }
      })
    } catch (e) {}
    delete data[key]
  }
  return t
}

/**
 * 深度字符串化合并字段
 */
export const stringifyFieldMergeFields = (needStringifyFields, formData) => {
  let t = {}
  for (let key in needStringifyFields) {
    let json = {}
    needStringifyFields[key].forEach(key2 => {
      if (formData[key2]) {
        json[key2] = formData[key2]
      }
      delete formData[key2]
    })
    t[key] = JSON.stringify(json)
  }
  return t
}

export const formatUTC = function(value, format) {
  if (moment(value || '').isValid()) {
    return moment(value).format(format || 'YYYY-MM-DD')
  }
  return '未知'
}

export const bytesToSize = bytes => {
  if (bytes === 0) return '0 B'
  const k = 1000
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(5) + ' ' + sizes[i]
}

export const getfilesize = size => {
  if (!size) return ''
  let num = 1024.0 // byte
  if (size < num) return size + 'B'
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + 'K' // kb
  if (size < Math.pow(num, 3)) return (size / Math.pow(num, 2)).toFixed(2) + 'M' // M
  if (size < Math.pow(num, 4)) return (size / Math.pow(num, 3)).toFixed(4) + 'G' // G
  return (size / Math.pow(num, 4)).toFixed(2) + 'T' // T
}
