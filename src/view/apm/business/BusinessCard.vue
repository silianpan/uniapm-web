<template>
  <div class="business-container" style="margin-top: 10px;">
    <Row :gutter="20">
      <i-col :xs="24" :sm="24" :md="6" :lg="6" v-for="obj in businessList" :key="obj.id">
        <Card style="margin-bottom: 10px;">
          <div class="top">{{obj.name}}<Icon class="update" type="ios-create-outline" @click="updateBusiness(obj.id)" /></div>
          <div class="center">
            <span v-if="_.isNil(obj.topoId) || obj.topoId === ''">暂无关联拓扑图</span>
            <!-- <Topo v-else :businessTopoId="obj.topoId" :isBusinessTopo="true"></Topo> -->
            <component v-else :is="busTopoDynamicComp" transition="fade" transition-mode="out-in" :businessTopoId="obj.topoId" :isBusinessTopo="true"></component>
          </div>
          <div class="bottom">
            <div class="left" @click="showDetail(obj.businessDetail)">查看</div>
            <div class="right" @click="showDeleteMadal(obj.id)">删除</div>
          </div>
        </Card>
      </i-col>
    </Row>
    <business-drawer :businessdrawer="businessDrawer" :detail="businessDetail" @close-drawer="businessDrawer = false"></business-drawer>
    <Modal v-model="deleteModal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>删除确认</span>
        </p>
        <div style="text-align:center">
            <p>删除后你将不能查看此业务</p>
            <p>确定删除?</p>
        </div>
        <div slot="footer">
            <Button type="error" long @click="deleteBusiness">删除</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import BusinessDrawer from './BusinessDrawer.vue'
import Topo from './topo.vue'
export default {
  components: {
    BusinessDrawer
  },
  props: {
    business: Array
  },
  mounted() {
    this.busTopoDynamicComp = Topo
  },
  beforeDestroy() {
    this.busTopoDynamicComp = null
  },
  data() {
    return {
      busTopoDynamicComp: null,
      businessDrawer: false,
      businessDetail: [], // 存放详细的业务配置
      deleteModal: false,
      deleteId: null // 存放要删除的业务
    }
  },
  methods: {
    updateBusiness(id) {
      this.$router.push({
        name: 'businessAdd',
        params: { businessId: id }
      })
    },
    showDetail(params) {
      this.businessDetail = JSON.parse(params)
      this.businessDrawer = true
    },
    showDeleteMadal(id) {
      this.deleteId = id
      this.deleteModal = !this.deleteModal
    },
    deleteBusiness() {
      this.$emit('delete', this.deleteId)
      this.deleteModal = !this.deleteModal
    }
  },
  computed: {
    businessList() {
      return this.business
    }
  }
}
</script>

<style lang="less">
  @import url('./businessCard.less');
</style>
