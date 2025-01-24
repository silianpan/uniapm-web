<template>
  <div class="resourceDetailDiv">
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col  :xs="24" :sm="24" :md="24" :lg="24">
        <Card style="text-align: center" bordered>
          <div slot="title">
            <span style="line-height: inherit;"></span>
            <b>基本信息</b>
          </div>
          <Spin v-if="infoFlag" fix></Spin>
          <Row v-else v-for="(item, index) in baseInfo" :key="index" :gutter="20" style="margin-top: 5px;">
            <i-col v-for="obj in item" :key="obj.id" :xs="24" :sm="24" :md="8" :lg="8">
              <span class="baseInfoLabel">{{obj.label}}:</span>
              <span v-if="_.isNil(obj.length)" class="baseInfoValue">{{obj.value}}</span>
              <Tooltip max-width="400" v-else :content="obj.value">
                <span class="baseInfoValue longValue">{{obj.value.slice(0, 40)}}</span>
              </Tooltip>
            </i-col>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row v-if="!isNetworkDevice" :gutter="20" style="margin-top: 10px;">
      <i-col  :xs="24" :sm="24" :md="8" :lg="8">
        <Card style="text-align: center;" bordered >
          <div slot="title">
            <span style="line-height: inherit;"></span>
            <b>仪表盘</b>
          </div>
          <Spin v-if="rateFlag" fix></Spin>
          <Row v-else :gutter="20" style="margin-top: 10px;">
            <i-col  :xs="24" :sm="24" :md="12" :lg="12">
              <i-circle :size="150" :percent="rate.cpu_util" dashboard>
                <p>CPU占用率</p>
                <span class="demo-circle-inner" style="font-size:24px">{{rate.cpu_util}}%</span>
              </i-circle>
            </i-col>
            <i-col :xs="24" :sm="24" :md="12" :lg="12">
              <i-circle :size="150" :percent="rate.memory_util" dashboard>
                <p>内存占用率</p>
                <span class="demo-circle-inner" style="font-size:24px">{{rate.memory_util}}%</span>
              </i-circle>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <i-col  :xs="24" :sm="24" :md="16" :lg="16">
        <Card style="text-align: center" bordered>
          <div slot="title">
            <span style="line-height: inherit;"></span>
            <b>磁盘状况</b>
          </div>
          <Spin v-if="romFlag" fix></Spin>
          <Row v-else :gutter="20" style="margin-top: 10px;">
            <i-col v-for="(item, index) in romInfo" :key="index" :xs="24" :sm="24" :md="8" :lg="8">
              <i-circle
                  :size="150"
                  :trail-width="4"
                  :stroke-width="5"
                  :percent="item.percent"
                  stroke-linecap="square"
                  stroke-color="#43a3fb">
                  <div>
                      <h3>{{item.name}}</h3>
                      <p>{{item.unused}}可用，共{{item.total}}</p>
                      <span>
                          占用率
                          <i>{{item.percent}}%</i>
                      </span>
                  </div>
              </i-circle>
            </i-col>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { HostsService } from '@/api/apm/host'
import LegaExpandRow from '@/components/LegaExpandRow'
export default {
  components: {
    LegaExpandRow
  },
  props: {
    hostId: Number
  },
  data() {
    return {
      // 判断是否是网络设备
      isNetworkDevice: false,
      rate: {},
      rateFlag: false, // CPU内存得spin
      baseInfo: [], // 储存设备基本信息
      infoFlag: false, // 控制基本信息的spin
      romInfo: [], // 存储磁盘状况
      romFlag: false // 控制磁盘的spin
    }
  },
  beforeDestroy() {
    this.isNetworkDevice = false
  },
  methods: {
    init() {
      this.infoFlag = true
      let param = {
        appnames: ['General'],
        hostid: this.hostId
      }
      HostsService.findItemsValueByApplicationName(param).then(res => {
        let baseInfo = []
        let row = []
        let i = 0
        for (let obj of res.data) {
          obj.last_value = obj.units === 'unixtime' ? this._moment.unix(obj.last_value).format('YYYY-MM-DD HH:mm:ss') : obj.last_value
          if (obj.units === 'uptime') {
            let day = parseInt(obj.last_value / 86400)
            let hour = parseInt((obj.last_value % 86400) / 3600)
            let minute = parseInt(((obj.last_value % 86400) % 3600) / 60)
            let second = parseInt(((obj.last_value % 86400) % 3600) % 60)
            obj.last_value = day + '天，' + hour + ':' + minute + ':' + second
          }
          if (obj.value_type === 1 && obj.last_value && obj.last_value.length > 40) {
            obj.length = obj.last_value.length
          }
          let label = {
            id: obj.itemid,
            label: obj.name,
            value: obj.last_value,
            length: obj.length
          }
          i++
          row.push(label)
          if (i === 3) {
            baseInfo.push(row)
            row = []
            i = 0
          }

          // 判断是否是网络设备：交换机、安全设备等，用于判断展示仪表盘和磁盘
          if (!this.isNetworkDevice && !this._.isEmpty(obj.name) && obj.name.indexOf('SNMP') !== -1) {
            this.isNetworkDevice = true
          }
        }
        baseInfo.push(row)
        this.baseInfo = baseInfo
        this.infoFlag = false
      })
    },
    initUtils() {
      this.rateFlag = true
      let params = {
        conditions: [{
          field: 'hostid',
          value: this.hostId
        }]
      }
      HostsService.pageHostByGroupId(params).then(res => {
        let cpu = res.data.records[0].cpu_util
        let memory = res.data.records[0].memory_util
        this.rate.cpu_util = this._.isNil(cpu) ? 0 : parseFloat(cpu.toFixed(2))
        this.rate.memory_util = this._.isNil(memory) ? 0 : parseFloat(memory.toFixed(2))
        this.rateFlag = false
      })
    },
    initRom() {
      this.romFlag = true
      let fileSystem = {
        appnames: ['Filesystems'],
        hostid: this.hostId
      }
      HostsService.findItemsValueByApplicationName(fileSystem).then(res => {
        let i = 0
        let rom = {}
        let driveLetter = ''
        for (let obj of res.data) {
          let desc = obj.desciption
          let value = obj.last_value
          if (i === 0) {
            driveLetter = obj.driveLetter
            rom.name = obj.driveLetter
          } else {
            if (obj.driveLetter !== driveLetter) { // 判断是否和上一个是同一磁盘
              this.romInfo.push(rom)
              rom = {}
              driveLetter = obj.driveLetter // 重置当前磁盘
              if (!this._.isNil(obj.driveLetter)) {
                rom.name = obj.driveLetter
              }
            }
          }
          if (this._.isNil(desc)) {
            continue
          }
          if (desc.indexOf('磁盘空间(百分比)') !== -1) {
            rom.percent = parseFloat((100 - value).toFixed(2))
          } else if (desc.indexOf('已用的磁盘空间') !== -1) {
            rom.use = (value / 1073741824).toFixed(2) + 'GB'
          } else if (desc.indexOf('磁盘总空间') !== -1) {
            rom.total = (value / 1073741824).toFixed(2) + 'GB'
          } else if (desc.indexOf('空闲的磁盘空间') !== -1) {
            rom.unused = (value / 1073741824).toFixed(2) + 'GB'
          }
          i++
        }
        if (!this._.isEmpty(rom)) {
          this.romInfo.push(rom)
        }
        this.romFlag = false
      })
    }
  },
  mounted() {
    this.init()
    this.initUtils()
    this.initRom()
  },
  watch: {
    hostId() {
      this.init()
      this.initUtils()
      this.initRom()
    }
  }
}
</script>

<style lang="less">
.resourceDetailDiv {
  .baseInfoLabel {
  font-weight: bolder;
  font-size: 15px;
  float: left;
  }
  .longValue {
    text-decoration: underline
  }
}
</style>
