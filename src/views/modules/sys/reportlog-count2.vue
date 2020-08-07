<template>
  <el-dialog
    :close-on-click-modal="false"
    width="880px"
    :append-to-body="true"
    :visible.sync="visible">
    <div slot="title" class="drawer-title">
      <b>{{title}}</b>
      <!-- <i class="el-icon-download drawer-down" @click="drawerClose"></i> -->
    </div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="用户名称"></el-table-column>
      <el-table-column prop="menuName" header-align="center" align="center" label="报表名称"></el-table-column>
      <el-table-column prop="accessTime" header-align="center" align="center" label="访问时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      style="margin-top:10px;text-align:right"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <report-log-count2 v-if="reportLogCount2Visible" ref="reportLogCount2"></report-log-count2>
  </el-dialog>
</template>
<script>
import { queryAccessList } from '@/api/sys/reportlog'
import reportLogCount2 from './reportlog-count2'
export default {
  data () {
    return {
      visible: false,
      title: '',
      name: '',
      dataForm: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      reportLogCount2Visible: false
    }
  },
  components: { reportLogCount2 },
  methods: {
    drawerClose () {
      this.visible = false
    },
    viewCountHandle (name) {
      this.reportLogCountVisible = true
      this.$nextTick(() => {
        this.$refs.reportLogCount2.init(this.dataForm, name)
      })
    },
    init (dataForm, name, title) {
      this.dataForm = dataForm
      this.title = title
      this.visible = true
      this.name = name
      this.getDataList()
    },
    getDataList () {
      this.dataListLoading = true
      let params = {
        page: this.pageIndex,
        limit: this.pageSize,
        // status: this.dataForm.status,
        startTime: this.dataForm.date.length ? this.dataForm.date[0] : '',
        endTime: this.dataForm.date.length ? this.dataForm.date[1] : ''
      }
      if (this.dataForm.status === 1) {
        params.name = this.name
      } else {
        params.menuName = this.name
      }
      queryAccessList(params).then(({ data }) => {
        if (data && data.status * 1 === 1) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>
<style scoped>
  .drawer-down {
    float: right;
    margin-right: 50px;
  }
</style>
