import { removeToken } from '@/libs/util'
import _ from 'lodash'
//
const userSessionPrefix = 'user-'
function getFromSessionStorage(key, defaultValue, isParse) {
  let value = sessionStorage.getItem(key)
  if (isParse && value) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return defaultValue
    }
  }
  if (!value && defaultValue) {
    return defaultValue
  }
  return value
}

export default {
  state: {
    // 登录账号
    username: getFromSessionStorage(`${userSessionPrefix}username`),
    // 用户名
    name: getFromSessionStorage(`${userSessionPrefix}name`),
    // id
    id: getFromSessionStorage(`${userSessionPrefix}id`),
    // 令牌
    token: getFromSessionStorage('token'),
    // 待定用户拥有角色
    roles: [],
    // // 可操作的模块（可能是）
    authorityModulesTree: [],
    // 用户的 菜单权限
    menus: getFromSessionStorage(`${userSessionPrefix}menus`, [], true),
    menusInfo: getFromSessionStorage(`${userSessionPrefix}menusInfo`, {}, true),
    // 用户页面模块的 按钮 操作权限
    elements: getFromSessionStorage(`${userSessionPrefix}elements`, [], true)
  },
  mutations: {
    /**
     *
     * @author hsc
     * @date 2019-01-03
     * @param {*} state
     * @param {*} userInfo
     * {
     *  username:'',
     *  name:'',
     *  photo:'',
     *  id:'',
     *  menus:[],
     *  elements:[]
     * }
     */
    initUserInfo(state, userInfo) {
      const info = userInfo || {}
      Object.keys(info).forEach(field => {
        let val = info[field]
        if (field === 'elements' && info[field]) {
          val = {}
          ;(info[field] || []).forEach(item => {
            if (item.code) {
              val[item.code] = { ...item }
            }
          })
        }
        if (_.isString(val)) {
          sessionStorage.setItem(`${userSessionPrefix}${field}`, val)
        } else {
          sessionStorage.setItem(
            `${userSessionPrefix}${field}`,
            JSON.stringify(val)
          )
        }
        state[field] = val
      })
    },

    /**
     *
     * @author hsc
     * @date 2019-01-13
     * @param {*} state
     * @param {*} menusInfo
     */
    initMenuInfo(state, menusInfo) {
      sessionStorage.setItem(
        `${userSessionPrefix}menusInfo`,
        JSON.stringify(menusInfo)
      )
      state.menusInfo = menusInfo
    },
    /**
     *
     *清除当前 用户信息
     * @author hsc
     * @date 2019-01-04
     * @param {*} state
     */
    clearUserInfo(state) {
      // sessionStorage.removeItem('token')
      sessionStorage.clear()
    },
    /** 根据菜单id 找到该菜单详细信息 */
    // getMenuById: (state, id) => {
    //   return this.getters.menusInfo[id]
    // },
    /**
     *初始化token
     *
     * @author hsc
     * @date 2019-01-04
     * @param {*} state
     * @param {*} token
     */
    initToken(state, token) {
      sessionStorage.setItem('token', token)
      state.token = token
    }
  },
  getters: {
    /**
     * 获取 token
     *
     * @author hsc
     * @date 2019-01-04
     * @param {*} state
     */
    token: state => {
      if (!state.token) {
        return getFromSessionStorage(`token`)
      }
      return state.token
    },

    menusInfo: state => {
      if (!state.menusInfo) {
        return getFromSessionStorage(`${userSessionPrefix}menusInfo`, {}, true)
      }
      return state.menusInfo
    },
    menuTree: state => {
      if (!state.menus || state.menus.length === 0) {
        return getFromSessionStorage(`${userSessionPrefix}menus`, [], true)
      }
      return state.menus
    },
    /**
     * 获取用户菜单信息
     *
     * @author hsc
     * @date 2019-01-04
     * @param {*} state
     */
    menuList: state => {
      if (!state.menus || state.menus.length === 0) {
        return getFromSessionStorage(`${userSessionPrefix}menus`, [], true)
      }
      return state.menus
    },
    /**
     * 判断 是否拥有此按钮权限
     *
     * @author hsc
     * @date 2019-01-04
     * @param {*} state
     */
    hasElementsPerimByKey: state => key => {
      if (state.elements[key] !== null && state.elements[key] !== undefined) {
        return true
      }
      return false
    },
    elements: state => {
      return state.elements
    }
  },
  actions: {
    // 退出登录
    handleLogOut({ state, commit }) {
      commit('initToken', '')
      commit('initUserInfo', {})
      commit('initMenuInfo', {})
      removeToken()
      commit('clearUserInfo')
    }
  }
}
