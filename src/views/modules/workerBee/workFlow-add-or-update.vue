<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
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
    <el-form-item label="返回结果" prop="outputParameters">
      <el-input v-model="dataForm.outputParameters" placeholder="返回结果"/>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="dataForm.description" placeholder="描述"/>
    </el-form-item>
     <el-form-item label="创建人姓名">
      <el-input v-model="dataForm.createdBy" placeholder="创建人姓名"/>
    </el-form-item>
    <el-form-item label="归属系统">
      <el-input v-model="dataForm.ownerApp" placeholder="归属系统"/>
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
    <!-- <el-form-item label="Tasks">
      <el-input v-model="dataForm.tasks" placeholder="Tasks"/>
    </el-form-item> -->
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveWorkFlow, getUpdateWorkFlow } from '@/api/workerBee/workFlow'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
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
          // tasks: '',
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
          outputParameters: [
            { required: true, message: '返回结果不能为空', trigger: 'blur' }
          ]
        },
        updateId: ''
      }
    },
    components: {
  
    },
    methods: {
      init (id) {
        this.updateId = id
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            const dataBody = id
            const updateIds = this.updateId
            getUpdateWorkFlow(dataBody, updateIds).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.beeWorkFlowVo.name
                this.dataForm.owner = data.beeWorkFlowVo.owner
                this.dataForm.user = data.beeWorkFlowVo.user
                this.dataForm.inputParameters = data.beeWorkFlowVo.inputParameters
                this.dataForm.description = data.beeWorkFlowVo.description
                this.dataForm.createdBy = data.beeWorkFlowVo.createdBy
                this.dataForm.outputParameters = data.beeWorkFlowVo.outputParameters
                this.dataForm.ownerApp = data.beeWorkFlowVo.ownerApp
                this.dataForm.restartable = data.beeWorkFlowVo.restartable
                this.dataForm.schemaVersion = data.beeWorkFlowVo.schemaVersion
                // this.dataForm.tasks = data.beeWorkFlowVo.tasks
                this.dataForm.version = data.beeWorkFlowVo.version
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            const dataUpdateId = this.updateId
            saveWorkFlow(dataBody, dataUpdateId).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000,
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
      },
      datano () {
        this.visible = false
      }
    }
  }
</script>
