<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form :onSuccessValid="handleSubmit" :userNameRules="userNameRules" ></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from './login-form'
import { LoginService, UserService } from '@/api/admin'
export default {
  components: {
    LoginForm
  },
  data() {
    /** 登陆验证规则 */
    return {
      userNameRules: [{ required: true, validator: this.userNameValidator, trigger: 'blur' }]
    }
  },
  methods: {
    userNameValidator: function (rule, value, callback) {
      if (this._.isNil(value) || value === '') {
        callback(new Error('登陆账户不能为空'))
        return
      }
      // 验证账户名是否存在
      let params = [
        {
          field: 'username',
          queryType: 'eq',
          value: value
        }
      ]
      UserService.countByCondition(params).then(res => {
        if (res.status === 0) {
          if (res.data === 0) {
            callback(new Error('账户不存在'))
          } else {
            callback()
          }
        } else {
          callback(new Error(res.msg || ''))
        }
      })
    },
    async handleSubmit ({ userName, password }) {
      let params = { username: userName, password }
      // 发起登陆请求 ，获取返回数据 初始化 vuex 进入home 页面
      let res = await LoginService.login(params)
      if (res.ok()) {
        // 设置 token
        const token = res.data
        this.$store.commit('initToken', token)
        let resInfo = await LoginService.getUserInfo(token)
        if (resInfo.ok()) {
          let { menuMap } = resInfo.data
          this.$store.commit('initUserInfo', resInfo.data)
          this.$store.commit('initMenuInfo', menuMap)
          this.$store.commit('resetTagNavList')
          // this.$store.dispatch('findDictByGroup')
          this.$Message.success('登录成功')
          this.$router.push({
            name: 'home'
          })
        } else {
          this.$Message.error('服务器无法连接!')
          this.loginout()
        }
      } else {
        this.$Message.error('服务器无法连接!')
        this.loginout()
      }
    },
    /** 退出登录 */
    loginout() {
      this.$store.dispatch('handleLogOut')
      this.$router.push({
        name: 'login'
      })
    },
    convertTreeToList(menus, parent) {
      let res = {}
      menus.forEach(m => {
        let mItem = { ...m }
        // mItem.breadcrumb =
        delete mItem.children
        res[m.id] = mItem
        if (m && 'children' in m && m.children.length > 0) {
          let _r = this.convertTreeToList(m.children)
          Object.assign(res, _r)
        }
        return m
      })
      return res
    }
  }
}
</script>
