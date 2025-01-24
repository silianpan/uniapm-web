import { setTagNavListInLocalstorage } from '@/libs/util'
import { getFromSessionStorage } from '../session-storage'
/** 首页 */
const HomeTag = {
  id: 'home',
  route: 'home',
  name: '首页'
}
const prefix = 'nav-'

export default {
  state: {
    homeTag: HomeTag,
    /** 当前的激活的导航 */
    activeTagNav: getFromSessionStorage(`${prefix}activeTagNav`, {}, true),
    /** 所有的导航标签页 */
    tagNavList: getFromSessionStorage(`${prefix}tagNavList`, [], true),
    local: '',
    // 大屏刷新数据时间间隔
    fullScreenSyncTime: '0 0 */1 * * *'
  },
  mutations: {
    resetTagNavList(state) {
      this.commit('setActiveTagNav', HomeTag)
      this.commit('setTagNavList', [HomeTag])
    },
    setActiveTagNav(state, tagNav) {
      let { id } = state.activeTagNav || {}
      if (id !== tagNav.id) {
        state.activeTagNav = tagNav
        sessionStorage.setItem(`${prefix}activeTagNav`, JSON.stringify(tagNav))
      }
    },
    setTagNavList(state, list) {
      state.tagNavList = [...list]
      sessionStorage.setItem(`${prefix}tagNavList`, JSON.stringify(list))
    },

    addTagNav(state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      state.local = lang
    },
    setFullScreenSyncTime: (state, data) => {
      state.fullScreenSyncTime = data
    }
  },
  actions: {
    closeTagNav({ state, commit }, name) {
      // 过滤掉传入的name
      let res = state.tagNavList.filter(item => item.id !== id)
      // 重新设置标签
      commit('setTagNavList', res)
    },
    saveFullScreenSyncTime({ commit }, data) {
      commit('setFullScreenSyncTime', data)
    }
  },
  getters: {
    getFullScreenSyncTime: state => {
      return state.fullScreenSyncTime
    }
  }
}
