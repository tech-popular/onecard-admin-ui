<template>
  <el-dialog
    :close-on-click-modal="false"
    width="880px"
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
      <el-table-column prop="menuName" header-align="center" align="center" label="报表名称" v-if="dataForm.status === 0"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="用户名称" v-else></el-table-column>
      <el-table-column prop="accessCount" header-align="center" align="center" label="访问次数">
        <template slot-scope="scope">
          <span style="color:#2093f7;cursor:pointer" @click="viewCountHandle(scope.row.name || scope.row.menuName)">{{scope.row.accessCount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <div class="footer">
      <el-button type="primary" @click="visible = false" size="small">确定</el-button>
    </div>
    <report-log-count2 v-if="reportLogCount2Visible" ref="reportLogCount2"></report-log-count2>
  </el-dialog>
</template>
<script>
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
      userName: '',
      menuName: '',
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
      this.reportLogCount2Visible = true
      this.$nextTick(() => {
        if (this.dataForm.status === 1) {
          this.userName = name
        } else {
          this.menuName = name
        }
        this.$refs.reportLogCount2.init(this.dataForm, this.userName, this.menuName, this.title)
      })
    },
    init (dataForm, name) {
      this.pageIndex = 1
      this.pageSize = 10
      this.dataForm = dataForm
      this.name = name
      this.visible = true
      this.getDataList()
    },
    getDataList () {
      // this.dataListLoading = true
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
  .footer {
    text-align: right;
    margin-top: 20px;
  }
</style>
