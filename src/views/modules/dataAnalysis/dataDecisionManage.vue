<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="决策ID">
        <el-input v-model="dataForm.decisionId" placeholder="决策ID" clearable />
      </el-form-item>
      <el-form-item label="决策编号">
        <el-input v-model="dataForm.decisionCode" placeholder="决策编号" clearable />
      </el-form-item>
      <el-form-item label="决策名称">
        <el-input v-model="dataForm.decisionName" placeholder="决策名称" clearable />
      </el-form-item>
      <el-form-item prop="groupId" label="分群名称">
        <el-select v-model="dataForm.groupId" filterable clearable placeholder="请选择分群">
          <el-option value="-1" label="全部"></el-option>
          <el-option v-for="(item, index) in custerList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column v-if="isAdmin" type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="决策ID"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="决策编号"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="决策名称"></el-table-column>
      <el-table-column prop="channelName" header-align="center" align="center" label="渠道"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username" @click="addOrUpdateHandle(scope.row, 'update')">编辑</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
          <el-button type="text" v-if="isAdmin || scope.row.authOwner === userid || scope.row.authOwner === username" @click="taskPermission(scope.row)">授权</el-button>
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
      layout="total, sizes, prev, pager, next, jumper" />
        <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" :submitDataApis= "submitDataApis" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>

<script>
  import { decisionList, custerList } from '@/api/dataAnalysis/dataDecisionManage'
   import { updateDecisionAuth, updateDecisionAuths } from '@/api/commom/assignPermission'
  import AssignPermission from '../../components/permission/assign-permission'
  export default {
    data () {
      return {
        dataForm: {
          decisionId: '',
          decisionCode: '',
          decisionName: '',
          groupId: '-1'
        },
        custerList: [],
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        dataListSelections: [],
        submitDataApi: updateDecisionAuth,
        submitDataApis: updateDecisionAuths,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        isAdmin: sessionStorage.getItem('username') === 'admin'
      }
    },
    components: {
      AssignPermission
    },
    mounted () {
      this.getCusterList()
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let params = {
          ...{ ...this.dataForm, groupId: this.dataForm.groupId === '-1' ? '' : this.dataForm.groupId },
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        decisionList(params).then(({data}) => {
          this.dataListLoading = false
          if (data.status !== '1' || !data.data || !data.data.list.length) {
            this.dataList = []
            this.totalCount = 0
            return
          }
          this.dataList = data.data.list
          this.totalCount = data.data.total
        })
      },
      getCusterList () {
        custerList('').then(({data}) => {
          if (data.status * 1 !== 1) {
            this.custerList = []
            return
          }
          this.custerList = data.data
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        const params = {
          authOthers: tag ? row.authOthers : '',
          authOwner: tag ? row.authOwner : '',
          authOtherList: tag ? row.authOtherList : []
        }
        this.$store.commit('workFlow/setRowData', params)
        if (tag) {
          this.$router.replace({ path: 'dataAnalysis-workFlow', query: { tag: tag, id: row.id, time: new Date().getTime() } })
        } else {
          this.$router.replace({ path: 'dataAnalysis-workFlow', query: { time: new Date().getTime() } })
        }
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
          decisionId: '',
          decisionCode: '',
          decisionName: '',
          groupId: '-1'
        }
        this.getDataList()
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
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
      multiTaskPermission() {
        this.assignPermissionVisible = true
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        this.$nextTick(() => {
          this.$refs.assignPermission.init(ids, true)
        })
      }
    }
  }
</script>
