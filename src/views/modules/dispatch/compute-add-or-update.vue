<template>
  <el-dialog
    :title="dataFormValue ? '查看' : dataForm.id ? '修改' : '新增/编辑计算任务'"
    :modal-append-to-body="false"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="23%">
      <el-form-item label="任务名称" prop="autoCommitIntervalMs">
        <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间" />
      </el-form-item>
      <el-form-item label="任务ID" prop="autoCommitIntervalMs">
        <el-input v-model="dataForm.autoCommitIntervalMs" placeholder="超时时间" disabled />
      </el-form-item>
      <el-form-item label="所属属性" prop="autoOffsetReset">
        <el-select v-model="dataForm.autoOffsetReset" placeholder="请选择偏移量重置机制">
          <el-option label="earliest" value="earliest"></el-option>
          <el-option label="latest" value="latest"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="bootstrapServers">
        <el-input type="textarea" v-model="dataForm.bootstrapServers" placeholder="kafka地址" />
      </el-form-item>
      <div style="margin-bottom: 10px; text-align: right;">
        <el-button type="primary">代码连贯模式</el-button>
      </div>
      <div style="border: 1px #cccccc dashed; padding:10px">
        <el-form-item label="作业序号" prop="consumerName">
          <el-input v-model="dataForm.consumerName" placeholder="消费者名字" />
        </el-form-item>
        <el-form-item label="所属属性" prop="autoOffsetReset">
          <el-select v-model="dataForm.autoOffsetReset" placeholder="请选择偏移量重置机制">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
      </div>
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
      dataRule: {}
    }
  },
  components: {},
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
          infoBeeTask(dataBody).then(({ data }) => { })
        }
      })
    },
    // 提交
    dataFormSubmit (form) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const dataBody = this.dataForm
          const dataUpdateId = this.dataForm.id
          saveorupt(dataBody, dataUpdateId).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功"',
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
