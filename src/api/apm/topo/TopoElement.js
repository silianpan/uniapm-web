import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author panliu
 * @date 2019-02-21
 * @class TopoElementService
 * @extends {BaseService}
 */
class TopoElementService extends BaseService {
  /**
   * 保存所有拓扑图元素
   * @param {*} params
   */
  static async saveAll(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/save/all`, params)
    }
  }
}
TopoElementService.baseUrlPrefix = '/api-uniapm/uniapm/topo/topoElement'
export { TopoElementService }
