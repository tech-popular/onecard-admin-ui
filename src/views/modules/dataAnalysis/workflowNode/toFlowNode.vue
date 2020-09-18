<template>
  <el-dialog title="分流"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules">
      <el-form-item prop="flowType" label="分流方式">
        <el-select v-model="dataForm.flowType" placeholder="请选择分流方式" style="width: 300px">
          <el-option v-for="(item, index) in flowData" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      flowData: [
        {
          value: 'condition',
          text: '按条件分流'
        },
        {
          value: 'hash',
          text: '按HASH分流'
        },
        {
          value: 'rate',
          text: '按比率分流'
        }
      ],
      dataForm: {
        flowType: ''
      },
      dataRules: {
        flowType: [
          { required: true, message: '请选择分流方式', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.key = data.key
      if (data.data) {
        this.dataForm.flowType = data.data.configItems.flowType
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.$parent.toFlowNodeVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.toFlowNodeVisible = false
    }
  }
}
</script>
