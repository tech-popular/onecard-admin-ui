<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1300px" class="data-transfer-manage-drawer">
    <div slot="title" class="drawer-title">
      SQL提数
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap">
      <el-form v-loading="loading" :model="baseForm" label-width="80px" ref="baseForm" class="base-form">
        <div class="base-pane">
          <el-tabs type="border-card">
            <el-tab-pane label="自助查询">
              <div style="display:flex">
                <div>
                  <el-form-item prop="datasourceId" label="服务器：">
                    <el-select filterable v-model="baseForm.datasourceId" placeholder="请选择" @change="selectdatabaseDataList">
                      <el-option v-for="item in datasourceList" :key="item.id" :label="item.datasourceName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="dataBaseId" label="数据库：">
                    <el-select filterable v-model="baseForm.dataBaseId" placeholder="请选择">
                      <el-option v-for="item in databaseIdList" :key="item.id" :label="item.databaseName" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-divider content-position="center">新增数据源信息</el-divider>
                  <el-form-item label="类型" prop="type">
                    <el-radio v-model="baseForm.addingDatabase.type" label="mysql">mysql</el-radio>
                    <el-radio v-model="baseForm.addingDatabase.type" label="maxcomputer" style="margin-left:5px;">maxcomputer</el-radio>
                  </el-form-item>
                  <el-form-item label="实例地址" prop="url" v-if="baseForm.addingDatabase.type === 'mysql'">
                    <el-input v-model="baseForm.addingDatabase.url"></el-input>
                  </el-form-item>
                  <el-form-item label="数据库" prop="database" v-if="baseForm.addingDatabase.type === 'mysql'">
                    <el-input v-model="baseForm.addingDatabase.database"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="user" v-if="baseForm.addingDatabase.type === 'mysql'">
                    <el-input v-model="baseForm.addingDatabase.user"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="passwd" v-if="baseForm.addingDatabase.type === 'mysql'">
                    <el-input v-model="baseForm.addingDatabase.passwd" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="空间名" prop="database" v-if="baseForm.addingDatabase.type === 'maxcomputer'">
                    <el-input v-model="baseForm.addingDatabase.database"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="accessId" v-if="baseForm.addingDatabase.type === 'maxcomputer'">
                    <el-input v-model="baseForm.addingDatabase.accessId"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="accessKey" v-if="baseForm.addingDatabase.type === 'maxcomputer'">
                    <el-input v-model="baseForm.addingDatabase.accessKey" type="password"></el-input>
                  </el-form-item>
                  <el-button style="float: right; margin-right: 10px;" type="success" plain @click="handleSaveDatasource">保存</el-button>
                </div>
                <div style="width:70%">
                  <el-form-item prop="sql" label="SQL：" ref="serviceBeginSqlForm">
                    <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative;">
                      <codemirror
                        ref="serviceBeginSql"
                        v-model="baseForm.sql"
                        :options="cmOptions"
                        @changes="cm => workItemChanges(cm, acquisitionTask.sql, 'serviceBeginSqlForm', 'serviceBeginSql')"
                        @keydown.native="e => workItemKeyDown(e, 'serviceBeginSql')"
                        class="code"
                        style="padding-bottom: 0px;"
                      ></codemirror>
                    </div>
                  </el-form-item>
                  <el-form-item style="margin-top:10px;">
                    <el-button type="primary" @click="dataSqlSubmit()">执行验证</el-button>
                  </el-form-item>
                  <el-form-item>
                    <span>执行完成，执行时间3S 预览查询结果（随机展示10条数据）</span>
                  </el-form-item>
                  <div style="margin-left:50px;">
                    <el-form-item label="申请原因" prop="approveReason">
                      <el-input v-model="baseForm.approveReason"></el-input>
                    </el-form-item>
                    <el-form-item label="提数类型" prop="exportType">
                      <el-radio v-model="baseForm.exportType" label="once">一次性</el-radio>
                      <el-radio v-model="baseForm.exportType" label="period" style="margin-left:5px;">周期性</el-radio>
                    </el-form-item>
                    <el-form-item label="提数周期" prop="period" v-if="baseForm.exportType === 'period'">
                      <el-select v-model="baseForm.period" placeholder="请选择" style="width:220px;" @change="disTimeTurnOff (baseForm.period)">
                        <el-option v-for="item in sqlCycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="接受天设置" prop="receiveDays" v-if="baseForm.exportType === 'period'" label-width="90px">
                      <el-select v-model="baseForm.receiveDays" multiple collapse-tags placeholder="请选择">
                        <el-option v-for="item in receiveDaysList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="允许接收时间段" prop="receiveTime" label-width="120px" style="width:400px;">
                      <el-time-picker is-range v-model="baseForm.receiveTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                    </el-form-item>
                    <el-form-item prop="receiver" label="接收人">
                      <el-select filterable v-model="baseForm.receiver" placeholder="请选择">
                        <el-option v-for="item in databaseIdList" :key="item.id" :label="item.databaseName" :value="item.id"></el-option>
                      </el-select>
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
      <el-button type="primary" @click="cancelHandle" size="small">立即申请</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { datasourceDataList, databaseDataList, sqlPreview, checkDatasource, saveDatasource } from '@/api/biExport/dataService'
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
      baseForm: {
        id: '',
        dataSourceId: '', // 数据源id
        dataBaseId: '', // 数据库id
        sql: '', // sql
        applyReason: '', // 申请原因
        period: '', // 提数周期
        receiveDays: '', // 接收天设置
        receiveTime: ['08:00:00', '23:59:59'],
        // receiveStartTime: '', // 允许接收时间开始时间
        // receiveEndTime: '', // 允许接收时间接收时间
        exportType: 'once', // 提数类型
        receiveType: '0', // 接收类型
        receiver: [], // 接收人
        addingDatabase: {
          'type': 'mysql',
          'url': '',
          'database': '',
          'user': '',
          'passwd': '',
          'accessId': '',
          'accessKey': ''
        }
      },
      datasourceList: [],
      databaseIdList: [],
      receiveDaysList: [], // 接收天设置list
      dataList: [],
      multipleSelection: [], // 多选数据
      sqlCycleList: [
        { value: 'HOUR', label: '小时' },
        { value: 'DAY', label: '天' },
        { value: 'WEEK', label: '周' },
        { value: 'MONTH', label: '月' }
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
      }
    }
  },
  mounted () {
    // this.isInnerIP = isInnerIPFn()
    // console.log('1112', isInnerIPFn())
  },
  components: { codemirror },
  methods: {
    // 打开抽屉弹窗
    init () {
      this.getSourceDataList()
      this.visible = true
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
      databaseDataList(this.baseForm.datasourceId).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.databaseIdList = data.data
        } else {
          this.databaseIdList = []
        }
      })
    },
    // 保存数据源管理
    handleSaveDatasource () {
      let params = {
        type: this.baseForm.addingDatabase.type,
        database: this.baseForm.addingDatabase.database
      }
      if (this.baseForm.addingDatabase.type === 'mysql') {
        params.url = this.baseForm.addingDatabase.url
        params.user = this.baseForm.addingDatabase.user
        params.passwd = this.baseForm.addingDatabase.passwd
        checkDatasource(params).then(({ data }) => {
          console.log('data:111', data);
        })
      } else {
        params.accessId = this.baseForm.addingDatabase.accessId
        params.accessKey = this.baseForm.addingDatabase.accessKey
        saveDatasource(params).then(({ data }) => {
          console.log('data: 222', data);
        })
      }

    },
    // sql执行预览
    dataSqlSubmit () {
      let params = {
        'dataBaseId': this.baseForm.dataBaseId,
        'sql': this.baseForm.sql
      }
      sqlPreview(params).then(({ data }) => {
        console.log('sql执行预览: ', data)
      })
    },
    //  提数 时间间隔 数据切换
    disTimeTurnOff (disType) {
      let tempArry = []
      if (disType === 'DAY') {
        tempArry.push({ value: '每天', label: '每天' })
      } else if (disType === 'HOUR') {
        for (let i = 1, j = 24; i < j; i++) {
          tempArry.push({ value: i, label: '每隔' + i + '小时' })
        }
      } else if (disType === 'MONTH') {
        for (let i = 1, j = 32; i < j; i++) {
          tempArry.push({ value: i, label: '每月' + i + '号' })
        }
        // tempArry.push({ value: '-1', label: '每月最后一天' })
      }
      this.baseForm.receiveDays = ''
      if (disType === 'WEEK') {
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
    handleSelectionChange (val) { // 表格多选
      this.multipleSelection = val
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
