<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="任务定义名称">
        <el-input v-model.trim="sacherName" placeholder="任务定义名称" clearable />
      </el-form-item>
      <el-form-item label="任务具体ID">
        <el-input v-model.trim="sacherId" placeholder="任务具体id" clearable />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select filterable v-model="sacherType" clearable placeholder="请选择" @change="clickType">
          <el-option v-for="item in ruleTypeList" :value="item.baseValue" :key="item.value" :label="item.baseName"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        v-if="isAdmin"
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="任务具体ID"/>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="任务定义名称"
        width="150px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="任务类型"/>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        label="任务描述">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.description)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.description}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="owner"
        header-align="center"
        align="center"
        label="任务归属"/>
      <el-table-column
        prop="user"
        header-align="center"
        align="center"
        label="任务使用者"
        width="150px"/>
      <el-table-column
        prop="ownerApp"
        header-align="center"
        align="center"
        label="所属系统"/>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.remark)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.remark}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small" >启用</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username ) || scope.row.authOwner === userid || scope.row.authOwner === username ? '修改' : '查看'" placement="top">
            <el-button type="primary" size="mini" :icon="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username ? 'el-icon-edit' : 'el-icon-share'" circle @click="addOrUpdateHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启用" placement="top" v-if="scope.row.status === 0 && (!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username)" >
            <el-button type="success" size="mini" icon="el-icon-open" circle @click="actionOpen(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="禁用" placement="top" v-else-if="scope.row.status !== 0 && (!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username)" >
            <el-button type="warning" size="mini" icon="el-icon-turn-off"  circle @click="storpOff(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner === username" @click="deleteHandle(scope.row.id)">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top"  v-if="!scope.row.authOwner || isAdmin || scope.row.authOwner === userid || scope.row.authOwner === username">
            <el-button type="warning" size="mini" icon="el-icon-connection" circle @click="taskPermission(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="清理缓存" placement="top"  v-if="!scope.row.authOwner || isAdmin || scope.row.authOwner === userid || scope.row.authOwner ===username" @click="exitCache(scope.row.id)">
              <el-button type="info" size="mini" icon="el-icon-document-delete" circle @click="taskPermission(scope.row)"></el-button>
          </el-tooltip>
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
     <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" :submitDataApis= "submitDataApis" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>

<script>
  import AddOrUpdate from './metadata-add-or-update'
  import { beeTaskList, deleteBeeTask, getBeeTaskTypeList, updateStatus, updateBeeTaskDefEhcache } from '@/api/workerBee/metadata'
  import { updateBeeTaskAuth, updateBeeTaskAuths } from '@/api/commom/assignPermission'
  import AssignPermission from '../../components/permission/assign-permission'
  export default {
    data () {
      return {
        sacherName: '',
        sacherId: '',
        sacherType: '',
        ruleTypeList: [],
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        newList: [],
        dataListSelections: [],
        visible: false,
        submitDataApi: updateBeeTaskAuth,
        submitDataApis: updateBeeTaskAuths,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        isAdmin: sessionStorage.getItem('username') === 'admin'
      }
    },
    components: {
      AddOrUpdate,
      AssignPermission
    },
    activated () {
      this.getDataList()
      getBeeTaskTypeList().then(({data}) => {
        if (data && data.status === 0) {
          this.ruleTypeList = data.data
        }
      })
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        const dataBody = {
          'name': this.sacherName,
          'id': this.sacherId,
          'type': this.sacherType,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        beeTaskList(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.newList = []
            this.dataList = data.list
            this.totalPage = data.totalCount
            var arrList = []
            for (let i = 0, length = this.dataList.length; i < length; i++) {
              arrList.push(this.dataList[i].beeTaskDef)
              this.newList = arrList
            }
          } else {
            this.dataList = []
            this.newList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 选择类型
      clickType (value) {
        this.sacherType = value
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.sacherName = ''
        this.sacherId = ''
        this.sacherType = ''
        this.getDataList()
      },
      exitCache (id) {
          this.$confirm('确认要清理' + id + '的缓存吗', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              updateBeeTaskDefEhcache(id).then(({data}) => {
                  if (data && data.code === 0) {
                      this.$message.success(data.msg || '执行成功')
                  } else {
                      this.$message.error(data.msg || '执行失败')
                  }
                  this.getDataList()
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消'
              })
          })
      },
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          let canUpdate = true
          if (!this.isAdmin) {
            canUpdate = row ? !row.authOwner || row.authOtherList.includes(this.userid || this.username) || row.authOwner === this.userid || row.authOwner === this.username : true
          }
          this.$refs.addOrUpdate.init(row, canUpdate)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = {
            utcParam: [id]
          }
          deleteBeeTask(dataBody).then(({data}) => {
            if (data && data.status === 0) {
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
      },
      // 启动
      actionOpen (val) {
        console.log(val, 'id,staus')
  
        this.$confirm(`确定启用?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = {
            'id': val.id,
            'status': 1
          }
          updateStatus(dataBody).then(({data}) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        })
      },
      // 禁用
      storpOff (val) {
        this.$confirm(`确定禁用?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const dataBody = {
            'id': val.id,
            'status': 0
          }
          updateStatus(dataBody).then(({data}) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        })
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
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>
