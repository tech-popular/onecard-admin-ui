<template>
  <el-dialog :title="dataForm.id && dataFormValue ? '查看' : dataForm.id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled='disbild'>
        <el-form-item label="实验名称" prop="strategyName">
          <el-input v-model="dataForm.strategyName" placeholder="请输入策略名称"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>流量参数配置</span><el-tag type="danger" style="margin-left:5px">各工具流量条件设置</el-tag>
      </div>
      <el-form :model="dimensionForm" :rules="dimensionRule" ref="dimensionForm" label-width="80px" :disabled='disbild' v-if="disbild === false">
        <el-form-item label="策略" prop="strategy">
          <el-select filterable v-model="dimensionForm.strategy" placeholder="请选择纬度" @change='clickNewAddText' style="width:100%">
            <el-option v-for="item in strategyList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分群名称" v-if="subgroupNameDisbild === false" prop="subgroupName">
          <el-select filterable v-model="dimensionForm.subgroupName" placeholder="请选择纬度" @change='subgroupNameAddText' style="width:100%">
            <el-option v-for="item in subgroupNameList" :value="item.baseName" :key="item.baseName" :label="item.baseName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="占比" prop="proportion" v-if="proportionDisbild === false" @change='proportionAddText'>
          <el-input v-model="dimensionForm.proportion" placeholder="请输入占比"/>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-plus" circle @click='addNewList()' style="float: right;" ></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
        <el-table
          :data="lists"
          style="width: 100%">
          <el-table-column
            prop="strategySort"
            label="序号"/>
          <el-table-column
            prop="strategy"
            label="策略"/>
          <el-table-column
            v-if="subgroupNameDisbild === false"
            prop="subgroupName"
            label="人群包"/>
          <el-table-column
            v-if="proportionDisbild === false"
            prop="proportion"
            label="占比%"/>
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
          strategyName: ''
        },
        dataFormValue: '',
        dataRule: {
          strategyName: [
            { required: true, message: '实验名称不能为空', trigger: 'blur' }
          ]
        },
        dimensionForm: {
          strategy: '',
          subgroupName: '',
          proportion: ''
        },
        dimensionRule: {
          strategy: [
            { required: true, message: '请选择策略', trigger: 'blur' }
          ],
          subgroupName: [
            { required: true, message: '请选择分群名称', trigger: 'blur' }
          ],
          proportion: [
            { required: true, message: '请输入占比', trigger: 'blur' }
          ]
        },
        sceneList: [],
        subgroupNameList: [
          {id: 2, baseName: '分群1', baseValue: '1', baseType: 'strategyScene', baseLevel: 2, baseSort: 1},
          {id: 1, baseName: '分群2', baseValue: '2', baseType: 'strategyScene', baseLevel: 1, baseSort: 2}
        ],
        strategyList: [],
        loginTypeList: [],
        lists: [],
        nextTodoId: 1,
        disbild: false,
        subgroupNameDisbild: false,
        proportionDisbild: false
      }
    },
    components: {
      EditableCell
    },
    watch: {
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
        this.visible = true
        this.dataFormValue === 'look' ? this.disbild = true : this.disbild = false
        getSceneDropDown().then(({data}) => {
          this.sceneList = data.data
        })
        showStrategyDropDown().then(({data}) => {
          this.loginTypeList = data.data.loginStatus
          this.hierarchyList = data.data.strategyLevels
          this.strategyList = data.data.strategyTypes
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            const dataBody = this.dataForm.id
            infoBeeTask(dataBody).then(({data}) => {
            })
          }
        })
      },
      addNewList () {
        this.$refs['dimensionForm'].validate((valid) => {
          if (valid) {
            this.lists.push({
              strategySort: this.nextTodoId++,
              subgroupName: this.dimensionForm.subgroupName,
              strategy: this.dimensionForm.strategy,
              proportion: this.dimensionForm.proportion
            })
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
        this.dimensionForm.strategy = val
      },
      subgroupNameAddText (val) {
        this.dimensionForm.subgroupName = val
        this.proportionDisbild = true
      },
      proportionAddText () {
        this.subgroupNameDisbild = true
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          var sum = 0
          this.lists.forEach((val) => {
            sum += Number(val.strategyRecall)
            this.weightSum = sum
          }, 0)
          if (this.weightSum > 100 || this.weightSum < 100) {
            this.$message.error('占比和需等于100%')
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
                      this.proportionDisbild = false
                      this.subgroupNameDisbild = false
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
        this.lists = []
        this.proportionDisbild = false
        this.subgroupNameDisbild = false
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