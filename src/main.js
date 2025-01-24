import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'

// import '@/assets/css/scrollbar.css'
// import 'iview/dist/styles/iview.css'
import '@/assets/css/dark-theme/styles/dist/iview.css'
import '@/assets/css/dark-theme/styles/index.less'
import '@/assets/icons/iconfont.css'
// import '@/assets/styles/transition.less'
// basscss
import 'basscss/css/basscss-cp.min.css'
import 'basscss/css/basscss.min.css'
// animate.css
import 'animate.css/animate.css'
// 通用component
// table
import LegaTable from '@/components/table/LegaTable'
// form
import LegaForm from '@/components/form/LegaForm'
import LegaSearchForm from '@/components/form/LegaSearchForm'
// area
import alSelector from '@/components/area/al-selector.vue'
import alCascader from '@/components/area/al-cascader.vue'

// loadsh
import _ from 'lodash'

import { DynamicModal } from '@/utils/modalUtil'

// moment
import moment from 'moment'

Vue.component('LegaTable', LegaTable)
Vue.component('LegaForm', LegaForm)
Vue.component('LegaSearchForm', LegaSearchForm)

Vue.component('al-selector', alSelector)
Vue.component('al-cascader', alCascader)

Vue.prototype._ = _
Vue.prototype._dynamicModal = DynamicModal
Vue.prototype._moment = moment

Vue.prototype.$compile = Vue.compile

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
window._Vue = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
