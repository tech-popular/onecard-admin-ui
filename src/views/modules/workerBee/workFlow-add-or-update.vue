<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="工作流任务" prop="region">
      <el-select v-model="dataForm.region" placeholder="请选择工作流任务" prop="name" style="width:100%">
        <el-option label="任务一" value="shanghai"></el-option>
        <el-option label="任务二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="工作流名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="工作流名称"/>
    </el-form-item>
     <el-form-item label="拥有者" prop="owner">
      <el-input v-model="dataForm.owner" placeholder="拥有者"/>
    </el-form-item>
    <el-form-item label="使用者" prop="user">
      <el-input v-model="dataForm.user" placeholder="使用者"/>
    </el-form-item>
    <el-form-item label="工作流入参" prop="inputParameters">
      <el-input v-model="dataForm.inputParameters" placeholder="工作流入参"/>
    </el-form-item>
    <el-form-item label="返回结果" prop="description">
      <el-input v-model="dataForm.outputParameters" placeholder="返回结果"/>
    </el-form-item>
     <el-form-item label="创建人姓名">
      <el-input v-model="dataForm.createdBy" placeholder="创建人姓名"/>
    </el-form-item>
    <el-form-item label="归属系统">
      <el-input v-model="dataForm.ownerApp"/>
    </el-form-item>
    <el-form-item label="是否重试">
      <el-radio-group v-model="dataForm.restartable">
          <el-radio :label="0">不重试</el-radio>
          <el-radio :label="1">重试</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="版本">
      <el-input v-model="dataForm.version" placeholder="版本"/>
    </el-form-item>
     <!-- <el-form-item label="什么版本">
      <el-input v-model="dataForm.schemaVersion" placeholder="什么版本"/>
    </el-form-item> -->
    <!-- <el-form-item label="返回结果">
      <el-input v-model="dataForm.tasks" placeholder="返回结果"/>
    </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          region: '',
          name: '',
          owner: '',
          user: '',
          inputParameters: '',
          description: '',
          createdBy: '',
          outputParameters: '',
          ownerApp: '',
          restartable: 0,
          schemaVersion: 0,
          tasks: '',
          version: ''

        },
        dataRule: {
          name: [
            { required: true, message: '工作流名称不能为空', trigger: 'blur' }
          ],
          owner: [
            { required: true, message: '拥有者不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '使用者不能为空', trigger: 'blur' }
          ],
          inputParameters: [
            { required: true, message: '工作流入参不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '返回结果不能为空', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择工作流任务', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
  
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canaryproject/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.canaryProject.name
                this.dataForm.type = data.canaryProject.type
                this.dataForm.description = data.canaryProject.description
                this.dataForm.enable = data.canaryProject.enable
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/canary/canaryproject/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'description': this.dataForm.description,
                'enable': this.dataForm.enable
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
