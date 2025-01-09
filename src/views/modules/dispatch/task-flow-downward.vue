<template>
    <el-dialog title="任务周期配置" :close-on-click-modal="false" :visible.sync="visible" width="600px" >
        <el-form label-width="100px" :model="dataForm"  ref="dataForm"
                 class="base-form">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model.trim="dataForm.taskName" placeholder="任务名称" clearable/>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
            <el-button @click="visible = false">关闭</el-button>
            <el-button type="primary" @click="submitData()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {startFlowInstanceDownward} from '@/api/dispatch/taskManag'
import {deepClone} from '@/utils'

export default {
    data() {
        return {
            visible: false,
            canUpdate: true,
            dataForm: {
              taskName: ''
            }
        }
    },
    methods: {
        init(data, canUpdate) {
            this.canUpdate = canUpdate
            this.visible = true
            this.dispatchTimeForm = deepClone(this.tempForm)
            this.dataAssembly()
            this.disTimeTurnOff('MINUTE')
            this.getTaskPeriodInfo(data)
            this.localDolphinProcessId = data
        },
        drawerClose () { // 关闭抽屉弹窗
            this.visible = false
            this.$parent.computAddOrUpdateVisible = false
        },
        submitData() {
            this.$confirm('是否确认执行' + this.dataForm.taskName + '以及下游任务', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              startFlowInstanceDownward(this.dataForm.taskName).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message.success(data.msg || '执行成功')
                } else {
                  this.$message.error(data.msg || '执行失败')
                }
                this.init()
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
    }
}
</script>