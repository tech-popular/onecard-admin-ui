<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
    <el-form-item label="自动提交超时时间(ms)" prop="autoCommitIntervalMs">
      <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间"/>
    </el-form-item>
    <el-form-item label="偏移量重置机制" prop="autoOffsetReset">
      <el-select v-model="dataForm.autoOffsetReset" placeholder="请选择偏移量重置机制">
        <el-option label="earliest" value="earliest"></el-option>
        <el-option label="latest" value="latest"></el-option>
      </el-select>
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
    <el-form-item label="是否自动提交">
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
  import { infoBeeTask, saveorupt } from '@/api/workerBee/kafka'
  export default {
    data () {
      var nullandnumber = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        if (!Number(value)) {
          callback(new Error('请输入数字类型'))
        }
        callback()
      }
      var nullkongge = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
      var nullkonggeselect = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请选择'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
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
          enableAutoCommit: true
        },
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          autoCommitIntervalMs: [
            { required: true, validator: nullandnumber, trigger: 'blur' }
          ],
          autoOffsetReset: [
            { required: true, validator: nullkonggeselect, trigger: 'blur' }
          ],
          bootstrapServers: [
            { required: true, validator: nullkongge, trigger: 'change' }
          ],
          consumerName: [
            { required: true, validator: nullkongge, trigger: 'change' }
          ],
          flowId: [
            { required: true, validator: nullandnumber, trigger: 'change' }
          ],
          groupId: [
            { required: true, validator: nullkongge, trigger: 'change' }
          ],
          topic: [
            { required: true, validator: nullkongge, trigger: 'change' }
          ],
          version: [
            { required: true, validator: nullandnumber, trigger: 'change' }
          ]
        }
      }
    },
    components: {
  
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            const dataBody = this.dataForm.id
            infoBeeTask(dataBody).then(({data}) => {
              this.dataForm.autoCommitIntervalMs = data.data.autoCommitIntervalMs
              this.dataForm.autoOffsetReset = data.data.autoOffsetReset
              this.dataForm.bootstrapServers = data.data.bootstrapServers
              this.dataForm.consumerName = data.data.consumerName
              this.dataForm.flowId = data.data.flowId
              this.dataForm.groupId = data.data.groupId
              this.dataForm.topic = data.data.topic
              this.dataForm.version = data.data.version
              this.dataForm.enableAutoCommit = JSON.parse(data.data.enableAutoCommit)
            })
          }
        })
      },
      // 弹窗状态
  
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const dataBody = this.dataForm
            const dataUpdateId = this.dataForm.id
            saveorupt(dataBody, dataUpdateId).then(({data}) => {
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
