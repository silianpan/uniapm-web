<template>
<Submenu :name="getName(parentItem)">
  <template slot="title">
    <common-icon :type="parentItem.iconCls || ''" :size="14"  />
    <span>{{ showTitle(parentItem) }}</span>
  </template>
  <template v-for="item in children">
    <side-menu-item v-if="hasChildren(item)" :key="`menu-${item.id}`" :parent-item="item"></side-menu-item>
    <menu-item v-else :name="getName(item)" :key="`menu-${item.id}`">
      <common-icon :type="item.iconCls || ''" :size="14" />
      <span>{{ showTitle(item) }}</span>
    </menu-item>
  </template>
</Submenu>
</template>

<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [mixin, itemMixin]
}
</script>
