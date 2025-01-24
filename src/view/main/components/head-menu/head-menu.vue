<template>
  <div class="main">
    <div class="menu" :class="item.code" v-for="item of menuList" :key="item.id" @click="showRoute(item)">
      <div class="img"></div>
      <div class="text"><b>{{item.name}}</b></div>
    </div>
  </div>
</template>

<script>
import './head-menu.less'
export default {
  methods: {
    showRoute(item) {
      this.$emit('provide-route', item)
    }
  },
  computed: {
    menuList() {
      return this.$store.getters.menuList
    }
  }
}
</script>

<style>

</style>
