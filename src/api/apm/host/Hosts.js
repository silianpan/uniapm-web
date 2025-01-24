import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author panliu
 * @date 2019-02-21
 * @class HostsService
 * @extends {BaseService}
 */
class HostsService extends BaseService {
  /**
   * 根据groupid获取主机信息，包括CPU和内存利用率
   * @param {*} params
   */
  static async pageHostByGroupId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/groupid`, params)
    }
  }

  /**
   * 查询主机分组
   * @param {*} params
   */
  static async findHostGroup() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/list/hostgroup`)
    }
  }

  /**
   * 查询某些应用集的监控项，以及最新数据
   * @param {*} params
   */
  static async findItemsValueByApplicationName(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/items/value`, params)
    }
  }

  /**
   * 统计各类型主机数量
   * @param {*} params
   */
  static async getHostsCount() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/hosts/count`)
    }
  }

  /**
   * 获取cpu或内存占用率前五
   * @param {*} params
   */
  static async getTopFive(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/top/five`, params)
    }
  }

  /**
   * 分页查询网络接口流量Top
   * @param {*} params
   */
  static async pageInterfaceFlowTop() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/interface/flow/top`, { current: 1, size: 5 })
    }
  }

  /**
   * 获取指定主机的应用集
   * @param {*} params
   */
  static async getApplicationsByHostId(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/applications/name`, params)
    }
  }

  /**
   * 查找所有主机
   * @param {*} params
   */
  static async findAllHosts() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/find/all/hosts`)
    }
  }
}
HostsService.baseUrlPrefix = '/api-uniapm/zabbix/host/hosts'
export { HostsService }
