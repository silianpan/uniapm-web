<!--  -->
<template>
  <tr :class="rowClasses(row)">
    <slot></slot>
  </tr>
</template>

<script>
export default {
  props: {
    row: Object,
    prefixCls: String
  },
  components: {
  },
  data() {
    return {}
  },
  methods: {
    /** 行所有的样式 */
    rowClasses(row) {
      return [
        `${this.prefixCls}-row`,
        this.rowClsName(row),
        {
          [`${this.prefixCls}-row-highlight`]: row && row._isHighlight,
          [`${this.prefixCls}-row-hover`]: row && row._isHover
        }
      ]
    },
    /** 行的样式名  */
    rowClsName(row) {
      return this.$parent.$parent.rowClassName(row)
    }
  },
  mounted: function () {},
  computed: {
    objData() {
      return this.$parent.objData
    }
  }
}
</script>

<style  scoped>
</style>
