import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供 服务模块表 接口}
 * @author hsc
 * @date 2018-09-18
 * @class AuthClientService
 * @extends {BaseService}
 */
class AuthService extends BaseService {
  static async getClients(id) {
    const url = '/api/auth/service/' + id + '/client'
    return api.get(url)
  }

  static async modifyClients(id, data) {
    const url = '/api/auth/service/' + id + '/client'
    return api.put(url, data, true)
  }
}
AuthService.baseUrlPrefix = '/api/auth/service'
export { AuthService }
