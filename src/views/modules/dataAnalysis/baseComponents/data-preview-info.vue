<template>
  <el-dialog
    :visible.sync="visible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="prevuew-dialog"
  >
    <div slot="title" class="title">
      本次用户分群共筛选出 <span>{{totalNum}}</span> 条数据
      <p class="title-tips" v-if="vestPackCode && vestPackCode.length">（提示：因风控包需调用第三方接口存在延时性，故筛选条数为未剔除风控包前的数据）</p>
    </div>
    <div class="column-filter">
      <el-button class="column-filter-btn" type="success" size="small">字段筛选</el-button>
      <el-select v-model="checkedColumn" multiple placeholder="请选择">
        <el-option v-for="(item, index) in totalTableColumns" :key="index" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </div>
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column :prop="item.value" header-align="center" align="center" :label="item.name" v-for="(item, index) in tableColumns" :key="index"></el-table-column>
    </el-table>
    <p>注：随机抽取数据供参考</p>
    <div slot="footer">
      <el-button type="primary" size="small" @click="visible=false">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { dataPreviewInfo } from '@/api/dataAnalysis/dataInsightManage'
export default {
  data () {
    return {
      loading: false,
      visible: false,
      isColumnShow: false,
      totalTableColumns: [],
      tableData: [],
      cities: ['上海', '北京', '广州', '深圳'],
      checkedColumn: [],
      totalNum: 0
    }
  },
  props: ['vestPackCode'],
  computed: {
    tableColumns () {
      if (this.checkedColumn.length === this.totalTableColumns.length) {
        return this.totalTableColumns
      }
      if (this.checkedColumn.length === 0) {
        return []
      }
      let newArr = []
      for (let i = 0; i < this.totalTableColumns.length; i++) {
        let item = this.totalTableColumns[i]
        for (let c = 0; c < this.checkedColumn.length; c++) {
          let citem = this.checkedColumn[c]
          if (item.value === citem) {
            newArr.push(item)
          }
        }
      }
      return newArr
    }
  },
  methods: {
    init (params) {
      this.visible = true
      this.getPreviewInfo(params)
    },
    getPreviewInfo (params) {
      this.loading = true
      this.totalTableColumns = []
      this.checkedColumn = []
      params.vestPackCode = params.vestPackCode.join(',')
      dataPreviewInfo(params).then(({data}) => {
        if (data.status !== '1') {
          this.totalNum = 0
          this.tableData = []
          this.loading = false
          return this.$message({
            type: 'error',
            message: data.message || '数据异常'
          })
        } else {
          this.totalNum = data.data.total
          this.tableData = data.data.tableData
          let tableHead = data.data.tableHead
          for (let item in tableHead) {
            this.totalTableColumns.push({
              name: tableHead[item],
              value: item
            })
          }
          let initColumns = this.totalTableColumns.slice(0, 5)
          for (let i = 0; i < initColumns.length; i++) {
            this.checkedColumn.push(initColumns[i].value)
          }
          this.$nextTick(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style>
  .prevuew-dialog .title {
    font-size: 16px;
  }
  .prevuew-dialog .title span {
    color: red;
  }
  .prevuew-dialog .column-filter {
    text-align: right;
    margin: -10px 0 10px;
    position: relative;
    height: 40px;
  }
  .prevuew-dialog .column-filter-btn {
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 36px;
  }
  .prevuew-dialog .el-select {
    position: absolute;
    right: -15px;
    top: 0;
    width: 150px;
    height: 36px;
    opacity: 0;
    overflow: hidden;
    z-index: 999;
  }
  .prevuew-dialog .el-select__tags {
    height: 36px;
    overflow: hidden;
  }
  .prevuew-dialog .el-select-dropdown {
    top: 0 !important
  }
  .prevuew-dialog .title-tips {
    font-size: 12px;
  }
</style>
