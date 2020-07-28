<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="gotoHome">
        <a class="site-navbar__brand-lg" href="javascript:;">玖富数据中台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">
          <!-- <icon-svg style="transform: scale(1.4, 1.4)" name="bird"></icon-svg> -->
          <img src="../../static/img/logo.png" />
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        v-if="isFold"
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <!-- <icon-svg name="zhedie"></icon-svg> -->
          <img :src="sidebarFold ? right : left" alt="">
        </el-menu-item>
      </el-menu>
      <div style="flex: 1;overflow:hidden;position:relative;display:flex;flex-direction: row;" v-if="routerName !== 'home' && isUnifiedAccount !== '1'">
        <el-menu
          class="site-navbar__menu site-navbar__arrow"
          mode="horizontal"
        >
            <i class="el-icon-d-arrow-left" style="color:#fff" @click="toPrev"></i>
        </el-menu>
        <div ref="navDiv" style="flex: 1;overflow:hidden;position:relative">
          <el-menu :default-active="activeIndex" class="site-navbar__menu site-navbar__menu-nav" :style="{width: navListData.length * 110 + 'px', left: navBarLeft + 'px'}" mode="horizontal" background-color="#202b30" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
            <el-menu-item :index="item.menuId + ''" v-for="(item, index) in navListData" :key="index" style="width: 110px">{{item.name}}</el-menu-item>
          </el-menu>
        </div>
        <el-menu
          class="site-navbar__menu site-navbar__arrow"
          mode="horizontal"
        >
          <i class="el-icon-d-arrow-right" style="color:#fff" @click="toNext"></i>
        </el-menu>
      </div>
      <div style="flex: 1;" v-else></div>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__tenant" index="1" v-if="routerName === 'home'">
          所属租户：
          <el-select v-model="tenantId" placeholder="请选择" @change="tenantIdChange" style="width: 140px;height: 40px; line-height: 36px;">
            <el-option
              v-if="!tenantList.length"
              label="无"
              :value="-999">
            </el-option>
            <template v-else>
              <el-option
                v-for="item in tenantList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </template>
          </el-select>
          <span class="site-navbar__apply" @click="applyPermission">申请</span>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item> -->
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  import { getTenantList, saveHomeTenantId } from '@/api/sys/tenant'
  export default {
    props: {
      isFold: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        navBarLeft: 0,
        updatePassowrdVisible: false,
        left: require('../assets/img/left1.png'),
        right: require('../assets/img/right1.png'),
        tenantId: 0,
        tenantList: [],
        isNavbarBtnFlag: true,
        isUnifiedAccount: sessionStorage.getItem('isUnifiedAccount')
      }
    },
    components: {
      UpdatePassword
    },
    mounted () {
      if (this.routerName === 'home') {
        this.getTenantList()
      }
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      routerName () {
        return this.$route.name
      },
      navListData () {
        if (!sessionStorage.getItem('navList')) return []
        return JSON.parse(sessionStorage.getItem('navList'))
      },
      activeIndex: {
        get () { return sessionStorage.getItem('activeNavIndex') || 0 },
        set (val) { sessionStorage.setItem('activeNavIndex', val) }
      }
    },
    methods: {
      getTenantList () { // 租户下拉列表
        getTenantList().then(({data}) => {
          if (data && data.code === 0 && data.data.length) {
            console.log(data)
            this.tenantList = data.data
            this.tenantId = this.tenantList[0].id
          } else {
            this.tenantList = []
            this.tenantId = -999
          }
          this.tenantIdChange(this.tenantId)
          sessionStorage.setItem('tenantList', this.tenantList || [])
        })
      },
      tenantIdChange (val) { // 租户id改变时
        saveHomeTenantId(val).then(({data}) => {
          if (data && data.code !== 0) {
            this.$message({
              type: 'error',
              message: data.msg || '租户信息保存异常'
            })
          }
        })
      },
      handleSelect (index, indexPath) {
        this.activeIndex = index
        this.$store.dispatch('common/getMenuData')
        // this.$store.commit('common/updateMainTabs', []) // 切换导航时，把标签重置
      },
      toPrev () {
        if (this.navBarLeft === 0) return
        this.navBarLeft = this.navBarLeft + 110
      },
      toNext () {
        if (this.$refs.navDiv.clientWidth - this.navBarLeft < this.navListData.length * 110) {
          this.navBarLeft = this.navBarLeft - 110
        }
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
              document.body.removeChild(document.getElementById('1.23452384164.123412415'))
            }
          })
        }).catch(() => {})
      },
      gotoHome () {
        if (this.$route.name === 'home') return
        this.$router.replace({ name: 'home' })
      },
      applyPermission () { // 申请租户权限 直接进入“我的申请”页面
        this.$store.dispatch('common/getNavData', 407).then(() => {
          this.$store.dispatch('common/getMenuData', 'apply')
        })
      }
    }
  }
</script>
<style lang="scss">
.site-navbar {
  background-color: #202b30;
}
.el-menu--horizontal>.site-navbar__tenant.is-active {
  border: 0
}
.site-navbar--inverse .el-menu > .site-navbar__tenant:focus, .site-navbar--inverse .el-menu > .site-navbar__tenant:hover {
  background: none;
}
.site-navbar--inverse .el-menu .site-navbar__tenant i {
  color: #c0c4cc
}
.site-navbar__apply {
  margin-left: 10px;
  color: #2093f7;
}
.site-navbar__apply:hover {
  border-bottom: 1px solid #2093f7
}
.site-navbar__body {
  display: flex;
  flex-direction: row;
}
.site-navbar__menu-nav {
  position: absolute;
  left: 0;
  top: 0;
  transition-duration: .3s;
  text-align: center;
}
.site-navbar__arrow {
  height: 51px;
  line-height: 51px;
  margin: 0 12px;
}
</style>
