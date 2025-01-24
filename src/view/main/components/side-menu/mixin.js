import CommonIcon from '@/components/common-icon'
export default {
  components: {
    CommonIcon
  },
  methods: {
    /**
     *
     * 展示的文本标签
     * @author hsc
     * @date 2019-01-04
     * @param {*} item
     * @returns
     */
    showTitle(item) {
      let title = item.title || item.name || item.code
      return this.$config.useI18n ? this.$t(title) : title
    },
    /** 是否有子菜单 */
    hasChildren(item) {
      const p = item || {}
      return 'children' in p && p.children && p.children.length > 0
    },
    getName(item) {
      return item.id
    }
  }
}
