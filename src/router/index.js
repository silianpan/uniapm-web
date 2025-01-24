import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
// import { getToken } from '@/libs/util'
import { LoginService } from '@/api/admin'

Vue.use(Router)
const router = new Router({
  routes
  // mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = sessionStorage.getItem('token')
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到home页
    })
  } else {
    if (
      (!store.getters.menuList || store.getters.menuList.length === 0) &&
      token
    ) {
      LoginService.getUserInfo(token).then(res => {
        if (res.status === 0) {
          next()
        } else {
          next({ name: LOGIN_PAGE_NAME })
        }
      })
    } else {
      next()
    }
  }
})
router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
