<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
			<el-form-item label="sku(商品编号)：">
        <el-input v-model.trim="dataForm.skus" placeholder="请输入sku(商品编号)" clearable style="width: 400px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button type="success" @click="updateHandle()">一键更新</el-button>
        <el-button type="danger" @click="clearCacheHandle()">一键更新推荐缓存</el-button>
        <el-button type="warning" @click="multiImportFile()">批量文件上传</el-button>
        <span v-if="!!uploadText" :class="uploadText ==='上传成功'? 'isSuccess': 'isFail'">{{uploadText}}</span>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" header-align="center" align="center">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="sku" header-align="center" align="center" label="sku"></el-table-column>
      <el-table-column prop="line_price" header-align="center" align="center" label="划线价"></el-table-column>
      <el-table-column prop="sale_price" header-align="center" align="center" label="售价"></el-table-column>
      <el-table-column prop="product_name" header-align="center" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="first_category_type" header-align="center" align="center" label="一级类别"></el-table-column>
      <el-table-column prop="second_category_type" header-align="center" align="center" label="二级类别"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="商城状态">
        <template slot-scope="scope">
          <span>{{scope.row.status * 1 === 0 ?  '下线' : '上线'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brand_name" header-align="center" align="center" label="品牌名称"></el-table-column>
      <el-table-column prop="brand_english_name" header-align="center" align="center" label="品牌英文名"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" @click="addOrUpdateHandle(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" />
      <multi-import-file v-if="multiImportFileVisible" ref="multiImportFile" @importSuccess="importSuccessChange" @importFail="importFailChange"></multi-import-file>
  </div>
</template>
<script>
import AddOrUpdate from './baseComponents/urgetUpdateGoods-add-or-update'
import multiImportFile from './baseComponents/urgetUpdateGoods-multi-import-file'
import { productInfoList, updateEsProductInfo, clearRecommendCache } from '@/api/lexicon/urgentUpdateGoods'
export default {
  data () {
    return {
      dataForm: {
        skus: ''
      },
      addOrUpdateVisible: false,
      multiImportFileVisible: false,
      dataList: [],
      multiSelectedData: [],
      uploadText: ''
    }
  },
  components: { AddOrUpdate, multiImportFile },
  methods: {
    getDataList (arr) {
      productInfoList({
        skus: arr
      }).then(({data}) => {
        if (data.code === 0 && data.data.length > 0) {
          this.dataList = data.data
        } else {
          this.dataList = []
        }
      })
    },
    searchHandle () { // 查询
      this.getDataList([ this.dataForm.skus ])
    },
    updateHandle () { // 一键更新 2018072610261631205c15
      if (this.multiSelectedData.length === 0) return
      let skus = []
      this.multiSelectedData.forEach(item => {
        skus.push(item.sku)
      })
      this.$confirm(`更新缓存将覆盖原有数据，是否确定要更新？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEsProductInfo({
          skus: skus
        }).then(({data}) => {
          if (data.code === 0) {
            this.$message.success(data.data || '更新成功')
          } else {
            this.$message.error(data.data || '更新失败')
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    clearCacheHandle () { // 一键清除推荐缓存
      clearRecommendCache().then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.data || '清除失败')
        }
        return this.$message.success(data.data || '清除成功')
      })
    },
    multiImportFile () { // 批量上传文件
      this.multiImportFileVisible = true
      this.$nextTick(() => {
        this.$refs.multiImportFile.init()
      })
    },
    importFailChange (data) {
      this.uploadText = data.msg || '上传失败'
    },
    importSuccessChange (data) { // 数据导入完成后
      let arr = []
      data.forEach(item => {
        if (!arr.includes(item.sku)) {
          arr.push(item.sku)
        }
      })
      this.getDataList(arr)
      this.uploadText = '上传成功'
    },
    handleSelectionChange (val) { // 选中表格数据
      this.multiSelectedData = val
    },
    addOrUpdateHandle (row) { // 查看详情
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    }
  }
}
</script>
<style scoped>
  .isSuccess {
    color: green
  }
  .isFail {
    color: red
  }
</style>
