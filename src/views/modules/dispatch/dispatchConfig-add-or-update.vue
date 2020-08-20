<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{!!id ? '编辑调度配置' : '新增调度配置'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
      <h3>基础信息<span v-if="!!id">最近修改人：<i>{{updateUser}}</i> 最近修改时间：<i>{{updateTime}}</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="110px">
        <div class="work-type-pane">
          <el-form-item label="任务名称：" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" disabled style="width: 400px">
              <template slot="prepend">{{formDs}}_to_{{toDs}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务ID：" prop="id">
            <el-input v-model="dataForm.id" placeholder="任务ID" disabled  style="width: 300px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统：" prop="projectSystemName">
          <el-input v-model="dataForm.projectSystemName" placeholder="所属系统" disabled  style="width: 300px" />
        </el-form-item>
        <el-form-item label="任务描述：" prop="taskDescribe">
          <el-input type="textarea" v-model="dataForm.taskDescribe" placeholder="任务描述" disabled />
        </el-form-item>
      </el-form>
      <div class="work-content-1">
        <h3 style="overflow:hidden">任务依赖
          <el-button style="float:right" type="danger" @click="deleteDependenceHandle">批量删除</el-button>
          <el-button style="float:right;margin-right:20px" type="primary" @click="addDependenceHandle">新增依赖</el-button>
        </h3>
        <div class="work-type-pane" style="align-items: flex-start;margin-top:10px">
          <div style="width: 110px;text-align:right;padding-right: 10px;">已选依赖：</div>
          <el-table
            style="flex:1;"
            ref="multipleTable"
            :data="dataForm.selectedDpendeceList"
            border
            @selection-change="handleSelectDependenceChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="taskName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="projectSystemName" label="所属系统"></el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <a style="cursor: pointer" @click="deleteDependenceHandle(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <dispatch-config-period ref="dispatchConfigPeriod" :id="id" :data="dispatchConfigPeriodData" :dispatch-status="dispatchStatusForm"></dispatch-config-period>
      <div class="work-content-1">
        <h3>调度报警</h3>
        <el-form label-width="110px" :model="dispatchWarningForm" :rules="dataRule" ref="dispatchWarningForm">
          <el-form-item prop="warningCause" label="报警原因：">
            <el-checkbox-group v-model="dispatchWarningForm.warningCause">
              <el-checkbox :label="0">失败</el-checkbox>
              <el-checkbox :label="1">超时</el-checkbox>
              <el-checkbox :label="2">成功</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="warningType" label="报警方式：">
            <el-checkbox-group v-model="dispatchWarningForm.warningType">
              <el-checkbox label="dingding">钉钉</el-checkbox>
              <el-checkbox label="tel">电话</el-checkbox>
              <el-checkbox label="mail">邮件</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="warningAccessUser" label="接收人：">
            <el-select v-model="dispatchWarningForm.warningAccessUser" multiple filterable style="width: 400px">
              <el-option :value="item.value" :label="item.name" v-for="item in warningAccessUserList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ddQunToken" label="钉钉群报警：">
            <el-input v-model="dispatchWarningForm.ddQunToken" style="width: 400px" placeholder="请输入token"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="work-content-1">
        <h3>调度启停</h3>
        <el-form label-width="110px" :model="dispatchStatusForm" :rules="dataRule" ref="dispatchStatus">
          <div class="work-type-pane">
            <el-form-item label="状态：" prop="dispatchStatus" label-width="100px">
              <el-radio-group v-model="dispatchStatusForm.dispatchStatus">
                <el-radio :label="0">有效</el-radio>
                <el-radio :label="1">无效</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="任务责任人：" prop="dutyUser" label-width="200px">
              <el-input v-model="dispatchStatusForm.dutyUser" placeholder="任务责任人" style="width: 300px" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <dispatch-config-task-dependent v-if="dispatchConfigTaskDependentVisible" ref="dispatchConfigTaskDependent" @refreshTaskDependence="getTaskSelectDependence"></dispatch-config-task-dependent>
  </el-drawer>
</template>

<script>
import {
  save,
  update,
  taskBaseInfo,
  taskDependenceDelete,
  taskSelectDependence,
  taskPeriodInfo
} from '@/api/dispatch/taskManag'
import dispatchConfigTaskDependent from './dispatchConfig-task-dependent'
import dispatchConfigPeriod from './dispatchConfig-time-period'
export default {
  components: {
    dispatchConfigTaskDependent,
    dispatchConfigPeriod
  },
  data () {
    return {
      visible: false,
      loading: false,
      id: '',
      formDs: '',
      toDs: '',
      updateUser: '',
      updateTime: '',
      selectedDpendeceData: [],
      dataForm: {
        taskName: '',
        id: '',
        projectSystemName: '',
        taskDescribe: '',
        selectedDpendeceList: [
          {
            id: 1,
            taskName: '1',
            taskSys: 'maxcompute1'
          },
          {
            id: 2,
            taskName: '2',
            taskSys: 'maxcompute'
          }
        ]
      },
      dispatchConfigPeriodData: {},
      dispatchStatusForm: {
        dispatchStatus: 0,
        dutyUser: ''
      },
      dispatchWarningForm: {
        warningCause: [1],
        warningType: ['dingding'],
        warningAccessUser: ['zhangbing'],
        ddQunToken: ''
      },
      warningAccessUserList: [
        {
          name: '章冰',
          value: 'zhangbing'
        },
        {
          name: '王一',
          value: 'wangyi'
        }
      ],
      dataRule: {
        warningCause: [
          { required: true, message: '请选择报警原因', trigger: 'change' }
        ],
        warningType: [
          { required: true, message: '请选择报警方式', trigger: 'change' }
        ],
        warningAccessUser: [
          { required: true, message: '请选择报警接收人', trigger: 'change' }
        ],
        ddQunToken: [
          { required: true, message: '请输入报警群', trigger: 'blur' }
        ],
        dispatchStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        dutyUser: [
          { required: true, message: '请输入任务责任人', trigger: 'blur' }
        ]
      },
      dispatchConfigTaskDependentVisible: false
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.$nextTick(() => {
        console.log(this)
        this.$refs.dispatchConfigPeriod.dataAssembly()
        this.$refs.dispatchConfigPeriod.disTimeTurnOff('MINUTE')
        if (id) {
          this.getTaskBaseInfo()
          this.getTaskSelectDependence()
          this.getTaskPeriodInfo()
        }
        this.$refs['dataForm1'].resetFields()
      })
    },
    // 基础信息
    getTaskBaseInfo () {
      taskBaseInfo(this.id).then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.msg || '获取数据异常')
        }
        this.dataForm.id = data.data.id
        this.dataForm.projectSystemName = data.data.projectSystemName
        this.dataForm.taskDescribe = data.data.taskDescribe
        let name = data.data.taskName.split('_')
        this.formDs = name[0]
        this.toDs = name[2]
        this.dataForm.taskName = name.slice(3).join('_')
      })
    },
    // 任务依赖列表
    getTaskSelectDependence () {
      taskSelectDependence(this.id).then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.msg || '获取数据异常')
        }
        this.dataForm.selectedDpendeceList = data.data
      })
    },
    // 获取周期信息 & 状态信息
    getTaskPeriodInfo () {
      taskPeriodInfo(this.id).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          if (data.data !== null) {
            this.dispatchConfigPeriodData = data.data
            this.dispatchStatusForm.dispatchStatus = data.data.dispatchStatus
            this.dispatchStatusForm.dutyUser = data.data.dutyUser
          } else {
            this.dispatchConfigPeriodData = null
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 已选依赖选中操作
    handleSelectDependenceChange (val) {
      console.log(val)
      this.selectedDpendeceData = val
    },
    // 删除所选依赖
    deleteDependenceHandle (row) {
      let arr = []
      if (row.id) { // 单个删除
        arr = [row.id]
      } else { // 批量删除
        if (!this.selectedDpendeceData.length) return
        this.selectedDpendeceData.forEach(item => {
          arr.push(item.id)
        })
      }
      taskDependenceDelete(arr).then(({data}) => {
        if (data && data.code === 0) {
          this.$message.success(data.msg)
          this.getTaskSelectDependence()
        } else {
          this.$message.error(data.msg || '删除失败')
        }
      })
    },
    // 新增依赖
    addDependenceHandle () {
      this.dispatchConfigTaskDependentVisible = true
      this.$nextTick(() => {
        this.$refs.dispatchConfigTaskDependent.init(this.dataForm.id)
      })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },

    // 提交
    dataFormSubmit (form) {
      let flag = true
      flag = this.$refs.dispatchConfigPeriod.validateForm()
      this.$refs['dispatchStatus'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['dispatchWarningForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      if (flag) {
        // 提交周期及状态信息数据
        this.$refs.dispatchConfigPeriod.submitData()
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        url({
          ...this.dataForm,
          taskName: `${this.formDs}_to_${this.toDs}_${this.dataForm.taskName}`,
          taskType: 'ACQUISITION',
          acquisitionTask: { ...this.acquisitionTask, sqlField: this.acquisitionTask.sqlField.join(',') }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg || '操作成功',
              type: 'success',
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
}
</script>
<style>
.api-manage-drawer .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
  }
  .wrap h3 span  {
    float: right;
    font-size: 12px;
    font-weight: normal;
  }
  .wrap h3 span i {
    font-style: normal;
    padding-right: 10px;
    color: #000;
  }
  .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  .drawer-close {
    position: absolute;
    right: 20px;
  }
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
  .btn-code-continue {
    text-align: right;
  }
  .work-content-1 {
    border-top: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin-top: 20px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
    z-index: 500;
  }
  .CodeMirror {
    height: 260px
  }
  .styled-background {
    color: red
  }
  .work-type-pane {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
  .CodeMirror-hints.xq-light, .CodeMirror-hints.idea {
    position: absolute;
    z-index: 9999;
    display: block;
  }
  .inputTag {
    border-radius: 4px;
    width: 600px;
    line-height: 22px;
    border: 1px solid #dcdfe6
  }
</style>
