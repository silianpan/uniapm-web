<template>
<div class="side-menu-wrapper">
  <slot></slot>
  <!-- 展开 -->
  <LegaScroll :height="sideMenuHeight" v-show="!collapsed">
    <Menu ref="menu" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList">
        <!-- 拥有子集菜单 -->
        <template >
          <side-menu-item v-if="hasChildren(item)" :key="`menu-${item.id}`" :parent-item="item"></side-menu-item>
          <menu-item v-else :name="getName(item)" :key="`menu-${item.code}`">
            <common-icon :type="item.iconCls || ''" :size="14"  />
            <span>{{ showTitle(item) }}</span>
          </menu-item>
        </template>
      </template>
    </Menu>
  </LegaScroll>
  <!-- 折叠后 -->
  <div class="menu-collapsed" v-show="collapsed">
    <template v-for="item in menuList">
      <collapsed-menu v-if="hasChildren(item)" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.id}`">
      </collapsed-menu>
      <Tooltip v-else :content="item.name" placement="right" :key="`drop-menu-${item.id}`">
        <a @click="handleSelect(getName(item))" class="drop-menu-a" :style="{textAlign: 'center'}">
            <common-icon :size="rootIconSize" :color="textColor" :type="item.iconCls"/>
          </a>
      </Tooltip>
    </template>
  </div>
</div>
</template>

<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
// import { getUnion } from '@/libs/tools'
import mixin from './mixin'
import LegaScroll from '@/components/scroll/LegaScroll'
export default {
  name: 'SideMenu',
  mixins: [mixin],
  components: {
    SideMenuItem,
    CollapsedMenu,
    LegaScroll
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,

    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openedNames: []
    }
  },
  methods: {
    handleSelect(name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName(name) {

    },
    setOpenedNamesByActiveName(name) {
      let menu = this.menusInfo[name]
      let pids = ''
      if (menu) {
        pids = menu.pids
      }
      pids.split(',').map(pid => {
        if (this.openedNames.findIndex(item => item === name) === -1) {
          this.openedNames.push(pid)
        }
      })
    }
  },
  computed: {
    menusInfo() {
      return this.$store.state.user.menusInfo
    },
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060'
    },
    sideMenuHeight() {
      return {
        height: 'calc(100vh - 70px)'
      }
    },
    activeTagNav() {
      return this.$store.state.app.activeTagNav
    }
  },
  watch: {
    activeName(name) {
      if (this.accordion) {
        this.openedNames = []
      }
      this.setOpenedNamesByActiveName(name)
    },
    openNames(newNames) {
      this.openedNames = newNames
    },
    openedNames: {
      handler: function () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.setOpenedNamesByActiveName(this.activeName)
  }
}
</script>

<style lang="less">
@import './side-menu.less';
</style>
