<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="dictId">
      <el-input v-model="dataForm.dictId" placeholder="" ></el-input>
    </el-form-item>
    <el-form-item label="数据值" prop="value">
      <el-input v-model="dataForm.value" placeholder="数据值"></el-input>
    </el-form-item>
    <el-form-item label="标签名" prop="label">
      <el-input v-model="dataForm.label" placeholder="标签名"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="dataForm.description" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item label="排序（升序）" prop="sort">
      <el-input v-model="dataForm.sort" placeholder="排序（升序）"></el-input>
    </el-form-item>
    <el-form-item label="备注信息" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
    </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
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
          id: 0,
          dictId: '',
          value: '',
          label: '',
          description: '',
          sort: '',
          createTime: '',
          updateTime: '',
          remarks: '',
          enable: '',
          tenantId: '',
          key: ''
        },
        dataRule: {
          dictId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '数据值不能为空', trigger: 'blur' }
          ],
          label: [
            { required: true, message: '标签名不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序（升序）不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (key, id) {
        this.dataForm.id = id || 0
        this.dataForm.key = key || 0
        this.dataForm.dictId = key
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/sysdictitem/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                // this.dataForm.dictId = data.sysDictItem.dictId
                this.dataForm.value = data.sysDictItem.value
                this.dataForm.label = data.sysDictItem.label
                this.dataForm.description = data.sysDictItem.description
                this.dataForm.sort = data.sysDictItem.sort
                this.dataForm.createTime = data.sysDictItem.createTime
                this.dataForm.updateTime = data.sysDictItem.updateTime
                this.dataForm.remarks = data.sysDictItem.remarks
                this.dataForm.enable = data.sysDictItem.enable
                this.dataForm.tenantId = data.sysDictItem.tenantId
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
              url: this.$http.adornUrl(`/sys/sysdictitem/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dictId': this.dataForm.dictId,
                'value': this.dataForm.value,
                'label': this.dataForm.label,
                'description': this.dataForm.description,
                'sort': this.dataForm.sort,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'remarks': this.dataForm.remarks,
                'enable': this.dataForm.enable,
                'tenantId': this.dataForm.tenantId
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
