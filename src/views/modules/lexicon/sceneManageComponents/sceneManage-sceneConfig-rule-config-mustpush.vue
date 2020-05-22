<template>
  <div class="mustpust-content">
    <div class="pane-left"></div>
    <div class="pane-right">
      <div>上架商品 45678 件</div>
      <el-form label-width="80px" :model="baseForm" ref="baseForm" inline>
        <el-form-item label="SKU" prop="sku">
          <el-input v-model.trim="baseForm.sku" placeholder="sku" clearable />
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model.trim="baseForm.product_name" placeholder="sku" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
        <el-table-column prop="sku" header-align="center" align="center" label="SKU"></el-table-column>
        <el-table-column prop="product_name" header-align="center" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="second_category_type" header-align="center" align="center" label="二级品类"></el-table-column>
        <el-table-column prop="brand_name" header-align="center" align="center" label="品牌"></el-table-column>
        <el-table-column prop="price" header-align="center" align="center" label="价格"></el-table-column>
        <el-table-column prop="publishTime" header-align="center" align="center" label="发布时间"></el-table-column>
      </el-table>
      <el-card class="mpane" shadow="never">
        <el-form label-width="120px" :model="mustpushForm" :rules="mustpushFormRules" ref="mustpushForm">
          <el-form-item label="选择必推坑位" prop="id">
            <el-select v-model="mustpushForm.id">
              <el-option value="1">坑位一</el-option>
              <el-option value="2">坑位二</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择必推时间：" prop="date">
            <el-date-picker
              v-model="mustpushForm.date"
              type="datetimerange"
              start-placeholder="生效时间"
              end-placeholder="失效时间"
              value-format="yyyy-MM-dd hh:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <p class="tips">设为必推后，将在失效时间截止前，为每个用户推荐该商品一次。<br/>失效时间距离当前时间最短不低于5分钟，最长不超过90天</p>
          <el-form-item class="btn-group">
            <el-button type="primary" @click="dataSubmit">确定</el-button>
            <el-button @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      baseForm: {
        sku: '',
        product_name: ''
      },
      dataList: [
        {
          sku: '121212',
          product_name: '遥遥',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        }
      ],
      mustpushForm: {
        id: '',
        date: []
      },
      mustpushFormRules: {
        id: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetClick () { // 重置
      this.mustpushForm = {
        id: '',
        date: ''
      }
    },
    dataSubmit () {
      console.log(this.mustpushForm)
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
          console.log(9999)
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
    width: 350px;
    height: 705px;
    background: url(../assets/images/bg_phone.png) no-repeat;
    background-size: 100% auto;
    margin-right: 50px;
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
</style>
