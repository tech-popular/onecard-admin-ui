<template>
  <el-dialog title="历史日志下发" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
  <el-table :data="dataList" border style="width: 100%;">
    <el-table-column prop="index" header-align="center" align="center" label="序号"></el-table-column>
    <el-table-column prop="transferTargetDataSource" header-align="center" align="center" label="下发数据源"></el-table-column>
    <el-table-column prop="latestTransferTime" header-align="center" align="center" label="最近下发时间"></el-table-column>
    <el-table-column prop="transferNum" header-align="center" align="center" label="下发用户数"></el-table-column>
    <el-table-column prop="transferType" header-align="center" align="center" label="下发类型"></el-table-column>
    <el-table-column prop="transferStatus" header-align="center" align="center" label="下发状态"></el-table-column>
  </el-table>
  <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      style="margin-top: 15px;text-align:right"
      layout="total, sizes, prev, pager, next, jumper"/>
  <div class="footer">
    <el-button type="default" @click="cancelHandle" size="small">关闭</el-button>
  </div>
  </el-dialog>
</template>
<script>
import { r3Log } from '@/api/dataAnalysis/dataTransferManage'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      totalCount: 0,
      pageNum: 1, // 当前页
      pageSize: 10 // 默认每页10条
    }
  },
  methods: {
    init () {
      this.visible = true
      this.getDataList()
    },
    getDataList () {
      r3Log({
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(({data}) => {
        if (data && data.status === '1') {
          if (data.data == null) {
            this.dataList = []
            this.totalCount = 0
          } else {
            this.dataList = data.data.list
            this.totalCount = data.data.total
          }
        } else {
          this.dataList = []
          this.totalCount = 0
        }
      })
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNum = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNum = page
      this.getDataList()
    },
    cancelHandle () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
  .footer {
    margin-top: 20px;
    text-align: right;
  }
</style>
