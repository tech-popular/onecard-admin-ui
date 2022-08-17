<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item label="主题: ">
        <el-input v-model="dataForm.theme" clearable  class="input-with-select" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
      <el-form-item label="申请原因: ">
        <el-input v-model="dataForm.approveReason" clearable  class="input-with-select" @keyup.enter.native="getDataList()"></el-input>
      </el-form-item>
     <el-form-item label="类型: ">
        <el-select v-model="dataForm.type" clearable>
          <el-option label="提数" value="export"></el-option>
          <el-option label="订阅" value="subscription"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态: ">
        <el-select v-model="dataForm.status" clearable>
          <el-option label="未上线" value="0"></el-option>
          <el-option label="上线" value="1"></el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="searchData()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle">订阅申请</el-button>
        <el-button type="primary" @click="dispatchConfig">配置调度</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="数据源id"></el-table-column>
      <el-table-column prop="receiveType" header-align="center" align="center" label="接收方式"></el-table-column>
      <el-table-column prop="receiveContentType" header-align="center" align="center" label="接收方式"></el-table-column>
      <el-table-column prop="period" header-align="center" align="center" label="提数周期"></el-table-column>
       <el-table-column prop="receiveDays" header-align="center" align="center" label="接收天数"></el-table-column>
      <el-table-column prop="thene" header-align="center" align="center" label="主题"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="申请人"></el-table-column>
      <el-table-column prop="expiryTime" header-align="center" align="center" label="过期时间"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="上线状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">未上线</el-tag>
          <el-tag v-if="scope.row.status === 1" size="small">已上线</el-tag>
          <el-tag v-if="scope.row.status === 2" size="small" >上线中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="approveStatus" header-align="center" align="center" label="审批状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.approveStatus === 0" size="small" type="danger">审批异常</el-tag>
          <el-tag v-if="scope.row.approveStatus === 1" size="small">敏感数据验证审批中</el-tag>
          <el-tag v-if="scope.row.approveStatus === 2" size="small">敏感数据审批中</el-tag>
          <el-tag v-if="scope.row.approveStatus === 3" size="small">审批完成</el-tag>
        </template>
      </el-table-column>
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
      :current-page="currPage"
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
import {getList, subscriptionUpAndDown } from '@/api/dataGovernance/subscribeManage'
import addOrUpdate from './subscribeManage-add-or-update'
import dispatchConfigAddOrUpdate from './dispatchConfig-add-or-update'
export default {
  data () {
    return {
      dataList: [],
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dispatchConfigAddOrUpdateVisible: false,
      dataForm: {
        status: '',
        theme: '',
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
      let params = {
        'approveReason': this.dataForm.approveReason,
        'type': this.dataForm.type,
        'status': this.dataForm.status ? Number(this.dataForm.status) : '',
        'theme': this.dataForm.theme,
        'currPage': this.currPage,
        'pageSize': this.pageSize
      }
      // getList(params).then(({ data }) => {
      //   console.log('res: ', data)
      //   if (data.code === 0 && data.data) {
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
      this.currPage = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.currPage = val
      this.getDataList()
    },
    searchData () {
      this.currPage = 1
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
