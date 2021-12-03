<template>
  <el-dialog
    title="提数历史"
    :close-on-click-modal="false"
    :visible.sync="visible">
		 <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="申请原因">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" header-align="center" align="center" label="申请时间"></el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="提数类型"
      ></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="发送状态"></el-table-column>
			<el-table-column prop="inDatasourceName" header-align="center" align="center" label="失败原因"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :total="totalPage"
      layout="prev, pager, next"
    ></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataListLoading: false,
        id: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    methods: {
      init () {
        this.visible = true
      },
      // 获取数据列表
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
