<!-- 大屏api调用配置 -->
<template>
  <div>
    <el-alert title="温馨提示" type="success" description="分钟、时间、天，只能设置一种时间方式" show-icon :closable="false">
    </el-alert>
    <div style="font-size: 24px; margin: 12px 0 12px 8px">当前大屏刷新时间间隔：{{ syncTime }} </div>
    <el-form ref="syncSetRef" label-width="200px" :rules="syncSetRule" :model="syncSetData">
      <el-form-item label="每隔几分钟（1-59）" prop="syncMin">
        <el-input v-model="syncSetData.syncMin" placeholder="每隔几分钟" @change="changeMinClick"></el-input>
      </el-form-item>
      <el-form-item label="每隔几小时（1-23）" prop="syncHour">
        <el-input v-model="syncSetData.syncHour" placeholder="每隔几小时" @change="changeHourClick"></el-input>
      </el-form-item>
      <el-form-item label="每隔几天（1-31）" prop="syncDay">
        <el-input v-model="syncSetData.syncDay" placeholder="每隔几天" @change="changeDayClick"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left:10px">
      <el-button type="primary" @click="saveSyncTime">保存</el-button>
      <el-button type="success" @click="jumpFullScreenPage">跳转大屏</el-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    syncTime() {
      if (this.syncSetData.syncMin !== 0) {
        return '(' + this.syncSetData.syncMin + '分钟)'
      }
      if (this.syncSetData.syncHour !== 0) {
        return '(' + this.syncSetData.syncHour + '小时)'
      }
      if (this.syncSetData.syncDay !== 0) {
        return '(' + this.syncSetData.syncDay + '天)'
      }
    }
  },
  data() {
    const validateMin = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('时间值不能为空'))
      }
      const reg = /^[0-9]+$/
      // if (!Number.isInteger(value)) {
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        value = Number.parseInt(value)
        if (value < 0 || value > 59) {
          callback(new Error('请输入1~59分钟数'))
        } else {
          callback()
        }
      }
    }
    const validateHour = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('时间值不能为空'))
      }
      const reg = /^[0-9]+$/
      // if (!Number.isInteger(value)) {
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        value = Number.parseInt(value)
        if (value < 0 || value > 23) {
          callback(new Error('请输入1~23小时数'))
        } else {
          callback()
        }
      }
    }
    const validateDay = (rule, value, callback) => {
      if (!value && value !== 0) {
        return callback(new Error('时间值不能为空'))
      }
      const reg = /^[0-9]+$/
      // if (!Number.isInteger(value)) {
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        value = Number.parseInt(value)
        if (value < 0 || value > 31) {
          callback(new Error('请输入1~31天数'))
        } else {
          callback()
        }
      }
    }
    return {
      job: null,
      isSyncing: false,
      syncSetData: {
        syncMin: 0,
        syncHour: 1,
        syncDay: 0
      },
      syncSetRule: {
        syncMin: [{ validator: validateMin, trigger: 'blur' }],
        syncHour: [{ validator: validateHour, trigger: 'blur' }],
        syncDay: [{ validator: validateDay, trigger: 'blur' }]
      }
    }
  },
  methods: {
    changeMinClick(event) {
      this.syncSetData.syncHour = 0
      this.syncSetData.syncDay = 0
    },
    changeHourClick(event) {
      this.syncSetData.syncMin = 0
      this.syncSetData.syncDay = 0
    },
    changeDayClick(event) {
      this.syncSetData.syncMin = 0
      this.syncSetData.syncHour = 0
    },
    saveSyncTime() {
      let crond = ''
      if (this.syncSetData.syncMin !== 0) {
        crond = '0 */' + this.syncSetData.syncMin + ' * * * *'
      }
      if (this.syncSetData.syncHour !== 0) {
        crond = '0 0 */' + this.syncSetData.syncHour + ' * * *'
      }
      if (this.syncSetData.syncDay !== 0) {
        crond = '0 0 0 */' + this.syncSetData.syncDay + ' * *'
      } else {
        crond = '0 0 */1 * * *'
      }
      this.$store.dispatch('saveFullScreenSyncTime', crond)
    },
    jumpFullScreenPage() {
      this.$router.push('/screen/fullScreen')
    }
  }
}
</script>
