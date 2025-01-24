import api from '@/libs/api'
class LoginService {
  /**
   *
   * 登录请求
   * @author hsc
   * @date 2019-01-03
   * @static
   * @param {*} { username, password }
   * @returns
   * @memberof LoginService
   */
  static async login({ username, password }) {
    const url = '/api-uniapm/auth/jwt/token'
    // TODO: 明文传输 待改
    const data = {
      username: username,
      password: password
    }
    return api.post(url, data)
  }

  /**
   *
   *获取用户权限信息
   * @author hsc
   * @date 2019-01-03
   * @static
   * @param {*} token
   * @returns
   * @memberof LoginService
   */
  static async getUserInfo(token) {
    const url = '/api-uniapm/admin/user/front/info'
    return api.get(url, { token })
  }

  /**
   *获取当前菜单模块
   *
   * @author hsc
   * @date 2019-01-03
   * @static
   * @param {*} token
   * @returns
   * @memberof LoginService
   */
  static async getAuthorityMenus(token) {
    const url = '/api-uniapm/admin/user/front/menus'
    return api.get(url, { token })
  }
}

export { LoginService }
