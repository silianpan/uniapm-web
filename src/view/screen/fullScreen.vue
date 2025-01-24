<template>
  <div class="ledWrapper">
    <div v-if="titleFlag" class="tpl_header">
      <div class="logoText">
        <!-- 拉萨经开区大数据机房IT运维监控平台 -->
      </div>
    </div>
    <div class="ledWrapperCenter">
      <div class="leftScreen">
        <div class="boxScreen">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names hoverUnderline" @click="openDetail('WarningList')">告警信息统计</span>
            </div>
            <div class="mychartBox" id="alarmStatistics"></div>
          </div>
        </div>
        <div class="boxScreen secondChild">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names hoverUnderline" @click="openResourceDrawer(fullScreenData.networkFlow)">核心交换机网络流量监测</span>
            </div>
            <div class="mychartBox" style="overflow: auto;height:80%">
              <chart-line ref="graph" style="height: 400px;" :value="fullScreenData.networkFlow" :text="fullScreenData.networkFlow.name" />
            </div>

          </div>
        </div>
        <div class="boxScreen lastChild">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names">主机CPU占用率Top5</span>
            </div>
            <div class="mychartBox">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="chartsMains" id="hostChartBox">
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="chartsMains" id="oneday_hostChartBox">
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="chartsMains" id="sevendays_hostChartBox">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightScreen">
        <div class="boxScreen">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names hoverUnderline" @click="openDetail('ResourceList')">资产统计</span>
            </div>
            <div class="mychartBox" id="assetsStatistics"></div>
          </div>
        </div>
        <div class="boxScreen secondChild">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names">主机内存占用率Top5</span>
            </div>

            <div class="mychartBox" id="">
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <div class="chartsMains" id="businessChartBox">
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="chartsMains" id="oneday_businessChartBox">
                    </div>
                  </div>
                  <div class="swiper-slide">
                    <div class="chartsMains" id="sevendays_businessChartBox">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="boxScreen lastChild">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names">网络接口流量Top5</span>
            </div>
            <div class="mychartBox" style="overflow: auto;height:75%">
              <table class="dataTable" width="100%" border="0" border-collapse="0" border-spacing="0">
                <tr class="header">
                  <th>排名</th>
                  <th>设备名</th>
                  <th>ip</th>
                  <th>端口总流量(bps)</th>
                </tr>
                <tr v-for="(item, index) in fullScreenData.netTop" :key="index">
                  <td>
                    <span class="topNumbers">{{ index + 1 }}</span>
                  </td>
                  <td class="hoverUnderline" @click="openResourceDrawer(item)">{{item.hostname}}-{{item.name.split('：')[0]}}</td>
                  <td>{{item.ip}}</td>
                  <td>{{item.value}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="centerScreen">
        <!-- <div class="topScreen" id="fullscreenTopoRef"></div> -->
        <div class="topScreen">
          <!-- <Topo ref="fullscreenTopoRef"></Topo> -->
          <component :is="topoDynamicComp" transition="fade" transition-mode="out-in" ref="fullscreenTopoRef"></component>
        </div>

        <div class="boxScreen lastChild">
          <div class="boxScreenCenter">
            <div class="titles">
              <span class="names hoverUnderline" @click="openDetail('WarningList')">待处理告警信息</span>
            </div>
            <div class="otherChartsBox"  style="overflow: auto;height:75%">
              <table class="dataTable" width="100%" border="0" border-collapse="0" border-spacing="0">
                <tr class="header">
                  <th>告警时间</th>
                  <th>告警级别</th>
                  <th>主机</th>
                  <th>告警内容</th>
                </tr>
                <tr v-for="(item, index) in fullScreenData.alarmTop" :key="index">
                  <td>

                    {{ _moment.unix(item.clock).format('YYYY-MM-DD HH:mm:ss') }}
                  </td>
                  <td>
                    <span :class="['alarmType','leve_'+item.severity]">
                      {{ AlarmLevelsConfig[item.severity] }}</span>
                  </td>
                  <td>{{ item.name }}</td>
                  <td>
                    <Tooltip :content="item.description" max-width="300" placement="top">
                      {{ sliceTitle(item.description, 30) }}
                    </Tooltip>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <resource-drawer :resourcedrawer="resourceDrawer" :hostid="hostId" :detailflag="detailFlag" @close-drawer="setNull"></resource-drawer>
    <Drawer title="详情" v-model="drawer" width="80%">
      <component v-bind:is="componentFlag"></component>
    </Drawer>
  </div>
</template>
<script>
// import Swiper from 'swiper'
// import 'swiper/dist/css/swiper.min.css'
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import { AlarmService } from '@/api/apm/alarm'
import { HostsService } from '@/api/apm/host'
import { GraphsService } from '@/api/apm/graph'
import ResourceDrawer from '@/view/apm/resource/ResourceDrawer.vue'
import ResourceList from '@/view/apm/resource/ResourceList.vue'
import WarningList from '@/view/apm/warning/WarningList.vue'
import Topo from './topo.vue'
import ChartLine from './line'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
// const schedule = require('node-schedule')
export default {
  components: {
    ResourceDrawer,
    ResourceList,
    WarningList,
    // Topo,
    ChartLine
  },
  props: {
    titleflag: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['getFullScreenSyncTime']),
    titleFlag() { // 控制标题的显示
      return this.titleflag
    }
  },
  data() {
    return {
      topoDynamicComp: null,
      // 定时任务
      job: null,
      resourceDrawer: false, // 控制详情弹出框的展示
      detailFlag: null, // 传递要跳转的组件
      hostId: null, // 存放选中的主机id
      drawer: false,
      componentFlag: null,
      alarmDom: null,
      resourceDom: null,
      AlarmLevelsConfig: {
        '0': '未定义',
        '1': '信息',
        '2': '警告',
        '3': '一般严重',
        '4': '严重',
        '5': '灾难'
      },
      // 定时任务
      job: null,
      alarmStatisticsOption: {
        color: [
          '#BDBDBD',
          '#ddcd01',
          '#fdb933',
          '#f08300',
          '#e35020',
          '#B71C1C'
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        legend: {
          textStyle: {
            color: '#9db7ca'
          },
          orient: 'vertical',
          left: '0',
          top: '24',
          itemHeight: '12',
          align: 'left',
          itemGap: 18,
          data: ['未定义', '信息', '警告', '一般严重', '严重', '灾难']
        },
        calculable: false,
        series: {
          type: 'pie',
          radius: [48, 72],
          center: ['60%', '50%'],
          right: '30',
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: []
        }
      },
      assetsStatisticsOption: {
        color: ['#52a0f2', '#58cad4', '#52daf2', '#44c368', '#27ab20'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        textStyle: {
          color: '#fff',
          fontSize: '12'
        },
        calculable: false,
        series: {
          type: 'pie',
          radius: [0, 72],
          center: ['54%', '50%'],
          label: {
            formatter: '{a|{b}({c})} \n {b|{d}%}',
            align: 'left',
            rich: {
              a: {
                color: '#9db7ca',
                lineHeight: '20',
                // fontSize: '14',
                align: 'left'
              },
              b: {
                color: '#9db7ca',
                lineHeight: '20',
                // fontSize: '18',
                align: 'right',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            lineStyle: {
              width: '2'
            }
          },
          data: []
        }
      },
      hostCpuUtilOption: {
        title: {
          text: '近一小时主机Cpu占用率',
          top: 12,
          textStyle: {
            color: '#9db7ca',
            fontSize: '14',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '40',
          left: '25%',
          right: '2%',
          bottom: '40'
        },
        xAxis: {
          show: true,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false,
            lineStyle: {
              width: 20
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '12'
            },
            rotate: 30
          }
        },
        yAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '14'
            }
          },
          data: []
        },
        series: [
          {
            name: '主机CPU占用率',
            type: 'bar',
            data: [],
            barWidth: '12',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#07ffa6' },
                  { offset: 1, color: '#13ffff' }
                ])
              }
            }
          }
        ]
      },
      businessOption: {
        title: {
          text: '近1小时主机内存占用率',
          top: 12,
          textStyle: {
            color: '#9db7ca',
            fontSize: '14',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#9db7ca'],
        grid: {
          top: '60',
          left: '12%',
          right: '0',
          bottom: '20%'
        },
        xAxis: {
          show: true,
          axisTick: {
            show: false,
            lineStyle: {
              width: 20
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '12'
            }
            // rotate: 30
          },
          data: []
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '12'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: '24',
            barCategoryGap: '10%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#07ffa6' },
                  { offset: 1, color: '#13ffff' }
                ])
              }
            },
            data: []
          }
        ]
      },
      coreNetworkFlowOption: {
        color: ['#00bd7d', '#9db7ca'],
        title: {
          // text: '24小时交换机流量统计',
          top: 12,
          textStyle: {
            color: '#9db7ca',
            fontSize: '14',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '20',
          left: '10%',
          right: '2%',
          bottom: '70'
        },
        legend: {
          bottom: 18,
          data: [
            {
              name: '输入',
              fontSize: 20
            },
            {
              name: '输出'
            }
          ],
          textStyle: {
            color: '#fff'
          },
          borderWidth: 0,
          borderRadius: 0
        },
        xAxis: {
          show: true,
          nameGap: 0,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '12'
            }
          },
          data: []
        },
        yAxis: {
          // type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#9db7ca',
              fontSize: '12'
            }
          }
        },
        series: [
          {
            name: '输入',
            type: 'line',
            symbol: 'none',
            itemStyle: {
              borderWidth: 0
            },
            lineStyle: {
              color: '#00bd7d'
            },
            areaStyle: {
              color: 'rgba(0,189,125,0.4)'
            },
            smooth: true,
            data: []
          },
          {
            name: '输出',
            type: 'line',
            symbol: 'none',
            itemStyle: {
              borderWidth: 0
            },
            lineStyle: {
              color: '#9db7ca'
            },
            areaStyle: {
              color: 'rgba(0,216,255,0.4)'
            },
            smooth: true,
            data: []
          }
        ]
      },
      fullScreenData: {
        // 告警信息统计
        alarmStatistics: [],
        // 资产统计
        assetsStatistics: [],
        // 核心交换机网络流量监测
        networkFlow: {
          value: {},
          name: ''
        },
        // 主机CPU占用率Top5
        hostChartBox: [],
        // 网络接口流量统计Top5
        netTop: [],
        // 待处理告警信息
        alarmTop: []
      }
    }
  },
  mounted() {
    this.topoDynamicComp = Topo
    // 开启工作任务
    this.startWorkTask()
    // 开启定时任务
    this.stopJob()
    this.startJob()
    var mySwiper = new Swiper('.swiper-container', {
      autoplay: true
      // loop: true
    })
  },
  methods: {
    // 文字截取
    sliceTitle(t, n) {
      if (t.length > n) {
        return t.slice(0, n) + '…'
      } else {
        return t
      }
    },
    // 开始工作任务
    startWorkTask() {
      // 最近告警列表
      this.findAlarm()
      // 网络流量Top5
      this.getNetworkFlowTop5()

      this.$nextTick(() => {
        // 告警信息统计
        this.getAlarmCount()

        // 资产统计
        this.getAssetsCount()

        // 主机cpu利用率top5
        this.getCpuUtilTop5()

        // 最小可用内存top5
        this.getMemoryAvaliTop5()

        // 核心交换机网络流量监测
        this.getCoreExchangeInOut()

        // 拓扑，不调用任何方法
        // this.$refs.fullscreenTopoRef.updateTopoGraph()
      })
    },
    startJob() {
      if (this.getFullScreenSyncTime) {
        // const self = this
        // this.job = schedule.scheduleJob(this.getFullScreenSyncTime, function() {
        //   self.fullScreenData.netTop = []
        //   self.fullScreenData.alarmTop = []
        //   self.startWorkTask()
        // })
      }
    },
    stopJob() {
      if (this.job) {
        this.job.cancel()
      }
    },
    // 告警信息统计
    getAlarmCount() {
      AlarmService.getAlarmCount().then(res => {
        let alarmList = [
          { value: 0, name: '未定义', severity: 0 },
          { value: 0, name: '信息', severity: 1 },
          { value: 0, name: '警告', severity: 2 },
          { value: 0, name: '一般严重', severity: 3 },
          { value: 0, name: '严重', severity: 4 },
          { value: 0, name: '灾难', severity: 5 }
        ]
        // 告警信息统计
        for (let obj of res.data) {
          for (let alarm of alarmList) {
            if (obj.severity === alarm.severity) {
              alarm.value = obj.value
              break
            }
          }
        }
        this.alarmStatisticsOption.series.data = alarmList
        if (this._.isNil(this.alarmDom)) {
          this.alarmDom = echarts.init(document.getElementById('alarmStatistics'))
        }
        this.alarmDom.setOption(this.alarmStatisticsOption)
      })
    },
    // 资产统计
    getAssetsCount() {
      HostsService.getHostsCount().then(res => {
        this.assetsStatisticsOption.series.data = res.data
        // 资产统计
        if (this._.isNil(this.resourceDom)) {
          this.resourceDom = echarts.init(document.getElementById('assetsStatistics'))
        }
        this.resourceDom.setOption(this.assetsStatisticsOption)
      })
    },
    // 查询最近的告警
    findAlarm() {
      AlarmService.getAlarm().then(res => {
        this.fullScreenData.alarmTop = res.data
      })
    },
    // 查询cpu利用率top5
    getCpuUtilTop5() {
      // 一小时内
      let oneHour = {
        flag: 'cpu',
        start_time: this._moment().subtract(1, 'hours').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(oneHour).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.cpu_util)) {
            continue
          }
          let cpu = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.cpu_util.toFixed(2)),
            memory_util: this._.isNil(obj.memory_util) ? 0 : parseFloat(obj.memory_util.toFixed(2))
          }
          data.push(cpu)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          const item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.value,
              memory_util: item.memory_util
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        this.hostCpuUtilOption.title.text = '近一小时主机占用率'
        this.hostCpuUtilOption.yAxis.data = tmpYaxis.reverse()
        this.hostCpuUtilOption.series[0].data = tmpValue.reverse()
        // 主机CPU占用率Top5
        echarts
          .init(document.getElementById('hostChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('hostChartBox'))
          .setOption(this.hostCpuUtilOption)
      })
      // 一天内
      let oneDay = {
        flag: 'cpu',
        start_time: this._moment().subtract(1, 'days').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(oneDay).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.cpu_util)) {
            continue
          }
          let cpu = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.cpu_util.toFixed(2)),
            memory_util: this._.isNil(obj.memory_util) ? 0 : parseFloat(obj.memory_util.toFixed(2))
          }
          data.push(cpu)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          const item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.value,
              memory_util: item.memory_util
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        let oneDayOption = this._.defaultsDeep({}, this.hostCpuUtilOption, {})
        oneDayOption.title.text = '近一天主机占用率'
        oneDayOption.yAxis.data = tmpYaxis.reverse()
        oneDayOption.series[0].data = tmpValue.reverse()
        // 主机CPU占用率Top5
        echarts
          .init(document.getElementById('oneday_hostChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('oneday_hostChartBox'))
          .setOption(oneDayOption)
      })
      // 7天内
      let sevenDay = {
        flag: 'cpu',
        start_time: this._moment().subtract(7, 'days').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(sevenDay).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.cpu_util)) {
            continue
          }
          let cpu = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.cpu_util.toFixed(2)),
            memory_util: this._.isNil(obj.memory_util) ? 0 : parseFloat(obj.memory_util.toFixed(2))
          }
          data.push(cpu)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          const item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.value,
              memory_util: item.memory_util
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        let sevenDayOption = this._.defaultsDeep({}, this.hostCpuUtilOption, {})
        sevenDayOption.title.text = '近七天主机占用率'
        sevenDayOption.yAxis.data = tmpYaxis.reverse()
        sevenDayOption.series[0].data = tmpValue.reverse()
        // 主机CPU占用率Top5
        echarts
          .init(document.getElementById('sevendays_hostChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('sevendays_hostChartBox'))
          .setOption(sevenDayOption)
      })
    },
    // 查询最小可用内存Top5
    getMemoryAvaliTop5() {
      // 近一小时
      let oneHour = {
        flag: 'memory',
        start_time: this._moment().subtract(1, 'hours').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(oneHour).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.memory_util)) {
            continue
          }
          let memory = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.memory_util.toFixed(2)),
            cpu_util: this._.isNil(obj.cpu_util) ? 0 : parseFloat(obj.cpu_util.toFixed(2))
          }
          data.push(memory)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          let item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.cpu_util,
              memory_util: item.value
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        this.businessOption.title.text = '近一小时内存占用率'
        this.businessOption.xAxis.data = tmpYaxis
        this.businessOption.series[0].data = tmpValue
        // 主机内存占用率Top5
        echarts
          .init(document.getElementById('businessChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('businessChartBox'))
          .setOption(this.businessOption)
      })
      // 近一天
      let oneDay = {
        flag: 'memory',
        start_time: this._moment().subtract(1, 'days').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(oneDay).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.memory_util)) {
            continue
          }
          let memory = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.memory_util.toFixed(2)),
            cpu_util: this._.isNil(obj.cpu_util) ? 0 : parseFloat(obj.cpu_util.toFixed(2))
          }
          data.push(memory)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          let item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.cpu_util,
              memory_util: item.value
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        let oneDayOption = this._.defaultsDeep({}, this.businessOption, {})
        oneDayOption.title.text = '近一天内存占用率'
        oneDayOption.xAxis.data = tmpYaxis
        oneDayOption.series[0].data = tmpValue
        // 主机内存占用率Top5
        echarts
          .init(document.getElementById('oneday_businessChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('oneday_businessChartBox'))
          .setOption(oneDayOption)
      })
      // 近7天
      let sevenDay = {
        flag: 'memory',
        start_time: this._moment().subtract(7, 'days').format('X'),
        end_time: this._moment().format('X')
      }
      HostsService.getTopFive(sevenDay).then(res => {
        if (!res || !res.data) {
          return
        }
        let data = []
        for (let obj of res.data) {
          if (this._.isNil(obj.memory_util)) {
            continue
          }
          let memory = {
            host: obj.ip,
            hostid: obj.hostid,
            value: parseFloat(obj.memory_util.toFixed(2)),
            cpu_util: this._.isNil(obj.cpu_util) ? 0 : parseFloat(obj.cpu_util.toFixed(2))
          }
          data.push(memory)
        }
        const tmpYaxis = []
        const tmpValue = []
        for (let i = 0; i < data.length; ++i) {
          let item = data[i]
          if (item && item.host) {
            tmpYaxis.push(item.host)
          } else {
            tmpYaxis.push('未定义')
          }

          if (item && item.value) {
            let obj = {
              name: item.host,
              hostid: item.hostid,
              value: item.value,
              cpu_util: item.cpu_util,
              memory_util: item.value
            }
            tmpValue.push(obj)
          } else {
            tmpValue.push(0)
          }
        }
        let sevenDayOption = this._.defaultsDeep({}, this.businessOption, {})
        sevenDayOption.title.text = '近七天内存占用率'
        sevenDayOption.xAxis.data = tmpYaxis
        sevenDayOption.series[0].data = tmpValue
        // 主机内存占用率Top5
        echarts
          .init(document.getElementById('sevendays_businessChartBox'))
          .on('click', (params) => {
            this.openResourceDrawer(params.data)
          })
        echarts
          .init(document.getElementById('sevendays_businessChartBox'))
          .setOption(sevenDayOption)
      })
    },
    // 查询网络流量Top5
    getNetworkFlowTop5() {
      HostsService.pageInterfaceFlowTop().then(res => {
        this.fullScreenData.netTop = res.data.records
      })
    },
    getCoreExchangeInOut() {
      let params = {
        start_time: this._moment().subtract(1, 'hours').format('X'),
        end_time: this._moment().format('X')
      }
      GraphsService.findGraphEchartsCoreExchange(params).then(res => {
        this.fullScreenData.networkFlow = res.data
      })
    },
    openResourceDrawer(data) {
      this.hostId = data.hostid
      this.detailFlag = 'ResourceDetail'
      this.resourceDrawer = true
    },
    openDetail(component) {
      this.drawer = true
      this.componentFlag = component
    },
    // 置空
    setNull() {
      this.resourceDrawer = false
      this.hostId = null
    }
  },
  beforeDestroy() {
    this.topoDynamicComp = null
    console.log('销毁任务实例')
    this.stopJob()
  }
}
</script>

<style lang="less">
@import './fullScreen.less';
</style>
