import api from '@/libs/api'
import _ from 'lodash'

/**
 * 提供读取身份证接口
 * @author hsc
 * @date 2018-10-24
 * @class ISSOnlineService
 */
class ISSOnlineService {
  /**
   *检查服务是否启动
   *
   * @author hsc
   * @date 2018-10-29
   * @static
   * @memberof ISSOnlineService
   */
  static async checkWebServer() {}

  /**
   *下载驱动
   *
   * @author hsc
   * @date 2018-10-29
   * @static
   * @memberof ISSOnlineService
   */
  static async installDrive() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
    }
  }

  /**
   *读取身份证信息
   *
   * @author hsc
   * @date 2018-10-29
   * @static
   * @memberof ISSOnlineService
   */
  static async scanReadIdCardInfo() {
    if (_.isNil(this.baseUrlPrefix)) {
      console.log('请设置请求的前缀地址')
    } else {
      let params = {
        'OP-DEV': 1,
        'CMD-URL': 4,
        common: 1,
        random: parseInt(Math.random() * 10000)
      }
      return api.get(`${this.baseUrlPrefix}/ScanReadIdCardInfo`, params)
    }
  }
}

ISSOnlineService.baseUrlPrefix = '/ZKIDROnline'

ISSOnlineService.interfaceResult = {
  0: { mean: '成功', message: '二代身份证读取成功！', type: 'success' },
  1: {
    mean: '端口打开失败',
    message: '未检测到二代身份证阅读器！',
    type: 'warning'
  },
  2: {
    mean: '数据传输超时',
    message: '未检测到二代身份证阅读器！',
    type: 'error'
  },
  10: {
    mean: '没有找到卡',
    message: '未读取到身份证，请重新刷卡！',
    type: 'warning'
  },
  11: {
    mean: '读卡操作失败',
    message: '未检测到二代身份证阅读器！',
    type: 'error'
  },
  20: { mean: '自检失败', message: '二代身份证读取失败！', type: 'error' },
  30: { mean: '其他错误', message: '二代身份证读取失败！', type: 'error' },
  40: { mean: '相片解码失败', message: '二代身份证读取失败！', type: 'error' },
  100: {
    mean: '超时',
    message: '未读取到身份证，请重新刷卡！',
    type: 'warning'
  },
  200: {
    mean: 'GetBase64PhotoData',
    message: '二代身份证读取失败！',
    type: 'error'
  }
}

export { ISSOnlineService }
