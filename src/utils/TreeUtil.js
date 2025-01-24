import AreaData from 'area-data'
import _ from 'lodash'
class TreeUtil {
  /**
   *province 省(1) city 市(2) county 乡(3)  village 村(4)
   *
   * @author hsc
   * @date 2018-09-25
   * @static
   * @param {*} [options=[]]
   * @returns
   * @memberof TreeUtil
   */
  static getProviceDatas(options = []) {
    return loadAreaTreeDatas('86', 'provice', options)
  }

  /**
   *
   *
   * @author hsc
   * @date 2018-09-25
   * @static
   * @param {*} parentCode
   * @param {*} field
   * @param {*} [options=[]]
   * @returns
   * @memberof TreeUtil
   */
  static loadAreaTreeDatas(parentCode, field, options = []) {
    let res = []
    let childDatas = AreaData[parentCode] || []
    let _op = []
    if (_.isString(options)) {
      _op.push(options)
    }
    if (_.isArray(options)) {
      _op = options.map(item => {
        return item[field]
      })
    }
    // 去重
    _op = [...new Set(_op)]
    for (let c in childDatas) {
      let childtem = {
        value: c,
        field: field,
        title: childDatas[c],
        children: []
      }
      if (!_.isEmpty(_op) && this.oneOf(c, _op)) {
        res.push(childtem)
      }
      // 如果_op 为null 则默认加载该地区所有数据
      if (_.isEmpty(_op)) {
        res.push(childtem)
      }
    }
    return res
  }

  static oneOf(item, arr) {
    return arr.some(i => {
      return i === item
    })
  }

  static areaFormatter(areaData, format) {}
}
export { TreeUtil }
