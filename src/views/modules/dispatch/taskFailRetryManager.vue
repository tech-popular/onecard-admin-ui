<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="所属系统" prop="projectId">
                <el-select v-model="dataForm.projectId" placeholder="所属系统" filterable>
                    <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch()">查询</el-button>
                <el-button type="primary" @click="executeRetryFailedTask()">重试当日失败任务</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border
                  v-loading="dataListLoading">
            <el-table-column :show-overflow-tooltip="true" prop="id" header-align="center" align="center" label="批次id"/>
            <el-table-column :show-overflow-tooltip="true" prop="processDefinitionCode" header-align="center" align="center" label="工作流Id" />
            <el-table-column :show-overflow-tooltip="true" prop="name" header-align="center" align="center" label="批次名称" />
            <el-table-column :show-overflow-tooltip="true" prop="state" header-align="center" align="center" label="工作流状态" />
            <el-table-column :show-overflow-tooltip="true" prop="startTime" header-align="center" align="center" label="开始时间" />
            <el-table-column :show-overflow-tooltip="true" prop="endTime" header-align="center" align="center" label="结束时间" />
            <el-table-column :show-overflow-tooltip="true" prop="host" header-align="center" align="center" label="执行机" />
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"/>
    </div>
</template>

<script>
import {
    executeRetryFailedTask, projectAll, flowInstanceList
} from '@/api/dispatch/taskManag'

export default {
    data() {
        return {
            visible: false,
            pageNum: 1, // 当前页
            pageSize: 10, // 默认每页10条
            totalPage: 0,
            dataListLoading: false,
            dataForm: {},
            isButtonDisabled: false,
            allSystemList: [],
            dataList: []
        }
    },
    components: {

    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const dataBody = {
                'pageNum': this.pageNum,
                'pageSize': this.pageSize,
                'projectCode': this.dataForm.projectCode
            }
            this.getList(dataBody)
            this.getAllSystem()
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
        getAllSystem () {
            projectAll().then(({data}) => {
                this.allSystemList = data.data
            })
        },
        // 查询
        handleSearch() {
            this.pageNum = 1
            this.init()
        },
        executeRetryFailedTask() {
            if (!this.dataForm.projectCode) {
                this.$message({
                    message: '请选择重试哪个项目的失败任务',
                    type: 'warning'
                }).then(() => {
                    // 禁用按钮
                    this.isButtonDisabled = true
                    executeRetryFailedTask(this.dataForm.projectId).then(({data}) => {
                        if (data && data.code === 0) {
                            this.$message.success(data.msg || '执行成功')
                        } else {
                            this.$message.error(data.msg || '执行失败')
                        }
                    }).catch(() => {
                        this.$message.error('请求失败')
                    }).finally(() => {
                        // 启用按钮
                        this.isButtonDisabled = false
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        },
        // 列表接口
        getList (dataBody) {
            this.dataListLoading = true
            flowInstanceList(dataBody).then(({data}) => {
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