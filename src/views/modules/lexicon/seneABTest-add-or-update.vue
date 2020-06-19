<template>
  <el-dialog :title="dataFormValue === 'look' ? '查看' : id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled='disbild'>
        <el-form-item label="实验名称" prop="experimentName">
          <el-input v-model="dataForm.experimentName" placeholder="请输入策略名称"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" style="margin-top:20px">
      <div slot="header" class="clearfix">
        <span>流量参数配置</span><el-tag type="danger" style="margin-left:5px">各工具流量条件设置</el-tag>
      </div>
      <el-form :model="dimensionForm" :rules="dimensionRule" ref="dimensionForm" label-width="80px" :disabled='disbild' v-if="disbild === false">
        <el-form-item label="策略" prop="experimentStrategyId">
          <el-select filterable v-model="dimensionForm.experimentStrategyId" placeholder="请选择纬度" @change='clickNewAddText' ref="newText" style="width:100%">
            <el-option v-for="item in strategyList" :value="item.strategyName" :key="item.id" :label="item.strategyName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="分群名称" v-if="subgroupNameDisbild === false" prop="experimentGroupId">
          <el-select filterable v-model="dimensionForm.experimentGroupId" placeholder="请选择纬度" @change='subgroupNameAddText' style="width:100%">
            <el-option v-for="item in subgroupNameList" :value="item.groupName" :key="item.groupId" :label="item.groupName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="占比" prop="experimentPersent" v-if="proportionDisbild === false">
          <el-input-number v-model="dimensionForm.experimentPersent" @change='proportionAddText' :max="100" label="请输入占比"></el-input-number>
          <!-- <el-input v-model="dimensionForm.experimentPersent" placeholder="请输入占比" @focus='proportionAddText'/> -->
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
            prop="id"
            label="序号"/>
          <el-table-column
            prop="experimentStrategyId"
            label="策略"/>
          <el-table-column
            v-if="subgroupNameDisbild === false"
            prop="experimentGroupId"
            label="人群包"/>
          <el-table-column
            v-if="proportionDisbild === false"
            prop="experimentPersent"
            label="占比%"/>
          <el-table-column header-align="center" align="center" width="200" label="操作" v-if="disbild === false">
            <template slot-scope="scope">
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
  import { infoBeeTask, saveorupt, selectStrategyBySceneId, getDataApiGroupList } from '@/api/lexicon/ABTest'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          experimentName: '',
          experimentSceneId: '',
          experimentSetDetails: [],
          strategyType: ''
        },
        dataFormValue: '',
        dataRule: {
          experimentName: [
            { required: true, message: '实验名称不能为空', trigger: 'blur' }
          ]
        },
        dimensionForm: {
          experimentStrategyId: '',
          experimentGroupId: '',
          experimentPersent: undefined
        },
        celueId: '',
        dimensionRule: {
          experimentStrategyId: [
            { required: true, message: '请选择策略', trigger: 'blur' }
          ],
          experimentGroupId: [
            { required: true, message: '请选择分群名称', trigger: 'blur' }
          ],
          experimentPersent: [
            { required: true, message: '请输入占比', trigger: 'blur' }
          ]
        },
        subgroupNameList: [],
        examilId: '',
        strategyType: '',
        strategyList: [
          {
            id: 1,
            strategyName: 'zhiming'
          }
        ],
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
      'proportionDisbild': {
        handler (newVal, oldVal) {
          console.log('占比', newVal)
        },
        deep: true,
        immediate: true
      },
      'subgroupNameDisbild': {
        handler (newVal, oldVal) {
          console.log('人群', newVal)
        },
        deep: true,
        immediate: true
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value, type, testType, strategyType) {
        this.id = id
        this.dataFormValue = value
        this.examilId = testType[1]
        this.strategyType = strategyType
        this.visible = true
        this.dataFormValue === 'look' ? this.disbild = true : this.disbild = false
        selectStrategyBySceneId(this.examilId).then(({data}) => {
          this.strategyList = data.data
        })
        getDataApiGroupList().then(({data}) => {
          this.subgroupNameList = data.data
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.lists = []
          if (id) {
            const dataBody = this.id
            infoBeeTask(dataBody).then(({data}) => {
              this.lists = data.data.experimentSetDetails
              this.dataForm.experimentName = data.data.experimentName
              this.dataFormValue === 'look' && data && data.data && data.data.experimentSetDetails.length > 0 && data.data.experimentSetDetails[0].experimentPersent ? this.subgroupNameDisbild = true : this.subgroupNameDisbild = false
              this.dataFormValue === 'look' && data && data.data && data.data.experimentSetDetails.length > 0 && data.data.experimentSetDetails[0].experimentGroupId ? this.proportionDisbild = true : this.proportionDisbild = false
            })
          }
        })
      },
      addNewList () {
        this.$refs['dimensionForm'].validate((valid) => {
          if (valid) {
            // var strategyName = ''
            // var peopName = ''
            // this.strategyList.find(item => {
            //   if (item.id == this.dimensionForm.experimentStrategyId) { strategyName = item.strategyName }
            // })
            // this.subgroupNameList.find(item => {
            //   if (item.groupId == this.dimensionForm.experimentGroupId) { peopName = item.groupName }
            // })
            this.lists.push({
              id: this.nextTodoId++,
              experimentStrategyId: this.dimensionForm.experimentStrategyId,
              experimentGroupId: this.dimensionForm.experimentGroupId,
              // experimentStrategyId: strategyName,
              // experimentGroupId: peopName,
              experimentPersent: this.dimensionForm.experimentPersent
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
        this.dimensionForm.experimentStrategyId = val
      },
      subgroupNameAddText (val) {
        this.dimensionForm.experimentGroupId = val
        this.proportionDisbild = true
      },
      proportionAddText () {
        this.subgroupNameDisbild = true
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (this.subgroupNameDisbild === true) {
            var sum = 0
            this.lists.forEach((val) => {
              sum += Number(val.experimentPersent)
              this.weightSum = sum
            }, 0)
            if (this.weightSum > 100 || this.weightSum < 100) {
              this.$message.error('占比和需等于100%')
            } else {
              if (valid) {
                this.dataForm.experimentSetDetails = this.lists
                this.dataForm.experimentSceneId = this.examilId
                this.dataForm.strategyType = this.strategyType
                const dataBody = this.dataForm
                const dataUpdateId = this.id
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
                        this.nextTodoId = 1
                      }
                    })
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            }
          } else {
            if (valid) {
              this.dataForm.experimentSetDetails = this.lists
              this.dataForm.experimentSceneId = this.examilId
              this.dataForm.strategyType = this.strategyType
              const dataBody = this.dataForm
              const dataUpdateId = this.id
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
                      this.nextTodoId = 1
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
        if (this.dataFormValue === 'look') {
          this.$refs['dataForm'].resetFields()
        } else {
          this.$refs['dataForm'].resetFields()
          this.$refs['dimensionForm'].resetFields()
        }
        this.lists = []
        this.proportionDisbild = false
        this.subgroupNameDisbild = false
        this.nextTodoId = 1
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