<!--  -->
<template>
    <div>
      <Grid :columns="columns" :data="data"></Grid>
    </div>
</template>

<script>
import Grid from '@/components/tree-grid/grid'
export default {
  props: { },
  components: {
    Grid
  },
  data () {
    return {
      columns: [
        {
          key: 'name',
          title: '姓名'
        },
        {
          key: 'route',
          title: '路由'
        }

      ],
      data: [
        {
          id: 1,
          name: '菜单一',
          route: '/admin2'
        },
        {
          id: 2,
          name: '菜单2',
          route: '/admin2'
        },
        {
          id: 3,
          name: '菜单3',
          route: '/admin2'
        },
        {
          id: 4,
          name: '菜单4',
          route: '/admin2'
        }
      ]
    }
  },
  methods: {},
  mounted: function() {},
  computed: {}
}

</script>
<style  scoped>
</style>
