<template>
  <el-dialog :title="canUpdate? !dataForm.id ? '新增' : '修改' :'查看'"  @close="datano" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="20%" :disabled="!canUpdate">
    <el-form-item label="工作流名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="工作流名称"/>
    </el-form-item>
     <el-form-item label="拥有者" prop="owner">
      <el-input v-model="dataForm.owner" placeholder="拥有者"/>
    </el-form-item>
    <el-form-item label="使用者" prop="user">
      <el-input v-model="dataForm.user" placeholder="使用者"/>
    </el-form-item>
    <el-form-item label="工作流入参">
      <el-input v-model="dataForm.inputParameters" placeholder="多个参数用英文逗号隔开，例：name,costumerId"/>
    </el-form-item>
    <el-form-item v-if="!dataForm.id" label="组合工作流编码" prop="flowCode" >
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-select filterable v-model="flowCodeSys" placeholder="请选择" @change="flowCode" style="width:100%;">
              <el-option v-for="item in ownerAppList" :value="item.sysCode" :key="item.sysCode" :label="item.sysCode"/>
            </el-select>
          </div>
        </el-col>
        <el-col :span="11" style="float: right;">
          <div class="grid-content bg-purple">
            <el-input v-model="dataForm.flowCode" placeholder="只能输入英文 数字 和下划线" style="width:100%;"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="工作流编码">
      <span>{{flowCodeSys+dataForm.flowCode}}</span>
    </el-form-item>
    <el-form-item label="返回结果" prop="outputParameters">
      <el-input v-model="dataForm.outputParameters" placeholder="json格式，例：{'phome':17611112222,'name':'xiaoming'}"/>
    </el-form-item>
     <el-form-item label="版本" prop="version">
        <el-select filterable v-model="dataForm.version" placeholder="请选择">
          <el-option v-for="item in versionList" :value="item.id" :key="item.value" :label="item.id"/>
        </el-select>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="dataForm.description" placeholder="描述"/>
    </el-form-item>
     <el-form-item label="创建人姓名" prop="createdBy">
      <el-input v-model="dataForm.createdBy" placeholder="创建人姓名" disabled/>
    </el-form-item>
    <el-form-item label="归属系统" prop="ownerApp">
        <el-select filterable v-model="dataForm.ownerApp" placeholder="请选择">
          <el-option v-for="item in ownerAppList" :value="item.sysName" :key="item.sysName" :label="item.sysName"/>
        </el-select>
    </el-form-item>
    <el-form-item label="是否重试">
      <el-radio-group v-model="dataForm.restartable">
          <el-radio :label="0">不重试</el-radio>
          <el-radio :label="1">重试</el-radio>
        </el-radio-group>
    </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" v-if="canUpdate" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { saveWorkFlow, getUpdateWorkFlow, getAllSys } from '@/api/workerBee/workFlow'
  import Filter from './filter'
  import { deepClone } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          name: '',
          owner: '',
          user: '',
          inputParameters: '',
          description: '',
          createdBy: this.$store.state.user.name,
          outputParameters: '',
          ownerApp: '',
          restartable: 0,
          schemaVersion: 0,
          version: '',
          flowCode: ''
        },
        dataRule: {
          name: [
            { required: true, message: '工作流名称不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          owner: [
            { required: true, message: '拥有者不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          user: [
            { required: true, message: '使用者不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          // inputParameters: [
          //   { required: true, message: '工作流入参不能为空', trigger: 'blur' },
          //   { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          // ],
          outputParameters: [
            { required: true, message: '返回结果不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          version: [
            { required: true, message: '版本不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          createdBy: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          ownerApp: [
            { required: false, validator: Filter.NullKongGeRule, trigger: 'change' }
          ],
          flowCode: [
            { required: true, message: '工作流编码不能为空', trigger: 'blur' },
            { required: true, validator: Filter.NullKongGeRule, trigger: 'change' },
            { required: true, validator: Filter.FlowCode, trigger: 'change' }
          ]
        },
        updateId: '',
        versionList: [
          {id: 1, value: 1}
        ],
        ownerAppList: [],
        flowCodeSys: '',
        canUpdate: true, // 查看时不可编辑
        rowData: { // 修改时数据内容
          authOwner: '',
          authOtherList: [],
          authOthers: ''
        }
      }
    },
    components: {
  
    },
    methods: {
      init (row, canUpdate) {
      this.updateId = row ? row.id : ''
       this.rowData = {
          authOwner: '',
          authOtherList: [],
          authOthers: ''
        }
        this.dataForm.id = row ? row.id : 0
        this.canUpdate = row ? canUpdate : true
        this.rowData = this.dataForm.id ? deepClone(row) : this.rowData
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          getAllSys().then(({data}) => {
            if (data && data.message === 'success') {
              this.ownerAppList = data.data
            }
          })
          if (this.dataForm.id) {
            const dataBody = row.id
            const updateIds = this.updateId
            getUpdateWorkFlow(dataBody, updateIds).then(({data}) => {
              if (data && data.message === 'success') {
                this.dataForm.name = data.data.name
                this.dataForm.owner = data.data.owner
                this.dataForm.user = data.data.user
                this.dataForm.inputParameters = data.data.inputParameters
                this.dataForm.description = data.data.description
                this.dataForm.createdBy = data.data.createdBy
                this.dataForm.outputParameters = data.data.outputParameters
                this.dataForm.ownerApp = data.data.ownerApp
                this.dataForm.restartable = data.data.restartable
                this.dataForm.schemaVersion = data.data.schemaVersion
                this.dataForm.version = data.data.version
                this.dataForm.flowCode = data.data.flowCode
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.flowCode = this.flowCodeSys + this.dataForm.flowCode
            const dataBody = this.dataForm
            // const dataUpdateId = this.updateId
            let params = {
              authOwner: this.rowData.authOwner,
              authOtherList: this.rowData.authOtherList,
              authOthers: this.rowData.authOthers,
              dataUpdateId: this.updateId
            }
            saveWorkFlow(dataBody, params).then(({data}) => {
              if (data && data.message === 'success') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 300,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.dataForm.description = ''
                    this.dataForm.createdBy = ''
                    this.dataForm.ownerApp = ''
                    this.flowCodeSys = ''
                    this.dataForm.flowCode = ''
                    this.dataForm.inputParameters = ''
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
        })
      },
      // 工作流编码
      flowCode (value) {
        this.flowCodeSys = value + `_`
      },
      datano () {
        this.visible = false
        this.dataForm.description = ''
        this.dataForm.createdBy = ''
        this.dataForm.ownerApp = ''
        this.flowCodeSys = ''
        this.dataForm.flowCode = ''
        this.dataForm.inputParameters = ''
      }
    }
  }
</script>
