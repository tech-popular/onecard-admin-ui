<template>
	<el-dialog  :title="dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form v-loading="dataLoading" label-width="100px" :model="dataForm"  :rules="baseRule" ref="dataForm">
      <el-form-item label="连接名称" prop="shortLinkName">
        <el-input v-model="dataForm.shortLinkName" placeholder="请输入短链名称" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="连接url" prop="shortLinkUrl">
        <el-input v-model="dataForm.shortLinkUrl" placeholder="请输入短链URL" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { fetchBindingShortLink, saveBindingShortLinkInfo, updateBindingShortLinkInfo } from '@/api/dataAnalysis/bindingShortLink'
export default {
  data () {
    return {
      visible: false,
      dataLoading: false,
      dataForm: {
        id: '',
        shortLinkName: '',
        shortLinkUrl: '',
        enable: 1
      },
      baseRule: { // 基本信息校验规则
        shortLinkName: [
          { required: true, message: '请输入短链名称', trigger: 'input' }
        ],
        shortLinkUrl: [
          { required: true, message: '请输入短链URL', trigger: 'input' }
        ]
      }
    }
  },
  methods: {
    init (row) {
      this.visible = true
      if (row) {
        this.dataLoading = true
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {
      fetchBindingShortLink(row.id).then(res => {
        if (res.data.status === '1') {
          this.dataForm.id = res.data.data.id
          this.dataForm.shortLinkName = res.data.data.shortLinkName
          this.dataForm.shortLinkUrl = res.data.data.shortLinkUrl
          this.dataForm.enable = res.data.data.enable
        }
        this.dataLoading = false
      })
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.dataForm.id,
            shortLinkName: this.dataForm.shortLinkName,
            shortLinkUrl: this.dataForm.shortLinkUrl,
            enable: this.dataForm.enable
          }
          if (!this.dataForm.id) {
            saveBindingShortLinkInfo(params).then(({data}) => {
                if (data && data.status === '1') {
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
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
            updateBindingShortLinkInfo(params).then(({data}) => {
                if (data && data.status === '1') {
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
          }
        })
    }
  }
}
</script>