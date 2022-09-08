<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1300px" class="data-transfer-manage-drawer">
    <div slot="title" class="drawer-title">
      订阅申请
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap">
      <el-form v-loading="loading" :model="baseForm" :rules="baseRule" label-width="80px" ref="baseForm" class="base-form">
        <div class="base-pane">
          <div style="width:29%">
            <el-form-item prop="datasourceId" label="数据源：">
              <el-select filterable v-model="baseForm.datasourceId" placeholder="请选择" clearable @change="selectdatabaseDataList">
                <el-option v-for="item in datasourceList" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="databaseId" label="数据库：">
              <el-select filterable v-model="baseForm.databaseId" clearable placeholder="请选择">
                <el-option v-for="item in databaseIdList" :key="item.id" :label="item.databaseName" :value="item.id"></el-option>
              </el-select>
              <span style="color:red;font-size:12px;">
                （如需配置数据源，请
                <i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
            </el-form-item>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="SQL列表" name="1">
                <div v-for="(item, index) in sqlList" :key="index">
                  <span style="font-style: normal;cursor:pointer;margin-right:20px" @click="clicksqlTitle(item.sqlTitle, index)">名称：{{item.sqlTitle}}</span>
                  <span style="float: right">
                    <i class="el-icon-close cursor-pointer" @click="deletesqlTitle(item, index)"></i>
                  </span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div style="width:60%">
            <el-form-item label="SQL名称" prop="sqlTitle">
              <el-input v-model="sqlAddData.sqlTitle"></el-input>
            </el-form-item>
            <el-form-item prop="sql" label="SQL：" ref="serviceBeginSqlForm">
              <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative;">
                <codemirror
                  ref="serviceBeginSql"
                  v-model="sqlAddData.sql"
                  :options="cmOptions"
                  @changes="cm => workItemChanges(cm, sqlAddData.sql, 'serviceBeginSqlForm', 'serviceBeginSql')"
                  @keydown.native="e => workItemKeyDown(e, 'serviceBeginSql')"
                  class="code"
                  style="padding-bottom: 0px;"
                ></codemirror>
              </div>
            </el-form-item>
            <el-form-item style="margin-top:10px;">
              <el-button type="primary" @click="dataSqlSubmit()">执行验证</el-button>
              <el-button type="primary" @click="SqlAddSubmit()">保存</el-button>
            </el-form-item>
            <div style="margin-left:50px;">
              <el-form-item label="主题" prop="theme">
                <el-input v-model="baseForm.theme" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="前描述" prop="describePre">
                <el-input v-model="baseForm.describePre" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="后描述" prop="describeAfter">
                <el-input v-model="baseForm.describeAfter" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="提数周期" prop="period">
                <el-select v-model="baseForm.period" placeholder="请选择" class="reject-pane-item" @change="disTimeTurnOff (baseForm.period)">
                  <el-option v-for="item in sqlCycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接受天设置" prop="receiveDays" label-width="100px">
                <el-select v-model="baseForm.receiveDays" class="reject-pane-item" placeholder="请选择">
                  <el-option v-for="item in receiveDaysList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="允许接收时间段" prop="receiveTime" label-width="120px">
                <el-time-picker is-range v-model="baseForm.receiveTime" format="HH:mm" value-format="HH:mm" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
              </el-form-item>
              <el-form-item prop="receiver" label="数据接收人" label-width="100px">
                <el-select filterable multiple v-model="baseForm.receiver" class="reject-pane-item" placeholder="请选择">
                  <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接收方式" prop="receiveType">
                <el-radio v-model="baseForm.receiveType" label="0">钉钉</el-radio>
                <el-radio v-model="baseForm.receiveType" label="1" style="margin-left:5px;">邮件</el-radio>
              </el-form-item>
              <el-form-item label="接收内容类型" prop="receiveContentType">
                <el-radio v-model="baseForm.receiveContentType" label="0">链接</el-radio>
                <el-radio v-model="baseForm.receiveContentType" label="1" style="margin-left:5px;">图片</el-radio>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="severDataFormSubmit" size="small">立即申请</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getUsersList, queryEnableList, databaseList, editTask, saveTask, taskDetail } from '@/api/dataGovernance/subscribeManage'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/anyword-hint.js'
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/sql-hint.js')
export default {
  data () {
    return {
      loading: false,
      visible: true,
      dataListLoading: false,
      activeNames: 1,
      baseForm: {
        id: '',
        datasourceId: '', // 数据源id
        databaseId: '', // 数据库id
        theme: '', // 申请原因
        period: '', // 提数周期
        receiveDays: '', // 接收天设置
        receiveTime: ['08:00', '23:59'],
        // receiveEndTime: '', // 允许接收时间接收时间
        receiveType: '0', // 接收类型
        receiveContentType: '1', // 接收内容方式
        receiver: [], // 接收人,
        describePre: '', // 前描述
        describeAfter: '' // 后描述
      },
      sqlAddData: {
        sqlTitle: '',
        sql: ''
      },
      sqlList: [],
      datasourceList: [],
      databaseIdList: [],
      receiveDaysList: [], // 接收天设置list
      userList: [],
      userid: sessionStorage.getItem('id'),
      sqlCycleList: [
        { value: 'hours', label: '小时' },
        { value: 'day', label: '天' },
        { value: 'week', label: '周' },
        { value: 'month', label: '月' }
      ],
      dayOfWeeksList: [
        { value: 'MON', label: '周一' },
        { value: 'TUE', label: '周二' },
        { value: 'WED', label: '周三' },
        { value: 'THU', label: '周四' },
        { value: 'FRI', label: '周五' },
        { value: 'SAT', label: '周六' },
        { value: 'SUN', label: '周日' }
      ],
      dayOfMonthsList: [],
      cmOptions: {
        theme: 'idea',
        mode: 'text/x-sparksql',
        lineWrapping: true,
        lineNumbers: true,
        autofocus: false,
        smartIndent: false,
        autocorrect: true,
        spellcheck: true,
        extraKeys: {
          Tab: 'autocomplete'
        },
        lint: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter'
        ],
        foldGutter: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleActiveLine: true,
        autoRefresh: true,
        highlightSelectionMatches: {
          minChars: 2,
          style: 'matchhighlight',
          showToken: true
        },
        styleSelectedText: true
      },
      baseRule: {
        datasourceId: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        databaseId: [
          { required: true, message: '请选择数据库', trigger: 'change' }
        ],
        theme: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        receiveDays: [
          { required: true, message: '请选择接收天设置', trigger: 'change' }
        ],
        receiveType: [
          { required: true, message: '请选择接收类型', trigger: 'change' }
        ],
        receiver: [
          { type: 'array', required: true, message: '请选择接收人', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请选择提数周期', trigger: 'change' }
        ]
      }
    }
  },
  components: { codemirror },
  methods: {
    // 打开抽屉弹窗
    init (row) {
      this.getSourceDataList()
      this.getUsersList()
      if (row.id) {
        this.baseForm.id = row.taskDetail
        this.lookTaskDetail(row.id)
      } else {
        this.$nextTick(() => {
          this.$refs['baseForm'].resetFields()
        })
      }
      this.visible = true
    },
    lookTaskDetail (id) {
      taskDetail(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.baseForm.datasourceId = data.data.datasourceId
          this.baseForm.databaseId = data.data.databaseId
          this.baseForm.theme = data.data.theme
          this.baseForm.period = data.data.period
          this.baseForm.receiveDays = data.data.receiveDays
          this.baseForm.receiver = data.data.receiver.split(',')
          this.baseForm.receiveType = data.data.receiveType.toString()
          this.baseForm.receiveContentType = data.data.receiveContentTyp.toString()
          this.baseForm.describeAfter = data.data.describeAfter
          this.baseForm.describePre = data.data.describePre
          this.sqlAddData = data.data.sqlList
          this.baseForm.receiveTime = [data.data.receiveStartTime, data.data.receiveEndTime]
        } else {
          this.$message({
            message: data.message || '数据异常',
            type: 'error'
          })
        }
      })
    },
    // 获取用户同一租户下的列表
    getUsersList () {
      getUsersList().then(({ data }) => {
        if (data && data.code === 0) {
          this.userList = data.data
        } else {
          this.userList = []
        }
      })
    },
    // 获取服务器列表
    getSourceDataList () {
      queryEnableList({ 'userid': this.userid }).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.datasourceList = data.data
        } else {
          this.datasourceList = []
        }
      })
    },
    // 获取数据库列表
    selectdatabaseDataList () {
      databaseList(this.baseForm.datasourceId).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.baseForm.databaseId = ''
          this.databaseIdList = data.data
        } else {
          this.baseForm.databaseId = ''
          this.databaseIdList = []
        }
      })
    },
    // sql执行预览
    dataSqlSubmit () {
      // let params = {
      //   'databaseId': this.baseForm.databaseId,
      //   'sql': this.baseForm.sql
      // }
      // sqlPreview(params).then(({ data }) => {
      //   if (data && data.code === 0 && this.dataSqlSubmitTime < 180) {
      //     this.$message({
      //       message: '查询成功',
      //       type: 'success',
      //       duration: 1500,
      //       onClose: () => {
      //       }
      //     })
      //   } else {
      //   }
      // })
    },
    //  时间间隔 数据切换
    disTimeTurnOff (disType) {
      let tempArry = []
      if (disType === 'day') {
        tempArry.push({ value: '1', label: '每天' })
      } else if (disType === 'hours') {
        for (let i = 1, j = 24; i < j; i++) {
          tempArry.push({ value: i, label: '每隔' + i + '小时' })
        }
      } else if (disType === 'month') {
        for (let i = 1, j = 32; i < j; i++) {
          tempArry.push({ value: i, label: '每月' + i + '号' })
        }
        // tempArry.push({ value: '-1', label: '每月最后一天' })
      }
      this.baseForm.receiveDays = ''
      if (disType === 'week') {
        this.receiveDaysList = this.dayOfWeeksList
      } else {
        this.receiveDaysList = tempArry
      }
    },
    workItemChanges (cm, sql, refForm, selfRef) { // 内容更新时，不为空时将报错信息去除
      if (sql !== '') {
        this.$refs[refForm].clearValidate()
      }
      if (!sql) {
        this.$nextTick(() => {
          this.$refs[selfRef].codemirror.setOption('lint', false)
        })
      } else {
        this.$refs[selfRef].codemirror.setOption('lint', false)
        this.$nextTick(() => {
          this.$refs[selfRef].codemirror.setOption('lint', true)
        })
      }
    },
    // 按下键盘事件处理函数
    workItemKeyDown (event, ref) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs[ref].codemirror.showHint({ completeSingle: false })
      }
    },
    gotoDataSource () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
      this.$router.push({ name: 'dataGovernance-subscribeManage' })
    },
    SqlAddSubmit () {
      this.sqlList.push(this.sqlAddData)
      this.sqlAddData = {
        sqlTitle: '',
        sql: ''
      }
    },
    deletesqlTitle (index) {
      this.sqlList.splice(index, 1)
    },
    clicksqlTitle (sqlTitle, index) {
      this.sqlAddData.sqlTitle = sqlTitle
      this.sqlAddData.sql = this.sqlList[index].sql
      this.sqlAddData = {
        sqlTitle: '',
        sql: ''
      }
    },
    severDataFormSubmit () {
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          let params = {
            'datasourceId': this.baseForm.datasourceId,
            'databaseId': this.baseForm.databaseId,
            'sql': this.baseForm.sql,
            'theme': this.baseForm.theme,
            'period': this.baseForm.period,
            'receiveDays': this.baseForm.period === 'day' ? '' : this.baseForm.receiveDays,
            'receiveStartTime': this.baseForm.receiveTime[0],
            'receiveEndTime': this.baseForm.receiveTime[1],
            'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
            'receiveType': Number(this.baseForm.receiveType),
            'receiveContentType': Number(this.baseForm.receiveContentType),
            'describeAfter': this.baseForm.describeAfter,
            'describePre': this.baseForm.describePre,
            'sqlList': this.sqlAddData
          }
          if (this.baseForm.id) {
            params.id = this.baseForm.id
            editTask(params).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.$refs['baseForm'].resetFields()
                    this.visible = false
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            saveTask(params).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.$refs['baseForm'].resetFields()
                    this.visible = false
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
    // 关闭抽屉弹窗
    drawerClose () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    // 关闭
    cancelHandle () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>
<style lang="scss">
.data-transfer-manage-drawer {
  & .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
    .step-title {
      height: 30px;
      background: #e8e2e2;
      line-height: 30px;
      padding-left: 20px;
    }
    .steps-horizontal {
      height: 200px;
      display: flex;
      align-items: center;
      padding-left: 100px;
      border-bottom: 2px solid #97999e;
      font-weight: bolder;
      color: #333;
      .horizontal-one {
        height: 120px;
      }
      .one-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        border-color: #67c23a;
        color: #47ca6f;
        line-height: 90px;
        text-align: center;
      }
      .horizontal-line {
        height: 4px;
        width: 350px;
        background-color: #9b9c9e;
        margin-top: -10px;
      }
      .horizontal-icon {
        font-size: 28px;
        color: #9b9c9e;
        margin-left: -10px;
        margin-top: -10px;
      }
      .two-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        color: #303133;
        border-color: #ced3de;
        font-weight: bolder;
        line-height: 90px;
        text-align: center;
      }
      .three-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        color: #47ca6f;
        border-color: #ced3de;
        font-weight: bolder;
        line-height: 90px;
        text-align: center;
      }
    }
  }
  .reject-pane-item {
    width: 50%;
  }
  & .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  & .drawer-close {
    position: absolute;
    right: 20px;
  }
  & .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, 0.17);
    z-index: 500;
  }
  & .vue-treeselect {
    min-height: 38px;
    line-height: 24px;
    max-width: 100%;
  }
  & .base-pane {
    display: flex;
    // border-bottom: 1px dashed #ccc;
    & .label-remove-margin {
      & .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  & .base-pane-item {
    width: 80%;
  }
  & .base-select {
    width: 40%;
  }
  // & .base-form{
  //   & .pane-rules{
  //     & .el-form-item__content{
  //       margin-left: 0px !important;
  //     }
  //   }
  // }
  & .radio-item {
    margin-right: 15px;
  }
  & .radio-passive {
    margin-left: 30px;
  }
  & .radio-incremodel {
    margin-right: 15px;
  }
  & .transfer-log {
    margin-left: 20px;
  }
}
.el-drawer__open .el-drawer.rtl {
  width: 80% !important;
}
</style>
