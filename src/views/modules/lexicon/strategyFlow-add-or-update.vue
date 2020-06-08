<template>
  <el-dialog :title="dataFormValue ? '查看' : dataForm.id ? '复制' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form-item label="策略流名称" prop="consumerName">
          <el-input v-model="dataForm.consumerName" placeholder="消费者名字"/>
        </el-form-item>
        <el-form-item label="场景类型">
          <el-select filterable v-model="dataForm.scene" placeholder="请选择策略场景" style="width:100%">
            <el-option v-for="item in sceneList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="策略流场景">
          <el-select filterable v-model="dataForm.hierarchy" placeholder="请选择策略层级" style="width:100%">
            <el-option v-for="item in hierarchyList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐类型">
          <el-select filterable v-model="dataForm.type" placeholder="请选择策略类型" style="width:100%">
            <el-option v-for="item in typeList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
        </el-form-item>
      </el-card>
      <el-card shadow="never" style="margin-top:20px">
        <div slot="header" class="clearfix">
          <span>层级设置</span>
        </div>
        <el-form-item label="策略ID">
          <el-select filterable v-model="latitude" placeholder="请选择数据源类型" @change='clickNewAddText'>
            <el-option v-for="item in newAddTextList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择层级">
          <el-select filterable v-model="latitude" placeholder="请选择数据源类型" @change='clickNewAddText'>
            <el-option v-for="item in newAddTextList" :value="item.value" :key="item.value" :label="item.value"/>
          </el-select>
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-plus" circle @click='addNewList' style="float: right;" ></el-button>
          </el-tooltip>
        </el-form-item>
          <el-table
            :data="lists"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="层级">
            </el-table-column>
            <el-table-column
              prop="title"
              label="任务ID">
            </el-table-column>
            <el-table-column
              prop="title"
              label="策略名称">
            </el-table-column>
            <el-table-column
              prop="title"
              label="策略层级">
            </el-table-column>
            <el-table-column header-align="center" align="center" width="200" label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-minus" circle @click='deletedlLists(scope.row.id)'></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
      </el-card>
      <el-card shadow="never" style="margin-top:20px">
        <div slot="header" class="clearfix">
          <span>预览图</span>
        </div>
        <real-time-strategy v-if="realTimeStrategyVisible" ref="realTimeStrategy"></real-time-strategy>
      </el-card>
    </el-form>

    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import EditableCell from './components/EditableCell'
  import realTimeStrategy from './sceneManageComponents/sceneManage-sceneConfig-real-time-strategy'
  import { infoBeeTask, saveorupt } from '@/api/workerBee/kafka'
  export default {
    data () {
      return {
        visible: false,
        editModeEnabled: true,
        dataForm: {
          consumerName: '',
          scene: '',
          hierarchy: '',
          type: '',
          loginType: '',
          latitude: []
        },
        dataFormValue: '',
        dataRule: {},
        latitude: '',
        sceneList: [
          {id: 1, value: '场景1'},
          {id: 2, value: '场景2'},
          {id: 3, value: '场景3'},
          {id: 4, value: '场景4'}
        ],
        hierarchyList: [
          {id: 1, value: '策略层级1'},
          {id: 2, value: '策略层级2'},
          {id: 3, value: '策略层级3'},
          {id: 4, value: '策略层级4'}
        ],
        typeList: [
          {id: 1, value: '策略类型1'},
          {id: 2, value: '策略类型2'},
          {id: 3, value: '策略类型3'},
          {id: 4, value: '策略类型4'}
        ],
        loginTypeList: [
          {id: 1, value: '登陆类型1'},
          {id: 2, value: '登陆类型2'},
          {id: 3, value: '登陆类型3'},
          {id: 4, value: '登陆类型4'}
        ],
        lists: [],
        nextTodoId: 1,
        newAddTextList: [
          {id: 1, value: '年龄'},
          {id: 2, value: '历史订单倾向'},
          {id: 3, value: '渠道'}
        ],
        weightForm: { weight: '' },
        priorityForm: { priority: '' },
        realTimeStrategyVisible: true
      }
    },
    components: {
      EditableCell,
      realTimeStrategy
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id, value) {
        this.dataForm.id = id || ''
        this.dataFormValue = value
        this.visible = true
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
        this.lists.push({
          id: this.nextTodoId++,
          title: this.latitude
        })
        this.latitude = ''
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
        this.latitude = val
      },
      // 弹窗状态
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.latitude = this.lists
            const dataBody = this.dataForm
            const dataUpdateId = this.dataForm.id
            saveorupt(dataBody, dataUpdateId).then(({data}) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$refs['dataForm'].resetFields()
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
<style scoped>
  .edit-cell {
    min-height: 35px;
    cursor: pointer;
  }
</style>