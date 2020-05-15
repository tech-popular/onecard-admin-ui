<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
			<el-form-item label="sku(商品编号)：">
        <el-input v-model="dataForm.sku" placeholder="请输入sku(商品编号)" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button type="success" @click="updateHandle()">一键更新</el-button>
        <el-button type="warning" @click="multiImportFile()">批量文件上传</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="sku" header-align="center" align="center" label="sku"></el-table-column>
      <el-table-column prop="price" header-align="center" align="center" label="划线价"></el-table-column>
      <el-table-column prop="price1" header-align="center" align="center" label="售价"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="one" header-align="center" align="center" label="一级类别"></el-table-column>
      <el-table-column prop="two" header-align="center" align="center" label="二级类别"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="商城状态"></el-table-column>
      <el-table-column prop="brandName" header-align="center" align="center" label="品牌名称"></el-table-column>
      <el-table-column prop="brandEnglish" header-align="center" align="center" label="品牌英文名"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" @click="addOrUpdateHandle(scope.row)" ref="addOrUpdate">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper" />
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" />
      <multi-import-file v-if="multiImportFileVisible" ref="multiImportFile"></multi-import-file>
  </div>
</template>
<script>
import AddOrUpdate from './baseComponents/urgetUpdateGoods-add-or-update'
import multiImportFile from './baseComponents/urgetUpdateGoods-multi-import-file'
export default {
  data () {
    return {
      dataForm: {
        sku: ''
      },
      addOrUpdateVisible: false,
      multiImportFileVisible: false,
      dataList: [],
      dataListLoading: false,
      pageNo: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      multiSelectedData: []
    }
  },
  components: { AddOrUpdate, multiImportFile },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataList = [
        {
          id: '1',
          sku: '1233',
          price: '333',
          price1: '200.99',
          name: '牺牲',
          one: '1',
          two: '2',
          status: '正常',
          brandName: '米兰',
          brandEnglish: 'milan'
        },
        {
          id: '2',
          sku: '44',
          price: '444',
          price1: '444.99',
          name: '牺牲1',
          one: '13',
          two: '22',
          status: '正常1',
          brandName: '米兰3',
          brandEnglish: 'milan2'
        }
      ]
    },
    searchHandle () { // 查询
      this.getDataList()
    },
    updateHandle () { // 一键更新
      console.log('一键更新')
      this.$confirm(`更新缓存将覆盖原有数据，是否确定要更新？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确定操作')
      }).catch(() => {
        console.log('取消')
      })
    },
    multiImportFile () { // 批量上传文件
      console.log('批量上传')
      this.multiImportFileVisible = true
      this.$nextTick(() => {
        this.$refs.multiImportFile.init()
      })
    },
    handleSelectionChange (val) { // 选中表格数据
      console.log(val)
      this.multiSelectedData = val
    },
    addOrUpdateHandle (row) { // 查看详情
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
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
    }
  }
}
</script>
