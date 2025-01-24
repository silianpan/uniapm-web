import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author zxy
 * @date 2019-03-07
 * @class BusinessService
 * @extends {BaseService}
 */
class BusinessService extends BaseService {
  /**
   * 根据id获取业务详情及其拓扑图
   * @param {*} params
   */
  static async getBusinessAndTopo(id) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/get/businessAndTopo`, { id })
    }
  }
}
BusinessService.baseUrlPrefix = '/api/uniapm/business/business'
export { BusinessService }
