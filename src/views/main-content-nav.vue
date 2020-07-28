<template>
  <div class="main-cont-nav">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">玖富数据中台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">
          <!-- <icon-svg style="transform: scale(1.4, 1.4)" name="bird"></icon-svg> -->
          <img src="../../static/img/logo.png" />
        </a>
      </h1>
    </div>
    <div class="cont-navbar__body clearfix">
      <el-menu
        v-if="isFold"
        class="cont-navbar__ico"
        mode="horizontal">
        <el-menu-item class="cont-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <img :src="sidebarFold ? right : left" alt="">
        </el-menu-item>
      </el-menu>
      <el-menu :default-active="activeIndex" class="el-menu-nav" mode="horizontal" background-color="#202b30" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
        <el-menu-item index="1">处理中心1</el-menu-item>
        <el-menu-item index="2">处理中心2</el-menu-item>
        <el-menu-item index="3">处理中心3</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isFold: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      left: require('../assets/img/left1.png'),
      right: require('../assets/img/right1.png'),
      activeIndex: '1'
    }
  },
  computed: {
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss">
  .main-cont-nav {
    background: #202b30;
    height: 60px;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    z-index: 930;
  }
  .el-menu-nav {
    float: left;
  }
  .cont-navbar__body {
    float: left;
    background-color: #202b30;
    height: 60px;
    line-height: 60px;
    z-index: 930;
  }
  .cont-navbar__ico {
    height: 60px;
    float: left;
    background-color: transparent;
    border-bottom: 0;
  }
  .cont-navbar__switch:hover {
    background: #2093f7 !important
  }
</style>
