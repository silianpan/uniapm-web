import Axios from 'axios'
// import Cookies from 'js-cookie'
import _config from '@/config'
import { TOKEN_KEY } from '@/libs/util'
class httpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy(url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      config => {
        config.headers['dsNo'] = _config.dsNo
        if (!config.url.includes('/users')) {
          config.headers['x-access-token'] = sessionStorage.getItem(TOKEN_KEY)
          config.headers['Authorization'] = sessionStorage.getItem(TOKEN_KEY)
        }
        if (config.url.includes('/hfrid')) {
          config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        return config
      },
      error => {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    instance.interceptors.response.use(
      response => response,
      error => Promise.resolve(error.response)
    )
  }
  // 创建实例
  create(url) {
    let conf = {
      // 采用spring cloud微服务，注释baseURL
      // baseURL: baseURL,
      // timeout: 2000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      }
    }
    if (url.startsWith('/hfrid')) {
      conf.baseURL = _config.hfridBaseURL
      conf.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest(instances = []) {
    //
  }
  // 请求实例
  request(options) {
    let instance = this.create(options.url)
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
