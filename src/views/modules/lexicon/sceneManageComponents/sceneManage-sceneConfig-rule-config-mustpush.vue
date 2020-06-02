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
      <div class="total">上架商品 <span>45678</span> 件</div>
      <el-form label-width="80px" :model="baseForm" :rules="baseFormRules" ref="baseForm" inline>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model.trim="baseForm.sku" placeholder="sku" clearable />
        </el-form-item>
        <!-- <el-form-item label="商品名称" prop="productName">
          <el-input v-model.trim="baseForm.productName" placeholder="商品名称" clearable />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="seachWeight">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
        <el-table-column prop="sku" header-align="center" align="center" label="SKU"></el-table-column>
        <el-table-column prop="productName" header-align="center" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="secondCategoryName" header-align="center" align="center" label="二级品类"></el-table-column>
        <el-table-column prop="salePrice" header-align="center" align="center" label="价格"></el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="发布时间"></el-table-column>
      </el-table>
      <!-- <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper" /> -->
      <el-card class="mpane" shadow="never" v-if="showform === true">
        <el-form label-width="120px" :model="mustpushForm" :rules="mustpushFormRules" ref="mustpushForm">
          <el-form-item label="选择必推坑位" prop="pit">
            <el-select v-model="mustpushForm.pit" placeholder="请选择">
              <el-option
                v-for="item in mustpushLits"
                :key="item.pit"
                :label="item.pitName"
                :value="item.pit">
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
        <el-table-column prop="onlineTime" header-align="center" align="center" label="生效时间"></el-table-column>
        <el-table-column prop="offlineTime" header-align="center" align="center" label="失效时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getSceneWillPushList, getSceneWillPushsByBoxId, addSceneWillPush, queryceneBoxinfoById } from '@/api/lexicon/sceneManage'

export default {
  props: [
    'boxId'
  ],
  data () {
    return {
      'imgUrl': require('../assets/images/img_phone.jpg'),
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
      baseFormRules: {
        sku: [
          { required: true, message: '请输入sku', trigger: 'change' }
        ]
      },
      mustpushFormRules: {
        pit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      skuList: [],
      showform: false,
      pageNo: 1, // 当前页
      pageSize: 5, // 默认每页10条
      totalPage: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      queryceneBoxinfoById(this.boxId).then(({data}) => {
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
            if (data && data.data && !data.data.list) {
              this.showform = true
            }
          })
        }
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
