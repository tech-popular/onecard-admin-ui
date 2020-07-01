<template>
  <el-dialog title="管理字典" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="70%">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <!-- <el-tree
            :data="dictionData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree> -->
          <el-tree :data="dictionData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled="dataFormValue">
            <el-form-item label="字典名称" prop="baseName">
              <el-input v-model="dataForm.baseName" placeholder="字典名称"/>
            </el-form-item>
            <el-form-item label="字典值" prop="baseValue">
              <el-input v-model="dataForm.baseValue" placeholder="字典值"/>
            </el-form-item>
            <el-form-item label="字典类型" prop="baseType">
              <el-input v-model="dataForm.baseType" placeholder="字典类型" :disabled='typeDisabled'/>
            </el-form-item>
            <el-form-item label="层级" prop="baseLevel">
              <el-input v-model="dataForm.baseLevel" placeholder="层级" :disabled='flowDisabled'/>
            </el-form-item>
            <el-form-item label="排序" prop="baseSort">
              <el-input v-model="dataForm.baseSort" placeholder="排序"/>
            </el-form-item>
            <el-form-item label="状态">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="foot">
            <el-button type="success" @click="getCheckedNodes">新建子节点</el-button>
            <el-button type="danger" @click="deleteCheckedKeys">删除子节点</el-button>
            <el-button type="primary" @click="dataFormSubmit()">更新</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    
  </el-dialog>
</template>

<script>
  import { manageBaseDicdataInfo, getBaseDicdataInfo, addChildBaseDicdata, deleteBaseDicdataInfo, saveorupt } from '@/api/lexicon/dictionaries'
  export default {
    data () {
      var nullandnumber = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        if (!Number(value)) {
          callback(new Error('请输入数字类型'))
        }
        callback()
      }
      var nullkongge = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请输入'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
      var nullkonggeselect = (rule, value, callback) => {
        const nullValue = /^[^\s]+$/
        if (!value) {
          callback(new Error('请选择'))
        }
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
        callback()
      }
      return {
        visible: false,
        dataForm: {
          baseName: '',
          baseValue: '',
          baseType: '',
          baseLevel: 1,
          baseSort: '',
          status: 1,
          id: ''
        },
        dataFormValue: '',
        ruleTypeList: [],
        dataRule: {
          baseName: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          baseValue: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          baseType: [
            { required: true, validator: nullkongge, trigger: 'blur' }
          ],
          baseLevel: [
            { required: true, validator: nullandnumber, trigger: 'blur' }
          ],
          baseSort: [
            { required: true, validator: nullandnumber, trigger: 'blur' }
          ],
          status: [
            { required: true, validator: nullkonggeselect, trigger: 'change' }
          ]
        },
        flowDisabled: true,
        typeDisabled: false,
        dictionData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dictionId: ''
      }
    },
    components: {
  
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
        if (id) {
          this.typeDisabled = true
          this.flowDisabled = false
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (id) {
              this.typeDisabled = true
              this.flowDisabled = false
              const dataBody = this.dataForm.id
              getBaseDicdataInfo(dataBody).then(({data}) => {
                this.dataForm = data.data
                this.dataForm.status = Number(data.data.status)
              })
              manageBaseDicdataInfo(dataBody).then(({data}) => {
                this.dictionData = [data.data]
              })
            }
          })
        }
      },
      // 弹窗状态
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.id = this.dataForm.id
            const dataBody = this.dataForm
            const dataUpdateId = this.dataForm.id
            saveorupt(dataBody, dataUpdateId).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$refs['dataForm'].resetFields()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleNodeClick (data) {
        this.dictionId = data.id
        const dataBody = data.id
        getBaseDicdataInfo(dataBody).then(({data}) => {
          this.dataForm = data.data
          this.dataForm.status = Number(data.data.status)
        })
      },
      // 新建子节点
      getCheckedNodes () {
        this.dataForm.id = this.dictionId
        const dataBody = this.dataForm
        addChildBaseDicdata(dataBody).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$refs['dataForm'].resetFields()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 删除子节点
      deleteCheckedKeys () {
        const dataBody = this.dictionId
        deleteBaseDicdataInfo(dataBody).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$refs['dataForm'].resetFields()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>
