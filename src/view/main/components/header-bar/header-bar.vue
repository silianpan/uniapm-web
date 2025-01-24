<template>
  <div class="header-bar">
    <div class="logo-con" style="display: inline-block;vertical-align: top;cursor: pointer;" @click="returnHome">
      <img :src="maxLogo" key="max-logo" />
      <!-- <img v-show="collapsed" :src="minLogo" key="min-logo" /> -->
    </div>
    <!-- <span class="h1 bold" style="color:#fff;cursor: pointer;" @click="returnHome">IT运维管理软件</span> -->
    <span class="h1 bold" style="color:#fff;cursor: pointer;" @click="returnHome">智能运维平台</span>
    <!-- <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb> -->
    <div class="custom-content-con">
      <slot></slot>
    </div>
    <head-menu style="float:right;margin-right:50px;" @provide-route="showRoute"></head-menu>
  </div>
</template>

<script>
// import maxLogo from '@/assets/images/zoho-logo.png'
import maxLogo from '@/assets/images/uniapm-logo.png'
import customBreadCrumb from './custom-bread-crumb'
import HeadMenu from '../head-menu'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    customBreadCrumb,
    HeadMenu
  },
  props: {
    collapsed: Boolean
  },
  data() {
    return {
      maxLogo
    }
  },
  methods: {
    showRoute(item) {
      this.$emit('show-route', item)
    },
    returnHome() {
      this.$router.push({ name: 'home' })
    }
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  }
}
</script>
