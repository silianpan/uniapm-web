<template>
  <div>
    <iframe :src="href" ref="iframe" scrolling="yes" frameborder="0" ></iframe>
  </div>
</template>
<script>
export default {
  props: {
    href: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    /**
      * iframe-宽高自适应显示
      */
    changeMobsfIframe() {
      this.$nextTick(
        () => {
          const iframe = this.$refs.iframe
          const deviceHeight = document.body.clientHeight
          if (!this._.isNil(iframe)) {
            iframe.style.width = '100%' // 数字是页面布局宽度差值
            iframe.style.height = (Number(deviceHeight) - 80) + 'px' // 数字是页面布局高度差
          }
        }
      )
    }
  },
  mounted() {
    this.changeMobsfIframe()
    window.onresize = () => {
      this.changeMobsfIframe()
    }
  }
}
</script>
