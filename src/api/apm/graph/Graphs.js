import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author panliu
 * @date 2019-02-21
 * @class GraphsService
 * @extends {BaseService}
 */
class GraphsService extends BaseService {
  /**
   * 根据hostid查询主机图形
   * @param {*} params
   */
  static async findGraphByHostId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/list/graphs`, params)
    }
  }

  /**
   * 根据graphid查询items
   * @param {*} params
   */
  static async findGraphItemsByGraphId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/items/graphid`, params)
    }
  }

  /**
   * 根据itemid查询历史数据
   * @param {*} params
   */
  static async findGraphItemHistoryByItemId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/history/itemid`, params)
    }
  }

  /**
   * 根据hostid查询主机图形，包括echars需要
   * @param {*} params
   */
  static async findGraphEchartsByHostId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/list/graphs/echarts`, params)
    }
  }

  /**
   * 根据graphid更新图形数据，包括echars需要
   * @param {*} params
   */
  static async findGraphEchartsByGraphId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/update/echarts`, params)
    }
  }

  /**
   * 根据itemid和name（监控项名称）生成Eharts图形数据，用作单监控项图形
   * @param {*} params
   */
  static async genGraphEchartsByHostIdAndItemId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/gen/echarts`, params)
    }
  }

  /**
   * 更新生成的单监控项图形数据
   * @param {*} params
   */
  static async updateGenGraphEchartsByHostIdAndItemId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/update/gen/echarts`, params)
    }
  }

  /**
   * 查询核心交换机流量图形
   * @param {*} params
   */
  static async findGraphEchartsCoreExchange(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/graphs/echarts/core/exchange`, params)
    }
  }
}
GraphsService.baseUrlPrefix = '/api/zabbix/graph/graphs'
export { GraphsService }
