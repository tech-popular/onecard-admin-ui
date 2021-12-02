<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="任务ID: ">
        <el-input
          v-model="dataForm.id"
          placeholder="请输入任务ID"
          class="input-with-select"
          clearable
          @keyup.enter.native="getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务名称: ">
        <el-input
          v-model="dataForm.name"
          placeholder="请输入任务名称"
          class="input-with-select"
          clearable
          @keyup.enter.native="getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button type="default" @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="任务Id"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="任务名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="cron"
        header-align="center"
        align="center"
        show-overflow-tooltip
        label="cron表达式"
      ></el-table-column>
      <el-table-column
        prop="sql"
        header-align="center"
        align="center"
        label="SQL">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.sql)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.sql}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">正常</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
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
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
          <el-button
            type="text"
            size="small"
            @click="startTask(scope.row.id)"
          >手动执行</el-button>
					<el-button
            type="text"
            size="small"
						@click="taskDependent(scope.row.id)"
          >依赖任务</el-button>
          <el-button type="text" size="small" @click="SnapShotHandle(scope.row)">依赖任务进度</el-button>
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
		<!-- 任务依赖 -->
		<task-dependent v-if="taskDependentVisible" ref="taskDependent"></task-dependent>
    <!-- 依赖任务进度 -->
    <taskManagSnapShot v-if="taskManagSnapShotVisible" ref="taskManagSnapShot"></taskManagSnapShot>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { taskManageList } from '@/api/BI-Manager/taskManage'
import AddOrUpdate from './taskManage-add-or-update'
import TaskDependent from './taskManage-dependent'
import taskManagSnapShot from './taskManag-snap-shot'
export default {
  data () {
    return {
      dataForm: {
        name: '',
        id: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      taskDependentVisible: false,
      taskManagSnapShotVisible: false
    }
  },
  components: {
    AddOrUpdate,
    TaskDependent,
    taskManagSnapShot
  },
  activated () {
    this.getDataList()
  },
  mounted () {},
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'sysType': 1,
        'page': this.pageIndex.toString(),
        'limit': this.pageSize.toString(),
        'id': this.dataForm.id,
        'name': this.dataForm.name
      }
      taskManageList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    handleSelect (item) {
      this.dataForm.key = item.name
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
    },
    resetHandle () {
      this.dataForm.id = ''
      this.dataForm.name = ''
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    taskDependent (id) {
      this.taskDependentVisible = true
      this.$nextTick(() => {
        this.$refs.taskDependent.init(id)
      })
    },
    SnapShotHandle (row) {
      this.taskManagSnapShotVisible = true
      this.$nextTick(() => {
        this.$refs.taskManagSnapShot.init(row)
      })
    },
    // 手动执行
    startTask (id) {
      return this.$http({
        url: this.$http.adornUrl(`/honeycomb/honeycombtask/starttask/` + id),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/honeycomb/honeycombtask/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
