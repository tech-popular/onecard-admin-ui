<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="表名称" prop="tableName">
      <el-input v-model="dataForm.tableName" placeholder="表名称"></el-input>
    </el-form-item>
    <el-form-item label="表的主键" prop="pk">
      <el-input v-model="dataForm.pk" placeholder="表的主键"></el-input>
    </el-form-item>
    <el-form-item label="合并sql" prop="mergeSql">
      <el-input v-model="dataForm.mergeSql" placeholder="合并sql"></el-input>
    </el-form-item>
    <el-form-item label="空间名" prop="maxcomputeSpace">
      <el-input v-model="dataForm.maxcomputeSpace" placeholder="空间名"></el-input>
    </el-form-item>
    <el-form-item label="0是5分钟合并，1是t+1合并" prop="type">
      <!--<el-input v-model="dataForm.type" placeholder="0是5分钟合并，1是t+1合并"></el-input>-->
      <el-select v-model="dataForm.type" placeholder="请选择">
        <el-option v-for="item in typeoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="版本号" prop="version">
      <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">正常</el-radio>
      </el-radio-group>
    </el-form-item>
    <!--<el-form-item label="" prop="remark">-->
      <!--<el-input v-model="dataForm.remark" placeholder=""></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="" prop="createTime">-->
      <!--<el-input v-model="dataForm.createTime" placeholder=""></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="" prop="updateTime">-->
      <!--<el-input v-model="dataForm.updateTime" placeholder=""></el-input>-->
    <!--</el-form-item>-->
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
          tableName: '',
          pk: '',
          mergeSql: '',
          maxcomputeSpace: '',
          type: '',
          version: '',
          enable: 1,
          remark: '',
          createTime: '',
          updateTime: ''
        },
        typeoptions: [],
        dataRule: {
          tableName: [
            { required: true, message: '表名称不能为空', trigger: 'blur' }
          ],
          pk: [
            { required: true, message: '表的主键不能为空', trigger: 'blur' }
          ],
          mergeSql: [
            { required: true, message: '合并sql不能为空', trigger: 'blur' }
          ],
          maxcomputeSpace: [
            { required: true, message: '空间名不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '0是5分钟合并，1是t+1合并不能为空', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '版本号不能为空', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.$http({
          url: this.$http.adornUrl(`/sys/sysdictitem/selectbydictypes`),
          method: 'post',
          data: this.$http.adornData(['honeycomb_maxcompute_merge_task_type'], false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.typeoptions = data.dicMap.honeycomb_maxcompute_merge_task_type
          }
        })
        this.visible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        //   if (this.dataForm.tableName) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/honeycomb/honeycombmaxcomputemergetask/info/${this.dataForm.tableName}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         this.dataForm.pk = data.honeycombMaxcomputeMergeTask.pk
        //         this.dataForm.mergeSql = data.honeycombMaxcomputeMergeTask.mergeSql
        //         this.dataForm.maxcomputeSpace = data.honeycombMaxcomputeMergeTask.maxcomputeSpace
        //         this.dataForm.type = data.honeycombMaxcomputeMergeTask.type
        //         this.dataForm.version = data.honeycombMaxcomputeMergeTask.version
        //         this.dataForm.enable = data.honeycombMaxcomputeMergeTask.enable
        //         this.dataForm.remark = data.honeycombMaxcomputeMergeTask.remark
        //         this.dataForm.createTime = data.honeycombMaxcomputeMergeTask.createTime
        //         this.dataForm.updateTime = data.honeycombMaxcomputeMergeTask.updateTime
        //       }
        //     })
        //   }
        // })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombmaxcomputemergetask/save`),
              method: 'post',
              data: this.$http.adornData({
                'tableName': this.dataForm.tableName || undefined,
                'pk': this.dataForm.pk,
                'mergeSql': this.dataForm.mergeSql,
                'maxcomputeSpace': this.dataForm.maxcomputeSpace,
                'type': this.dataForm.type,
                'version': this.dataForm.version,
                'enable': this.dataForm.enable,
                'remark': this.dataForm.remark,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime
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
