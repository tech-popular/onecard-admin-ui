<template>
  <el-dialog title='查看' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
   <el-form label-width="140px" label-position="right" v-model="dataForm" ref="dataForm">
		 <el-form-item label="事件ID：">
			 <el-input v-model="dataForm.elementId" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
		 <el-form-item label="事件显示中文名：">
			 <el-input v-model="dataForm.eventBuildName" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
		<el-form-item label="所属渠道：">
			 <el-input v-model="dataForm.channelCode" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
		 	<el-form-item label="事件类型">
			 <el-input v-model="dataForm.eventType" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
		 	<el-form-item label="创建时间">
	      <el-input v-model="dataForm.createTime" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
		 <el-form-item label="事件状态">
			 	 <el-input v-model="dataForm.enable" v-bind:readonly='readonly' placeholder=""></el-input>
		 </el-form-item>
	 </el-form>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
    </div>	 
	</el-dialog>
</template>
<script>
import { infoEventManage } from '@/api/dataAnalysis/eventManage'
import { deepClone } from '../dataAnalysisUtils/utils'
export default{
  data () {
    return {
      visible: false,
      dataForm: {
        elementId: '',
        elementName: '',
        eventType: '',
        createTime: '',
        channelCode: '',
        enable: ''
      },
      readonly: true // 不可编辑
    }
  },
  methods: {
    init (row) {
      this.visible = true
      infoEventManage(row.id).then(({data}) => {
        if (data && data.status === '1') {
          this.dataForm = deepClone(data.data)
          this.dataForm.enable = this.dataForm.enable ? '有效' : '无效'
        }
      })
    }
  }
}
</script>