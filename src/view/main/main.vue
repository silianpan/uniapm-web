<template :lang="local">
  <Layout style="height: 100%" class="main">
   <Header class="header-con header-radius" >
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange" @show-route="showRoute">
        <user :user-avator="userAvator" />
        <!-- <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" /> -->
        <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
        <div style="margin-right: 10px;display: inline-block;vertical-align: middle;">
          <Button @click="goToFullScreen">监控大屏</Button>
        </div>
      </header-bar>
    </Header>
    <Layout>
      <Sider v-show="leftMenus && leftMenus.length >0" breakpoint="md" hide-trigger collapsible :width="256" :collapsed-width="80" v-model="collapsed">
        <side-menu accordion :active-name="activeMenu" :collapsed="collapsed" @on-select="handleSideMenuSelectAction" :menu-list="leftMenus">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <div style="text-align: center;"><sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollapsedChange"></sider-trigger></div>
        </side-menu>
      </Sider>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <transition name="fade-transform" mode="out-in">
              <router-view v-if="$route.meta && $route.meta.notCache === true" />
              <keep-alive v-else>
                <router-view />
              </keep-alive>
            </transition>
          </Content>
          <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
        </Layout>
      </Content>
    </Layout>
    <!-- <footer style="text-align:center;height:20px;padding:0;">
      2018-2025 &copy; 海豹科技有限公司
    </footer> -->
  </Layout>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import siderTrigger from './components/header-bar/sider-trigger'
import ABackTop from './components/a-back-top'
import {
  mapMutations, mapActions
} from 'vuex'
import {
  getNewTagList, getLatestTag
} from './components/tags-nav/utils.js'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    ABackTop,
    siderTrigger,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data() {
    return {
      // isRouterAlive: true,
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      leftMenus: []
    }
  },
  // provide() {
  //   return {
  //     reload: this.reload
  //   }
  // },
  computed: {
    menusInfo() {
      return this.$store.state.user.menusInfo
    },
    activeMenu() {
      return `${this.activeTagNav.id}`
    },
    homeTag() {
      return this.$store.state.app.homeTag
    },
    activeTagNav() {
      return this.$store.state.app.activeTagNav
    },
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    tagRouter() {
      return this.$store.state.app.tagRouter
    },
    userAvator() {
      return this.$store.state.user.photo
    },
    // menuList() {
    //   return this.$store.getters.leftMenuList
    // },
    local() {
      return this.$store.state.app.local
    }
  },
  methods: {
    ...mapMutations(['setTagNavList', 'getMenuById', 'setActiveTagNav', 'resetTagNavList', 'addTagNav', 'setLocal']),
    ...mapActions(['showMenu']),
    // reload() {
    //   this.isRouterAlive = false
    //   this.$nextTick(() => {
    //     this.isRouterAlive = true
    //   })
    // },
    showRoute(item) {
      this.leftMenus = [...item.children || []]
      // 设置active menus
      // 如果left Menus 不为空获取第一个叶子节点
      this.$nextTick(() => {
        let activeMenu = this.getFirstLeafMenu(item)
        if (activeMenu) {
          this.handleSideMenuSelectAction(activeMenu.id)
        }
      })
    },
    getFirstLeafMenu(menuNode) {
      if (menuNode) {
        if (menuNode.children && menuNode.children.length > 0) {
          return this.getFirstLeafMenu(menuNode.children[0])
        } else {
          return menuNode
        }
      }
      return null
    },
    goToFullScreen() {
      this.$router.push({
        name: 'fullScreen'
      })
    },
    handleCollapsedChange(state) {
      this.collapsed = state
    },
    handleSideMenuSelectAction(name) {
      let menuItem = this.menusInfo[name]
      this.turnToPage(menuItem)
    },
    /** 跳转到指定页面 */
    turnToPage(menuItem) {
      // let menuItem = this.getMenuById(name)
      let { route, config } = menuItem || {}
      // console.log(route, path, config)
      // 如果route 和 path 都为null 则 跳转到 此功能正在开发页面
      var matchRoute = this.$router.match({
        name: route || ''
      }, this.$route)
      if (matchRoute.matched.length === 0 && matchRoute.fullPath === '/') {
        // 跳转到 功能正在开发页面
        this.$router.push({
          name: 'nopage',
          params: menuItem
        }, (_route) => {
          this.setActiveTagNav(menuItem)
          this.setTagNavList(getNewTagList(this.tagNavList, menuItem))
        })
        return
      }
      let p = {}
      if (config && this._.isString(config)) {
        try {
          let configObj = JSON.parse(config)
          p = configObj || {}
        } catch (e) {
        }
      }
      this.$router.push({
        name: route || '',
        params: p
      }, (_route) => {
        this.setActiveTagNav(menuItem)
        this.setTagNavList(getNewTagList(this.tagNavList, menuItem))
      })
    },
    handleCloseTag(res, type, tagId) {
      let nextTag = getLatestTag(this.tagNavList, tagId)
      this.setTagNavList(res)
      if (type === 'all') {
        // 关闭所有，除了home
        this.turnToPage(this.homeTag)
      } else {
        if (this.tagNavList.length < 2) {
          nextTag = { ...this.homeTag }
        }
        if (tagId === this.activeTagNav.id) {
          this.turnToPage(nextTag)
        }
      }
    }
  },
  watch: {
    $route(newRoute) {
      // 判断是否拥有此route 的权限 ，没有则跳转到 无权限页面
      // console.log(newRoute)
    }
  },
  created () {
  },
  mounted() {
    // console.log(this.dictRefreshTag)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
  }
}
</script>

<style lang="less">
.layout-container {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
</style>
