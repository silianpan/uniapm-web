import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供  接口}
 * @author hsc
 * @date 2018-09-18
 * @class UserService
 * @extends {BaseService}
 */
class UserService extends BaseService {
  /**
   * change/enable
   * @author hsc
   * @date 2019-01-09
   * @static
   * @returns
   * @memberof UserService
   */
  static async changeEnable(id, enable) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/change/enable`, {
        id: id,
        enable: enable
      })
    }
  }

  /**
   *
   * 锁定/解锁 某个用户
   * @author hsc
   * @date 2019-01-09
   * @static
   * @param {*} id
   * @param {*} lockStatus
   * @returns
   * @memberof UserService
   */
  static async changeLockStatus(id, lockStatus) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/change/lockStatus`, {
        id: id,
        lockStatus: lockStatus
      })
    }
  }

  /**
   *
   * 根据role 查找可分配用户
   * @author hsc
   * @date 2019-01-09
   * @static
   * @param {*} roleId
   * @returns
   * @memberof UserService
   */
  static async findAvailableUserByRole(roleId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/available/by/role/${roleId}`)
    }
  }

  /**
   *
   * 根据role 查找已分配用户
   * @author hsc
   * @date 2019-01-09
   * @static
   * @param {*} roleId
   * @returns
   * @memberof UserService
   */
  static async findExistsUserByRole(roleId) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/exists/by/role/${roleId}`)
    }
  }

  /**
   *
   * 分配角色用户
   * @author hsc
   * @date 2019-01-09
   * @static
   * @param {*} roleId
   * @param {*} [userIds=[]]
   * @returns
   * @memberof UserService
   */
  static async signUserToRole(roleId, userIds = []) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/sign/to/role/${roleId}`, userIds)
    }
  }

  /**
   *
   * 验证旧密码是否正确
   * @author hsc
   * @date 2019-01-23
   * @static
   * @param {*} id
   * @param {*} oldPwd
   * @returns
   * @memberof UserService
   */
  static async validateUserOldPwdById(id, oldPwd) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}//validate/old/pwd/${id}`, {
        oldPwd
      })
    }
  }

  /**
   * 修改密码
   * @author hsc
   * @date 2019-01-23
   * @static
   * @param {*} id
   * @param {*} oldPwd
   * @param {*} newPwd
   * @returns
   * @memberof UserService
   */
  static async modifyUserPwdById(id, oldPwd, newPwd) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/modify/pwd/${id}`, {
        oldPwd,
        newPwd
      })
    }
  }

  /**
   *重置用户密码
   *
   * @author hsc
   * @date 2019-01-24
   * @static
   * @param {*} id
   * @returns
   * @memberof UserService
   */
  static async resetUserPwdById(id) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/reset/pwd/${id}`)
    }
  }
}
UserService.baseUrlPrefix = '/api-uniapm/admin/user'
export { UserService }
