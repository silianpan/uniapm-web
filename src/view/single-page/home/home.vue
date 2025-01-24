<template>
  <div class="homeDiv" style="position: relative;width: 100%;height: 100%">
    <FullScreen :titleflag="false"></FullScreen>
  </div>
</template>

<script>
import FullScreen from '@/view/screen/fullScreen.vue'
export default {
  components: {
    FullScreen
  }
}
</script>

<style lang="less">
 @import url('./home.less');
</style>
