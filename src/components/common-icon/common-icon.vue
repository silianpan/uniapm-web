<template>
  <component :is="iconType" :type="iconName" :color="iconColor" :size="iconSize" />
</template>

<script>
import Icons from '@/components/icons'
export default {
  name: 'CommonIcon',
  components: { Icons },
  props: {
    type: {
      type: String,
      required: true,
      default: ''
    },
    color: String,
    size: Number
  },
  computed: {
    iconType() {
      return 'Icons'
    },
    iconName() {
      return this.type
    },
    iconSize() {
      return this.size || (this.iconType === 'Icons' ? 12 : undefined)
    },
    iconColor() {
      return this.color || ''
    }
  },
  methods: {
    getCustomIconName(iconName) {
      return iconName.slice(1)
    }
  }
}
</script>

<style>
</style>
