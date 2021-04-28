<template>
	<el-dialog
	width="50%"
	:visible="visible"
  title="模板编辑"
  :append-to-body="true"
  @close="closed"
	>
	 <el-form label-width="80px" :model="baseForm" :rules="baseRule" ref="baseForm">
     <el-form-item label="模板" prop="templateId" >
       <el-select
         v-model="baseForm.templateId"
         placeholder="请选择"
       >
          <el-option
            v-for="item in templateIdList"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
       </el-select>
     </el-form-item>
     <el-form-item label="渠道" prop="channelId" >
       <el-select
         v-model="baseForm.channelId"
         placeholder="请选择"
       >
          <el-option
            v-for="item in channelIdList"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
       </el-select>
     </el-form-item>
      <el-form-item label="签名" prop="signatureId" >
       <el-select
         v-model="baseForm.signatureId"
         placeholder="请选择"
       >
          <el-option
            v-for="item in signatureIdList"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
       </el-select>
     </el-form-item>
   </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"  @click="dataFormSubmit()">确定</el-button>
    </span>
	</el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      baseForm: {
        templateId: '',
        channelId: '',
        signatureId: ''
      },
      templateIdList: [],
      channelIdList: [],
      signatureIdList: [],
      baseRule: {
        templateId: [
          { required: true, message: '请选择模板', trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        signatureId: [
          { required: true, message: '请选择签名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    dataFormSubmit () {
      this.visible = false
      console.log('visible: ', this.visible)
    },
    closed () {
      this.visible = false
    }
  }
}
</script>