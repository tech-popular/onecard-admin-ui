<template>
  <el-dialog title='查看日志' :fullscreen="isFullscreen" :show-close="false" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" class="view-log">
  <div slot="title" class="view-log-title">
    <div>查看日志</div>
    <div>
      <el-button size="small" @click="isFullscreen = !isFullscreen"> {{isFullscreen ? '缩小' : '放大'}}</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
    </div>
  </div>
  <div style="width:100%; height:600px; overflow:auto; padding-left:15px; word-wrap:break-word; word-break: normal; background:white;color:black;" v-html="logText">
  </div>
    <!-- <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
    </div>	  --> 
	</el-dialog>
</template>
<script>
import { taskBatchLog } from '@/api/dispatch/taskManag'
export default{
  data () {
    return {
      visible: false,
      isFullscreen: false,
      logText: ''
    }
  },
  methods: {
    init (dolphinInstanceId) {
      this.isFullscreen = false
      this.visible = true
      this.logText = ''
      taskBatchLog(dolphinInstanceId).then(({data}) => {
        if (data.code === 0) {
          this.logText = data.data && data.data.replace(/\n/g, '<br>')
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style>
 .view-log-title{
  display:flex;
  justify-content: space-between;
  align-items: center;
  /* padding-right:50px; */
  font-size: 16px;
}
.view-log-title .el-dialog__headerbtn {
  font-size: 20px;
}
</style>