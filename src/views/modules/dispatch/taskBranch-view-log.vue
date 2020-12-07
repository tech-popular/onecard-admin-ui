<template>
  <el-dialog title='查看日志' :fullscreen="true" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
  <div style="width:100%; height:600px;overflow:auto;word-wrap:font-size:12px; break-word;word-break: normal;background:black;color:#fff;" v-html="logText">
  </div>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
    </div>	 
	</el-dialog>
</template>
<script>
import { taskBatchLog } from '@/api/dispatch/taskManag'
export default{
  data () {
    return {
      visible: false,
      logText: ''
    }
  },
  methods: {
    init (dolphinInstanceId) {
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