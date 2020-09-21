<template>
  <el-dialog :title="title"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules">
      <el-form-item prop="rate" label="所占比率">
        <!-- <el-select v-model="dataForm.rate" placeholder="请选择所占比率" style="width: 300px">
          <el-option v-for="item in flowData" :key="item" :value="item" :label="item + '%'"></el-option>
        </el-select> -->
        <el-input-number placeholder="请选择所占比率" :min="0" :max="100" v-model="dataForm.rate" style="width: 200px">
        </el-input-number>&nbsp;%
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
      title: '',
      visible: false,
      dataForm: {
        rate: 0
      },
      dataRules: {
        rate: [
          { required: true, message: '请选择所占比率', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (link, type) {
      this.visible = true
      this.from = link.data.from
      this.to = link.data.to
      this.title = type === 'hash' ? '按HASH分流' : '按百分比分流'
      if (link.data.data) {
        this.dataForm = link.data.data.configItems
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, from: this.from, to: this.to } })
          this.$parent.multiBranchRateVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.multiBranchRateVisible = false
    }
  }
}
</script>
