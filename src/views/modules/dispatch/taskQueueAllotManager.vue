<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="任务名称" prop="taskId">
                <el-select v-model="dataForm.taskId" placeholder="任务名称" filterable clearable>
                    <el-option :label="item.taskName" :value="item.id" v-for="(item, index) in taskNameList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="队列名称" prop="queueId">
                <el-select v-model="dataForm.queueId" placeholder="队列名称" filterable clearable>
                    <el-option :label="item.queueName" :value="item.id" v-for="(item, index) in queueNameList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()">新增任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading">
            <el-table-column :show-overflow-tooltip="true" v-if="false"  prop="id" header-align="center" align="center" label="id"/>
          <el-table-column :show-overflow-tooltip="true" prop="taskName" header-align="center" align="center" label="任务名称" />
          <el-table-column :show-overflow-tooltip="true" prop="queueName" header-align="center" align="center" label="队列名称" />
            <el-table-column  header-align="center" align="center" width="200" fixed="right" label="操作" class="but">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="'编辑'" placement="top">
                  <el-button type="primary" size="mini" circle :icon="'el-icon-edit'"
                             @click="addOrUpdateHandle(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="'删除'" placement="top">
                  <el-button type="danger" size="mini" circle :icon="'el-icon-delete'"
                             @click="deleteHandle(scope.row.id)"></el-button>
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
      <taskQueueAllotManagerAddOrUpdate v-if="addOrUpdateVisible" ref="taskQueueAllotManagerAddOrUpdate" @refreshDataList="init"></taskQueueAllotManagerAddOrUpdate>
    </div>
</template>

<script>
import {
    getTrinoQueueNameList, queryTaskQueueAllotPage, getTaskNameList, deleteTaskQueueAllot
} from '@/api/dispatch/taskManag'
import taskQueueAllotManagerAddOrUpdate from './taskQueueAllotManager-add-or-update.vue'

export default {
    data() {
        return {
            visible: false,
            addOrUpdateVisible: false,
            pageNum: 1, // 当前页
            pageSize: 10, // 默认每页10条
            totalPage: 0,
            dataListLoading: false,
            dataForm: {
                taskId: '',
                queueId: ''
            },
            isButtonDisabled: false,
            queueNameList: [],
            taskNameList: [],
            dataList: []
        }
    },
    components: {
      taskQueueAllotManagerAddOrUpdate
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
          this.getTrinoQueueNameList()
          this.getTaskNameList()
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'taskId': this.dataForm.taskId,
                'queueId': this.dataForm.queueId
            }
            this.getList(dataBody)
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.init()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val
            this.init()
        },
        getTrinoQueueNameList () {
          getTrinoQueueNameList().then(({data}) => {
                this.queueNameList = data.data
            })
        },
        getTaskNameList () {
          getTaskNameList().then(({data}) => {
                this.taskNameList = data.data
            })
        },
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
        },
        // 列表接口
        getList (dataBody) {
            this.dataListLoading = true
            queryTaskQueueAllotPage(dataBody).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataListLoading = false
                    this.dataList = data.data.records
                    this.totalPage = data.data.total
                } else {
                    this.dataList = []
                    this.totalPage = 0
                    this.$message.error(data.msg)
                }
            })
        },
        addOrUpdateHandle(data) {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.taskQueueAllotManagerAddOrUpdate.init(data)
          })
        },
        // 删除
        deleteHandle (id) {
          this.$confirm(`确定删除操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const dataBody = id
            deleteTaskQueueAllot(dataBody).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.handleSearch()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        }
    }
}
</script>
<style scoped>
.el-button + .el-button {
    margin: 0 !important;
}

.toZhi {
    line-height: 36px;
    margin-right: 8px;
}

.goback {
    position: absolute;
    right: 50px;
    top: 20px;
    font-size: 18px;
    cursor: pointer;
}
.custom-button {
    border: none !important;
    float: left;  /* 将按钮浮动到左侧 */
    margin-right: 1px;  /* 可以根据需要调整按钮与左框之间的间距 */
}
</style>