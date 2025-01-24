<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick" placement="bottom-end">
      <Avatar :src="userAvator" style="background-color: #87d068" icon="ios-person"/>
      <DropdownMenu slot="list">
         <DropdownItem v-for="(item, index) in dropdowmItems" :key="index" :name="item.name" :divided="item.divided">
             <Icons :type="item.icon" :size="14"></Icons><span style="margin-left:10px">{{item.label}}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import Icons from '@/components/icons'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  components: {
    Icons
  },
  data: function() {
    return {
      dropdowmItems: [
        {
          icon: 'iconfont icon-yonghuguanli',
          name: 'persionalSettings',
          label: '个人设置'
        },
        {
          name: 'modifyPwd',
          icon: 'iconfont icon-peizhi',
          label: '修改密码'
        },
        {
          name: 'loginout',
          icon: 'ivu-icon ivu-icon-md-exit',
          divided: true,
          label: '退出登录'
        }
      ]
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id
    }
  },
  methods: {
    /** 个人设置 */
    persionalSettings() {
      this.$router.push({
        name: 'persionalSettings',
        params: {
          sourceRoute: this.$route,
          userId: this.userId
        }
      })
    },
    /** 修改密码 */
    modifyPwd() {
      this.$router.push({
        name: 'editPasswordForm',
        params: {
          sourceRoute: this.$route,
          userId: this.userId
        }
      })
    },
    /** 退出登录 */
    loginout() {
      this.$store.dispatch('handleLogOut')
      this.$router.push({
        name: 'login'
      })
    },
    handleClick (name) {
      if (this[name] && this._.isFunction(this[name])) {
        this[name]()
      }
    }
  }
}
</script>
