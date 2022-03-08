<template>
  <div>
    <main-navbar :is-fold="false" />
    <!-- 欢迎使用utc后台管理系统 -->
    <el-row :gutter="24" class="dash" style="margin: 80px 30px 0">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px;">
            <el-row class="userAdmin">
              <el-col :span="24">
                <div class="images">
                  <img src="~@/assets/img/avatar.png" class="imgs" :alt="userName" />
                </div>
              </el-col>
              <el-col :span="24">{{ userName }}</el-col>
            </el-row>
            <el-row style="border-bottom:1px dashed #ccc;margin: 20px;" />
            <div class="bottom clearfix">
              <el-row>
                <el-col :span="24" class="orginName" style="margin: 5px;">
                  <time class="time">
                    <i class="el-icon-time" style="line-height: 25px;">系统简介</i>
                  </time>
                </el-col>
                <el-col :span="24" class="orginName" style="margin: 5px;">
                  <time class="time">
                    欢迎使用
                    <span style="color: #2093f7;">数据中台系统，</span>本系统的主要板块：
                    <p>
                      <el-tag class="tagText">用户画像板块</el-tag>
                      <el-tag class="tagText" type="success">审批板块</el-tag>
                      <el-tag class="tagText" type="info">搜索推荐板块</el-tag>
                      <el-tag class="tagText" type="warning">调度板块</el-tag>
                      <el-tag class="tagText" type="danger">报警板块</el-tag>
                      <el-tag class="tagText">凤凰系统</el-tag>
                    </p>
                  </time>
                </el-col>
                <el-col :span="24" class="orginName" style="margin: 5px;">
                  <time class="time">
                    <el-form>
                      <i class="el-icon-setting" style="line-height: 25px;">风格设置</i>
                      <el-form-item label="导航条类型">
                        <el-radio-group v-model="navbarLayoutType" size="mini">
                          <el-radio label="default" border>默认</el-radio>
                          <el-radio label="inverse" border size="mini">全色</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="侧边栏皮肤">
                        <el-radio-group v-model="sidebarLayoutSkin" size="mini">
                          <el-radio label="dark" border>默认</el-radio>
                          <!-- <el-radio label="light" border>白色</el-radio> -->
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                  </time>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <!-- <el-row> -->
          <h4 style="border-bottom:1px dashed #ccc;margin-bottom: 10px;padding-bottom: 20px">
            <span class="other-tips">
              <i class="el-icon-warning"></i>功能权限与数据权限自助申请，请点击“
              <i style="font-style:normal;font-size:15px;color:#2093f7;padding:0;cursor:pointer" @click="gotoApply">系统管理</i>”版块
            </span>
          </h4>
          <!-- <el-row style="border-bottom:1px dashed #ccc;margin: 20px 0;"/> -->
          <!-- <el-col :span="12" v-for="(item, index) in plateList" :key="index" @click.native="gotoHandle(item)" style="cursor: pointer"> -->
          <div class="card-pane">
            <el-card :body-style="{ padding: '0px' }" style="margin:10px;width:400px" v-for="(item, index) in plateList" :key="index" @click.native="gotoHandle(item)">
              <img width="400px" height="155px" :src="item.img" />
              <el-row style="padding:10px">
                <el-col :span="12" style="line-height: 38px;">
                  <span>{{item.name}}</span>
                </el-col>
                <el-col :span="12" style="text-align: right;vertical-align: middle;">
                  <el-button type="primary" icon="el-icon-right" size="mini" circle></el-button>
                </el-col>
              </el-row>
            </el-card>
          </div>
          <!-- </el-col> -->
          <!-- </el-row> -->
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="请选择租户" :visible.sync="dialogVisible" width="30%">
      <span>
        请在页面上方选择租户，若无租户，请前往
        <a href="javascript:;" style="color:#2093f7" @click="applyPermission">申请</a>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogPermissionVisible" width="30%">
      <span>
        该用户没有权限，请自行前往“授权管理”中
        <a href="javascript:;" style="color:#2093f7" @click="applyPermission">申请</a>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPermissionVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import watermark from '@/utils/watermark'
import MainNavbar from '../main-navbar'
import { getPlateList } from '@/api/sys/menu'
export default {
  components: { MainNavbar },
  data () {
    let originHost = location.origin
    return {
      value: new Date(),
      dataHoste: '',
      dialogVisible: false,
      dialogPermissionVisible: false,
      defaultPageUrl: '',
      plateList: [],
      userName: '',
      allSystemData: [
        {
          isRouter: true,
          name: '数据服务',
          img: require('../../assets/img/dataservice.jpg'),
          url: sessionStorage.getItem('defaultPage'),
          menuId: 405
        },
        {
          isRouter: true,
          name: '系统管理',
          img: require('../../assets/img/sysmanage.jpg'),
          url: sessionStorage.getItem('defaultPage'),
          menuId: 407
        }
      ],
      otherSys: [
        {
          name: 'BI系统',
          img: require('../../assets/img/bi.jpg'),
          url: 'http://data.9f.cn/login.jsp'
        },
        {
          name: '凤凰系统',
          img: require('../../assets/img/fenghuang.jpg'),
          url: originHost + '/phoenix/#/home'
        },
        {
          name: '数语系统',
          img: require('../../assets/img/shuyu.png'),
          url: 'http://datablau.9f.cn/dam/login.jsp '
        },
        {
          name: '神策系统',
          img: require('../../assets/img/shence.jpg'),
          url: 'http://sensors.9f.cn/login/index.html'
        },
        {
          name: 'Zeppelin',
          img: require('../../assets/img/zepplin.png'),
          url: 'http://zeppelin.9f.cn'
        },
        {
          name: '新BI系统',
          img: require('../../assets/img/newBI.png'),
          url: originHost + '/bi/#/'
          // url: 'http://tech.9fbank.com/bi/#/'
          // url: 'http://10.3.0.50:3088/#/'
        }
      ]
    }
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType },
      set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
    },
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin },
      set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
    }
    // userId: {
    //   get () { return this.$store.state.user.id },
    //   set (val) { this.$store.commit('user/updateId', val) }
    // }
    // userName: {
    //   get () { return this.$store.state.user.name },
    //   set (val) {
    //     this.$store.commit('user/updateName', val)
    //     watermark.set(this.$store.state.user.name)
    //   }
    // },
    // createTime: {
    //   get () { return this.$store.state.user.datetime },
    //   set (val) { this.$store.commit('user/createTime', val) }
    // }
  },
  created () {
    // this.getUserInfo()
    // console.log('this.$store.state.user: ', this.$store.state.user);
    sessionStorage.setItem('menuList', '[]')
    sessionStorage.setItem('permissions', '[]')
    this.$store.dispatch('user/getUserInfo').then((username) => {
      watermark.set(username)
      this.userName = username
    })
  },
  mounted () {
    if (!this.$cookie.get('token')) {
      this.$router.push({ name: 'login' })
    }
    this.getPlateList()
    // var date1 = this.createTime.replace(/-/g, '/') // 开始时间
    // var date2 = new Date() // 结束时间
    // var date3 = date2.getTime() - new Date(date1).getTime() // 时间差的毫秒数
    // // 计算出相差天数
    // var days = Math.floor(date3 / (24 * 3600 * 1000))
    // // 计算出小时数
    // var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    // var hours = Math.floor(leave1 / (3600 * 1000))
    // // 计算相差分钟数
    // var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    // var minutes = Math.floor(leave2 / (60 * 1000))
    // // 计算相差秒数
    // var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    // var seconds = Math.round(leave3 / 1000)
    // this.dataHoste = days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
  },
  methods: {
    getPlateList () {
      getPlateList().then(({ data }) => {
        this.plateList = []
        if (data && data.code === 0) {
          data.menuList.forEach(item => {
            let tt = this.allSystemData.filter(aitem => aitem.menuId === item.menuId)[0]
            this.plateList.push(tt)
          })
          this.plateList = this.plateList.concat(this.otherSys)
        } else {
          this.plateList = this.otherSys
          // return this.$message({
          //   type: 'error',
          //   message: data.msg || '获取数据异常'
          // })
        }
      })
    },
    gotoApply () {
      let curItem = {
        isRouter: true,
        name: '系统管理',
        img: require('../../assets/img/sysmanage.jpg'),
        url: sessionStorage.getItem('defaultPage'),
        menuId: 407
      }
      this.gotoHandle(curItem)
    },
    gotoHandle (item) {
      if (item.menuId === 405 && !sessionStorage.getItem('tenantList').length) { // 若无权限时，弹窗提示
        this.dialogVisible = true
      } else {
        if (item.isRouter) { // 本项目功能时，直接路由跳转
          this.$store.dispatch('common/getNavData', item.menuId).then(() => {
            this.$store.dispatch('common/getMenuData').then((res) => {
              if (!res.length) { // 若用户角色权限冻结时，数据服务中无内容，则弹窗提示
                this.dialogPermissionVisible = true
              }
            })
          })
        } else { // 外链系统，进行页面跳转
          if (item.name === '新BI系统') {
            // let url = item.url + '?token=' + this.$cookie.get('token') + '&userId=' + sessionStorage.getItem('id')
            window.open(item.url, '_blank')
            // window.location.href = item.url + '?token=' + this.$cookie.get('token') + 'userId=' + sessionStorage.getItem('id')
          } else {
            window.open(item.url, '_blank')
          }
          // window.open(item.url, '_blank')
        }
      }
    },
    applyPermission () { // 跳转到申请权限页面
      this.$store.dispatch('common/getNavData', 407).then(() => {
        this.$store.dispatch('common/getMenuData', 'apply')
      })
    }
    // 获取当前管理员信息
    // getUserInfo () {
    //   this.$http({
    //     url: this.$http.adornUrl('/sys/user/info'),
    //     method: 'get',
    //     params: this.$http.adornParams()
    //   }).then(({data}) => {
    //     if (data && data.code === 0) {
    //       this.userId = data.user.userId
    //       this.userName = data.user.username
    //       this.createTime = data.user.createTime
    //     }
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-backtop,
.el-calendar-table td.is-today {
  color: #2093f7 !important;
}
.el-form-item--medium .el-form-item__content,
.el-form-item--medium .el-form-item__label {
  font-size: 14px;
  color: #999;
}
.card-pane {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.userAdmin {
  line-height: 40px;
  text-align: center;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  .images {
    height: 80px;
    width: 80px;
    margin: 0px auto;
    .imgs {
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius: 50%;
    }
  }
  .userEdit {
    text-align: right;
  }
  .orginName {
    color: #999;
    font-size: 14px;
    font-variant: tabular-nums;
  }
  .sexMale {
    color: #17b3a3;
    font-size: 20px;
  }
  .sexFemale {
    color: palevioletred;
    font-size: 20px;
  }
}
.time {
  font-size: 14px;
  color: #999;
  .tagText {
    margin: 5px;
  }
}
.other-tips {
  font-weight: normal;
  font-size: 12px;
  // padding-left: 10px;
  i {
    color: #faad14;
    padding-right: 5px;
  }
}
</style>
