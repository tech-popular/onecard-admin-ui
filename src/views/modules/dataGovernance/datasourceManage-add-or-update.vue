<template>
  <el-dialog :title="!updateId ? '新增' : '修改'" @close="datano" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
      <el-form-item label="数据源名称" prop="datasourceName">
        <el-select filterable v-model="dataForm.datasourceName" placeholder="请选择">
          <el-option v-for="item in datasourceNameList" :value="item.id" :key="item.id" :label="item.datasourceName" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择">
          <el-option v-for="item in datasourceTypeList" :value="item.value" :key="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库用户名" prop="user">
        <el-input v-model="dataForm.user" placeholder="数据库用户名" />
      </el-form-item>
      <el-form-item label="数据库密码" prop="passwd">
        <el-input v-model="dataForm.passwd" placeholder="数据库密码" />
      </el-form-item>
      <el-form-item label="数据库URL" prop="url">
        <el-input v-model="dataForm.url" placeholder="数据库URL" />
      </el-form-item>
      <el-form-item label="启用/禁用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio label="0">禁用</el-radio>
          <el-radio label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryEnableList, saveDatasource, editDatasource, lookDatasource } from '@/api/dataGovernance/datasourceManage'
import Filter from './filter'
export default {
  data () {
    return {
      visible: false,
      updateId: '',
      dataForm: {
        datasourceName: '',
        user: '',
        passwd: '',
        url: '',
        enable: 0,
        remark: '',
        datasourceType: ''
      },
      datasourceNameList: [],
      userid: sessionStorage.getItem('id'),
      dataRule: {
        datasourceName: [
          { required: true, message: '数据源名称不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        datasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'blur' },
        ],
        user: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        passwd: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        url: [
          { required: true, message: '数据库url不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        enable: [
          { required: true, message: '请选择启用/禁用', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ]
      },

      datasourceTypeList: [
        { id: 'mysql', value: 'mysql' },
        { id: 'postgre', value: 'postgre' },
        { id: 'maxCompute', value: 'maxCompute' }
      ]
    }
  },
  mounted () {
  },
  components: {
  },
  methods: {
    init (id) {
      console.log('id: ', id);
      this.updateId = id
      this.visible = true
      let params = {
        'userId': Number(this.userid)
      }
      queryEnableList(params).then(({ data }) => {
        if (data.code === 0) {
          this.datasourceNameList = data.data
        } else {
          this.datasourceNameList = []
          this.$message({
            message: data.msg || '数据异常',
            type: 'error'
          })
        }
      })
      if (id) {
        lookDatasource(id).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.data
            this.dataForm.enable = data.data.enable.toString()
          } else {
            this.$message({
              message: data.message || '数据异常',
              type: 'error'
            })
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            'datasourceName': this.dataForm.datasourceName,
            'user': this.dataForm.user,
            'passwd': this.dataForm.passwd,
            'url': this.dataForm.url,
            'enable': Number(this.dataForm.enable),
            'remark': this.dataForm.remark,
            'datasourceType': this.dataForm.datasourceType,

          }
          if (this.updateId) {
            params.id = this.updateId
            editDatasource(params).then(({ data }) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 300,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message({
                  message: data.message || '数据异常',
                  type: 'error'
                })
              }
            })

          } else {

            saveDatasource(params).then(({ data }) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 300,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message({
                  message: data.message || '数据异常',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    datano () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
