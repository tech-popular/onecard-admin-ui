<template>
  <el-dialog :title="dataFormValue === 'look' ? '查看' : id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled='disbild'> 
        <el-form-item label="策略名称" prop="strategyName">
          <el-input v-model="dataForm.strategyName" placeholder="请输入策略名称"/>
        </el-form-item>
        <el-form-item label="策略层级" prop="strategyLevel">
          <el-select filterable v-model="dataForm.strategyLevel" placeholder="请选择策略层级" style="width:100%" @change="LevelClick" :disabled='levelDisbild'>
            <el-option v-for="item in hierarchyList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="策略场景" prop="strategyName" v-if="sceneDisbild === false">
          <el-cascader style="width: 100%" :props="props" v-model="dataForm.strategyScene" :key="id" clearable :options="sceneList"></el-cascader>
        </el-form-item>
        <el-form-item label="策略类型" prop="strategyType">
          <el-select filterable v-model="dataForm.strategyType" placeholder="请选择策略类型" style="width:100%" @change="typeClick">
            <el-option v-for="item in typeList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="登陆类型" prop="loginStatus">
          <el-select filterable v-model="dataForm.loginStatus" placeholder="请选择登陆类型" style="width:100%">
            <el-option v-for="item in loginTypeList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>详细配置</span><el-tag type="danger" style="margin-left:5px">占比和需等于1%</el-tag>
      </div>
      <el-form :model="dimensionForm" :rules="dimensionRule" ref="dimensionForm" label-width="80px" :disabled='disbild'> 
        <el-form-item label="纬度" v-if="disbild === false" prop="latitude">
          <el-select filterable v-model="dimensionForm.latitude" placeholder="请选择纬度" @change='clickNewAddText'>
            <el-option v-for="item in newAddTextList" :value="item.dimensionName" :key="item.dimensionName" :label="item.dimensionName"/>
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
            prop="id"
            label="序号"/>
          <el-table-column
            prop="strategyDimension"
            label="纬度"/>
          <el-table-column
            v-if="paixudisbuld === '排序'"
            prop="strategyRecall"
            label="排序占比%"/>
          <el-table-column
            v-if="paixudisbuld === '召回'"
            prop="strategyRecall"
            label="召回占比%"/>
          <el-table-column
            v-if="paixudisbuld === '召回'"
            prop="strategySort"
            label="排序优先级"/>
        </el-table>
        <el-table
          v-else
          :data="lists"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="序号"/>
          <el-table-column
            prop="strategyDimension"
            label="纬度"/>
          <el-table-column
            label="排序占比%"
            header-align="center" 
            align="center"
            v-if="paixudisbuld === '排序'"
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
            v-if="paixudisbuld === '召回'"
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
            v-if="paixudisbuld === '召回'"
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
                <el-button type="danger" size="mini" icon="el-icon-minus" circle @click='deletedlLists(scope.row)'></el-button>
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
  import { infoBeeTask, saveorupt, showStrategyDropDown, getSceneDropDown, getDefaultSceneDropDown, weidushowStrategyDropDown, weidushowStrategyDropDownTwo } from '@/api/lexicon/strategy'
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
          strategyName: '',
          strategyScene: [],
          strategyLevel: '',
          strategyType: '',
          loginStatus: '',
          strategySetDetails: []
        },
        id: '',
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
      init (id, value, type) {
        this.id = id
        this.visible = true
        this.paixudisbuld = Number(type)
        getSceneDropDown().then(({data}) => {
          this.sceneList = data.data
        })
        showStrategyDropDown().then(({data}) => {
          this.loginTypeList = data.data.loginStatus
          this.hierarchyList = data.data.strategyLevels
          this.typeList = data.data.strategyTypes
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (value) {
            this.dataFormValue = value
          }
          this.dataFormValue === 'look' ? this.disbild = true : this.disbild = false
          if (id) {
            const dataBody = this.id
            infoBeeTask(dataBody).then(({data}) => { // 详情接口
              this.lists = data.data.strategySetDetails
              this.paixudisbuld = data.data.strategyType
              this.dataForm = data.data
              this.dataFormValue === 'look' ? this.dataForm.strategyName = data.data.strategyName : this.dataForm.strategyName = data.data.strategyName + '_复制'
              this.nextTodoId = Math.max.apply(Math, data && data.data && data.data.strategySetDetails.length > 0 &&
                data.data.strategySetDetails.map(item => { return item.strategySort })) // 获取排序最大值
              this.numId = Math.max.apply(Math, data && data.data && data.data.strategySetDetails.length > 0 &&
                data.data.strategySetDetails.map(item => { return item.id })) // 获取序号最大值
              let arr1Ids = data.data.strategySetDetails.map(item => item.strategyDimension)
              const result = this.newAddTextList.filter(item => !arr1Ids.includes(item.baseName))
              this.newAddTextList = result
              if (data.data.strategyLevel === '默认策略') {
                getDefaultSceneDropDown().then(({data}) => {
                  this.sceneList = data.data
                })
              }
              if (data.data.strategyLevel === '全局策略') {
                this.levelDisbild = true
              }
            })
          }
        })
      },
      addNewList () {
        this.$refs['dimensionForm'].validate((valid) => {
          if (valid) {
            this.lists.push({
              id: this.numId++,
              strategySort: this.nextTodoId++,
              strategyDimension: this.dimensionForm.latitude
            })
            this.dimensionForm.latitude = ''
            this.lists.forEach(item => { this.bName = item.dimensionName })
            this.newAddTextList.splice(this.newAddTextList.findIndex(item => item.baseName === this.bName), 1)
          }
        })
      },
      deletedlLists (val) {
        this.lists && this.lists.length > 0 && this.lists.forEach((item) => {
          if (item.id === val.id) {
            if (this.lists.indexOf(item) > -1) {
              var i = this.lists.indexOf(item)
              this.lists.splice(i, 1)
            }
          }
        })
        if (this.dataForm.strategyType === '召回') {
          this.stragId = 0
        } else {
          this.stragId = 1
        }
  
        weidushowStrategyDropDownTwo(this.stragId).then(({data}) => { // 删除后增加或删除纬度的数据
          this.weidu = false
          this.newAddTextList = data.data
          if (this.lists.length > 0) {
            this.lists.forEach(item => { this.bName = item.dimensionName })
            this.newAddTextList.splice(this.newAddTextList.findIndex(item => item.baseName === this.bName), 1)
          } else {
            this.newAddTextList = data.data.dimensionName
            if (this.id) {
              this.nextTodoId = 1
              this.numId = 1
            }
          }
        })
      },
      clickNewAddText (val) {
        this.dimensionForm.latitude = val
      },
      // 类型
      typeClick (val) {
        this.paixudisbuld = val
        var obj = {}
        obj = this.typeList.find(function (item) {
          return item.baseName === val
        })
        this.weiduId = obj.baseValue
        weidushowStrategyDropDown(this.weiduId).then(({data}) => {
          this.newAddTextList = data.data
        })
      },
      // 层级
      LevelClick (val) {
        if (val === '默认策略') {
          getDefaultSceneDropDown().then(({data}) => {
            this.sceneList = data.data
          })
        }
        if (val === '全局策略') {
          this.sceneDisbild = true
        } else {
          this.sceneDisbild = false
        }
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          var sum = 0
          this.lists.forEach((val) => {
            sum += Number(val.strategyRecall)
            this.weightSum = sum
          }, 0)
          var hash = {}
          for (var i in this.lists) {
            if (
              hash[this.lists[i].strategyDimension]
            ) {
              this.weidu = hash[this.lists[i].strategyDimension]
              this.$message.error('纬度不能重复')
              return true
            } else {
              hash[this.lists[i].strategyDimension] = true
            }
          }
          if (this.paixudisbuld === '排序') {
            if (this.weidu === true) {
              this.$message.error('纬度不能重复')
            } else {
              if (valid) {
                this.dataForm.strategySetDetails = this.lists
                const dataBody = this.dataForm
                saveorupt(dataBody).then(({data}) => {
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
                        this.dataForm.strategyScene = []
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
            }
          } else {
            if (this.weightSum > 1 || this.weightSum < 1) {
              this.$message.error('占比和需等于1%')
            } else if (this.weidu === true) {
              this.$message.error('纬度不能重复')
            } else {
              if (valid) {
                this.dataForm.strategySetDetails = this.lists
                const dataBody = this.dataForm
                saveorupt(dataBody).then(({data}) => {
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
                        this.dataForm.strategyScene = []
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
            }
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