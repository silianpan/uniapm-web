import axios from '@/libs/api.request'
import iView from 'iview'
import router from '@/router'
const HttpErrorCode = {
  400: '请求错误',
  401: '未授权，请登陆',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}
function checkStatus(response = {}) {
  let { status, statusText } = response
  if (status === 200 || status === 304) {
    return response.data
  } else {
    let msg = statusText || HttpErrorCode[status]
    return {
      status: -1,
      code: status,
      msg: msg
    }
  }
}
function checkToken(result) {
  let { code } = result
  if (code === 40102) {
    // token 失效
    console.log(router)
    sessionStorage.removeItem('token')
    router.push({
      name: 'login'
    })
    // 跳转到登录页面
    // 清除token
    console.log(result.msg)
  }
  return result
}

function checkResult(result) {
  let { status } = result
  result.ok = function() {
    return false
  }
  if (status === 0) {
    result.ok = function() {
      return true
    }
  }
  if (status === -1) {
    // 请求数据失败
    iView.LoadingBar.error()
    iView.Message.error({
      content: result.msg || result.message || '发生错误',
      closable: true
    })
  } else {
    iView.LoadingBar.finish()
  }
  return result
}

export default {
  get: (url, params = {}) => {
    return axios
      .request({
        url: url,
        params,
        method: 'get'
      })
      .then(checkStatus)
      .then(checkResult)
      .then(checkToken)
  },
  post: (url, data, hasParams = false) => {
    let options = {
      url: url,
      data,
      method: 'post'
    }
    if (hasParams) {
      options.params = data
    }
    return axios
      .request(options)
      .then(checkStatus)
      .then(checkResult)
      .then(checkToken)
  },
  delete: (url, params) => {
    return axios
      .request({
        url: url,
        params,
        method: 'delete'
      })
      .then(checkStatus)
      .then(checkResult)
      .then(checkToken)
  },
  put: (url, data, hasParams = false) => {
    let options = {
      url: url,
      data,
      method: 'put'
    }
    if (hasParams) {
      options.params = data
    }
    return axios
      .request(options)
      .then(checkStatus)
      .then(checkResult)
      .then(checkToken)
  }
}
