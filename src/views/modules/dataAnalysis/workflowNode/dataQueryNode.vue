<template>
  <el-dialog title="分群节点"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataRules">
      <el-form-item prop="groupId" label="分群名称">
        <el-select v-model="dataForm.groupId" placeholder="请选择分群" style="width: 400px">
          <el-option v-for="(item, index) in custerList" :key="index" :value="item.value" :label="item.text"></el-option>
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
      channelList: [],
      custerList: [],
      dataForm: {
        groupId: ''
      },
      dataRules: {
        groupId: [
          { required: true, message: '请选择分群', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.key = data.key
      console.log(data)
      this.custerList = this.$parent.selectCuster
      if (data.data) {
        this.dataForm.groupId = data.data.configItems.groupId
      }
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let config = {
            configItems: this.dataForm
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key } })
          this.$parent.dataQueryNodeVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.dataQueryNodeVisible = false
    }
  }
}
</script>
