<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="订阅说明: ">
        <el-input v-model="dataForm.approveReason" clearable placeholder="请输入申请原因" class="input-with-select" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">订阅申请</el-button>
        <el-button type="primary" @click="dispatchConfig">配置调度</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="approveReason" header-align="center" align="center" label="申请原因">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.approveReason)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.approveReason}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="typeDesc" header-align="center" align="center" label="类型"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="申请人"></el-table-column>
      <el-table-column prop="expiryTime" header-align="center" align="center" label="过期时间"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="是否失效">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1" size="small">否</el-tag>
          <el-tag v-else size="small" type="danger">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="approveStatus" header-align="center" align="center" label="审批流状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.approveStatus === 'agree'" size="small">审批通过</el-tag>
          <el-tag v-if="scope.row.approveStatus === 'running'" size="small">审批中</el-tag>
          <el-tag v-if="scope.row.approveStatus === 'refuse'" size="small" type="danger">审批拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="period" header-align="center" align="center" label="周期"></el-table-column>
      <el-table-column prop="receiveDays" header-align="center" align="center" label="接收天数"></el-table-column>
      <el-table-column prop="remainDay" header-align="center" align="center" label="距离失效日期"></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="dispatchConfig(scope.row.id)">配置调度</el-button>
          <el-button type="text" @click="disableHandle(scope.row)">申请失效</el-button>
          <el-button type="text" @click="renewalHandle(scope.row)">申请续期</el-button>
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
    <!--调度配置-->
    <dispatch-config-add-or-update v-if="dispatchConfigAddOrUpdateVisible" ref="dispatchConfigAddOrUpdate" @refreshDataList="getDataList" />
    <addOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></addOrUpdate>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
</style>
<script>
import { } from '@/api/dataGovernance/subscribeManage'
import addOrUpdate from './subscribeManage-add-or-update'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
export default {
  data () {
    return {
      restaurants: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dispatchConfigAddOrUpdateVisible: false,
      dataForm: {
        approveReason: '',
        type: ''
      }
    }
  },
  components: { addOrUpdate, dispatchConfigAddOrUpdate },
  activated () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      // this.dataListLoading = true
      // let params = {
      //   approveReason: this.dataForm.approveReason,
      //   type: this.dataForm.type ? Number(this.dataForm.type) : '',
      //   pageNum: this.pageIndex,
      //   pageSize: this.pageSize
      // }
      // exportDataList(params).then(({ data }) => {
      //   console.log('res: ', data)
      //   if (data.code === 0 && data.data) {
      //     data.data.list.forEach(element => {
      //       if (element.typeDesc === 'ftp提数') {
      //         element.remainDay = ''
      //         element.receiveDays = ''
      //       }
      //     })
      //     this.dataList = data.data.list
      //     this.totalPage = data.data.totalCount
      //     this.dataListLoading = false
      //   } else {
      //     this.dataList = []
      //     this.dataListLoading = false
      //   }
      // })
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
    searchData () {
      this.pageIndex = 1
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    // 调度配置
    dispatchConfig () {
      this.dispatchConfigAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchConfigAddOrUpdate.init()
      })
    },
    renewalHandle (row) {
      // let params = {
      //   'id': row.id,
      //   'month': 3
      // }
      // approveRenewal(params).then(({ data }) => {
      //   console.log('申请延期 ', data)
      //   if (data && data.code === 0) {
      //     this.$message({
      //       message: '延期成功',
      //       type: 'success',
      //       duration: 1500,
      //       onClose: () => {
      //         this.getDataList()
      //       }
      //     })
      //   }
      // })
    },
    // 申请失效
    disableHandle (row) {
      this.$confirm('确认要将此申请设为失效？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // approveDisable(row.id).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     this.$message({
        //       message: '申请失效成功',
        //       type: 'success',
        //       duration: 1500,
        //       onClose: () => {
        //         this.getDataList()
        //       }
        //     })
        //   }
        // })
      })
    }
  }
}
</script>
