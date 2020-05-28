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
      </el-form-item>
    </el-form>
    <el-table
      :data="newList" border
      v-loading="dataListLoading"
      style="width: 100%;">
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
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="启用" placement="top" v-if="scope.row.status === 0">
            <el-button type="success" size="mini" icon="el-icon-open" circle @click="actionOpen(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="禁用" placement="top" v-else>
            <el-button type="warning" size="mini" icon="el-icon-turn-off"  circle @click="storpOff(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteHandle(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
  import AddOrUpdate from './metadata-add-or-update'
  import { beeTaskList, deleteBeeTask, getBeeTaskTypeList, updateStatus } from '@/api/workerBee/metadata'
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
        visible: false
      }
    },
    components: {
      AddOrUpdate
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
</style>
