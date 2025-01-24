import { BaseService } from '@/api/base-service'
import api from '@/libs/api'
/**
 *
 * 提供  接口}
 * @author panliu
 * @date 2019-02-21
 * @class AlarmService
 * @extends {BaseService}
 */
class AlarmService extends BaseService {
  /**
   * 分页查询告警
   * @param {*} params
   */
  static async pageAlarm(params) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.post(`${this.baseUrlPrefix}/page/alarm`, params)
    }
  }

  /**
   * 统计各类型警告数量
   * @param {*} params
   */
  static async getAlarmCount() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/alarm/count`)
    }
  }

  /**
   * 获取未处理的告警信息
   * @param {*} params
   */
  static async getAlarm() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/get/alarm`)
    }
  }

  /**
   * 修改指定告警信息的解决状态
   * @param {*} params
   */
  static async updateAlarmValue(eventid) {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/update/` + eventid + '/value')
    }
  }

  /**
   * 统计各个主机的告警情况
   * @param {*} params
   */
  static async countHostsAlarmNum() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      return api.get(`${this.baseUrlPrefix}/count/hosts/alarm/num`)
    }
  }
}
AlarmService.baseUrlPrefix = '/api/zabbix/alarm/problem'
export { AlarmService }
