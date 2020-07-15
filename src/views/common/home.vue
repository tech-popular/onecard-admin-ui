<template>
    <!-- 欢迎使用utc后台管理系统 -->
     <el-row :gutter="24" class="dash">
          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <el-row class="userAdmin">
                  <el-col :span="24">
                    <div class="images">
                      <img src="~@/assets/img/avatar.png" class="imgs" :alt="userName"/>
                    </div>
                  </el-col>
                  <el-col :span="24">{{ userName }}</el-col>
                </el-row>
                <el-row style="border-bottom:1px dashed #ccc;margin: 20px;"/>
                <div class="bottom clearfix">
                  <el-row>
                    <el-col :span="24" class="orginName" style="margin: 5px;">
                      <time class="time">
                        <i class="el-icon-time" style="line-height: 25px;">  系统简介</i>
                      </time>
                    </el-col>
                    <el-col :span="24" class="orginName" style="margin: 5px;">
                      <time class="time">
                        欢迎使用<span style="color: #2093f7;">数据中台系统，</span>本系统的主要板块：
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
                        <i class="el-icon-setting" style="line-height: 25px;">  风格设置  </i>
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
              <el-row>
                <h4>去往其他系统</h4>
                <el-row style="border-bottom:1px dashed #ccc;margin: 20px 0;"/>
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="~@/assets/img/fenghuang.png">
                    <el-row style="padding:10px">
                      <el-col :span="12" style="line-height: 38px;"><span>凤凰系统</span></el-col>
                      <el-col :span="12" style="text-align: right;vertical-align: middle;">
                       <el-button type="primary" icon="el-icon-right" size="mini" circle @click="fhHandle(fenghuang)"></el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="~@/assets/img/bi.jpg">
                    <el-row style="padding:10px">
                      <el-col :span="12" style="line-height: 38px;"><span>BI系统</span></el-col>
                      <el-col :span="12" style="text-align: right;vertical-align: middle;">
                       <el-button type="primary" icon="el-icon-right" size="mini" circle @click="biHandle(bi)"></el-button>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <!-- <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                    <el-row style="padding:10px">
                      <el-col :span="12"><span>凤凰系统</span></el-col>
                      <el-col :span="12" style="text-align: right;color: #2093f7;"><i class="el-icon-right"></i></el-col>
                    </el-row>
                  </el-card>
                </el-col> -->
              </el-row>
              <!-- <el-row>
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card :body-style="{ padding: '0px' }" style="margin:5px">
                    <img width="100%" height="155px" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                  </el-card>
                </el-col>
              </el-row> -->
            </el-card>
          </el-col>
        </el-row>
</template>

<script>
import http from '@/utils/httpRequest'
export default {
  data () {
    let originHost = location.origin
    return {
      value: new Date(),
      dataHoste: '',
      fenghuang: originHost + '/phoenix/#/home',
      bi: 'http://data.9fbank.com/plate.jsp'
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
    },
    userName: {
      get () { return this.$store.state.user.name }
    },
    createTime: {
      get () { return this.$store.state.user.datetime }
    }
  },
  mounted () {
    var date1 = this.createTime.replace(/-/g, '/') // 开始时间
    var date2 = new Date() // 结束时间
    var date3 = date2.getTime() - new Date(date1).getTime() // 时间差的毫秒数
    // 计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    // 计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    // 计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    // 计算相差秒数
    var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    this.dataHoste = days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
    if (!sessionStorage.getItem('tableauUrl')) {
      this.getTableauUrl()
    }
  },
  methods: {
    fhHandle (url) {
      window.open(url, '_blank')
    },
    biHandle (url) {
      window.open(url, '_blank')
    },
    getTableauUrl () {
      http({
        url: 'http://songxin.sk.9f.cn/dataSCInfo/selectSCInfoUrl', // http.adornUrl('/sys/menu/nav'),
        method: 'get',
        params: http.adornParams()
      }).then(({data}) => {
        console.log(data)
        sessionStorage.setItem('tableauUrl', data.data)
        // sessionStorage.setItem('tableauUrl', 'http://182.92.24.177:10080/t/9fbank_id/views/71/sheet36?:iid=1?:embed=yes&:toolbar=yes#1')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-backtop, .el-calendar-table td.is-today {
    color: #2093f7 !important;
}
.el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label{
  font-size: 14px;
    color: #999;
}
.userAdmin{
  line-height: 40px;
  text-align: center;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  .images{
    height: 80px;
    width: 80px;
    margin: 0px auto;
      .imgs{
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      border-radius:50%;
    }
  }
  .userEdit{
    text-align: right
  }
  .orginName{
    color: #999;
    font-size: 14px;
    font-variant: tabular-nums;
  }
  .sexMale{
    color: #17B3A3;
    font-size: 20px;
  }
  .sexFemale{
    color: palevioletred;
    font-size: 20px;
  }
}
.time {
    font-size: 14px;
    color: #999;
    .tagText{
      margin: 5px;

    }
}
</style>
