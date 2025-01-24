import { mapGetters } from 'vuex'

const backMixin = {
  computed: {
    ...mapGetters([
      'elements',
      'hasElementsPerimByKey',
      'dictDatasWithGroupKey',
      'dictFormatter'
    ]),
    tagNavList() {
      return this.$store.state.app.tagNavList
    }
  },
  data() {
    return {
      sourceRoute: null,
      targetRoute: {
        name: 'home'
      }
    }
  },
  methods: {
    /** 回退 */
    goBack: function () {
      if (
        this._.isNil(this.sourceRoute) ||
        this._.isEmpty(this.sourceRoute.name)
      ) {
        // 返回首页
        this.$router.push({
          name: this.targetRoute.name,
          params: this.targetRoute.params || {}
        })
      } else {
        this.$router.push({
          name: this.sourceRoute.name,
          params: this.sourceRoute.params || {}
        })
      }
    }
  }
}

export { backMixin }
