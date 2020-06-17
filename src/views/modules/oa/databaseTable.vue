<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="空间显示状态">
        <el-select placeholder="请选择" v-model="spaceStatus">
          <el-option v-for="item in approvalStatus" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="空间名">
        <el-input v-model="spaceName" placeholder="请输入词组ID" clearable />
      </el-form-item>
      <el-form-item label="负责部门">
        <el-select v-model="dutyGroup" placeholder="请选择">
          <el-option v-for="item in applyType" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="info" @click="sureEfiltHandle()">确认修改</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      style="width: 100%;"
      @select='onTableSelect'
      @selection-change="handleSelectionChange">
      >
      <el-table-column
        type="selection"
        :selectable="selectable" 
        width="55">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="空间ID"/>
      <el-table-column
        prop="applyType"
        header-align="center"
        align="center"
        label="空间名"/>
      <el-table-column
        prop="flow"
        header-align="center"
        align="center"
        label="负责部门"/>
      <el-table-column
        prop="flow"
        header-align="center"
        align="center"
        label="负责人"/>
      <el-table-column
        prop="flow"
        header-align="center"
        align="center"
        label="创建人"/>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"/>
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
  </div>
</template>
<script>
import AddOrUpdate from './databaseTable-add-or-update'
import { myAccoutList, myAccoutSelect } from '@/api/oa/apply'

export default {
  data () {
    return {
      name: '',
      applyType: [],
      applyTypeId: '',
      applyTypeValue: '',
      approvalStatus: [],
      spaceStatus: '',
      spaceName: '',
      dutyGroup: '',
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      newList: [],
      dialogVisible: false
    }
  },
  components: {
    AddOrUpdate
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
        spaceStatus: this.spaceStatus,
        spaceName: this.spaceName,
        dutyGroup: this.dutyGroup,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      myAccoutList(dataBody).then(({data}) => {
        this.totalPage = data.data.total
        this.newList = data.data.rows
        this.dataListLoading = false
      })
    },
    onTableSelect (rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1
      console.log(selected)  // true就是选中，0或者false是取消选中
    },
    // 是否禁用
    selectable (row) {
      console.log(row, 'zhi')

      if (row.approvalStatus === '审批通过') {
        return false// 禁用状态
      } else {
        return true// 非禁用状态
      }
    },
    handleSelectionChange (val) {
      console.log(val, 'val')

      this.multipleSelection = val
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
      this.spaceStatus = ''
      this.spaceName = ''
      this.dutyGroup = ''
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
<style scoped>
</style>