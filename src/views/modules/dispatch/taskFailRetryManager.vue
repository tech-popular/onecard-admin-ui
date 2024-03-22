<template>
    <div>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
            <el-form-item label="所属系统" prop="projectId">
                <el-select v-model="dataForm.projectId" placeholder="所属系统" filterable>
                    <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="executeRetryFailedTask()">恢复日失败任务</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    executeRetryFailedTask, projectAll
} from '@/api/dispatch/taskManag'

export default {
    data() {
        return {
            visible: false,
            dataForm: {},
            allSystemList: []
        }
    },
    components: {
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getAllSystem()
        },
        getAllSystem () {
            projectAll().then(({data}) => {
                this.allSystemList = data.data
            })
        },
        // 查询
        handleSearch() {
        },
        executeRetryFailedTask () {
            executeRetryFailedTask(this.dataForm.projectId).then(({data}) => {
                if (data && data.code === 0) {
                    this.$message.success(data.msg || '执行成功')
                } else {
                    this.$message.error(data.msg || '执行失败')
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