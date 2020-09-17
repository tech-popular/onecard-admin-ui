<template>
  <el-dialog title="入参"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRules">
      <el-form-item prop="inParam" label="入参">
        <el-select v-model="dataForm.inParam" placeholder="请选择入参" style="width: 300px">
          <el-option v-for="(item, index) in inparamData" :key="index" :value="item.value" :label="item.text"></el-option>
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
import { inparamsSelect } from '@/api/dataAnalysis/dataDecisionManage'
export default {
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      inparamData: [],
      dataForm: {
        inParam: ''
      },
      dataRules: {
        inParam: [
          { required: true, message: '请选择入参', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.key = data.key
      this.getInparamData()
      if (data.data) {
        this.dataForm.inParam = data.data.configItems.inParam
      }
      console.log(data)
    },
    getInparamData () {
      inparamsSelect().then(({data}) => {
        this.inparamData = data.data
      })
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.$parent.inparamsNodeVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.inparamsNodeVisible = false
    }
  }
}
</script>
