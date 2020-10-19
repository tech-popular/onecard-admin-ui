<template>
  <el-dialog :title="dataFormValue === 'edit' ? '修改' : id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" >
        <el-form-item label="召回源名称" prop="dimensionName">
          <el-input v-model="dataForm.dimensionName" placeholder="请输入召回源名称"/>
        </el-form-item>
        <el-form-item label="召回源英文名称" prop="dimensionEnglishName">
          <el-input v-model="dataForm.dimensionEnglishName" placeholder="请输入召回源英文名称"/>
        </el-form-item>
        <el-form-item label="类型" prop="dimensionType" >
          <el-select filterable v-model="dataForm.dimensionType" placeholder="请选择类型" style="width:100%" >
            <el-option v-for="item in dimensionTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="召回源类型" prop="recSourceType">
          <el-select filterable v-model="dataForm.recSourceType" placeholder="请选择召回源类型" style="width:100%" >
            <el-option value=1 key=1 label="非算法" />
            <el-option value=0 key=0 label="算法"/>
          </el-select>
        </el-form-item>
        <el-form-item label="前缀" prop="prefixKey">
          <el-input v-model="dataForm.prefixKey" placeholder="前缀"/>
        </el-form-item>
        <el-form-item label="后缀" prop="suffixKeys">
          <el-input v-model="dataForm.suffixKeys" placeholder="后缀"/>
        </el-form-item>
        <el-form-item label="service服务入参" prop="serviceParams">
          <el-input v-model="dataForm.serviceParams" placeholder="service服务入参"/>
        </el-form-item>
        <el-form-item label="维度变量表达式" prop="expressions">
          <el-input v-model="dataForm.expressions" placeholder="维度变量表达式"/>
        </el-form-item>
        <el-form-item label="后缀的生成类型" prop="type">
          <el-input v-model="dataForm.type" placeholder="后缀的生成类型"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select filterable v-model="dataForm.status" placeholder="状态" style="width:100%" >
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div slot="footer" class="foot">
      <el-button @click="taskDialgClose">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import EditableCell from './components/EditableCell'
  import { infoBeeTask, saveorupt } from '@/api/lexicon/dimension'
  export default {
    data () {
      return {
        visible: false,
        editModeEnabled: true,
        props: {
          multiple: false,
          checkStrictly: false,
          label: 'sceneName',
          value: 'sceneType'
        },
        dataForm: {
          dimensionName: '',
          dimensionEnglishName: '',
          dimensionType: 0,
          recSourceType: '',
          prefixKey: '',
          suffixKeys: '',
          serviceParams: '',
          expressions: '',
          type: '',
          status: 1
        },
        dimensionTypeList: [{
          value: 0,
          label: '召回'
        },
          {
            value: 1,
            label: '排序'
          }],
        statusList: [{
            value: 0,
            label: '非启用'
          },
          {
            value: 1,
            label: '启用'
          }
        ],
        id: '',
        dataFormValue: '',
        dataRule: {
          dimensionName: [
            { required: true, message: '召回源名称不能为空', trigger: 'blur' }
          ],
          dimensionType: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ],
          recSourceType: [
            { required: true, message: '请选择召回源类型', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'blur' }
          ]
        },
        lists: [],
        nextTodoId: 1,
        numId: 1,
        newAddTextList: [],
        disbild: false,
        levelDisbild: false,
        sceneDisbild: false,
        paixudisbuld: '',
        bName: '',
        weiduId: ''
      }
    },
    components: {
      EditableCell
    },
    watch: {
      'paixudisbuld': {
        handler (newVal, oldVal) {
          this.paixudisbuld = newVal
        },
        deep: true,
        immediate: true
      },
      'dataFormValue': {
        handler (newVal, oldVal) {
          this.dataFormValue = newVal
        },
        deep: true,
        immediate: true
      },
      'newAddTextList': {
        handler (newVal, oldVal) {
  
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value) {
        this.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (value) {
            this.dataFormValue = value
          }
          this.disbild = true
          if (id) {
            const dataBody = this.id
            infoBeeTask(dataBody).then(({data}) => { // 详情接口
              this.dataForm = data.data
            })
          }
        })
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
           if (valid) {
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
                        this.$emit('refreshDataList')
                        this.$refs['dataForm'].resetFields()
                        this.dataFormValue = ''
                        this.lists = []
                        this.nextTodoId = 1
                        this.numId = 1
                        this.weidu = false
                        this.levelDisbild = false
                        this.sceneDisbild = false
                      }
                    })
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
        })
      },
      taskDialgClose () {
        this.visible = false
        this.$refs['dataForm'].resetFields()
        this.$refs['dimensionForm'].resetFields()
        this.dataForm.strategyScene = []
        this.paixudisbuld = ''
        this.lists = []
        this.dataFormValue = ''
        this.nextTodoId = 1
        this.numId = 1
        this.weidu = false
        this.levelDisbild = false
        this.sceneDisbild = false
      }
    }
  }
</script>
<style scoped>
  .edit-cell {
    min-height: 35px;
    cursor: pointer;
  }
</style>
