<template>
  <Form :label-width="100">
    <FormItem label="允许访问服务">
      <Select v-model="clients" multiple filterable remote placeholder="请输入服务关键词" :remote-method="remoteMethod" :loading="loading">
        <Option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"> </Option>
      </Select>
    </FormItem>
    <FormItem>
      <Button type="primary" v-if="serviceManager_btn_clientManager" @click="onSubmit">保存</Button>
    </FormItem>
  </Form>
</template>

<script>
import { AuthService } from '@/api/auth'
import { mapGetters } from 'vuex'
export default {
  props: {
    serviceId: {
      default: '1'
    }
  },
  data() {
    return {
      items: [],
      clients: [],
      list: [],
      loading: false,
      serviceManager_btn_clientManager: false
    }
  },
  mounted() {
    this.initClients()
    this.serviceManager_btn_clientManager = this.elements['serviceManager:btn_clientManager']
  },
  computed: {
    ...mapGetters(['elements'])
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        AuthService.page({
          name: query
        }).then(response => {
          this.items = response.data.rows
          this.total = response.data.total
          this.loading = false
        })
      } else {
        this.items = []
      }
    },
    onSubmit() {
      const vals = {}
      if (this.clients.length > 0) vals.clients = this.clients.join()
      AuthService.modifyClients(this.serviceId, vals).then(() => {
        this.$emit('closeClientDialog')
        this.$Message.success('保存成功')
      })
    },
    initClients() {
      AuthService.getClients(this.serviceId).then(response => {
        console.log('res123', this.serviceId, response)
        this.items = response.data
        const leas = []
        for (let i = 0; i < response.data.length; i++) {
          leas.push(response.data[i].id)
        }
        this.clients = leas
      })
    }
  }
}
</script>
