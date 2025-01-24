<!-- 个人设置 -->
<template>
<div>
  <Card bordered>
    <Layout>
      <Sider hide-trigger >
        <Menu  width="auto" :theme="theme" :active-name="currentComponent">
          <MenuItem v-for="(item, index) in menuItems" :key="index" :name="item.name">{{item.label}}</MenuItem>
        </Menu>
      </Sider>
      <Layout :style="{padding: '10px',border: '1px solid #1f4191'}">
        <Content :style="{padding: '10px', minHeight: '280px'}">
          <component :is="currentComponent" :userId="userId"></component>
        </Content>
      </Layout>
    </Layout>
  </Card>
</div>
</template>

<script>
import PersionalBaseSetting from './PersionalBaseSetting'
export default {
  props: {
    userId: String
  },
  components: {
    PersionalBaseSetting
  },
  data() {
    return {
      theme: 'dark',
      currentComponent: 'PersionalBaseSetting',
      menuItems: [
        {
          label: '基本设置',
          name: 'PersionalBaseSetting'
        }
      ]
    }
  },
  methods: {},
  mounted: function () {},
  computed: {}
}
</script>

<style  scoped>
</style>
