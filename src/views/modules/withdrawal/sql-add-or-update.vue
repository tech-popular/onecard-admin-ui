<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1300px" class="data-transfer-manage-drawer">
    <div slot="title" class="drawer-title">
      SQL提数
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap">
      <el-form v-loading="loading" :model="baseForm" :rules="baseRule" label-position="right" label-width="110px" ref="baseForm" class="base-form">
        <div class="base-pane">
          <el-tabs type="border-card">
            <el-tab-pane label="自助查询">
              <div style="display:flex">
                <div>
                  <el-form-item prop="dataSourceId" label="服务器：" label-width="80px">
                    <el-select filterable v-model="baseForm.dataSourceId" placeholder="请选择" clearable @change="selectdatabaseDataList">
                      <el-option v-for="item in datasourceList" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="dataBaseId" label="数据库：" label-width="80px">
                    <el-select filterable v-model="baseForm.dataBaseId" clearable placeholder="请选择">
                      <el-option v-for="item in databaseIdList" :key="item.id" :label="item.databaseName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="新增数据源信息" name="1">
                      <el-form-item label="类型" prop="type" label-width="80px">
                        <el-radio v-model="baseForm.addingDatabase.type" @change="radioTypeChange" label="mysql">mysql</el-radio>
                        <el-radio v-model="baseForm.addingDatabase.type" @change="radioTypeChange" label="maxComputer" style="margin-left:5px;">maxComputer</el-radio>
                      </el-form-item>
                      <el-form-item label="实例地址" label-width="80px" prop="url" v-if="baseForm.addingDatabase.type === 'mysql'">
                        <el-input v-model="baseForm.addingDatabase.url" placeholder="jdbc:mysql://ip:3306/"></el-input>
                      </el-form-item>
                      <el-form-item label="数据库" label-width="80px" prop="database" v-if="baseForm.addingDatabase.type === 'mysql'">
                        <el-input v-model="baseForm.addingDatabase.database" placeholder="database"></el-input>
                      </el-form-item>
                      <el-form-item label="用户名" label-width="80px" prop="userName" v-if="baseForm.addingDatabase.type === 'mysql'">
                        <el-input v-model="baseForm.addingDatabase.userName" placeholder="user"></el-input>
                      </el-form-item>
                      <el-form-item label="密码" label-width="80px" prop="password" v-if="baseForm.addingDatabase.type === 'mysql'">
                        <el-input v-model="baseForm.addingDatabase.password" placeholder="password"></el-input>
                      </el-form-item>
                      <el-form-item label="空间名" label-width="80px" prop="database" v-if="baseForm.addingDatabase.type === 'maxComputer'">
                        <el-input v-model="baseForm.addingDatabase.database" placeholder="bd_src"></el-input>
                      </el-form-item>
                      <el-form-item label="用户名" label-width="80px" prop="userName" v-if="baseForm.addingDatabase.type === 'maxComputer'">
                        <el-input v-model="baseForm.addingDatabase.userName" placeholder="access-id"></el-input>
                      </el-form-item>
                      <el-form-item label="密码" label-width="80px" prop="password" v-if="baseForm.addingDatabase.type === 'maxComputer'">
                        <el-input v-model="baseForm.addingDatabase.password" placeholder="access-key"></el-input>
                      </el-form-item>
                      <el-button style="float: right; margin-right: 10px; margin-bottom: 20px;" type="success" plain @click="handleSaveDatasource">保存</el-button>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <div style="width:70%">
                  <el-form-item prop="sql" label-width="70px" label="SQL：" ref="serviceBeginSqlForm">
                    <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative;">
                      <codemirror
                        ref="serviceBeginSql"
                        v-model="baseForm.sql"
                        :options="cmOptions"
                        @changes="cm => workItemChanges(cm, baseForm.sql, 'serviceBeginSqlForm', 'serviceBeginSql')"
                        @keydown.native="e => workItemKeyDown(e, 'serviceBeginSql')"
                        class="code"
                        style="padding-bottom: 0px;"
                      ></codemirror>
                    </div>
                  </el-form-item>
                  <el-form-item style="margin-top:10px;" label-width="70px">
                    <el-button type="primary" @click="dataSqlSubmit()">执行验证</el-button>
                  </el-form-item>
                  <el-form-item v-if="previewing" label-width="70px">
                    <span>
                      <el-button type="text" v-if="sqlPreviewDataList.length" @click="previewSqlData">预览查询结果</el-button>
                      <span v-if="sqlPreviewDataList.length">（随机展示10条数据）</span>
                    </span>
                  </el-form-item>
                  <div style="margin-left:50px;">
                    <el-form-item label="申请原因" prop="approveReason">
                      <el-input v-model="baseForm.approveReason" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="提数类型" prop="exportType">
                      <el-radio v-model="baseForm.exportType" label="once">一次性</el-radio>
                      <el-radio v-model="baseForm.exportType" label="period" style="margin-left:5px;">周期性</el-radio>
                    </el-form-item>
                    <el-form-item label="提数周期" prop="period" v-if="baseForm.exportType === 'period'">
                      <el-select v-model="baseForm.period" placeholder="请选择" class="reject-pane-item" @change="disTimeTurnOff (baseForm.period)">
                        <el-option v-for="item in sqlCycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="接受天设置" prop="receiveDays" v-if="baseForm.exportType === 'period'">
                      <el-select v-model="baseForm.receiveDays" class="reject-pane-item" placeholder="请选择">
                        <el-option v-for="item in receiveDaysList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="允许接收时间段" prop="receiveTime">
                      <el-time-picker
                        is-range
                        v-model="baseForm.receiveTime"
                        format="HH:mm"
                        value-format="HH:mm"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                      ></el-time-picker>
                    </el-form-item>
                    <el-form-item prop="receiver" label="数据接收人">
                      <el-select filterable multiple v-model="baseForm.receiver" class="reject-pane-item" placeholder="请选择">
                        <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="提数方式" prop="receiveType">
                      <el-radio v-model="baseForm.receiveType" label="0">钉钉</el-radio>
                      <el-radio v-model="baseForm.receiveType" label="1" style="margin-left:5px;">邮件</el-radio>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
import { datasourceDataList, databaseDataList, sqlPreview, checkDatasource, saveDatasource, getUsersList, saveDatabySql } from '@/api/withdrawal/datareport'
// import {isInnerIPFn} from '@/utils/validate'
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
      isInnerIP: false,
      dataListLoading: false,
      previewText: '',
      previewTextColor: '#303133',
      previewing: false,
      activeNames: 1,
      sqlSubmitSuccess: false,
      dataSqlSubmiting: false,
      dataSqlSubmitTime: 0,
      timer: null,
      baseForm: {
        id: '',
        dataSourceId: '', // 数据源id
        dataBaseId: '', // 数据库id
        sql: '', // sql
        approveReason: '', // 申请原因
        period: '', // 提数周期
        receiveDays: '', // 接收天设置
        receiveTime: ['08:00', '23:59'],
        // receiveEndTime: '', // 允许接收时间接收时间
        exportType: 'once', // 提数类型
        receiveType: '0', // 接收类型
        receiver: [], // 接收人
        addingDatabase: {
          'type': 'mysql',
          'url': '',
          'database': '',
          'userName': '',
          'password': ''
        }
      },
      datasourceList: [],
      databaseIdList: [],
      receiveDaysList: [], // 接收天设置list
      sqlPreviewDataList: [], // sql预览数据
      userList: [],
      multipleSelection: [], // 多选数据
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
        dataSourceId: [
          { required: true, message: '请选择服务器', trigger: 'change' }
        ],
        dataBaseId: [
          { required: true, message: '请选择数据库', trigger: 'change' }
        ],
        approveReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
        receiveDays: [
          { required: true, message: '请选择接收天设置', trigger: 'change' }
        ],
        exportType: [
          { required: true, message: '请选择提数类型', trigger: 'change' }
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
    init () {
      this.getSourceDataList()
      this.getUsersList()
      this.previewing = false
      this.previewText = ''
      this.dataSqlSubmiting = false
      this.visible = true
      this.sqlSubmitSuccess = false
      this.$nextTick(() => {
        this.$refs['baseForm'].resetFields()
        this.baseForm.addingDatabase = {
          'type': 'mysql',
          'url': '',
          'database': '',
          'userName': '',
          'password': ''
        }
        this.sqlPreviewDataList = []
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
      datasourceDataList().then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.datasourceList = data.data
        } else {
          this.datasourceList = []
        }
      })
    },
    // 获取数据库列表
    selectdatabaseDataList () {
      databaseDataList(this.baseForm.dataSourceId).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.baseForm.dataBaseId = ''
          this.databaseIdList = data.data
        } else {
          this.baseForm.dataBaseId = ''
          this.databaseIdList = []
        }
      })
    },
    // 数据源类型切换
    radioTypeChange () {
      this.baseForm.addingDatabase.database = ''
      this.baseForm.addingDatabase.url = ''
      this.baseForm.addingDatabase.userName = ''
      this.baseForm.addingDatabase.password = ''
    },
    // 保存数据源管理
    handleSaveDatasource () {
      let params = {
        'type': this.baseForm.addingDatabase.type,
        'database': this.baseForm.addingDatabase.database,
        'user': this.baseForm.addingDatabase.userName,
        'passwd': this.baseForm.addingDatabase.password
      }
      if (this.baseForm.addingDatabase.type === 'mysql') {
        params.url = this.baseForm.addingDatabase.url
        checkDatasource(params).then(({ data }) => {
          if (data && data.code === 0) {
            if (!data.data) {
              this.handleSaveDatasourceData(params)
            } else if (data.data.user === params.user && data.data.passwd === params.passwd) {
              this.$confirm('当前登录用户，数据源已存在', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '修改',
                type: 'warning'
              }).then(() => {
                this.handleSaveDatasourceData(params)
              })
            } else if (data.data.user === params.user && data.data.passwd !== params.passwd) {
              this.$confirm('当前登录用户，数据源下用户名相同，是否覆盖密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.handleSaveDatasourceData(params)
              })
            } else if (data.data.user !== params.user && data.data.passwd !== params.passwd) {
              this.$confirm('当前登录用户，数据源已存在 是否覆盖用户名和密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.handleSaveDatasourceData(params)
              })
            }
          }
        })
      } else {
        this.handleSaveDatasourceData(params)
      }
    },
    // 保存数据源管理
    handleSaveDatasourceData (params) {
      saveDatasource(params).then(({ data }) => {
        console.log('data: save', data)
        if (data && data.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.baseForm.addingDatabase = {
                'type': 'mysql',
                'url': '',
                'database': '',
                'userName': '',
                'password': ''
              }
              this.getSourceDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
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
        'dataBaseId': this.baseForm.dataBaseId,
        'sql': this.baseForm.sql
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
    previewSqlData () {
      let routeUrl = this.$router.resolve({ path: '/withdrawal-reportData' })
      window.open(routeUrl.href, '_blank')
    },
    //  提数 时间间隔 数据切换
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
    severDataFormSubmit () { // 表格多选
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          if (!this.sqlSubmitSuccess) {
            return this.$message({
              message: '请在SQL执行成功后保存提数申请',
              type: 'error',
              center: true
            })
          }
          let params = {
            'dataSourceId': this.baseForm.dataSourceId,
            'dataBaseId': this.baseForm.dataBaseId,
            'sql': this.baseForm.sql,
            'approveReason': this.baseForm.approveReason,
            'exportType': this.baseForm.exportType,
            'period': this.baseForm.period,
            'receiveDays': this.baseForm.period === 'day' ? '' : this.baseForm.receiveDays,
            'receiveStartTime': this.baseForm.receiveTime[0],
            'receiveEndTime': this.baseForm.receiveTime[1],
            'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
            'receiveType': Number(this.baseForm.receiveType)
          }
          saveDatabySql(params).then(({ data }) => {
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
</style>
