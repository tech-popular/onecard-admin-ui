<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="dataForm.type" placeholder="请选择">
        <el-option v-for="item in selectionTypes" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="占位符" prop="placeholder">
      <el-input v-model="dataForm.placeholder" placeholder="占位符"></el-input>
    </el-form-item>
    <el-form-item label="字段名" prop="columnName">
      <el-input v-model="dataForm.columnName" placeholder="字段名"></el-input>
    </el-form-item>
    <el-form-item label="标记" prop="mark">
      <el-input v-model="dataForm.mark" placeholder="标记"></el-input>
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
          chartId: '',
          // screenId: '',
          name: '',
          type: '',
          placeholder: '',
          columnName: '',
          mark: ''
        },
        selectionTypes: [],
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '选择项值不能为空', trigger: 'blur' }
          ],
          placeholder: [
            { required: true, message: '占位符不能为空', trigger: 'blur' }
          ],
          columnName: [
              { required: true, message: '字段名不能为空', trigger: 'blur' }
          ],
          mark: [
              { required: true, message: '标记不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (chartId, id) {
        this.dataForm.id = id || 0
        this.dataForm.chartId = chartId || 0
        this.visible = true
        // 下拉框选型
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['selection_type'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.selectionTypes = data.dicMap.selection_type
          }
        })
        this.$nextTick(() => {
          if (this.dataForm.id <= 0) {
            this.$refs['dataForm'].resetFields()
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/phoenix/phoenixselection/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.chartId = data.phoenixSelection.chartId
                // this.dataForm.screenId = data.phoenixSelection.screenId
                this.dataForm.name = data.phoenixSelection.name
                this.dataForm.type = data.phoenixSelection.type
                this.dataForm.placeholder = data.phoenixSelection.placeholder
                this.dataForm.columnName = data.phoenixSelection.columnName
                this.dataForm.mark = data.phoenixSelection.mark
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
              url: this.$http.adornUrl(`/phoenix/phoenixselection/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'chartId': this.dataForm.chartId,
                // 'screenId': this.dataForm.screenId,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'placeholder': this.dataForm.placeholder,
                'columnName': this.dataForm.columnName,
                'mark': this.dataForm.mark
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
