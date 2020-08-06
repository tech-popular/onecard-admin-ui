<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{!!id ? '修改' : '新增/编辑同步任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3>作业信息<span>最近修改人：<i>admin</i> 最近修改时间：<i>2020-07-20</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 400px">
              <template slot="prepend">mc_sql</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务ID" prop="id">
            <el-input v-model="dataForm.id" placeholder="任务ID" disabled  style="width: 300px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统" prop="taskSys">
          <el-select v-model="dataForm.taskSys" placeholder="所属系统" style="width: 400px">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" placeholder="任务描述" />
        </el-form-item>
      </el-form>
      <div class="work-content">
        <el-form :model="dispatchAcquisitionTask" :rules="dataRule" ref="dispatchAcquisitionTask">
          <div class="work-type-pane">
            <el-form-item label="数据来源" prop="workType" label-width="120px">
              <el-select v-model="dispatchAcquisitionTask.workType" placeholder="请选择数据源类型">
                <el-option label="earliest" value="earliest"></el-option>
                <el-option label="latest" value="latest"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inDatasourceId" label-width="10px">
              <el-select v-model="dispatchAcquisitionTask.inDatasourceId" placeholder="请选择数据源名称">
                <el-option label="earliest" value="earliest"></el-option>
                <el-option label="latest" value="latest"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inAccountId" label-width="10px">
              <el-select v-model="dispatchAcquisitionTask.inAccountId" placeholder="请选择账户" @change="handleChange">
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;">
                （如需配置账户，请<router-link :to="{name:'dispatch-dataSource'}">点击</router-link>）
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="inDataSql" label="作业开始前SQL：" label-width="120px" ref="workBeginSqlForm">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql"
                v-model="dispatchAcquisitionTask.inDataSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, dispatchAcquisitionTask.inDataSql, 'workBeginSqlForm', 'workBeginSql')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <el-form-item prop="sqlField" label-width="120px" label="输出字段" ref="sqlFieldEl">
            <input-tag v-model="dispatchAcquisitionTask.sqlField" @change="inputTagChange" :tag-tips=[] :add-tag-on-blur="true" :allow-duplicates="true" class="itemIput inputTag" style="display: inline-block;" placeholder="可用回车输入多条"></input-tag>
            <el-button type="primary" size="mini">SQL解析</el-button>
          </el-form-item>
          <div class="work-type-pane">
            <el-form-item label="数据去向" prop="workType" label-width="120px">
              <el-select v-model="dispatchAcquisitionTask.workType" placeholder="请选择数据源类型">
                <el-option label="earliest" value="earliest"></el-option>
                <el-option label="latest" value="latest"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outDatasourceId" label-width="10px">
              <el-select v-model="dispatchAcquisitionTask.outDatasourceId" placeholder="请选择数据源名称">
                <el-option label="earliest" value="earliest"></el-option>
                <el-option label="latest" value="latest"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="outAccountId" label-width="10px">
              <el-select v-model="dispatchAcquisitionTask.outAccountId" placeholder="请选择账户" @change="handleChange">
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;">
                （如需配置账户，请<router-link :to="{name:'dispatch-dataSource'}">点击</router-link>）
              </span>
            </el-form-item>
          </div>
          <el-form-item prop="outDataTable" label-width="120px" style="width:700px">
            <el-input v-model="dispatchAcquisitionTask.outDataTable" placeholder="输入数据表/topic名称" />
          </el-form-item>
          <el-form-item prop="outBeforeSql" label="目标库前置处理SQL：" label-width="120px" ref="workBeginSqlForm2">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql2"
                v-model="dispatchAcquisitionTask.outBeforeSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, dispatchAcquisitionTask.outBeforeSql, 'workBeginSqlForm2', 'workBeginSql2')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql2')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <el-form-item prop="outAfterSql" label="目标库前置处理SQL：" label-width="120px" ref="workBeginSqlForm3">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="workBeginSql3"
                v-model="dispatchAcquisitionTask.outAfterSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, dispatchAcquisitionTask.outAfterSql, 'workBeginSqlForm3', 'workBeginSql3')"
                @keydown.native="e => workItemKeyDown(e, 'workBeginSql3')"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
            </div>
          </el-form-item>
          <div class="work-type-pane">
            <el-form-item label="下发类型：" prop="addDataRule" label-width="120px">
              <el-radio-group v-model="dispatchAcquisitionTask.addDataRule">
                <el-radio label="all">全量</el-radio>
                <el-radio label="add">增量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="增量规则：" prop="workType" label-width="200px">
              <el-input v-model="dispatchAcquisitionTask.workType" placeholder="增量规则" style="width: 300px" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="状态：" prop="dispatchStatus" label-width="120px">
            <el-radio-group v-model="dataForm.dispatchStatus">
              <el-radio :label="1">有效</el-radio>
              <el-radio :label="0">无效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="任务需求人：" prop="requestedUser" label-width="200px">
            <el-input v-model="dataForm.requestedUser" placeholder="任务需求人" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
// import { deepClone } from '@/utils'
import { info } from '@/api/dispatch/taskManag'
import InputTag from '../dataAnalysis/components/InputTag'
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
  name: 'codeMirror',
  components: {
    codemirror,
    InputTag
  },
  data () {
    return {
      visible: false,
      id: '',
      dataForm: {
        taskName: '',
        id: '',
        taskSys: '',
        taskDiscribe: '',
        dispatchStatus: '',
        requestedUser: ''
      },
      dispatchAcquisitionTask: {
        inDatasourceId: 1,
        inAccountId: '',
        inDataSql: '',
        sqlField: [], // 输入sql所对应的字段
        outDatasourceId: '', // 输出数据源Id
        outAccountId: '', // 输出数据源对应帐户Id
        outDataTable: '', // 输出数据表
        outBeforeSql: '', // 输出前处理sql
        outAfterSql: '', // 输出后处理sql
        addDataRule: '' // 采集规则（ALL-全量，ADD-增量）
      },
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskSys: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        inDataSql: [
          { required: true, message: '请输入作业开始前SQL', trigger: 'change' }
        ],
        sqlField: [
          { required: true, message: '请选择输出字段', trigger: 'change' }
        ],
        outAccountId: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        outDatasourceId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        outDataTable: [
          { required: true, message: '请输入输出数据表', trigger: 'blur' }
        ],
        outBeforeSql: [
          { required: true, message: '请输入目标库前置处理SQL', trigger: 'change' }
        ],
        outAfterSql: [
          { required: true, message: '请输入目标库后置处理SQL', trigger: 'change' }
        ],
        addDataRule: [
          { required: true, message: '请选择下发类型', trigger: 'change' }
        ],
        dispatchStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        requestedUser: [
          { required: true, message: '请输入需求提出人', trigger: 'blur' }
        ]
      },
      options: [{
        label: '个人账号',
        options: [{
          value: 'Shanghai',
          label: '个人一'
        }, {
          value: 'Beijing',
          label: '个人二'
        }]
      }, {
        label: '公共账号',
        options: [{
          value: 'Chengdu',
          label: '北京账号'
        }, {
          value: 'Shenzhen',
          label: '上海账号'
        }, {
          value: 'Guangzhou',
          label: '广州账号'
        }]
      }],
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
  computed: {
    previreCodemirror () {
      return this.$refs.previewSql.codemirror
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['dispatchAcquisitionTask'].resetFields()
        if (id) {
          // const dataBody = this.id
          info(this.id).then(({data}) => {
            if (data.code !== 0) {
              return this.$message.error(data.msg || '获取数据异常')
            }
            console.log(data)
            // this.formData = data.data
            this.dataForm.taskName = data.data.taskName
            this.dataForm.id = data.data.id
            this.dataForm.taskDiscribe = data.data.taskDiscribe
            this.dataForm.dispatchStatus = data.data.dispatchStatus
            this.dataForm.requestedUser = data.data.requestedUser
            this.dispatchAcquisitionTask = data.data.dispatchAcquisitionTask
            if (typeof (this.dispatchAcquisitionTask.sqlField) === 'string') {
              this.dispatchAcquisitionTask.sqlField = [ this.dispatchAcquisitionTask.sqlField ]
            }
          })
        }
      })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    inputTagChange () {
      if (this.dispatchAcquisitionTask.sqlField.length) { // 如果已经有输入的值则清空报错提示
        this.$refs.sqlFieldEl.clearValidate()
      }
    },
    handleChange (val) {
      console.log(val)
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
    // 提交
    dataFormSubmit (form) {
      let flag = true
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['dispatchAcquisitionTask'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      console.log(1, this.dataForm, this.dispatchAcquisitionTask)
      if (flag) {
        console.log(this.dataForm, this.dispatchAcquisitionTask)
        // const dataBody = this.dataForm
        // const dataUpdateId = this.dataForm.id
        // saveorupt(dataBody, dataUpdateId).then(({ data }) => {
        //   if (data && data.status === 0) {
        //     this.$message({
        //       message: '操作成功"',
        //       type: 'success',
        //       duration: 1500,
        //       onClose: () => {
        //         this.visible = false
        //         this.$emit('refreshDataList')
        //         this.$refs['dataForm'].resetFields()
        //       }
        //     })
        //   } else {
        //     this.$message.error(data.msg)
        //   }
        // })
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
  .work-content {
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
