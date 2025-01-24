import _ from 'lodash'
import { DictItemService } from '@/api/admin/dict'
export default {
  state: {
    // 刷新标志
    refreshTag: true,
    dictDatas: {}
  },
  getters: {
    getDictDatas: state => {
      if (state.refreshTag === true) {
        if (
          sessionStorage.dictDatas &&
          typeof sessionStorage.dictDatas === 'string'
        ) {
          state.dictDatas = JSON.parse(sessionStorage.dictDatas)
        }
        state.refreshTag = false
      }
      return state.dictDatas
    },

    dictFormatter: (state, getters) => (groupKey, options) => {
      let value, valueField, keyField
      let _options = options || ''
      let split = ','
      if (
        !_.isNil(_options) &&
        (_.isString(_options) || _.isNumber(_options))
      ) {
        value = `${_options || ''}`
      } else {
        value = _options.value || []
        valueField = _options.valueField
        keyField = _options.keyField
        split = _options.split
      }
      var groupDatas = (getters.getDictDatas[groupKey] || []).datas || []
      var _r = []
      for (let i = 0; i < groupDatas.length; i++) {
        let item = groupDatas[i]
        if (typeof value === 'string') {
          if (item[valueField || 'value'] === value) {
            _r.push(item[keyField || 'key'])
          }
        } else {
          value.forEach(val => {
            if (item[valueField || 'value'] === val) {
              _r.push(item[keyField || 'key'])
            }
          })
        }
      }
      return _r.join(split)
    },
    dictDatasWithGroupKey: (state, getters) => groupKey => {
      return (getters.getDictDatas[groupKey] || []).datas || []
    }
  },
  mutations: {
    // 设置数据库字典数据
    setDictDatas(state, dictDatas) {
      state.dictDatas = dictDatas
      state.refreshTag = false
      // 重新设置 sessionStorage 中字典数据
      sessionStorage.dictDatas = JSON.stringify(dictDatas)
    }
  },
  actions: {
    // 查询数据库字典,刷新一次 本地字典数据
    findDictByGroup({ commit, getters }, query = {}) {
      DictItemService.findByGroup(query).then(res => {
        if (res.ok()) {
          let _dictDatas = {}
          for (let groupType in res.data) {
            let _items = res.data[groupType] || []
            _dictDatas[groupType] = {
              datas: _items.map(item => {
                let _i = {}
                _i.value = item.dictValue
                _i.key = item.dictKey
                _i.id = item.id
                _i.groupCode = item.groupCode
                _i.enable = item.enable
                return _i
              })
            }
          }
          commit('setDictDatas', _dictDatas)
        }
      })
    }
  }
}
