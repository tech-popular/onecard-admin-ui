<template>
  <el-dialog
    :title="!!id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    width="800px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
      <el-form-item label="系统名称" prop="projectSystemName">
        <el-input v-model.trim="dataForm.projectSystemName" placeholder="系统名称" />
      </el-form-item>
      <el-form-item label="系统状态" prop="projectDisable">
        <el-radio-group v-model="dataForm.projectDisable">
          <el-radio :label="0">有效</el-radio>
          <el-radio :label="1">无效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="describe">
        <el-input type="textarea" v-model="dataForm.describe" placeholder="备注" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, info, update } from '@/api/dispatch/systemManag'
export default {
  data () {
    return {
      visible: false,
      id: '',
      dataForm: {
        projectSystemName: '',
        projectDisable: 0,
        describe: ''
      },
      dataRule: {
        projectSystemName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' }
        ],
        projectDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.dataForm = {
        projectSystemName: '',
        projectDisable: 0,
        describe: ''
      }
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          info(this.id).then(({data}) => {
            this.dataForm = data.data
          })
        }
        this.$refs.dataForm.resetFields()
      })
    },
    handleCancel () {
      this.visible = false
      this.dataForm = {}
      this.id = ''
    },
    // 提交
    handleSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let url = update
          let params = this.dataForm
          if (!this.id) {
            url = save
            params.createUser = this.userName
          }
          url(params).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.dataForm = {}
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
