<template>
  <div>
    <el-form :inline="true">
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
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
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
        prop="flow"
        header-align="center"
        align="center"
        label="钉钉审批流"/>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button> -->
          <el-button type="primary" icon="el-icon-view" size="small" @click="lookHandle(scope.row)">查看</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- 查看弹出框 -->
    <ApplyDetail v-if="applyDetailVisible" ref="applyDetail"/>
  </div>
</template>
<script>
import AddOrUpdate from './apply-add-or-update'
import ApplyDetail from './applyDetail'
import { myAccoutList, myAccoutSelect } from '@/api/oa/apply'

export default {
  data () {
    return {
      name: '',
      applyType: [],
      applyTypeId: '',
      applyTypeValue: '',
      approvalStatus: [],
      approvalStatusId: '',
      approvalStatusValeu: '',
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      newList: [],
      dialogVisible: false,
      applyDetailVisible: false
    }
  },
  components: {
    AddOrUpdate,
    ApplyDetail
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      // 条件查询初始化
      myAccoutSelect().then(({data}) => {
        this.applyType = data.data.applyTypeList
        this.approvalStatus = data.data.approvalStatusList
      })
      const dataBody = {
        'applyType': {
          id: this.applyTypeId,
          name: this.applyTypeValue
        },
        'approvalStatus': {
          id: this.approvalStatusId,
          name: this.approvalStatusValeu
        },
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      myAccoutList(dataBody).then(({data}) => {
        this.totalPage = data.data.total
        this.newList = data.data.rows
        this.dataListLoading = false
      })
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
      this.getDataList()
    },
      // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
     // 查看
    lookHandle (val) {
      console.log(val)

      this.applyDetailVisible = true
      this.$nextTick(() => {
        this.$refs.applyDetail.init(val)
      })
    }
  }
}
</script>
<style scoped>
</style>