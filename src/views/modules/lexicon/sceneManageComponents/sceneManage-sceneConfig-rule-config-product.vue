<template>
  <div>
    <el-form label-width="80px" :model="baseForm" ref="baseForm" inline>
      <el-form-item label="SKU" prop="sku">
        <el-input v-model.trim="baseForm.sku" placeholder="sku" clearable />
      </el-form-item>
      <el-form-item label="商品名称" prop="product_name">
        <el-input v-model.trim="baseForm.product_name" placeholder="sku" clearable />
      </el-form-item>
      <el-form-item label="一级品类" prop="first_category_type">
        <el-input v-model.trim="baseForm.first_category_type" placeholder="一级品类" clearable />
      </el-form-item>
      <el-form-item label="二级品类" prop="second_category_type">
        <el-input v-model.trim="baseForm.second_category_type" placeholder="二级品类" clearable />
      </el-form-item>
      <el-form-item label="品牌" prop="brand_name">
        <el-input v-model.trim="baseForm.brand_name" placeholder="品牌" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
      <el-table-column prop="sku" header-align="center" align="center" label="SKU"></el-table-column>
      <el-table-column prop="product_name" header-align="center" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="weight" header-align="center" align="center">
        <template slot="header">
          <span>权重</span>
          <el-tooltip placement="top">
            <div slot="content">范围 1-5 整数，默认为 1 不加权，权重越高， 物品曝光越多</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span :class="'weight-shape weight-shape-color-' + scope.row.weight">{{scope.row.weight}}</span>
          <i class="el-icon-edit" @click="productWeightChange"></i>
        </template>
      </el-table-column>
      <el-table-column prop="first_category_type" header-align="center" align="center" label="一级品类"></el-table-column>
      <el-table-column prop="second_category_type" header-align="center" align="center" label="二级品类"></el-table-column>
      <el-table-column prop="brand_name" header-align="center" align="center" label="品牌"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="价格"></el-table-column>
      <el-table-column prop="publishTime" header-align="center" align="center" label="发布时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper" />
    <el-dialog title="修改" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
      <el-form label-width="100px" :model="weightForm" ref="weightForm">
        <el-form-item label="权重：" prop="weight">
          <el-select v-model="weightForm.weight">
            <el-option v-for="item in 5" :key="item" :value="item">{{item}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置时间：" prop="date">
          <el-date-picker
            v-model="weightForm.date"
            type="datetimerange"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
            :default-time="['12:00:00']">
          </el-date-picker>
          <p class="tips">失效时间距离当前时间最短不低于5分钟，最长不超过180天</p>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="cancel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      baseForm: {
        sku: '',
        product_name: '',
        first_category_type: '',
        second_category_type: '',
        brand_name: ''
      },
      loading: false,
      dataList: [
        {
          sku: '121212',
          product_name: '遥遥',
          weight: 1,
          first_category_type: '434',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        },
        {
          sku: '121212',
          product_name: '遥遥',
          weight: 2,
          first_category_type: '434',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        },
        {
          sku: '121212',
          product_name: '遥遥',
          weight: 3,
          first_category_type: '434',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        },
        {
          sku: '121212',
          product_name: '遥遥',
          weight: 4,
          first_category_type: '434',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        },
        {
          sku: '121212',
          product_name: '遥遥',
          weight: 5,
          first_category_type: '434',
          second_category_type: 'try',
          brand_name: 'lll',
          price: '12.98',
          publishTime: '2020-12-12 12:12:12'
        }
      ],
      pageNo: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      visible: false,
      weightForm: {
        weight: '',
        date: []
      }
    }
  },
  methods: {
    productWeightChange () { // 改变权重
      this.visible = true
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
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
  .weight-shape {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 23px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    border-radius: 50%;
  }
  .weight-shape-color-1{
    background: #cce6cc;
    border: 1px solid #008000;
    color: #008000;
  }
  .weight-shape-color-2{
    background: #ffe8c5;
    border: 1px solid #ff9a00;
    color:#ff9a00;
  }
  .weight-shape-color-3{
    background: #ffdcc5;
    border: 1px solid #ff6600;
    color: #ff6600
  }
  .weight-shape-color-4{
    background: #ffd1c5;
    border: 1px solid #ff3300;
    color: #ff3300;
  }
  .weight-shape-color-5{
    background: #ffc5c5;
    border: 1px solid #ff0000;
    color: #ff0000;
  }
  .tips {
    color: #999
  }
</style>
