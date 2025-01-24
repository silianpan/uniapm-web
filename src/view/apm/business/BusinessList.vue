<template>
  <Card>
    <div class="bs-callout-small bs-callout-primary">
      <h4>业务信息</h4>
    </div>
    <Layout :style="{border: '1px solid #1f4191',padding:'5px'}">
      <Content :style="{padding: '0', minHeight: '280px'}">
        <Spin v-if="spinFlag === true" fix>加载业务中...</Spin>
        <Button v-if="spinFlag === false" @click="addBusiness">新建</Button>
        <business-card v-if="spinFlag === false" :business="businessList" @delete="logicDelete"></business-card>
      </Content>
    </Layout>
  </Card>
</template>

<script>
import BusinessCard from './BusinessCard.vue'
import { BusinessService } from '@/api/apm/business'
export default {
  components: {
    BusinessCard
  },
  data() {
    return {
      businessList: [], // 所有业务
      spinFlag: false
    }
  },
  methods: {
    addBusiness() {
      this.$router.push({
        name: 'businessAdd'
      })
    },
    // 查询所有业务
    initBusiness() {
      this.spinFlag = true
      BusinessService.findAll({}).then(res => {
        this.businessList = res.data
        this.spinFlag = false
      })
    },
    logicDelete(id) {
      BusinessService.logicDelete(id).then(res => {
        this.initBusiness()
      })
    }
  },
  mounted() {
    this.initBusiness()
  }
}
</script>

<style>

</style>
