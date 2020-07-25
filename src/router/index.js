/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo, getQueryString } from '@/utils'
Vue.use(Router)
console.log(getQueryString('tag'))
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
  { path: '/resetPassword', component: _import('common/resetPass'), name: 'resetPass', meta: { title: '重置密码' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  // redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    // { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    { path: '/demo-eventChoose', component: _import('demo/eventChoose'), name: 'demo-eventChoose', meta: { title: 'demo-eventChoose', isTab: true } },
    // { path: '/report-list', component: _import('pages/report-list/report-list'), name: 'report-list', meta: { title: '报表列表', isTab: true } },
    // { path: '/chart-list', component: _import('pages/chart-list/chart-list'), name: 'chart-list', meta: { title: '图形列表', isTab: true } },
    { path: '/create-report', component: _import('modules/pages/createreport'), name: 'create-report', meta: { title: '报表', isTab: true } },
    { path: '/create-chart', component: _import('modules/pages/createchart'), name: 'create-chart', meta: { title: '图形', isTab: true } },
    { path: '/phoenix-visual', component: _import('modules/phoenix/visual'), name: 'phoenix-visual', meta: { title: '可视化工具', isTab: true } },
    { path: '/phoenix-spectaculars', component: _import('modules/phoenix/spectaculars'), name: 'phoenix-spectaculars', meta: { title: '看板', isTab: true } },
    { path: '/phoenix-spectaculars0', component: _import('modules/phoenix/spectaculars0'), name: 'phoenix-spectaculars0', meta: { title: '彩虹评级', isTab: true } }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    let sysUuid = getQueryString('system_uuid')
    let sysArr = [
      'ecf36297-37ea-489e-a350-045b1ab49f75', // 统一后台uuid
      '95dd8c99-8c51-4394-b2f4-95ba472c2ef4' // 小鱼福卡uuid
    ]
    if (sysUuid && sysArr.includes(sysUuid)) { // 嵌入统一后台的免登陆处理
      http.get(http.adornUrl('/data/login?systemUuid=' + sysUuid)).then(res => {
        Vue.cookie.set('token', res.data.token)
        sessionStorage.setItem('isUnifiedAccount', '1')
        specialHttpMenu(to, from, next)
      })
    } else {
      httpMenu(to, from, next)
    }
  }
})

function httpMenu (to, from, next) {
  if (sessionStorage.getItem('menuList')) {
    fnAddDynamicMenuRoutes(JSON.parse(sessionStorage.getItem('menuList')))
    router.options.isAddDynamicMenuRoutes = true
    next({ ...to, replace: true })
  }
}

function specialHttpMenu (to, from, next) {
  http({
    url: http.adornUrl('/sys/menu/selectDownNoButtonMenu/402'),
    method: 'get',
    params: http.adornParams()
  }).then(({data}) => {
    if (data && data.code === 0) {
      if (!data.menuList.length) {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      } else {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      }
    } else {
      sessionStorage.setItem('menuList', '[]')
      sessionStorage.setItem('permissions', '[]')
      next()
    }
  }).catch((e) => {
    console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    router.push({ name: 'login' })
  })
}
/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}
export default router
