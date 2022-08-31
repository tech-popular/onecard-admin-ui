<template>
  <div class="wrap">
    <el-form v-loading="loading" :model="baseForm" :rules="baseRule" label-position="right" label-width="110px" ref="baseForm" class="base-form">
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
            <el-form-item label="前描述" prop="describePre">
              <el-input v-model="baseForm.describePre" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="后描述" prop="describeAfter">
              <el-input v-model="baseForm.describeAfter" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="申请原因" prop="approveReason">
              <el-input v-model="baseForm.approveReason" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="发送频率" prop="exportType">
              <el-radio v-model="baseForm.exportType" label="once">一次性</el-radio>
              <el-radio v-model="baseForm.exportType" label="period" style="margin-left:5px;">周期性</el-radio>
            </el-form-item>
            <el-form-item label="提数周期" prop="period" v-if="baseForm.exportType === 'period'">
              <el-select v-model="baseForm.period" placeholder="请选择" class="reject-pane-item" @change="disTimeTurnOff (baseForm.period)">
                <el-option v-for="item in sqlCycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接受天设置" prop="receiveDays" label-width="100px" v-if="baseForm.exportType === 'period'">
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
            <el-form-item prop="headUser" label="数据负责人" label-width="100px">
              <el-select filterable v-model="baseForm.headUser" class="reject-pane-item" placeholder="请选择">
                <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收方式" prop="receiveType">
              <el-radio v-model="baseForm.receiveType" label="0">钉钉</el-radio>
              <el-radio v-model="baseForm.receiveType" label="1" style="margin-left:5px;">邮件</el-radio>
            </el-form-item>
            <el-form-item label="接收内容类型" prop="receiveContentType">
              <el-radio v-model="baseForm.receiveContentType" label="1">图片</el-radio>
              <el-radio v-model="baseForm.receiveContentType" label="2" style="margin-left:5px;">Excel压缩包下载链接</el-radio>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="severDataFormSubmit" size="small">立即申请</el-button>
    </div>
  </div>
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
      activeNames: ['1'],
      baseForm: {
        datasourceId: '', // 数据源id
        databaseId: '', // 数据库id
        approveReason: '',
        exportType: 'once', // 提数类型
        period: '', // 提数周期
        receiveDays: '', // 接收天设置
        receiveTime: ['08:00', '23:59'],
        // receiveEndTime: '', // 允许接收时间接收时间
        receiveType: '0', // 接收类型
        receiveContentType: '1', // 接收内容方式
        receiver: [], // 接收人,
        describePre: '', // 前描述
        describeAfter: '', // 后描述
        headUser: '' // 负责人
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
        approveReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
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
        ],
        headUser: [
          { required: true, message: '请选择负责人', trigger: 'change' }
        ],
        describePre: [
          { required: true, message: '请输入前描述', trigger: 'blur' }
        ],
        describeAfter: [
          { required: true, message: '请输入后描述', trigger: 'blur' }
        ],
        exportType: [
          { required: true, message: '请选择发送频率', trigger: 'change' }
        ],
        receiveContentType: [
          { required: true, message: '请选择接收内容类型', trigger: 'change' }
        ],
      }
    }
  },
  components: { codemirror },
  mounted () {
    if (this.$route.query.id) {
      this.lookTaskDetail(this.$route.query.id)
    }
    this.getSourceDataList()
    this.getUsersList()

  },
  methods: {
    lookTaskDetail (id) {
      taskDetail(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.baseForm.datasourceId = data.data.datasourceId
          this.baseForm.databaseId = data.data.databaseId
          this.baseForm.approveReason = data.data.approveReason
          this.baseForm.exportType = data.data.exportType
          this.baseForm.period = data.data.period
          this.baseForm.receiveDays = data.data.receiveDays
          this.baseForm.receiver = data.data.receiver.split(',')
          this.baseForm.receiveType = data.data.receiveType.toString()
          this.baseForm.receiveContentType = data.data.receiveContentType.toString()
          this.baseForm.describeAfter = data.data.describeAfter
          this.baseForm.describePre = data.data.describePre
          this.sqlList = data.data.sqlList
          this.baseForm.receiveTime = [data.data.receiveStartTime, data.data.receiveEndTime]
          this.baseForm.headUser = data.data.headUser
          if (this.baseForm.exportType === 'period') {
            this.disTimeTurnOff(this.baseForm.period)
          }
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
      // this.sqlAddData = {
      //   sqlTitle: '',
      //   sql: ''
      // }
    },
    severDataFormSubmit () {
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          if (!this.sqlList.length && !this.sqlAddData.sqlTitle && !this.sqlAddData.sql) {
            return this.$message.error('请填写SQL名称及内容后再申请！')
          } else if (this.sqlAddData.sqlTitle && this.sqlAddData.sql) {
            this.sqlList.push(this.sqlAddData)
          } else if (!this.sqlAddData.sqlTitle && this.sqlAddData.sql) {
            return this.$message.error('请填写SQL名称后再申请！')
          } else if (this.sqlAddData.sqlTitle && !this.sqlAddData.sql) {
            return this.$message.error('请填写SQL内容后再申请！')
          }
          let params = {
            'datasourceId': this.baseForm.datasourceId,
            'databaseId': this.baseForm.databaseId,
            'type': 0,
            'receiveType': Number(this.baseForm.receiveType),
            'receiveContentType': Number(this.baseForm.receiveContentType),
            'approveReason': this.baseForm.approveReason,
            'exportType': this.baseForm.exportType,
            'period': this.baseForm.period,
            'receiveDays': this.baseForm.period === 'day' ? '' : this.baseForm.receiveDays,
            'receiveStartTime': this.baseForm.receiveTime[0],
            'receiveEndTime': this.baseForm.receiveTime[1],
            'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
            'headUser': this.baseForm.headUser,
            'describeAfter': this.baseForm.describeAfter,
            'describePre': this.baseForm.describePre,
            'sqlList': this.sqlList
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
                    this.sqlList = []
                    this.$refs['baseForm'].resetFields()
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
                    this.$refs['baseForm'].resetFields()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.reject-pane-item {
  width: 50%;
}
.footer {
  width: 20%;
  float: right;
}
.base-pane {
  display: flex;
  // border-bottom: 1px dashed #ccc;
  & .label-remove-margin {
    & .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.wrap {
  & .base-pane-item {
    width: 80%;
  }
  & .base-select {
    width: 40%;
  }
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
</style>
