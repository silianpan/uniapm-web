<template>
<Drawer v-model="resourceDrawer" width="75%" @on-visible-change="visibleChange">
  <div slot="header">
    <div class="resource-main">
      <div :class="['resource-menu',activedRourceMenu === item.name?'resource-menu-actived':'',item.class]" v-for="(item, index) of menuList" :key="index" @click="changeComponent(item)">
        <div class="resource-img"></div>
        <div class="resource-text"><b>{{item.name}}</b></div>
      </div>
    </div>
  </div>
  <transition name="fade-transform" mode="out-in">
    <component :resourcedrawer="resourceDrawer" :hostId="hostid" :appName="appname" v-bind:is="detailFlag"></component>
  </transition>
</Drawer>
</template>

<script>
import ResourceDetail from './details/ResourceDetail.vue'
import PerformanceDetail from './details/PerformanceDetail.vue'
import WarningDetail from '@/view/apm/warning/WarningList.vue'
import ComputerDetail from './details/ComputerDetail.vue'
import './resourceDrawer.less'
import { HostsService } from '@/api/apm/host'
// 存放要监控的应用集
const applicationMenu = {
  'CPU': 'CPU',
  'Memory': '内存',
  'Network interfaces': '网络接口',
  'Filesystem': '文件系统',
  'Processes': '进程',
  'MYSQL': 'MySQL',
  'Java': 'Java',
  'Tomcat': 'Tomcat'
}
export default {
  components: {
    ResourceDetail,
    PerformanceDetail,
    WarningDetail,
    ComputerDetail
    // ComputerDetail2: {
    //   props:{
    //     hostid:String,
    //     appName:String,
    //     utils:[Object,util]
    //   },
    //   render: function(){
    //    return (
    //       <ComputerDetail hostid={hostid} appName={appname} utils={util}></ComputerDetail>
    //     )
    //   }
    // }
  },
  props: {
    resourcedrawer: {
      type: Boolean,
      default: false
    },
    detailflag: {
      type: String,
      default: null
    },
    hostid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      activedRourceMenu: '资源总览',
      detailFlag: null, // 传递要跳转的组件
      appname: '', // 查询主机的详细内容
      menuList: []
    }
  },
  computed: {
    resourceDrawer: {
      get() {
        return this.resourcedrawer
      },
      set() {}
    }
  },
  methods: {
    changeComponent(item) {
      this.detailFlag = item.component
      this.activedRourceMenu = item.name
      this.appname = item.appname
    },
    visibleChange(visible) {
      if (!visible) {
        this.activedRourceMenu = '资源总览'
        this.menuList = []
        this.$emit('close-drawer')
      }
      this.detailFlag = visible ? this.detailflag : ''
    }
  },
  watch: {
    hostid(value) {
      if (!this._.isNil(value)) {
        HostsService.getApplicationsByHostId({ hostid: value }).then(res => {
          let menus = [
            {
              name: '资源总览',
              class: 'resource-All',
              component: 'ResourceDetail'
            },
            {
              name: '性能',
              class: 'resource-Performance',
              component: 'PerformanceDetail'
            },
            {
              name: '告警',
              class: 'resource-Warning',
              component: 'WarningDetail'
            },
            {
              name: '监控指标',
              class: 'resource-Index',
              component: 'ComputerDetail',
              appname: 'all'
            }
          ]
          for (let obj of res.data) {
            let item = {}
            for (let name in applicationMenu) {
              if (obj.name === name && obj.itemNum !== 0) {
                item.name = applicationMenu[name]
                item.class = 'resource-' + name
                item.component = 'ComputerDetail'
                item.appname = name
                menus.push(item)
                break
              }
            }
          }
          this.menuList = menus
        })
      }
    }
  }
}
</script>
