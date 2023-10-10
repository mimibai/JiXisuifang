import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import './styles/element-variables.scss' // 修改elementui默认主体色
import '@/styles/index.scss' // global css
import Print from 'vue-print-nb'
import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'

import {
  dispatchEventStroage
} from '@/utils/wacthStroage' // 监听localstroage变化

import '@/icons' // icon
import '@/permission' // 权限控制

/**
 *如果你不想使用模拟服务器
 *您想将MockJs用于mock api
 *可以执行：mockXHR（）
 *
 *目前MockJs将用于生产环境，
 *请在上线前删除！
 */
// if (process.env.NODE_ENV === 'production') {
//     const { mockXHR } = require('../mock')
//     mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(dispatchEventStroage)
Vue.prototype.$moment = moment
Vue.config.productionTip = false
Vue.use(Print)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
