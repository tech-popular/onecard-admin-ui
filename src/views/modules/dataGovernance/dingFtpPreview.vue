<template>
  <div class="mod-config" v-loading="dataListLoading">
    <div class="dingding-preview-title">查询结果</div>
    <div v-for="(item,index) in tableList" :key="index" style="margin-bottom:30px;">
      <h3 style="margin-left: 30px;">文件名称：{{item.fileName}}</h3>
      <el-table :data="item.dataList" border style="width: 100%;" :header-cell-style="{background:'#cceaf9'}">
        <template v-for="(citem,cindex) in item.columns">
          <el-table-column :prop="citem.prop" :key="cindex" :label="citem.label" :align="citem.align"></el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>
// import { dingDingPreview } from '@/api/dataGovernance/datareport'
export default {
  data () {
    return {
      tableList: [],
      // dataList: [],
      dataListLoading: false
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
      this.dataListLoading = true
      let id = this.$route.query.id
      this.tableList = []
      this.$http({
        url: this.$http.adornUrl(`/export/data/ftp/preview/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let reportData = data.data
          reportData.forEach(item => {
            let columnData = {
              fileName: '',
              dataList: [],
              columns: []
            }
            item.forEach((citem, cindex) => {
              if (cindex === 0) {
                columnData.fileName = citem.fileName
              } else if (cindex === 1) {
                let columnsData = Object.keys(citem)
                let columns = []
                columnsData.forEach(eitem => {
                  columns.push({
                    label: eitem,
                    prop: eitem,
                    align: 'center'
                  })
                })
                columnData.columns = columns
              } else {
                columnData.dataList.push(citem)
              }
            })
            this.tableList.push(columnData)
          })
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
          this.tableList = []
          this.dataListLoading = false
        }
      })
    }
  }
}
</script>
<style scoped>
.mod-config {
  margin-left: 10px;
  margin-right: 10px;
}
.dingding-preview-title {
  padding: 14px;
  background: #c3c3c3;
  font-size: 14px;
  margin: 20px 0px;
  position: relative;
}
</style>