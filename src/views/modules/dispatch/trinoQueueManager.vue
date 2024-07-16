<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="队列名称" prop="queueName">
                <el-select v-model="dataForm.queueName" placeholder="队列名称" filterable>
                    <el-option :label="item.id" :value="item.queueName" v-for="(item, index) in queueNameList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()">新增任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading">
            <el-table-column :show-overflow-tooltip="true" prop="id" header-align="center" align="center" label="id"/>
            <el-table-column :show-overflow-tooltip="true" prop="queueName" header-align="center" align="center" label="队列名称" />
            <el-table-column :show-overflow-tooltip="true" prop="description" header-align="center" align="center" label="队列描述" />
            <el-table-column :show-overflow-tooltip="true" prop="status" header-align="center" align="center" label="队列状态" >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" type="success">有效
                </el-tag>
                <el-tag v-else-if="scope.row.status === 0" type="danger">无效
                </el-tag>
                <el-tag v-else-if="scope.row.status === -1" type="danger">-</el-tag>
              </template>
            </el-table-column>
            <el-table-column  header-align="center" align="center" width="300" fixed="right" label="操作" class="but">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="'编辑任务'" placement="top">
                  <el-button type="primary" size="mini" circle :icon="'el-icon-edit'"
                             @click="addOrUpdateHandle(scope.row.id)"></el-button>
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
      <trinoQueueManagerAddOrUpdate v-if="addOrUpdateVisible" ref="trinoQueueManagerAddOrUpdate" @refreshDataList="init"></trinoQueueManagerAddOrUpdate>
    </div>
</template>

<script>
import {
    getTrinoQueueNameList, queryTrinoQueuePage
} from '@/api/dispatch/taskManag'
import trinoQueueManagerAddOrUpdate from './trinoQueueManager-add-or-update.vue'

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
               queueName: ''
            },
            isButtonDisabled: false,
            queueNameList: [],
            dataList: []
        }
    },
    components: {
      trinoQueueManagerAddOrUpdate

    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
          this.getTrinoQueueNameList()
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'queueName': this.dataForm.queueName
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
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
        },
        // 列表接口
        getList (dataBody) {
            this.dataListLoading = true
            queryTrinoQueuePage(dataBody).then(({data}) => {
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
            this.$refs.trinoQueueManagerAddOrUpdate.init(data)
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