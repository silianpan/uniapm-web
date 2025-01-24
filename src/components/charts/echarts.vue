<!--  -->
<template>
<div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import tdTheme from './theme.json'
// import { on, off } from '@/utils/dom'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  props: {
    options: Object
  },
  components: {},
  data() {
    return {
      echartDom: null,
      handleResize: () => {}
    }
  },
  watch: {
    options: function(newOptions) {
      if (this.echartDom) {
        this.echartDom.setOption(newOptions)
      }
    }
  },
  methods: {
    resize() {
      if (this.echartDom) {
        this.echartDom.resize()
      }
    }
  },

  // off(window, 'resize', this.handleResize)
  mounted: function () {
    this.handleResize = this._.throttle(this.resize, 500, {
      leading: true
    })
    this.observer = elementResizeDetectorMaker()
    this.observer.listenTo(this.$el, this.handleResize)
    this.$nextTick(() => {
      if (!this._.isNil(this.options)) {
        this.echartDom = echarts.init(this.$refs.dom, 'tdTheme')
        this.echartDom.setOption(this.options)
      }
    })
  },
  beforeDestroy() {
    if (this.echartDom) {
      echarts.dispose(this.echartDom)
    }
    this.observer.removeListener(this.$el, this.handleResize)
  },
  computed: {}
}
</script>

<style  scoped>
</style>
