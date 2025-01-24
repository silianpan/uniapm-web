import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 资源模块表 接口}
 * @author hsc
 * @date 2019-01-07
 * @class ModuleService
 * @extends {BaseService}
 */
class ModuleService extends BaseService {
  /**
   * change/enable
   * @author hsc
   * @date 2019-01-09
   * @static
   * @returns
   * @memberof ModuleService
   */
  static async findModulesByPid(pid) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/by/pid/${pid}`)
    }
  }

  /**
   *
   * @author hsc
   * @date 2019-01-13
   * @static
   * @param {*} roleId
   * @param {*} pid
   * @returns
   * @memberof ModuleService
   */
  static async findModulesAndElementsByRoleAndPid(roleId, pid) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/authority/by/role/and/pid`, {
        roleId: roleId,
        pid: pid
      })
    }
  }

  /**
   * 分配权限
   * @author hsc
   * @date 2019-01-13
   * @static
   * @param {*} params
   * @returns
   * @memberof ModuleService
   */
  static async signAuthority(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/sign/authority`, params)
    }
  }
}
ModuleService.baseUrlPrefix = '/api-uniapm/admin/module'
export { ModuleService }
