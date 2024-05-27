<template>
  <div class="wrap">
    <div class="base-pane">
      <div style="width:25%">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="SQL列表" name="1">
            <div v-for="(item, index) in sqlList" :key="index">
              <span style="font-style: normal; font-size: 16px;cursor:pointer;margin-right:20px" @click="clicksqlTitle(item.sqlTitle, index)">名称：{{item.sqlTitle}}</span>
              <span style="float: right">
                <i class="el-icon-close cursor-pointer" v-if="!editAble" @click="deletesqlTitle(item, index)"></i>
              </span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div style="width:70%">
        <el-form v-loading="loading" :disabled="editAble" :model="sqlAddData" :rules="sqlAddDataRule" label-position="right" label-width="110px" ref="sqlAddData" class="base-form">
          <div style="display:flex">
            <el-form-item prop="datasourceId" label="数据源：">
              <el-select filterable v-model="sqlAddData.datasourceId" placeholder="请选择" clearable @change="selectdatabaseDataList">
                <el-option v-for="item in datasourceList" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="databaseId" label="数据库：">
              <el-select filterable v-model="sqlAddData.databaseId" clearable placeholder="请选择">
                <el-option v-for="item in databaseIdList" :key="item.id" :label="item.databaseName" :value="item.id"></el-option>
              </el-select>
              <span style="color:red;font-size:12px;">
                （如需配置数据源，请
                <i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="sql" label="SQL：" ref="serviceBeginSqlForm" >
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
              <span style="color:#6da7ff; position:absolute;left: 40px;top:4px;">{{sqlAddData.placeholder}}</span>
            </div>
          </el-form-item>
          <div style="display:flex">
            <el-form-item label="SQL名称：" prop="sqlTitle">
              <el-input v-model="sqlAddData.sqlTitle" type="text" maxlength="50" style="width:500px"></el-input>
            </el-form-item>
            <el-form-item label-width="20px">
              <el-button :disabled="dataSqlSubmiting" type="success" size="medium" @click="dataSqlSubmit()">执行验证</el-button>
              <el-button @click="SqlAddSubmit()" v-if="!editAble" type="primary" size="medium">添加</el-button>
            </el-form-item>
          </div>
          <el-form-item v-if="previewing" label-width="70px">
            <span :style="{color:previewTextColor}">{{previewText}},执行时间&nbsp;&nbsp;{{dataSqlSubmitTime}}</span>
            <span>
              <el-button type="text" v-if="sqlPreviewDataList.length" @click="previewSqlData">预览查询结果</el-button>
              <span v-if="sqlPreviewDataList.length">（随机展示100条数据）</span>
              <!-- <span v-if="sqlPreviewDataList.length === 0">无数据</span> -->
            </span>
          </el-form-item>
        </el-form>
        <div>
          <el-form v-loading="loading" :disabled="editAble" :model="baseForm" :rules="baseRule" label-position="right" label-width="130px" ref="baseForm" class="base-form">
            <el-form-item label="接收方式" prop="receiveType">
              <el-radio v-model="baseForm.receiveType" label="0">钉钉</el-radio>
              <el-radio v-model="baseForm.receiveType" label="1" style="margin-left:5px;">邮件</el-radio>
            </el-form-item>
            <el-form-item label="接收内容类型：" prop="receiveContentType">
              <el-radio v-model="baseForm.receiveContentType" label="1" @change="receiveContentTypeChange">图片</el-radio>
              <el-radio v-model="baseForm.receiveContentType" label="2" style="margin-left:5px;">Excel</el-radio>
              <el-radio v-model="baseForm.receiveContentType" v-if="checkUserHaveHtmlVisible && baseForm.receiveType === '1'" @change="receiveContentTypeChange" label="3" style="margin-left:5px;">HTML</el-radio>
            </el-form-item>
            <el-form-item label="Excel数据分布：" prop="excelContentType" v-if="checkUserHaveHtmlVisible && baseForm.receiveContentType === '2'">
              <el-tooltip class="item" effect="dark" content="多条sql数据分布于多个excel文件" placement="top">
                <el-radio v-model="baseForm.excelContentType" label="1" style="margin-left:5px;">文件</el-radio>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="多条sql数据分布于一个excel不同sheet页" placement="top">
                <el-radio v-model="baseForm.excelContentType" label="2" style="margin-left:5px;">sheet</el-radio>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="发送频率：" prop="exportType">
              <el-radio v-model="baseForm.exportType" label="once">一次性</el-radio>
              <el-radio v-model="baseForm.exportType" label="period" style="margin-left:5px;">周期性</el-radio>
            </el-form-item>
            <el-form-item label="提数周期：" prop="period" v-if="baseForm.exportType === 'period'">
              <el-select v-model="baseForm.period" placeholder="请选择" class="reject-pane-item" @change="disTimeTurnOff (baseForm.period)">
                <el-option v-for="item in sqlCycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接受天设置：" prop="receiveDays" v-if="baseForm.exportType === 'period'">
              <el-select v-model="baseForm.receiveDays" class="reject-pane-item" placeholder="请选择">
                <el-option v-for="item in receiveDaysList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="允许接收时间段：" prop="receiveTime">
              <el-time-picker is-range v-model="baseForm.receiveTime" format="HH:mm" value-format="HH:mm" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
            </el-form-item>
            <el-form-item prop="receiver" label="数据接收人：">
              <el-select filterable multiple v-model="baseForm.receiver" class="reject-pane-item" placeholder="请选择">
                <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="headUser" label="数据负责人：">
              <el-select filterable v-model="baseForm.headUser" class="reject-pane-item" placeholder="请选择">
                <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请原因：" prop="approveReason">
              <el-input v-model="baseForm.approveReason" type="textarea" show-word-limit :autosize="{ minRows: 2}" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="前描述：" prop="describePre">
              <el-input v-model="baseForm.describePre" type="textarea" show-word-limit :autosize="{ minRows: 2}" maxlength="1000"></el-input>
            </el-form-item>
            <el-form-item label="后描述：" prop="describeAfter">
              <el-input v-model="baseForm.describeAfter" type="textarea" show-word-limit :autosize="{ minRows: 2}" maxlength="1000"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="sql-footer">
      <el-button type="primary" v-if="!editAble" @click="severDataFormSubmit" size="small">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getUsersList, queryEnableList, databaseList, editTask, saveTask, taskDetail, checkUserHaveHtml } from '@/api/dataGovernance/subscribeManage'
import { sqlPreview } from '@/api/dataGovernance/datareport'
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
      previewText: '',
      previewTextColor: '#303133',
      previewing: false,
      sqlSubmitSuccess: false,
      dataSqlSubmiting: false,
      dataSqlSubmitTime: 0,
      checkUserHaveHtmlVisible: false,
      editAble: false,
      timer: null,
      baseForm: {
        id: '',
        approveReason: '',
        exportType: 'once', // 提数类型
        period: '', // 提数周期
        receiveDays: '', // 接收天设置
        receiveTime: ['08:00', '23:59'],
        // receiveEndTime: '', // 允许接收时间接收时间
        receiveType: '', // 接收类型
        receiveContentType: '', // 接收内容方式
        excelContentType: '1',
        receiver: [], // 接收人,
        describePre: '', // 前描述
        describeAfter: '', // 后描述
        headUser: '' // 负责人
      },
      sqlAddData: {
        datasourceId: '', // 数据源id
        databaseId: '', // 数据库id
        sqlTitle: '',
        sql: '',
        id: 1,
        placeholder: '请输入sql语句，查询数量超过5万条，请将sql自行排序，程序将自动分页查询!'
      },
      sqlList: [],
      datasourceList: [],
      databaseIdList: [],
      receiveDaysList: [], // 接收天设置list
      sqlPreviewDataList: [], // sql预览数据
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
        approveReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 检查是否为空字符串、仅包含空格、仅包含数字或仅包含字母
              if (value === '' || /^ *$/.test(value) || /^\d+$/.test(value) || /^[a-zA-Z]+$/.test(value)) {
                callback(new Error('请输入有效的申请原因，不能是空串、空格、单独的数字或字母。'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
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
        // describePre: [
        //   { required: true, message: '请输入前描述', trigger: 'blur' }
        // ],
        // describeAfter: [
        //   { required: true, message: '请输入后描述', trigger: 'blur' }
        // ],
        exportType: [
          { required: true, message: '请选择发送频率', trigger: 'change' }
        ],
        receiveContentType: [
          { required: true, message: '请选择接收内容类型', trigger: 'change' }
        ]
      },
      sqlAddDataRule: {
        datasourceId: [
          { required: true, message: '请选择数据源', trigger: 'blur' }
        ],
        databaseId: [
          { required: true, message: '请选择数据库', trigger: 'blur' }
        ],
        sqlTitle: [
          { required: true, message: '请输入SQL名称', trigger: 'blur' }
        ],
        sql: [{ required: true, message: 'sql不能为空', trigger: 'blur' }]
      }
    }
  },
  components: { codemirror },
  activated () {
    this.reload()
  },
  methods: {
    reload () {
      this.editAble = false
      this.$refs['sqlAddData'].resetFields()
      this.$refs['baseForm'].resetFields()
      if (this.$route.query.id) {
        this.lookTaskDetail(this.$route.query.id)
      } else {
        this.baseForm.id = 0
        this.sqlList = []
        this.baseForm.period = ''
        this.baseForm.receiveDays = ''
      }
      this.getSourceDataList()
      this.getUsersList()
      this.checkUserHaveHtmlHandle()
      this.sqlPreviewDataList = []
      this.previewing = false
      this.previewText = ''
      this.dataSqlSubmiting = false
      this.sqlSubmitSuccess = false
    },
    lookTaskDetail (id) {
      taskDetail(id).then(({ data }) => {
        if (data && data.code === 0) {
          this.baseForm.id = data.data.id
          this.baseForm.status = data.data.status
          // this.baseForm.datasourceId = data.data.datasourceId
          // this.baseForm.databaseId = data.data.databaseId
          this.baseForm.approveReason = data.data.approveReason
          this.baseForm.exportType = data.data.exportType
          this.baseForm.period = data.data.period
          this.baseForm.receiveDays = data.data.period === 'month' || data.data.period === 'hours' ? Number(data.data.receiveDays) : data.data.receiveDays
          this.baseForm.receiver = data.data.receiver.split(',')
          this.baseForm.receiveType = data.data.receiveType.toString()
          this.baseForm.receiveContentType = data.data.receiveContentType.toString()
          this.baseForm.excelContentType = data.data.excelContentType.toString()
          this.baseForm.describeAfter = data.data.describeAfter
          this.baseForm.describePre = data.data.describePre
          this.sqlList = data.data.sqlList.map((item, index) => {
            item.id = index + 1
            return item
          })
          // this.sqlAddData.sqlTitle = this.sqlList[0].sqlTitle
          this.sqlAddData = this.sqlList[0]
          // this.sqlAddData.sql = this.sqlList[0].sql
          // this.sqlAddData.datasourceId = this.sqlList[0].datasourceId
          // this.sqlAddData.databaseId = this.sqlList[0].databaseId
          // this.sqlAddData.id = this.sqlList[0].id
          this.baseForm.receiveTime = [data.data.receiveStartTime, data.data.receiveEndTime]
          this.baseForm.headUser = data.data.headUser
          this.getDatabaseList()
          if (this.baseForm.status === 0) {
            // let tempArry = []
            // if (this.baseForm.period === 'day') {
            //     this.baseForm.receiveDays = 1
            //     tempArry.push({ value: 1, label: '每天' })
            // } else if (this.baseForm.period === 'hours') {
            //   for (let i = 1, j = 24; i < j; i++) {
            //     tempArry.push({ value: i, label: '每隔' + i + '小时' })
            //   }
            // } else if (this.baseForm.period === 'month') {
            //   for (let i = 1, j = 32; i < j; i++) {
            //     tempArry.push({ value: i, label: '每月' + i + '号' })
            //   }
            //   // tempArry.push({ value: 'L', label: '每月最后一天' })
            // }
            // if (this.baseForm.period === 'week') {
            //   this.receiveDaysList = this.dayOfWeeksList
            // } else {
            //   this.receiveDaysList = tempArry
            // }
            this.disTimeTurnOff(this.baseForm.period)
          } else {
            this.editAble = true
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
    // 获取用户是否有权限使用HTML的接收方式
    checkUserHaveHtmlHandle () {
      checkUserHaveHtml().then(({ data }) => {
        if (data && data.code === 0) {
          this.checkUserHaveHtmlVisible = data.data
        } else {
          this.checkUserHaveHtmlVisible = false
          this.$message.error(data.msg)
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
      this.baseForm.databaseId = ''
      this.getDatabaseList()
    },
    getDatabaseList () {
      databaseList(this.sqlAddData.datasourceId).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.databaseIdList = data.data
        } else {
          this.databaseIdList = []
        }
      })
    },
    // sql执行预览
    dataSqlSubmit () {
      this.previewText = '执行中'
      this.previewing = true
      this.dataSqlSubmiting = true
      this.previewTextColor = '#303133'
      this.dataSqlSubmitTime = 0
      let params = {
        'databaseId': this.sqlAddData.databaseId,
        'datasourceId': this.sqlAddData.datasourceId,
        'sql': this.sqlAddData.sql
      }
      let that = this
      that.timer = setInterval(function () {
        if (that.dataSqlSubmitTime >= 180) {
          that.previewText = '执行超时,请联系管理员'
          that.sqlSubmitSuccess = false
          that.dataSqlSubmiting = false
          that.previewTextColor = 'red'
          clearInterval(that.timer)
        }
        that.dataSqlSubmitTime = that.dataSqlSubmitTime + 1
      }, 1000)
      sqlPreview(params).then(({ data }) => {
        clearInterval(this.timer)
        if (data && data.code === 0 && this.dataSqlSubmitTime < 180) {
          this.$message({
            message: '查询成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.sqlPreviewDataList = data.data
              sessionStorage.setItem('sqlPreviewDataList', JSON.stringify(data.data || '[]'))
              this.previewText = '查询成功'
              this.sqlSubmitSuccess = true
              this.dataSqlSubmiting = false
            }
          })
        } else {
          sessionStorage.setItem('sqlPreviewDataList', [])
          if (this.dataSqlSubmitTime < 180) {
            this.previewTextColor = 'red'
            this.$message.error(data.msg)
            this.previewText = '执行失败：' + data.msg
          }
          this.sqlSubmitSuccess = false
          this.dataSqlSubmiting = false
        }
      })
    },
    // 点击查看预览数据
    previewSqlData () {
      let routeUrl = this.$router.resolve({ path: '/dataGovernance-reportData' })
      window.open(routeUrl.href, '_blank')
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
        // tempArry.push({ value: 'L', label: '每月最后一天' })
      }
      if (disType === 'week') {
        this.receiveDaysList = this.dayOfWeeksList
      } else {
        this.receiveDaysList = tempArry
      }
    },
    workItemChanges (cm, sql, refForm, selfRef) { // 内容更新时，不为空时将报错信息去除
      console.log('sql:' + sql)
      if (sql !== '') {
        this.$refs[refForm].clearValidate()
        this.sqlAddData.placeholder = ''
      } else {
        this.sqlAddData.placeholder = '请输入sql语句，查询数量超过5万条，请将sql自行排序，程序将自动分页查询!'
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
    // 配置数据源
    gotoDataSource () {
      this.$router.push({ name: 'dataGovernance-datasourceManage' })
    },
    // 接受内容方式
    receiveContentTypeChange (label) {
      if (label === '1' || label === '3') {
        return this.$message.warning('如果数据量超过1000条请使用Excel')
      }
    },
    SqlAddSubmit () {
      this.$refs['sqlAddData'].validate(valid => {
        if (!valid) {
          return this.$message.warn('请补全或清空SQL信息')
        } else {
          if (this.sqlList.length) {
            let sqlfilterList = this.sqlList.filter(item => item.id === this.sqlAddData.id)
            if (!sqlfilterList.length) {
              this.sqlList.push(this.sqlAddData)
            }
          } else {
            this.sqlList.push(this.sqlAddData)
          }
        }
      })
      // this.sqlList.push(this.sqlAddData)
      this.sqlAddData = {
        sqlTitle: '',
        sql: '',
        databaseId: '',
        datasourceId: '',
        id: this.sqlList.length + 1
      }
      this.$refs['sqlAddData'].clearValidate()
    },
    deletesqlTitle (item, index) {
      if (item.id === this.sqlAddData.id) {
        this.sqlList.splice(index, 1)
        if (this.sqlList.length) {
          this.sqlAddData = this.sqlList[0]
        } else {
          this.sqlAddData = {
            sqlTitle: '',
            sql: '',
            databaseId: '',
            datasourceId: '',
            id: 0
          }
        }
        // this.sqlAddData.sql = this.sqlList[0].sql
        // this.sqlAddData.datasourceId = this.sqlList[0].datasourceId
        // this.sqlAddData.databaseId = this.sqlList[0].databaseId
      } else {
        this.sqlList.splice(index, 1)
      }
    },
    clicksqlTitle (sqlTitle, index) {
      this.sqlAddData = this.sqlList[index]
    },
    severDataFormSubmit () {
      let sqlValid = true
      if (!this.sqlList.length) {
        this.$refs['sqlAddData'].validate(valid => {
          if (!valid) {
            sqlValid = false
          } else {
            this.sqlList.push(this.sqlAddData)
          }
        })
      } else {
        if (!this.sqlAddData.datasourceId && !this.sqlAddData.databaseId && !this.sqlAddData.sqlTitle && !this.sqlAddData.sql) {
          sqlValid = true
        } else {
          this.$refs['sqlAddData'].validate(valid => {
            if (!valid) {
              sqlValid = false
              return this.$message.warning('请补全或清空SQL信息')
            } else {
              let sqlfilterList = this.sqlList.filter(item => item.id === this.sqlAddData.id)
              if (!sqlfilterList.length) {
                this.sqlList.push(this.sqlAddData)
              }
            }
          })
        }
      }
      this.$refs['baseForm'].validate(valid => {
        if (!valid) {
          sqlValid = false
        }
      })
      if (sqlValid) {
        let sqlListSaveData = this.sqlList.map(item => {
          delete item.id
          return item
        })
        let params = {
          'type': 0,
          'receiveType': Number(this.baseForm.receiveType),
          'receiveContentType': Number(this.baseForm.receiveContentType),
          'excelContentType': Number(this.baseForm.excelContentType),
          'approveReason': this.baseForm.approveReason,
          'exportType': this.baseForm.exportType,
          'period': this.baseForm.exportType === 'once' ? '' : this.baseForm.period,
          'receiveDays': this.baseForm.exportType === 'once' ? '' : (this.baseForm.period === 'day' ? '1' : this.baseForm.receiveDays),
          'receiveStartTime': this.baseForm.receiveTime[0],
          'receiveEndTime': this.baseForm.receiveTime[1],
          'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
          'headUser': this.baseForm.headUser,
          'describeAfter': this.baseForm.describeAfter,
          'describePre': this.baseForm.describePre,
          'sqlList': sqlListSaveData
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
                  const path = this.$route.path // 先获取路由路径
                  this.$router.push(path) // 再跳转路由路径，query参数没带，被清除掉
                  this.reload()
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
                  this.reload()
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
}
</script>
<style lang="scss" scoped>
.reject-pane-item {
  width: 50%;
}
.sql-footer {
  width: 15%;
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
