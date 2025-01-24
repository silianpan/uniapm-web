import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
import _ from 'lodash'
/**
 *
 * 提供 字典数据项 接口}
 * @author hsc
 * @date 2018-10-29
 * @class DictItemService
 * @extends {BaseService}
 */
class DictItemService extends BaseService {
  /**
   *
   *查询字典类型分组数据
   * @author hsc
   * @date 2018-10-30
   * @static
   * @param {*} query
   * @returns
   * @memberof DictItemService
   */
  static async findByGroup(query) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/find/by/group`, query)
    }
  }
}
DictItemService.baseUrlPrefix = '/api/admin/dict/dictItem'
export { DictItemService }
