<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="状态">
        <el-select v-model="dataForm.status">
          <el-option value="1" label="已开启"></el-option>
          <el-option value="2" label="已关闭"></el-option>
          <el-option value="3" label="全部"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建者">
        <el-autocomplete
          v-model="dataForm.key"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入任务名称"
          @select="handleSelect"
          class="input-with-select"
          @keyup.enter.native="getDataList()"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('honeycomb:honeycombtask:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="发送主题"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="申请状态"></el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="允许接收时间"
      ></el-table-column>
      <el-table-column
        prop="sql"
        header-align="center"
        align="center"
        label="接收方式">
      </el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">已开启</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
			<el-table-column
        prop="sql"
        header-align="center"
        align="center"
        label="上次发送时间">
      </el-table-column>
			<el-table-column
        prop="sql"
        header-align="center"
        align="center"
        label="创建者">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="isAuth('honeycomb:honeycombtask:update')"
            @click="addOrUpdateHandle(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="small"
          >手动执行</el-button>
					<el-button
            type="text"
            size="small"
          >停止调度</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import AddOrUpdate from './apply-add-or-update'

export default {
  data () {
    return {
      dataForm: {
        key: '',
        status: ''
      },
      restaurants: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  mounted () {},
  methods: {
    querySearchAsync (queryString, cb) {},
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.dataForm.key = item.name
      this.getDataList()
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
    },
    // 新增 / 修改
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    }
  }
}
</script>
