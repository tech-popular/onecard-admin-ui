<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="分群ID">
        <el-input v-model="dataForm.id" placeholder="分群ID" clearable />
      </el-form-item>
      <el-form-item label="分群名称">
        <el-input v-model="dataForm.name" placeholder="分群名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;"  @selection-change="selectionChangeHandle">
      <el-table-column
        v-if="isAdmin"
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="分群ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="分群名称">
        <!-- <template slot-scope="scope">
          <el-button type="text" size="small" @click="tableShowHandle(scope.row)">{{scope.row.name}}</el-button>
        </template> -->
      </el-table-column>
      <el-table-column prop="templateUserNum" header-align="center" align="center" label="分群用户数" :formatter="templateUserNumFormat"></el-table-column>
      <el-table-column prop="lastCalTime" header-align="center" align="center" label="最近计算时间" :formatter="lastCalTimeFormat"></el-table-column>
      <el-table-column prop="desc" header-align="center" align="center" label="分群说明">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.desc)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
            <div class="text-to-long-cut">{{scope.row.desc}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最后修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="addOrUpdateHandle(scope.row, 'update')">
             {{(isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username) ? '编辑' : '查看'}}
          </el-button>
          <el-button type="text" size="small"  v-if="isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username" @click="deleteHandle(scope.row)">删除</el-button>
          <!-- <el-button type="text" size="small" :disabled="!!scope.row.actionExpressionTemplate" @click="tableShowHandle(scope.row)">特征分析</el-button> -->
          <el-button type="text" size="small" :disabled="!!scope.row.actionExpressionTemplate" @click="tableShowHandle(scope.row)">分群概览</el-button>
          <el-button type="text" size="small" :disabled="!!scope.row.actionExpressionTemplate" @click="detailPreviewHandle(scope.row)">明细预览</el-button>
          <el-button type="text" size="small" v-if="isAdmin || scope.row.authOwner === userid || scope.row.authOwner === username" @click="taskPermission(scope.row)">授权</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <tableShow v-if="tableShowVisible" ref="tableShow"/>
    <detailPreview v-if="detailPreviewVisible" ref="detailPreview"/>
     <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" :submitDataApis= "submitDataApis" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>

<script>
  import { dataInsightManageList, deleteDataInfo } from '@/api/dataAnalysis/dataInsightManage'
  import AddOrUpdate from './baseComponents/dataInsightManage-add-or-update'
  // import TableShow from './baseComponents/tableShow'
  import TableShow from './baseComponents/tableShow1'
  import detailPreview from './baseComponents/detailPreview'
  import { updateGroupAuth, updateGroupAuths } from '@/api/commom/assignPermission'
  import AssignPermission from '../../components/permission/assign-permission'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          name: ''
        },
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        tableShowVisible: false,
        detailPreviewVisible: false,
        dataListSelections: [],
        submitDataApi: updateGroupAuth,
        submitDataApis: updateGroupAuths,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        isAdmin: sessionStorage.getItem('username') === 'admin'
      }
    },
    components: {
      AddOrUpdate,
      TableShow,
      AssignPermission,
      detailPreview
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let params = {
          ...this.dataForm,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        dataInsightManageList(params).then(({data}) => {
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
      // 明细预览
      detailPreviewHandle (value) {
        this.detailPreviewVisible = true
        this.$nextTick(() => {
          let canUpdate = true
          if (!this.isAdmin) {
            canUpdate = value.authOtherList.includes(this.userid || this.username) || value.authOwner === this.userid || value.authOwner === this.username
          }
          this.$refs.detailPreview.init(value, canUpdate)
        })
      },
      // 分群概览
      tableShowHandle (value) {
        this.tableShowVisible = true
        this.$nextTick(() => {
          let canUpdate = true
          if (!this.isAdmin) {
            canUpdate = value.authOtherList.includes(this.userid || this.username) || value.authOwner === this.userid || value.authOwner === this.username
          }
          this.$refs.tableShow.init(value, canUpdate)
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
      // 删除
      deleteHandle (row) {
        this.$confirm(`确认删除分群名称为【${row.name}】的数据?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDataInfo(row.id).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                type: 'error',
                message: data.message
              })
            }
            this.$message({
              type: 'success',
              message: data.message
            })
            this.getDataList()
          })
        }).catch(() => {
          // console.log('quxiao')
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
          name: '',
          id: ''
        }
        this.getDataList()
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
      templateUserNumFormat (row, column) {
        if (row.templateUserNum === '' || row.templateUserNum === null) {
          return '计算中'
        } else {
          return row.templateUserNum
        }
      },
      lastCalTimeFormat (row, column) {
        if (row.templateUserNum === '' || row.templateUserNum === null) {
          return '计算中'
        } else {
          return row.lastCalTime
        }
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
