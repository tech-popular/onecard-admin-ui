<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="超时时间" prop="autoCommitIntervalMs">
      <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间"/>
    </el-form-item>
    <el-form-item label="偏移量重置机制" prop="autoOffsetReset">
      <el-input v-model="dataForm.autoOffsetReset" placeholder="偏移量重置机制"/>
    </el-form-item>
    <el-form-item label="kafka地址" prop="bootstrapServers">
      <el-input v-model="dataForm.bootstrapServers" placeholder="kafka地址"/>
    </el-form-item>
    <el-form-item label="消费者名字" prop="consumerName">
      <el-input v-model="dataForm.consumerName" placeholder="消费者名字"/>
    </el-form-item>
    <el-form-item label="工作流编号" prop="flowId">
      <el-input v-model="dataForm.flowId" placeholder="工作流编号"/>
    </el-form-item>
    <el-form-item label="分组名称" prop="groupId">
      <el-input v-model="dataForm.groupId" placeholder="分组名称"/>
    </el-form-item>
    <el-form-item label="topic名称" prop="topic">
      <el-input v-model="dataForm.topic" placeholder="topic名称"/>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号"/>
    </el-form-item>
    <el-form-item label="是否自动提交" prop="enableAutoCommit">
    <el-radio-group v-model="dataForm.enableAutoCommit">
      <el-radio :label="true">是</el-radio>
      <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    </el-form>
   
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          autoCommitIntervalMs: '',
          autoOffsetReset: '',
          bootstrapServers: '',
          consumerName: '',
          flowId: '',
          groupId: '',
          topic: '',
          version: '',
          ownerApp: '',
          enableAutoCommit: ''
        },
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          autoCommitIntervalMs: [
            { required: true, message: '超时时间不能为空', trigger: 'blur' }
          ],
          autoOffsetReset: [
            { required: true, message: '偏移量重置机制不能为空', trigger: 'blur' }
          ],
          bootstrapServers: [
            { required: true, message: 'kafka地址不能为空', trigger: 'change' }
          ],
          consumerName: [
            { required: true, message: '消费者名字不能为空', trigger: 'change' }
          ],
          flowId: [
            { required: true, message: '工作流编号不能为空', trigger: 'change' }
          ],
          groupId: [
            { required: true, message: '分组名称不能为空', trigger: 'change' }
          ],
          topic: [
            { required: true, message: 'topic名称不能为空', trigger: 'change' }
          ],
          version: [
            { required: true, message: '版本号不能为空', trigger: 'change' }
          ],
          enableAutoCommit: [
            { required: true, message: '是否自动提交不能为空', trigger: 'change' }
          ]
        },
        fatherData: {
          enable: true,
          enableCache: 1,
          parsTemplate: false
        }
      }
    },
    components: {
  
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          getBeeTaskTypeList().then(({data}) => {
            if (data && data.status === 0) {
              this.ruleTypeList = data.data
            }
          })
          if (id) {
            const dataBody = {
              utcParam: [id]
            }
            infoBeeTask(dataBody).then(({data}) => {
              if (data && data.status === 0) {
  
              }
            })
          }
        })
      },
      // 弹窗状态
  
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            beeTask(dataBody, `/bee/mkafka/${!this.dataForm.id ? 'add' : 'upd'}`).then(({data}) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$refs['dataForm'].resetFields()
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
