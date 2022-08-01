<template>
  <el-dialog :title="!updateId ? '新增' : '修改'" @close="datano" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%">
      <el-form-item label="数据源名称" prop="datasourceName">
        <el-input v-model="dataForm.datasourceName" placeholder="数据源名称" />
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasourceType">
        <el-select filterable v-model="dataForm.datasourceType" placeholder="请选择">
          <el-option v-for="item in datasourceTypeList" :value="item.value" :key="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库列表" v-if="(!updateId && dataForm.datasourceType === 'maxCompute') || updateId" prop="databaseList">
        <input-tag
          v-model="dataForm.databaseList"
          :valueType="'string'"
          :add-tag-on-blur="true"
          :tag-tips="[]"
          :readOnly="updateId && dataForm.datasourceType !== 'maxCompute'"
          :allow-duplicates="true"
          class="itemIput inputTag"
          placeholder="可用回车输入多条"
        ></input-tag>
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
      <el-form-item label="驱动类" prop="driver">
        <el-input v-model="dataForm.driver" placeholder="数据库用户名" />
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
import { saveDatasource, editDatasource, lookDatasource } from '@/api/dataGovernance/datasourceManage'
import Filter from './filter'
import InputTag from '../dataAnalysis/components/InputTag'
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
        enable: '',
        remark: '',
        datasourceType: '',
        databaseList: [],
        driver: ''
      },
      userid: sessionStorage.getItem('id'),
      dataRule: {
        datasourceName: [
          { required: true, message: '数据源名称不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        datasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'blur' }
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
          { required: true, message: '请选择启用/禁用', trigger: 'blur' }
        ],
        databaseList: [
          { required: true, message: '数据库列表不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ],
        driver: [
          { required: true, message: '驱动类不能为空', trigger: 'blur' },
          { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
        ]
      },

      datasourceTypeList: [
        { id: 'mysql', value: 'mysql' },
        { id: 'postgres', value: 'postgres' },
        { id: 'maxCompute', value: 'maxCompute' }
      ]
    }
  },
  mounted () {
  },
  components: {
    InputTag
  },
  methods: {
    init (id) {
      this.updateId = id
      this.dataForm.databaseList = []
      if (id) {
        lookDatasource(id).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.data
            this.dataForm.enable = data.data.enable.toString()
            this.dataForm.databaseList = data.data.databaseList.split(',')
            console.log(' this.dataForm.databaseList: ', this.dataForm.databaseList);
          } else {
            this.$message({
              message: data.message || '数据异常',
              type: 'error'
            })
          }
        })
      }
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('this.dataForm.databaseList: ', this.dataForm.databaseList);
          let params = {
            'datasourceName': this.dataForm.datasourceName,
            'user': this.dataForm.user,
            'passwd': this.dataForm.passwd,
            'url': this.dataForm.url,
            'enable': Number(this.dataForm.enable),
            'remark': this.dataForm.remark,
            'datasourceType': this.dataForm.datasourceType,
            'databaseList': this.dataForm.databaseList.join(','),
            'driver': this.dataForm.driver
          }
          if (this.updateId) {
            params.id = this.updateId
            // params.databaseList = this.dataForm.databaseList.join(',')
            editDatasource(params).then(({ data }) => {
              if (data && data.code === 0) {
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
              if (data && data.code === 0) {
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
