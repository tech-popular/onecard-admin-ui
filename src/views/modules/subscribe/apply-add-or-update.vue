<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
    <el-form-item label="发送主题" prop="name">
      <el-input v-model="dataForm.name" placeholder="用户组名称"></el-input>
    </el-form-item>
		<el-form-item label="报表选择" prop="reportId">
      <el-select v-model="dataForm.reportId"  placeholder="请选择" style="width:100%" filterable>
        <el-option
          v-for="item in reportIdList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="允许接收时间段" prop="periodTime">
       <el-time-picker
					is-range
					style="width:100%"
					format="HH:mm：ss"
					v-model="dataForm.periodTime"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					placeholder="选择时间范围">
  		</el-time-picker>
    </el-form-item>
    <el-form-item label="通知方式" prop="InformType">
      <el-radio-group v-model="dataForm.InformType">
        <el-radio :label="0">邮件</el-radio>
        <el-radio :label="1">钉钉消息</el-radio>
      </el-radio-group>
    </el-form-item>
		 <el-form-item label="接收人" prop="recipient">
      <el-select v-model="dataForm.recipient" multiple placeholder="请选择" style="width:100%" filterable>
        <el-option
          v-for="item in recipientList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit()">立即申请</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        InformType: 1,
        reportId: '',
        periodTime: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
        recipient: ''
      },
      reportIdList: [],
      recipientList: [],
      dataRule: {
        name: [{
          required: true,
          message: '订阅主题不能为空',
          trigger: 'blur'
        }],
        periodTime: [{
          required: true,
          message: '请选择接收时间段',
          trigger: 'blur'
        }],
        reportId: [{
          required: true,
          message: '请选择报表',
          trigger: 'blur'
        }],
        recipient: [{
          required: true,
          message: '请选择接收人',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        }
      })
    }
  }
}
</script>
