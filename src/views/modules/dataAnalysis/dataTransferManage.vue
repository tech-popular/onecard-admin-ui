<template>
  <div v-loading="loading">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="任务ID">
        <el-input v-model="dataForm.id" @keyup.native="number" placeholder clearable />
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="dataForm.transferName" placeholder clearable />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="dataForm.enable" placeholder="任务状态">
          <el-option label="全部" value></el-option>
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新建</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column v-if="isAdmin" type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" label="任务ID"></el-table-column>
      <el-table-column prop="transferName" header-align="center" align="center" label="任务名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.transferName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.transferName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="taskUniqueFlag" header-align="center" align="center" label="蜂巢任务ID"></el-table-column> -->
      <!-- <el-table-column prop="templateUserNum" header-align="center" align="center" label="分群用户数"></el-table-column> -->
      <el-table-column prop="transferType" header-align="center" align="center" label="下发数据源"></el-table-column>
      <el-table-column prop="dispatchFrequency" header-align="center" align="center" :formatter="dispatchFrequencyFormat" label="调度频率"></el-table-column>
      <el-table-column prop="lastCalTime" header-align="center" align="center" sortable width="154" label="最近下发时间"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" sortable width="154" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" sortable width="154" label="最后修改时间"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="任务状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#409EFF"
            active-text="开"
            :active-value="true"
            inactive-color="#909399"
            inactive-text="关"
            :inactive-value="false"
            :disabled="!(isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username)"
            @change="changeSwitch($event,scope.row)"
            class="switchStyle"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="140" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row,'edit')">
            {{
            (isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username) ? '编辑' : '查看'
            }}
          </el-button>
          <!-- <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button> -->
          <el-button
            type="text"
            @click="lowerHandle(scope.row)"
            v-if="scope.row.enable === true && (isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username)"
          >立即下发</el-button>
          <el-button
            type="text"
            v-if="scope.row.enable != true && (isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username)"
            @click="lowerHandle(scope.row)"
            disabled
          >立即下发</el-button>
          <el-button type="text" style="margin-left:0px;" v-if="isAdmin || scope.row.authOwner === userid || scope.row.authOwner === username" @click="taskPermission(scope.row)">授权</el-button>
          <el-button type="text" @click="taskProgress(scope.row)">执行进度</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi="submitDataApi" :submitDataApis="submitDataApis" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
    <dataTransferManage-task-progress v-if="taskProgressVisible" ref="taskProgress"></dataTransferManage-task-progress>
  </div>
</template>

<script>
import { dataTransferManageList, enableDataTransferManage, lowerDataTransferManage } from '@/api/dataAnalysis/dataTransferManage'
import AddOrUpdate from './baseComponents/dataTransferManage-add-or-update'
import { updateDataTransferAuth, updateDataTransferAuths } from '@/api/commom/assignPermission'
import AssignPermission from '../../components/permission/assign-permission'
import dataTransferManageTaskProgress from './baseComponents/dataTransferManage-task-progress'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        transferName: '',
        enable: ''
      },
      loading: false,
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      dataListSelections: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      taskProgressVisible: false,
      submitDataApi: updateDataTransferAuth,
      submitDataApis: updateDataTransferAuths,
      assignPermissionVisible: false,
      userid: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
      isAdmin: sessionStorage.getItem('username') === 'admin'
    }
  },
  components: {
    AddOrUpdate,
    AssignPermission,
    dataTransferManageTaskProgress
  },
  mounted () {
    this.getDataList()
  },
  methods: {

    number () {
      this.dataForm.id = this.dataForm.id.replace(/[^.\d]/g, '')
      this.dataForm.id = this.dataForm.id.replace('.', '')
    },

    // 调度频率
    dispatchFrequencyFormat (row, column) {
      if (row.triggerMode === 1) {
        return '被动'
      } else {
        if (row.dispatchFrequency === 'TIME') {
          return '定时'
        } else if (row.dispatchFrequency === 'ONCE_ONLY') {
          return '单次'
        }
      }
    },
    // 状态启用停用
    changeSwitch (status, row) {
      this.$confirm('确认任务名称：' + row.transferName + (status === true ? ' 开启' : ' 关闭') + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        let params = status === true ? 1 : 0
        enableDataTransferManage(row.id, params).then(({ data }) => {
          this.loading = false
          if (data && data.status === '1') {
            row.enable = status
            this.$message.success(data.message)
          } else {
            row.enable = !status
            this.$message.error(data.message ? data.message : data.msg)
          }
        })
      }).catch(() => {
        this.loading = false
        row.enable = !status
        this.$message.info('取消操作！')
      })
    },

    // 立即下发
    lowerHandle (row, tag) {
      this.$confirm('确认任务名称：' + row.transferName + ' 立即下发?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        lowerDataTransferManage(row.id).then(({ data }) => {
          if (data && data.status === '1') {
            this.loading = false
            this.$message.success(data.message)
          } else {
            this.loading = false
            this.$message.error(data.message ? data.message : data.msg)
          }
        })
      }).catch(() => {
        this.loading = false
        this.$message.info('取消操作！')
      })
    },

    // 获取数据列表
    getDataList () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          let params = {
            ...this.dataForm,
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          }
          dataTransferManageList(params).then(({ data }) => {
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
            this.dataListLoading = false
          })
        }
      })
    },

    // 新增 / 修改
    addOrUpdateHandle (row, tag) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        let canUpdate = true
        if (!this.isAdmin) {
          canUpdate = row ? row.authOtherList.includes(this.userid || this.username) || row.authOwner === this.userid || row.authOwner === this.username : true
        }
        this.$refs.addOrUpdate.init(row, tag, canUpdate)
      })
    },
    /** 查询 */
    searchHandle () {
      this.pageNum = 1
      this.getDataList()
    },
    /** 重置 */
    resetHandle () {
      this.pageNum = 1
      this.dataForm = {
        id: '',
        transferName: '',
        enable: ''
      }
      // this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
    taskPermission (row) {
      // 打开权限分配弹框
      // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
      this.assignPermissionVisible = true
      this.$nextTick(() => {
        this.$refs.assignPermission.init(row, false)
      })
    },
    // 批量授权
    multiTaskPermission () {
      this.assignPermissionVisible = true
      let ids = this.dataListSelections.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.$refs.assignPermission.init(ids, true)
      })
    },
    // 执行进度
    taskProgress (row) {
      this.taskProgressVisible = true
      this.$nextTick(() => {
        this.$refs.taskProgress.init(row)
      })
    }
  }
}
</script>
<style scope lang="scss">
.switchStyle {
  .el-switch__label {
    position: absolute;
    display: none;
    font-weight: normal;
  }
  .el-switch__label * {
    font-size: 12px;
  }
  .el-switch__label--left {
    z-index: 9;
    left: 8px;
    top: -1px;
    color: #fff;
  }
  .el-switch__label--right {
    z-index: 9;
    left: -17px;
    top: -1px;
    color: #fff;
  }
  .el-switch__label.is-active {
    display: block;
    height: 20px;
    line-height: 20px;
  }
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 40px !important;
}
</style>
