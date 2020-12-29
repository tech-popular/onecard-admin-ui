<template>
  <el-dialog title='Yarn日志查询' :fullscreen="isFullscreen"  :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" class="yarn-log">
  <!-- <div slot="title" class="view-log-title">
    <div>查看Yarn日志</div> -->
    <!-- <div>
      <el-button size="small" @click="isFullscreen = !isFullscreen"> {{isFullscreen ? '缩小' : '放大'}}</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
    </div> -->
  <!-- </div> -->
  <el-form :model="dataForm" ref="dataForm">
		<el-form-item label="applicationId ：" label-width="150px">
      <el-input placeholder="请输入applicationId" v-model="dataForm.applicationId" class="yarn-log-input"></el-input>
			<el-button @click="handleSearch()">查询</el-button>
		</el-form-item>
		<el-form-item>
			<div v-if="logTextisible" style="width:100%; height:600px; overflow:auto; padding-left:15px; word-wrap:break-word; word-break: normal; background:black;color:#fff;" v-html="logText">
      </div>
		</el-form-item>
	</el-form>
  <!-- <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
    </div>	  --> 
	</el-dialog>
</template>
<script>
import { taskBatchYarnLog } from '@/api/dispatch/taskManag'
export default{
  data () {
    return {
      visible: false,
      isFullscreen: false,
      logTextisible: false,
      logText: '',
      dataForm: {
        applicationId: ''
      }
    }
  },
  methods: {
    init () {
      this.isFullscreen = false
      this.logTextisible = false
      this.visible = true
      this.logText = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    handleSearch () { // 提交查询
      if (!this.dataForm.applicationId) {
        this.$message.error('请输入applicationId后查询')
      } else {
        taskBatchYarnLog(this.dataForm.applicationId).then(({ data }) => {
          if (data.code === 0) {
            this.$message({
              message: '执行成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.logTextisible = true
                 this.logText = data.data && data.data.replace(/\n/g, '<br>')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
}
</script>
<style>
.yarn-log-input {
	width: 300px !important;
}
</style>