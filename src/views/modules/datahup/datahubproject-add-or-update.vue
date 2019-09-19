<template>
  <el-dialog
    title="创建"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="maxcompute空间名称" prop="odpsProjectName">
      <el-input v-model="dataForm.odpsProjectName" placeholder="maxcompute空间名称"></el-input>
    </el-form-item>
    <el-form-item label="maxcompute表名" prop="odpsTableName">
      <el-input v-model="dataForm.odpsTableName" placeholder="maxcompute表名"></el-input>
    </el-form-item>
    <el-form-item label="datahub工程名" prop="datahubProjectName">
      <el-input v-model="dataForm.datahubProjectName" placeholder="datahub工程名"></el-input>
    </el-form-item>
    <el-form-item label="datahub表名" prop="datahubTableName">
      <el-input v-model="dataForm.datahubTableName" placeholder="datahub表名"></el-input>
    </el-form-item>
    <el-form-item label="json对象" prop="json">
      <el-input v-model="dataForm.json" placeholder="json" type="textarea" ></el-input>
    </el-form-item>
    <el-form-item label="shardCount" prop="shardCount">
      <el-input v-model="dataForm.shardCount" placeholder="" type="number" ></el-input>
    </el-form-item>
    <el-form-item label="lifeCycle" prop="lifeCycle">
      <el-input v-model="dataForm.lifeCycle" placeholder="" type="number" ></el-input>
    </el-form-item>
    <el-form-item label="comment" prop="comment">
      <el-input v-model="dataForm.comment" placeholder="" ></el-input>
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
          odpsProjectName: '',
          odpsTableName: '',
          datahubProjectName: '',
          datahubTableName: '',
          json: '',
          shardCount: 5,
          lifeCycle: 5,
          comment: ''
        },
        dataRule: {
          odpsProjectName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          odpsTableName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          datahubProjectName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          datahubTableName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          json: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/datahup/datahubproject/datahub/create`),
              method: 'post',
              data: this.$http.adornData({
                'odpsProjectName': this.dataForm.odpsProjectName,
                'odpsTableName': this.dataForm.odpsTableName,
                'datahubProjectName': this.dataForm.datahubProjectName,
                'datahubTableName': this.dataForm.datahubTableName,
                'json': this.dataForm.json,
                'shardCount': this.dataForm.shardCount,
                'lifeCycle': this.dataForm.lifeCycle,
                'comment': this.dataForm.comment
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
