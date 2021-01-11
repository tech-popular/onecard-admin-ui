<template>
  <div>
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule">
      <el-form-item label="工作流名称">
        <el-input v-model.trim="dataForm.workerBee" placeholder="工作流名称"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item label="工作流编号" :rules="dataRule.id" prop="id">
        <el-input v-model.trim="dataForm.id" placeholder="工作流ID"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item label="工作流CODE">
        <el-input v-model.trim="dataForm.flowCode" placeholder="工作流CODE"
        onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/\s/g,''))" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" v-if="isAdmin" @click="multiTaskPermission()">批量授权</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border 
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
      <el-table-column prop="id" header-align="center" align="center" label="工作流编号"/>
      <el-table-column prop="name" header-align="center" align="center" label="工作流名称">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="owner" header-align="center" align="center" label="拥有者"/>
      <el-table-column prop="user" header-align="center" align="center" label="使用者"/>
      <el-table-column prop="createdBy" header-align="center" align="center" label="创建人"/>
      <!-- <el-table-column prop="flowCode" header-align="center" align="center" label="工作流编码"/> -->
      <el-table-column prop="flowCode" header-align="center" align="center" label="工作流code"/>
      <el-table-column prop="inputParameters" header-align="center" align="center" label="工作流入参">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.inputParameters)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.inputParameters}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="描述">
        <template slot-scope="scope">
          <el-tooltip effect="dark" placement="top">
            <div v-html="toBreak(scope.row.description)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.description}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="200" label="操作" class="but">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('cash:instmanage:update')" type="text" @click="clickSketchMap(scope.row)">查看工作流</el-button> -->
          <el-tooltip class="item" effect="dark" :content="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner ===username ? '修改' : '查看'" placement="top">
            <el-button type="primary" size="mini" circle :icon="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid ||username) || scope.row.authOwner === userid || scope.row.authOwner ===username ? 'el-icon-edit' : 'el-icon-share'" @click="addOrUpdateHandle(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看工作流" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="clickSketchMap(scope.row.id,scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="任务关系" placement="top">
            <el-button type="warning" size="mini" icon="el-icon-sort" circle @click="clickFlowEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="!scope.row.authOwner || isAdmin || scope.row.authOtherList.includes(userid || username) || scope.row.authOwner === userid || scope.row.authOwner ===username" @click="deleteHandle(scope.row.id)">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteddialog(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top"  v-if="!scope.row.authOwner || isAdmin || scope.row.authOwner === userid || scope.row.authOwner ===username">
            <el-button type="warning" size="mini" icon="el-icon-connection" circle @click="taskPermission(scope.row)"></el-button>
          </el-tooltip>
          <!-- <el-button type="text" @click="clickFlowShow(scope.row.id)">2.0工作流</el-button> -->
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
    <!-- 弹窗查看示意图 -->
    <el-dialog
      title="工作流预览"
      @close="handleClosede"
      fullscreen
      style="max-height: 100vh"
      :show-close="false"
      :visible.sync="visible">
      <i class="el-icon-back goback" @click="visible = false">返回</i>
      <showFlow v-if="sketchMap" ref="showFlow" :dataAllList="dataAllList" :list="list" @refreshDataList="getDataList"/>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleted()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗查看示意图 -->
    <el-dialog
      title="2.0工作流预览"
      @close="handleClosede"
      fullscreen
      style="max-height: 100vh"
      :visible.sync="flowTaskFlowVisible">
      <flowTaskFlow v-if="flowTaskFlow"/>
    </el-dialog>
    <!-- 数据关系 -->
    <taskFlow v-if="visibleEdit" ref="taskFlow"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
    <!-- 授权 -->
    <assign-permission v-if="assignPermissionVisible" :submitDataApi= "submitDataApi" :submitDataApis= "submitDataApis" ref="assignPermission" @refreshDataList="getDataList"></assign-permission>
  </div>
</template>

<script>
  import showFlow from './workflowChart'
  import taskFlow from './taskFlow'
  import flowTaskFlow from './marketingDecision'
  import AddOrUpdate from './workFlow-add-or-update'
  import { workFlowList, deleteWorkFlow, workFlowShow } from '@/api/workerBee/workFlow'
  import { updateWorkflowAuth, updateWorkflowAuths } from '@/api/commom/assignPermission'
  import AssignPermission from '../../components/permission/assign-permission'
  export default {
    data () {
      return {
        visible: false,
        deleteVisible: false,
        visibleEdit: false,
        flowTaskFlowVisible: false,
        flowTaskFlow: false,
        dataForm: {
          workerBee: '',
          id: '',
          flowCode: ''
        },
        dataRule: {
          id: [
            { max: 9, message: '长度在 9 个字符' }
          ]
        },
        dataList: [],
        dataAllList: {},
        workerBee: '',
        list: '',
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        dataListLoading: false,
        sketchMap: false,
        addOrUpdateVisible: false,
        deletedId: '',
        submitDataApi: updateWorkflowAuth,
        submitDataApis: updateWorkflowAuths,
        assignPermissionVisible: false,
        userid: sessionStorage.getItem('id'),
        username: sessionStorage.getItem('username'),
        isAdmin: sessionStorage.getItem('username') === 'admin'
      }
    },
    components: {
      showFlow,
      taskFlow,
      AddOrUpdate,
      flowTaskFlow,
      AssignPermission
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            const dataBody = {
              'pageNum': this.pageNum,
              'pageSize': this.pageSize,
              'name': this.dataForm.workerBee,
              'id': this.dataForm.id,
              'flowCode': this.dataForm.flowCode
            }
            workFlowList(dataBody, false).then(({data}) => {
              if (data && data.message === 'success') {
                this.dataList = data.data.list
                this.totalPage = data.data.totalCount
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
  
      /** 查看示意图接口 */
      getDataFlowList () {
        const dataBody = this.workerBee
        workFlowShow(dataBody).then(({data}) => {
          if (data && data.status === 0) {
            this.sketchMap = true
            // this.visible = true
            this.dataAllList = data.data
          } else {
            return false
          }
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
      // 数据关系
      clickFlowEdit (row) {
        this.visibleEdit = true
        this.$store.commit('workFlow/setFlowId', row.id)
        this.$nextTick(() => {
          let canUpdate = true
          if (!this.isAdmin) {
            canUpdate = row ? !row.authOwner || row.authOtherList.includes(this.userid || this.username) || row.authOwner === this.userid || row.authOwner === this.username : true
          }
          this.$refs.taskFlow.init(row.id, canUpdate)
        })
      },
      // 删除弹窗获取值
      deleteddialog (value) {
        this.deletedId = value
        this.deleteVisible = true
      },
      // 删除
      deleted () {
        const dataBody = this.deletedId
        deleteWorkFlow(dataBody, false).then(({data}) => {
          if (data && data.message === 'success') {
            this.deleteVisible = false
            this.getDataList()
          }
        })
      },
      /** 查看示意图 */
      clickSketchMap (value, list) {
        this.visible = true
        this.list = list
        this.workerBee = value
        this.getDataFlowList()
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm.workerBee = ''
        this.dataForm.id = ''
        this.dataForm.flowCode = ''
        this.getDataList()
      },
      // 取消或关闭流程图弹窗
      handleClosede () {
        this.dataAllList = {}
        this.visible = false
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
      // 2.0工作流
      clickFlowShow () {
        this.flowTaskFlowVisible = true
        this.flowTaskFlow = true
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
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
  .toZhi {
    line-height: 36px;
    margin-right: 8px;
  }
  .goback{
    position: absolute;
    right: 50px;
    top:20px;
    font-size: 18px;
    cursor:pointer;
  }
</style>