<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div class="preview-title">查询结果</div>
    <!-- <tab :list="dataList" :columns="columns" :operates="{}" :fixed="{}" /> -->
    <el-table :data="dataList" border style="width: 100%" :header-cell-style="{background:'#cceaf9'}">
      <template v-for="(item,index) in columns">
        <el-table-column :prop="item.prop" :key="index" :label="item.label" :align="item.align"></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<style>
</style>
<script>
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      columns: []
    }
  },
  activated () {
    this.getDataList()
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.columns = []
      this.dataListLoading = true
      let reportData = JSON.parse(sessionStorage.getItem('sqlPreviewDataList'))
      let columnsData = Object.keys(reportData[0])
      columnsData.forEach(item => {
        this.columns.push({
          label: item,
          prop: item,
          align: 'center'
        })
      })
      this.dataList = reportData
      this.dataListLoading = false
    }
  }
}
</script>
<style scoped>
.preview-title {
  padding: 17px;
  background: #c3c3c3;
  font-size: 17px;
  margin: 20px 0px;
  position: relative;
}
</style>
