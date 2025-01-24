import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author panliu
 * @date 2019-02-21
 * @class TopoService
 * @extends {BaseService}
 */
class TopoService extends BaseService {
  /**
   * 分页获取未绑定业务的拓扑
   * @param {*} params
   */
  static async pageNoBindTopo(param) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/no/bind`, param)
    }
  }
}
TopoService.baseUrlPrefix = '/api/uniapm/topo/topo'
export { TopoService }
