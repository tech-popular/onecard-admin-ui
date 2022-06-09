<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div class="dingding-preview-title">查询结果</div>
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
// import { dingDingPreview } from '@/api/withdrawal/datareport'
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
      let id = this.$route.query.id
      this.$http({
        url: this.$http.adornUrl(`/export/data/ftp/preview/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let reportData = data.data
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
        } else {
          this.dataList = []
          this.dataListLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
.dingding-preview-title {
  padding: 14px;
  background: #c3c3c3;
  font-size: 14px;
  margin: 20px 0px;
  position: relative;
}
</style>