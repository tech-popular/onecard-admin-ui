import Vue from 'vue'
import App from '@/App'
import router from '@/router' // api: https://github.com/vuejs/vue-router
import store from '@/store' // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie' // api: https://github.com/alfhen/vue-cookie
import 'element-ui/lib/theme-chalk/index.css'
import '@/element-ui' // api: https://github.com/ElemeFE/element
import '@/icons' // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import {
  isAuth,
  toBreak
} from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import VueClipboard from 'vue-clipboard2'
import VueCodemirror from 'vue-codemirror'
import tab from './components/table/table'
import searchForm from './components/form/searchForm'
import 'codemirror/lib/codemirror.css'
import G6 from '@antv/g6'
import EleForm from 'vue-ele-form'
import EleFormCodemirror from 'vue-ele-form-codemirror'
// 以下仅为示例, 具体根据需要, 在局部或者全局引入相应的资源
// 属性和引用资源参考: https://github.com/surmon-china/vue-codemirror
// language js
import 'codemirror/mode/javascript/javascript.js'
// theme css
import 'codemirror/theme/base16-dark.css'
Vue.use(VueCodemirror)
Vue.use(VueClipboard)
Vue.use(VueCookie)
Vue.use(G6)
Vue.config.productionTip = false

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth // 权限方法
Vue.prototype.toBreak = toBreak // 内容换行
Vue.use(EleForm) // form二次封装
Vue.component('tab', tab) // 全局table组件
Vue.component('searchForm', searchForm) // 全局查询form组件
// 注册 ele-form
Vue.use(EleForm, {
  // 可以在这里设置全局的 json-editor 属性
  'json-editor': {
    height: 300
  }
})
// 注册 codemirror 组件
Vue.component('codemirror', EleFormCodemirror)

// 注册 vue-ele-form
Vue.use(EleForm, {
  // 可以为编辑器配置全局属性, 每个实例都共享这个属性
  // 属性请参考下面
  codemirror: {
    options: {
      theme: 'base16-dark',
      tabSize: 4,
      mode: 'text/javascript',
      lineNumbers: true,
      line: true
    }
    // events: ['scroll', ...]
  }
})
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
