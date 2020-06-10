<template>
  <el-dialog :title="dataForm.id && dataFormValue ? '查看' : dataForm.id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-card shadow="never">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled='disbild'>
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form-item label="策略名称" prop="strategyName">
          <el-input v-model="dataForm.strategyName" placeholder="请输入策略名称"/>
        </el-form-item>
        <el-form-item label="策略场景" prop="strategyName">
          <el-cascader
          style="width: 100%"
          :props="props"
          v-model="dataForm.strategyScene"
          clearable
          :options="sceneList">
        </el-cascader>
        </el-form-item>
        <el-form-item label="策略层级" prop="strategyLevel">
          <el-select filterable v-model="dataForm.strategyLevel" placeholder="请选择策略层级" style="width:100%">
            <el-option 
              v-for="item in hierarchyList" 
              :value="item.baseValue" 
              :key="item.baseValue" 
              :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="策略类型" prop="strategyType">
          <el-select filterable v-model="dataForm.strategyType" placeholder="请选择策略类型" style="width:100%" @change="typeClick">
            <el-option v-for="item in typeList" :value="item.baseValue" :key="item.baseValue" :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="登陆类型" prop="loginStatus">
          <el-select filterable v-model="dataForm.loginStatus" placeholder="请选择登陆类型" style="width:100%">
            <el-option v-for="item in loginTypeList" :value="item.baseValue" :key="item.baseValue" :label="item.baseName"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>详细配置</span><el-tag type="danger" style="margin-left:5px">占比和需等于100%</el-tag>
      </div>
      <el-form :model="dimensionForm" :rules="dimensionRule" ref="dimensionForm" label-width="80px" :disabled='disbild'> 
        <el-form-item label="纬度" v-if="disbild === false" prop="latitude">
          <el-select filterable v-model="dimensionForm.latitude" placeholder="请选择纬度" @change='clickNewAddText'>
            <el-option v-for="item in newAddTextList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-plus" circle @click='addNewList()' style="float: right;" ></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
       <el-table
          v-if="dataFormValue"
          :data="lists"
          style="width: 100%">
          <el-table-column
            prop="strategySort"
            label="序号"/>
          <el-table-column
            prop="strategyDimension"
            label="纬度"/>
          <el-table-column
            v-if="paixudisbuld === 1"
            prop="strategyRecall"
            label="排序占比%"/>
          <el-table-column
            v-if="paixudisbuld === 0"
            prop="strategyRecall"
            label="召回占比%"/>
          <el-table-column
            v-if="paixudisbuld === 0"
            prop="strategySort"
            label="排序优先级"/>
        </el-table>
        <el-table
          v-else
          :data="lists"
          style="width: 100%">
          <el-table-column
            prop="strategySort"
            label="序号"/>
          <el-table-column
            prop="strategyDimension"
            label="纬度"/>
          <el-table-column
            label="排序占比%"
            header-align="center" 
            align="center"
            v-if="paixudisbuld === 1"
            >
            <editable-cell
              slot-scope="scope"
              :can-edit="editModeEnabled"
              v-model="scope.row.strategyRecall">
              <span slot="content">{{scope.row.strategyRecall}}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column
            label="召回占比%"
            header-align="center" 
            align="center"
            v-if="paixudisbuld === 0"
            >
            <editable-cell 
              slot-scope="scope"
              :can-edit="editModeEnabled"
              :tablDis='dataFormValue'
              v-model="scope.row.strategyRecall">
              <span slot="content">{{scope.row.strategyRecall}}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column
            label="排序优先级"
            header-align="center" 
            align="center"
            v-if="paixudisbuld === 0"
            >
            <editable-cell
              slot-scope="scope"
              :can-edit="editModeEnabled"
              :tablDis='dataFormValue'
              v-model="scope.row.strategySort">
              <span slot="content">{{scope.row.strategySort}}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope" v-if="disbild === false">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" icon="el-icon-minus" circle @click='deletedlLists(scope.row.id)'></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <div slot="footer" class="foot">
      <el-button @click="taskDialgClose">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="disbild === false">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import EditableCell from './components/EditableCell'
  import { infoBeeTask, saveorupt, showStrategyDropDown, getSceneDropDown } from '@/api/lexicon/strategy'
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
          id: '',
          strategyName: '',
          strategyScene: [],
          strategyLevel: '',
          strategyType: '',
          loginStatus: '',
          strategySetDetails: []
        },
        dataFormValue: '',
        dataRule: {
          strategyName: [
            { required: true, message: '策略名称不能为空', trigger: 'blur' }
          ],
          strategyScene: [
            { required: true, message: '请选择策略场景', trigger: 'blur' }
          ],
          strategyLevel: [
            { required: true, message: '请选择策略层级', trigger: 'blur' }
          ],
          strategyType: [
            { required: true, message: '请选择策略类型', trigger: 'blur' }
          ],
          loginStatus: [
            { required: true, message: '请选择登录类型', trigger: 'blur' }
          ]
        },
        dimensionForm: {
          latitude: ''
        },
        dimensionRule: {
          latitude: [
            { required: true, message: '请选择纬度', trigger: 'blur' }
          ]
        },
        sceneList: [],
        hierarchyList: [],
        typeList: [],
        loginTypeList: [],
        lists: [],
        nextTodoId: 1,
        newAddTextList: [],
        disbild: false,
        paixudisbuld: ''
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
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value, type) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.paixudisbuld = type
        this.visible = true
        this.dataFormValue === 'look' ? this.disbild = true : this.disbild = false
        getSceneDropDown().then(({data}) => {
          this.sceneList = data.data
        })
        showStrategyDropDown().then(({data}) => {
          this.loginTypeList = data.data.loginStatus
          this.hierarchyList = data.data.strategyLevels
          this.typeList = data.data.strategyTypes
          this.newAddTextList = data.data.strategyDimension
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            const dataBody = this.dataForm.id
            infoBeeTask(dataBody).then(({data}) => {
              this.dataForm = data.data
              this.lists = data.data.strategySetDetails
              this.paixudisbuld = data.data.strategyType
            })
          }
        })
      },
      addNewList () {
        this.$refs['dimensionForm'].validate((valid) => {
          if (valid) {
            this.lists.push({
              strategySort: this.nextTodoId++,
              strategyDimension: this.dimensionForm.latitude
            })
            this.dimensionForm.latitude = ''
          }
        })
      },
      deletedlLists (val) {
        this.lists && this.lists.length > 0 && this.lists.forEach((item) => {
          if (item.id === val) {
            if (this.lists.indexOf(item) > -1) {
              var i = this.lists.indexOf(item)
              this.lists.splice(i, 1)
            }
          }
        })
      },
      clickNewAddText (val) {
        this.dimensionForm.latitude = val
      },
      // 类型
      typeClick (val) {
        this.paixudisbuld = Number(val)
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          var sum = 0
          this.lists.forEach((val) => {
            sum += Number(val.strategyRecall)
            this.weightSum = sum
          }, 0)
          if (this.weightSum > 100) {
            this.$message.error('占比和不得超过100%')
          } else {
            if (valid) {
              this.dataForm.strategySetDetails = this.lists
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
                      this.$refs['dimensionForm'].resetFields()
                      this.lists = []
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          }
        })
      },
      taskDialgClose () {
        this.visible = false
        this.$refs['dataForm'].resetFields()
        this.$refs['dimensionForm'].resetFields()
        this.paixudisbuld = ''
        this.lists = []
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