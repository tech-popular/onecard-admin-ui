<template>
  <div class="mustpust-content">
    <div class="pane-left">
      <div class="pane-left-1">
        <div class="pane-left-2">
          <img :src="imgUrl" />
        </div>
      </div>
    </div>
    <div class="pane-right">
      <div class="total">
        <el-button type="primary" @click="addArrUpdate">新建/修改必推坑位</el-button>
        <el-button type="success" @click="caozuoRizhi">操作日志</el-button>
      </div>
      <el-form label-width="80px" :model="baseForm" :rules="baseFormRules" ref="baseForm" inline>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model.trim="baseForm.sku" placeholder="sku" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="seachWeight">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
        <el-table-column prop="sku" header-align="center" align="center" label="SKU"></el-table-column>
        <el-table-column prop="productName" header-align="center" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="secondCategoryName" header-align="center" align="center" label="二级品类"></el-table-column>
        <el-table-column prop="salePrice" header-align="center" align="center" label="价格"></el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      </el-table>
      <el-card class="mpane" shadow="never" v-if="showform === true">
        <el-form label-width="120px" :model="mustpushForm" :rules="mustpushFormRules" ref="mustpushForm">
          <el-form-item label="选择必推坑位" prop="pit">
            <el-select v-model="mustpushForm.pit" placeholder="请选择">
              <el-option
                v-for="item in mustpushLits"
                :key="item.pitValue"
                :label="item.pitName"
                :value="item.pitValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择必推时间：" prop="date">
            <el-date-picker
              v-model="mustpushForm.date"
              type="datetimerange"
              start-placeholder="生效时间"
              end-placeholder="失效时间"
              value-format="yyyy-MM-dd HH:mm:ss" 
            >
            </el-date-picker>
          </el-form-item>
          <p class="tips">设为必推后，将在失效时间截止前，为每个用户推荐该商品一次。<br/>失效时间距离当前时间最短不低于5分钟，最长不超过90天</p>
          <el-form-item class="btn-group">
            <el-button type="primary" @click="dataSubmit">保存</el-button>
            <el-button @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table :data="skuList" border v-loading="loading" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="skuid" header-align="center" align="center" label="SKUID"></el-table-column>
        <el-table-column prop="pit" header-align="center" align="center" label="坑位"></el-table-column>
        <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
        <el-table-column prop="onlineTime" header-align="center" align="center" label="生效时间"></el-table-column>
        <el-table-column prop="offlineTime" header-align="center" align="center" label="失效时间"></el-table-column>
      </el-table>
    </div>
    <!-- 新建/修改 -->
    <el-dialog
      title="新建/修改必推坑位"
      :visible.sync="addArrUpdateBind"
      width="50%"
      :append-to-body="true"
      :modal-append-to-body='false'>
      <el-form :model="dataForm" ref="dataForm" label-width="23%">
        <el-form-item label="场景名称">
          <el-input v-model="boxname" disabled placeholder="场景名称"/>
        </el-form-item>
        <el-form-item label="必推一">
          <el-select v-model="dataForm.value1" placeholder="请选择" @change="bituiChange">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="必推二">
          <el-select v-model="dataForm.value2" placeholder="请选择" @change="bituiChange2">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addArrUpdateBind = false">取 消</el-button>
        <el-button type="primary" @click="addArrUpdateDataForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 操作日志 -->
    <el-dialog
      title="操作日志"
      :visible.sync="caozuorizhiBind"
      width="50%"
      :append-to-body="true"
      :modal-append-to-body='false'>
      场景名称:<span  disabled placeholder="场景名称">{{boxname}}</span>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="pit"
          label="坑位号"/>
        <el-table-column
          prop="skuid"
          label="sku"/>
        <el-table-column
          prop="onlineTime"
          label="必推生效时间"/>
        <el-table-column
          prop="offlineTime"
          label="必推失效时间"/>
        <el-table-column
          prop="createUser"
          label="创建人"/>
        <el-table-column
          prop="createTime"
          label="操作时间"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="caozuorizhiBind = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSceneWillPushList, getSceneWillPushsByBoxId, addSceneWillPush, getWillPushPitList, addWillPushPit, getWillPushPitInfo, getWillPushPitLog, updateWillPushPitInfo } from '@/api/lexicon/sceneManage'

export default {
  props: [
    'boxId',
    'boxname'
  ],
  data () {
    return {
      'imgUrl': require('../assets/images/bitui.jpg'),
      loading: false,
      baseForm: {
        sku: '',
        productName: ''
      },
      dataList: [],
      mustpushLits: [],
      mustpushForm: {
        pit: '',
        date: []
      },
      mustpushFormRules: {
        pit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      baseFormRules: {
        sku: [
          { required: true, message: '请输入sku', trigger: 'change' }
        ]
      },
      skuList: [],
      showform: false,
      addArrUpdateBind: false,
      pageNo: 1, // 当前页
      pageSize: 5, // 默认每页10条
      totalPage: 0,
      options: [
        {id: '0', name: '不配置'},
        {id: '1', name: '坑位一'},
        {id: '2', name: '坑位二'},
        {id: '3', name: '坑位三'},
        {id: '4', name: '坑位四'},
        {id: '5', name: '坑位五'},
        {id: '6', name: '坑位六'}
      ],
      dataForm: {
        name: '',
        value1: '',
        value2: ''
      },
      caozuorizhiBind: false,
      tableData: [],
      addUpd: false,
      firstPit: '',
      secondPit: '',
      firstPitChange: '',
      secondPitChange: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      getWillPushPitList(this.boxId).then(({data}) => {
        this.mustpushLits = data.data
      })
      getSceneWillPushsByBoxId(this.boxId).then(({data}) => {
        this.skuList = data.data
      })
    },
    resetClick () { // 重置
      this.mustpushForm = {
        pit: '',
        date: ''
      }
    },
    // 查询
    seachWeight () {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          const dataBody = {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'boxId': this.boxId,
            'productName': this.baseForm.productName,
            'sku': this.baseForm.sku
          }
          getSceneWillPushList(dataBody).then(({data}) => {
            if (data && data.msg === 'success') {
              this.dataList = data.data.list
              this.totalPage = data.data.totalPage
            }
            if (data && data.data && data.data.list.length > 0) {
              this.showform = true
            }
          })
        }
      })
    },
    // 选择坑位
    bituiChange (val) {
      this.firstPitChange = val
    },
     // 选择坑位
    bituiChange2 (val) {
      this.secondPitChange = val
    },
    // 新增/修改
    addArrUpdate () {
      this.addArrUpdateBind = true
      getWillPushPitInfo(this.boxId).then(({data}) => {
        data.data.firstPit || data.data.secondPit ? this.addUpd = true : this.addUpd = false
        this.firstPit = data.data.firstPit
        this.secondPit = data.data.secondPit
        this.options.forEach(item => {
          if (item.id == data.data.firstPit) {
            this.dataForm.value1 = item.name
          }
          if (item.id == data.data.secondPit) {
            this.dataForm.value2 = item.name
          }
        })
      })
    },
    // 新增或修改坑位
    addArrUpdateDataForm (done) {
      this.$confirm('修改必推坑位，原坑位配置的商品将失效，是否确定？').then(() => {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if (this.addUpd === false) {
              const dataBody = {
                boxId: this.boxId,
                firstPit: this.dataForm.value1,
                secondPit: this.dataForm.value2
              }
              addWillPushPit(dataBody).then(({data}) => {
                if (data && data.code === 0) {
                  this.addArrUpdateBind = false
                  this.$message.success('新建成功')
                  this.init()
                } else {
                  return this.$message.error(data.msg)
                }
              })
            } else {
              const dataBody = {
                boxId: this.boxId,
                firstPit: this.firstPitChange ? this.firstPitChange : this.firstPit,
                secondPit: this.secondPitChange ? this.secondPitChange : this.secondPit
              }
              updateWillPushPitInfo(dataBody).then(({data}) => {
                if (data && data.code === 0) {
                  this.addArrUpdateBind = false
                  this.$message.success('修改成功')
                  this.init()
                } else {
                  return this.$message.error(data.msg)
                }
              })
            }
          }
        })
      })
    },
    // 操作日志
    caozuoRizhi () {
      this.caozuorizhiBind = true
      getWillPushPitLog(this.boxId).then(({data}) => {
        this.tableData = data.data
      })
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNo = page
      this.getDataList()
    },
    // 坑位时间更改
    dataSubmit () {
      let uneffectTime = new Date(this.mustpushForm.date[1]).getTime()
      let now = Date.now()
      if (now + 1000 * 60 * 5 > uneffectTime) {
        return this.$message.error('失效时间距离当前时间最短不低于5分钟')
      }
      if (now + 1000 * 60 * 60 * 24 * 90 < uneffectTime) {
        return this.$message.error('失效时间距离当前时间最长不超过90天')
      }
      this.$refs.mustpushForm.validate((valid) => {
        if (valid) {
          this.$confirm('配置必推商品后将覆盖原坑位必推商品，是否确定？<br/><br/><span style="padding:10px;border:1px solid #dedede;display:inline-block">原SKU商品名称</span> <i class="el-icon-refresh"></i> <span style="padding:10px;border:1px solid #dedede;display:inline-block">原SKU商品名称</span>', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: ''
          }).then(() => {
            const dataBody = {
              boxId: this.boxId,
              onlineTime: this.mustpushForm.date[0],
              offlineTime: this.mustpushForm.date[1],
              skuid: this.baseForm.sku,
              pit: this.mustpushForm.pit
            }
            addSceneWillPush(dataBody).then(({data}) => {
              if (data && data.msg === 'success') {
                this.$message.success('更新成功')
                this.init()
              } else {
                return this.$message.error(data.msg)
              }
            })
          }).catch(() => {
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .mustpust-content {
    display: flex;
    margin-top: 20px;
  }
  .pane-left {
    width: 330px;
    height: 670px;
    background: url(../assets/images/bg_phone.png) no-repeat;
    background-size: 100% auto;
    margin-right: 50px;
    padding: 84px 22px 88px 22px;
    overflow: hidden;
  }
  .pane-left-1 {
    width: 286px;
    height: 490px;
    overflow: hidden;
  }
  .pane-left-2 {
    overflow: auto;
    width: 303px;
    height: 490px;
  }
  .pane-left img {
    width: 100%;
  }
  .pane-right {
    flex: 1;
  }
  .tips {
    padding-left: 120px;
    color:#999;
  }
  .mpane {
    margin-top: 20px;
  }
  .total {
    padding: 0 0 20px 35px;
  }
  .total span {
    color: red;
    font-weight: bold;
  }
</style>
