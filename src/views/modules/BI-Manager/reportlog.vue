<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-radio-group v-model="dataForm.status" @change="statusChange">
          <el-radio-button :label="1">按报表</el-radio-button>
          <el-radio-button :label="0">按用户</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="日期: ">
        <el-date-picker
          v-model="dataForm.date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 320px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="筛选报表" v-if="dataForm.status === 1">
        <el-input
          v-model="dataForm.menuName"
          placeholder="请输入报表名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="筛选用户" v-else>
        <el-input
          v-model="dataForm.name"
          placeholder="请输入用户名称"
          clearable
        ></el-input>
      </el-form-item>
        <el-form-item label="类型">
        <el-select v-model="dataForm.templateName" @change="templateNameChange">
          <el-option value="1" label="报表点击"></el-option>
          <el-option value="2" label="自助查询"></el-option>
          <el-option value="3" label="数据订阅"></el-option>
          <el-option value="4" label="提数记录"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">查询</el-button>
        <!-- <el-button>下载</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="menuName" header-align="center" align="center" label="报表名称" v-if="dataForm.status === 1" sortable></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="记录时间" v-if="dataForm.status === 0" sortable></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="人员ID" v-if="dataForm.status === 0" sortable></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="登录IP" v-if="dataForm.status === 0" sortable></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="日志内容" v-if="dataForm.status === 0" sortable></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="类型" v-if="dataForm.status === 0" sortable></el-table-column>
      <el-table-column prop="accessCount" header-align="center" align="center" v-if="dataForm.status === 1" label="访问次数" sortable>
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
    <!-- 弹窗, 新增 / 修改 -->
    <report-log-count v-if="reportLogCountVisible" ref="reportLogCount"></report-log-count>
  </div>
</template>
<script>
import { getDate } from '@/utils'
import reportLogCount from './reportlog-count'
export default {
  data () {
    return {
      dataForm: {
        status: 1,
        date: [getDate(new Date().getTime() - 1000 * 60 * 60 * 24 * 6, 'day'), getDate(new Date().getTime(), 'day')],
        name: '',
        menuName: '',
        templateName: '-1'
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      reportLogCountVisible: false
    }
  },
  components: { reportLogCount },
  mounted () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      // this.dataListLoading = true
    },
    viewCountHandle (name) {
      this.reportLogCountVisible = true
      this.$nextTick(() => {
        this.$refs.reportLogCount.init(this.dataForm, name)
      })
    },
    statusChange () {
      this.pageIndex = 1
      this.getDataList()
    },
    templateNameChange () {
      this.pageIndex = 1
      this.getDataList()
    },
    searchHandle () {
      this.pageIndex = 1
      this.getDataList()
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
