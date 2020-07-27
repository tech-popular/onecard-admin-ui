import router from '@/router'
import { Message } from 'element-ui'
import { getNavList, getDownNoButtonMenu } from '@/api/sys/menu'
let defaultPageUrl = ''
function findChildUrl (arr) {
  arr.forEach((item, index) => {
    if (index === 0) {
      if (item.list && item.list.length) {
        findChildUrl(item.list)
      } else {
        defaultPageUrl = item.url.replace('/', '-')
      }
    }
  })
}
export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'inverse',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    }
  },
  actions: {
    getNavData ({ commit }, id) { // 获取导航数据
      return new Promise((resolve, reject) => {
        getNavList(id).then(({data}) => {
          if (data && data.code === 0) {
            sessionStorage.setItem('navList', JSON.stringify(data.menuList || '[]'))
            sessionStorage.setItem('activeNavIndex', data.menuList[0].menuId)
            resolve()
          } else {
            sessionStorage.setItem('navList', '[]')
            Message.error(data.msg || '数据异常')
          }
        }).catch((e) => {
          Message.error('数据获取失败')
          console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
        })
      })
    },
    getMenuData ({ commit }, type) { // 获取菜单数据
      return new Promise((resolve, reject) => {
        getDownNoButtonMenu(sessionStorage.getItem('activeNavIndex')).then(({data}) => {
          if (data && data.code === 0) {
            if (!data.menuList.length) {
              resolve([])
              return
            }
            sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
            sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
            router.options.isAddDynamicMenuRoutes = false
            if (type) { // type:apply 表示为从首页中点击“申请”直接进入的
              sessionStorage.setItem('defaultPage', 'oa-apply') // 默认 我的申请 页面
              router.push({ name: 'oa-apply' })
            } else {
              findChildUrl(data.menuList)
              sessionStorage.setItem('defaultPage', defaultPageUrl) // 默认打开第一个页面
              router.push({ name: defaultPageUrl })
            }
            resolve(data.menuList)
          } else {
            sessionStorage.setItem('menuList', '[]')
            sessionStorage.setItem('permissions', '[]')
          }
        }).catch((e) => {
          Message.error('数据获取失败')
          console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
          // router.push({ name: 'login' })
        })
      })
    }
  }
}
