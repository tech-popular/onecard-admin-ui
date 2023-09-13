<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="ID: ">
        <el-input
          v-model="dataForm.id"
          clearable
          class="input-with-select"
          @keyup.enter.native="getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请原因: ">
        <el-input
          v-model="dataForm.approveReason"
          clearable
          class="input-with-select"
          @keyup.enter.native="getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型: ">
        <el-select v-model="dataForm.type" clearable>
          <el-option label="SQL提数提数" value="0"></el-option>
          <el-option label="订阅" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态: ">
        <el-select v-model="dataForm.status" clearable>
          <el-option label="未上线" value="0"></el-option>
          <el-option label="已上线" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData()">查询</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()"
          >批量授权</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%"
    >
      <el-table-column
        v-if="isAdmin"
        type="selection"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID"
      ></el-table-column>
      <el-table-column
        prop="typeDesc"
        header-align="center"
        align="center"
        label="类型"
      ></el-table-column>
      <el-table-column
        prop="approveReason"
        header-align="center"
        align="center"
        label="申请原因"
      ></el-table-column>
      <el-table-column
        prop="receiveTypeDesc"
        header-align="center"
        align="center"
        label="接收方式"
      ></el-table-column>
      <el-table-column
        prop="receiveContentTypeDesc"
        header-align="center"
        align="center"
        label="接收内容类型"
      ></el-table-column>
      <el-table-column
        prop="exportTypeDesc"
        header-align="center"
        align="center"
        label="订阅周期"
      ></el-table-column>
      <el-table-column
        prop="receiveDays"
        header-align="center"
        align="center"
        label="接收天设置"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="申请时间"
      ></el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="申请人"
      ></el-table-column>
      <el-table-column
        prop="expiryTime"
        header-align="center"
        align="center"
        label="过期时间"
      ></el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="上线状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">未上线</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">已上线</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="approveStatus"
        header-align="center"
        align="center"
        label="审批状态"
      >
        <!-- <template slot-scope="scope">
          <el-tag v-if="scope.row.approveStatus === 0" size="small" type="danger">审批异常</el-tag>
          <el-tag v-if="scope.row.approveStatus === 1" size="small">敏感数据验证审批中</el-tag>
          <el-tag v-if="scope.row.approveStatus === 2" size="small">敏感数据审批中</el-tag>
          <el-tag v-if="scope.row.approveStatus === 3" size="small">审批完成</el-tag>
        </template> -->
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="authHandle(scope.row) && scope.row.type === 0"
            @click="addOrUpdateHandle(scope.row.id)"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="
              authHandle(scope.row) &&
              scope.row.type === 0 &&
              scope.row.status === 0
            "
            @click="addOrUpdateHandle(scope.row.id)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="dispatchConfig(scope.row)"
            v-if="
              scope.row.type === 0 &&
              scope.row.exportType === 'period' &&
              scope.row.status === 0
            "
            >配置调度</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="authHandle(scope.row) && scope.row.type === 0"
            @click="upOrDownHandle(scope.row)"
            >{{ scope.row.status === 0 ? "上线" : "下线" }}</el-button
          >
          <el-button
            type="text"
            size="small"
            v-if="
              isAdmin ||
              scope.row.authOwner === userid ||
              scope.row.authOwner === username
            "
            @click="taskPermission(scope.row)"
            >授权</el-button
          >
          <el-button type="text" size="small" @click="historySql(scope.row)"
            >历史SQL</el-button
          >
          <el-button type="text" v-if="scope.row.exportType === 'period' &&  scope.row.status === 0" size="small" @click="takeEffect(scope.row)"
            >立即触发</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="currPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <assign-permission
      v-if="assignPermissionVisible"
      :submitDataApi="submitDataApi"
      :submitDataApis="submitDataApis"
      ref="assignPermission"
      @refreshDataList="getDataList"
    ></assign-permission>
    <!--调度配置-->
    <dispatch-config-add-or-update
      v-if="dispatchConfigAddOrUpdateVisible"
      ref="dispatchConfigAddOrUpdate"
      @refreshDataList="getDataList"
    />
    <addOrUpdate
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></addOrUpdate>

    <!-- Table -->
    <el-dialog title="历史sql列表" :visible.sync="dialogTableVisible">
      <el-table :data="historySqlList">
        <el-table-column property="id" label="ID" width="60"></el-table-column>
        <el-table-column
          property="sqlTitle"
          label="sql标题"
          width="120"
        ></el-table-column>
        <el-table-column
          property="sql"
          label="sql语句"
          width="300"
        ></el-table-column>
        <el-table-column
          property="dataJobId"
          label="订阅任务ID"
          width="120"
        ></el-table-column>
        <el-table-column
          property="sqlBatchId"
          label="sql批次ID"
          width="120"
        ></el-table-column>
        <el-table-column
          property="datasourceId"
          label="数据源ID"
        ></el-table-column>
        <el-table-column
          property="databaseId"
          label="数据库ID"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { getList, subscriptionUpAndDown, watchHistorySql, periodImmediateStartAPI, updateSubscriptionAuth, batchUpdateSubscriptionAuth } from '@/api/dataGovernance/subscribeManage'
import addOrUpdate from './subscribeManage-add-or-update'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
import AssignPermission from '../../components/permission/assign-permission'
export default {
  data() {
    return {
      historySqlList: [],
      dialogTableVisible: false,
      dataList: [],
      dataListSelections: [],
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dispatchConfigAddOrUpdateVisible: false,
      dataForm: {
        id: '',
        status: '',
        approveReason: '',
        type: ''
      },
      submitDataApi: updateSubscriptionAuth,
      submitDataApis: batchUpdateSubscriptionAuth,
      assignPermissionVisible: false,
      userid: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
      isAdmin: sessionStorage.getItem('username') === 'admin'
    }
  },
  components: { addOrUpdate, dispatchConfigAddOrUpdate, AssignPermission },
  activated() {
    this.getDataList()
  },
  mounted() {
  },
  methods: {
    takeEffect(item) {
      if (item.status !== 0) {
        this.$message({
          message: '请下线后立即触发！',
          type: 'error'
        })
        return
      }
      console.log(item)
      periodImmediateStartAPI({
        id: item.id,
        periodImmediateStatus: '1'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '立即触发成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: data.msg || '数据异常',
            type: 'error'
          })
        }
      })
    },
    historySql(item) {
      watchHistorySql(item.id).then(({ data }) => {
        if (data && data.code === 0) {
          this.historySqlList = data.data
          this.dialogTableVisible = true
        } else {
          this.$message({
            message: data.msg || '数据异常',
            type: 'error'
          })
        }
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      let params = {
        'approveReason': this.dataForm.approveReason,
        'id': this.dataForm.id,
        'type': this.dataForm.type,
        'status': this.dataForm.status ? Number(this.dataForm.status) : '',
        'currPage': this.currPage,
        'pageSize': this.pageSize
      }
      getList(params).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.dataListLoading = false
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.currPage = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.currPage = val
      this.getDataList()
    },
    searchData() {
      this.currPage = 1
      this.getDataList()
    },
    authHandle(row) {
      return this.isAdmin || row.authOtherList.includes(this.userid || this.username) || row.authOwner === this.userid || row.authOwner === this.username
    },
    // searchImgData () {
    //   let routeUrl = this.$router.resolve({ path: '/dataGovernance-imgView', query: {fileName: 'user_50_0_1662016491641'} })
    //   window.open(routeUrl.href, '_blank')
    // },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.$router.push({ name: 'dataGovernance-dataServiceSql', query: { id: id } })
    },
    // 调度配置
    dispatchConfig(row) {
      this.dispatchConfigAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchConfigAddOrUpdate.init(row)
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    taskPermission(row) {
      // 打开权限分配弹框
      // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
      this.assignPermissionVisible = true
      this.$nextTick(() => {
        this.$refs.assignPermission.init(row, false)
      })
    },
    // 批量授权
    multiTaskPermission() {
      if (this.dataListSelections.length) {
        this.assignPermissionVisible = true
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$nextTick(() => {
          this.$refs.assignPermission.init(ids, true)
        })
      }
    },
    // 上下线
    upOrDownHandle(row) {
      subscriptionUpAndDown(row.id).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '成功',
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
    }
  }
}
</script>
