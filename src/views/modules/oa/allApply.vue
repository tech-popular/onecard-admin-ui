<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="申请人姓名">
        <el-input v-model.trim="allApplyName" placeholder="申请人姓名" clearable />
      </el-form-item>
      <el-form-item label="申请人邮箱前缀">
        <el-input v-model.trim="allApplyEmail" placeholder="申请人邮箱前缀" clearable />
      </el-form-item>
      <el-form-item label="申请类别">
        <el-select v-model="applyTypeValue" placeholder="请选择" @change='clickApplyType'>
          <el-option v-for="item in applyType" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select placeholder="请选择" v-model="approvalStatusValeu"  @change='clickApprovalStatus'>
          <el-option v-for="item in approvalStatus" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题"/>
      <el-table-column
        prop="applyType"
        header-align="center"
        align="center"
        label="申请类别"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="发起审批时间"/>
      <el-table-column
        prop="approvalStatus"
        header-align="center"
        align="center"
        label="钉钉审批状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.approvalStatus === '审批通过'" size="small" >审批通过</el-tag>
          <el-tag v-else-if="scope.row.approvalStatus === '审批失败'" size="small" type="danger">审批失败</el-tag>
          <el-tag v-else size="small" type="warning">审批中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="grantResult"
        header-align="center"
        align="center"
        label="授权状态">
        <template slot-scope="scope" v-if="scope.row.approvalStatus === '审批通过'">
          <el-tag v-if="scope.row.grantResult === '授权成功'" size="small" >授权成功</el-tag>
          <el-tag v-else size="small" type="danger">授权异常</el-tag>
        </template>
        <template v-else>
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-finished" size="small"  style="width:100px" @click="addOrUpdateHandle(scope.row)">审批记录</el-button>
          <el-button type="success" icon="el-icon-tickets" size="small" style="width:100px;margin-left:0;margin-top:10px;" @click="applyDetailHandle(scope.row)">授权详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"/>
    <!-- 授权详情 -->
    <allApplyDetail v-if="allApplyDetailVisible" ref="allApplyDetail"/>
  </div>
</template>
<script>
import AddOrUpdate from './allApply-add-or-update'
import AllApplyDetail from './allApplyDetail'
import { myAccoutList, myAccoutSelect } from '@/api/oa/apply'

export default {
  data () {
    return {
      name: '',
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      allApplyDetailVisible: false,
      newList: [],
      applyType: [],
      applyTypeId: '',
      applyTypeValue: '',
      approvalStatus: [],
      approvalStatusId: '',
      approvalStatusValeu: '',
      allApplyName: '',
      allApplyEmail: ''
    }
  },
  components: {
    AddOrUpdate,
    AllApplyDetail
  },
  activated () {
    this.getDataList()
  },
  methods: {
      // 获取数据列表
    getDataList () {
      // 条件查询初始化
      myAccoutSelect().then(({data}) => {
        this.applyType = data.data.applyTypeList
        this.approvalStatus = data.data.approvalStatusList
      })
      this.dataListLoading = true
      const dataBody = {
        'applyType': {
          id: this.applyTypeId,
          name: this.applyTypeValue
        },
        'approvalStatus': {
          id: this.approvalStatusId,
          name: this.approvalStatusValeu
        },
        'applyName': this.allApplyName,
        'applyEmail': this.allApplyEmail,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      myAccoutList(dataBody).then(({data}) => {
        this.totalPage = data.data.total
        this.newList = data.data.rows
        this.dataListLoading = false
      })
    },
      // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getDataList()
    },
      // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.getDataList()
    },
      /** 查询 */
    searchHandle () {
      this.pageNum = 1
      this.getDataList()
    },
      /** 重置 */
    resetHandle () {
      this.pageNum = 1
      this.applyTypeId = ''
      this.applyTypeValue = ''
      this.approvalStatusId = ''
      this.approvalStatusValeu = ''
      this.allApplyName = ''
      this.allApplyEmail = ''
      this.getDataList()
    },
    // 条件查询change
    clickApplyType (id) {
      let obj = {}
      obj = this.applyType.find((item) => {
        return item.id === id // 筛选出匹配数据
      })
      this.applyTypeId = obj.id
      this.applyTypeValue = obj.name
    },
    clickApprovalStatus (id) {
      let obj = {}
      obj = this.approvalStatus.find((item) => {
        return item.id === id // 筛选出匹配数据
      })
      this.approvalStatusId = obj.id
      this.approvalStatusValeu = obj.name
    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(val)
      })
    },
    // 授权详情
    applyDetailHandle (val) {
      this.allApplyDetailVisible = true
      this.$nextTick(() => {
        this.$refs.allApplyDetail.init(val)
      })
    }
  }
}
</script>
<style scoped>
</style>
