<!-- 新增业务时，设备的图形选项  -->
<template>
  <Select :value="graphIds" multiple @on-change="setValue">
    <Option v-for="item in graphList" :value="item.graphid" :key="item.graphid">{{ item.name }}</Option>
  </Select>
</template>

<script>
import { GraphsService } from '@/api/apm/graph'
export default {
  props: {
    graphIds: Array,
    hostid: Number
  },
  data() {
    return {
      graphList: []
    }
  },
  methods: {
    init() {
      // 查询该主机的所有图形选项
      let temp = {
        hostid: this.hostid
      }
      GraphsService.findGraphByHostId(temp).then(res => {
        this.graphList = res.data
      })
    },
    setValue(temp) {
      this.$emit('graphs', temp)
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style>

</style>
