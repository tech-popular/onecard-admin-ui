<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{canUpdate ? dataForm.id ? '编辑任务' : '新增任务' : '查看任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3 id="title">任务信息<span v-if="!!dataForm.id">最近修改人：<i>{{updateUser}}</i> 最近修改时间：<i>{{updateTime}}</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 400px" />
          </el-form-item>
          <el-form-item v-if="!!dataForm.id" label="负责人" prop="createUser">
            <el-input v-model="dataForm.createUser" placeholder="负责人" style="width: 150px" />
          </el-form-item>
          <el-form-item label="任务id" prop="id" :disabled="!canUpdate">
            <el-input v-model="dataForm.id" placeholder="id" disabled  style="width: 100px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统" prop="projectId">
          <el-select v-model="dataForm.projectId" placeholder="所属系统" @change="getDolphinFlowList" style="width: 400px" filterable>
            <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Tag标记" prop="tags">
          <el-select v-model="dataForm.tags" placeholder="Tag标记" style="width: 400px" filterable allow-create multiple>
            <el-option :label="item" :value="item" v-for="(item, index) in tagList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="taskDescribe">
          <el-input type="textarea" v-model="dataForm.taskDescribe" placeholder="任务描述" />
        </el-form-item>
      </el-form>
      <div class="btn-code-continue">
        <el-button type="success" @click="mergeSql">代码连贯模式</el-button>
      </div>
      <div class="work-content" v-for="(item, index) in calculateTasks" :key="index">
        <el-form :model="item" :rules="dataRule" ref="calculateTasks" :disabled="!canUpdate">
          <el-form-item label="作业序号" prop="jobNo" label-width="120px">
            <el-input-number v-model="item.jobNo" placeholder="作业序号" :min="1"></el-input-number>
          </el-form-item>
          <div class="work-type-pane">
            <el-form-item label="任务类型" prop="jobType" label-width="120px" >
                <el-select v-model="item.jobType"  clearable placeholder="任务类型">
                    <el-option label="trino" value="TRINO"></el-option>
                    <el-option label="sparkSql" value="SPARKSQL"></el-option>
                    <el-option label="kyuubi" value="KYUUBI"></el-option>
                    <el-option label="shell" value="SHELL"></el-option>
                    <el-option label="python" value="PYTHON"></el-option>
                    <el-option label="db" value="DB"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="item.jobType === 'DB'"  label="数据源" prop="dataSourceId" label-width="120px" >
                <el-select v-model="item.dataSourceId"  clearable placeholder="任务类型">
                    <el-option :label="item.name" :value="item.id" v-for="(item, index) in dataSourceList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="item.jobType === 'PYTHON' || item.jobType === 'SHELL'" label="资源" prop="resourceList" label-width="120px" >
                <el-select v-model="item.resourceList" placeholder="资源" style="width: 300px" clearable filterable allow-create multiple>
                    <el-option :label="data" :value="data" v-for="(data, index) in resourceInfoList" :key="index"></el-option>
                </el-select>
            </el-form-item>
           </div>
          <el-form-item label="作业描述" prop="jobDesc" label-width="120px">
              <el-input type="textarea" v-model="item.jobDesc" placeholder="作业描述" />
          </el-form-item>
          <el-form-item prop="jobScript" label="作业语句" :ref="'mycode-' + index" label-width="120px">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                :ref="'code-' + index"
                v-model="item.jobScript"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, item, 'mycode-' + index, index)"
                @keydown.native="e => workItemKeyDown(e, index)"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
              <span style="color:#6da7ff; position:absolute;left: 40px;top:4px;">{{item.placeholder}}</span>
            </div>
          </el-form-item>
          <el-form-item v-show="false" label="dolphin任务id" prop="dolphinTaskId" label-width="120px">
              <el-input type="textarea" v-model="item.dolphinTaskId" placeholder="dolphin任务id" />
          </el-form-item>
          <div style="margin-bottom: 10px; text-align: right;">
            <el-button type="primary" @click="addWork">新增</el-button>
            <el-button type="danger" @click="deleteWork(index)">删除</el-button>
          </div>
        </el-form>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px" :disabled="!canUpdate">
        <div class="work-type-pane">
          <el-form-item label="失败重跑"  prop="isRunAgain">
            <el-radio-group v-model="dataForm.isRunAgain">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="failRepeatTrigger" label="重跑"  v-if="dataForm.isRunAgain === 1">
            <el-input-number v-model="dataForm.failRepeatTrigger" style="width:160px;margin: 0 10px" :min="1" />次
          </el-form-item>
          <el-form-item label="失败预警" prop="alarmTypes">
              <el-select v-model="dataForm.alarmTypes" multiple  placeholder="失败预警">
                  <el-option label="钉钉通知" value="ding"></el-option>
                  <el-option label="短信通知" value="msg"></el-option>
              </el-select>
          </el-form-item>
        </div>>
      </el-form>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="canUpdate" @click="dataFormSubmit()">确定</el-button>
    </div>
    <el-dialog
      title="代码连贯模式"
      :visible.sync="mergeCodeVisible"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="50%"
    >
      <div style="position:relative;">
        <codemirror
          ref="previewSql"
          v-model="previewSql"
          :options="cmOptions"
          @changes="sqlPreviewChange"
          @click.native="sqlPreviewFocus"
          @keydown.native="sqlPreviewKeyDown"
          class="code"
          style="border:1px solid #dcdfe6; border-radius: 4px;"
        ></codemirror>
        <span style="position:absolute;right: 20px;bottom:-30px;">变动行数: <b style="color:red;">{{updateRowNum}}</b>行</span>
      </div>
      <div slot="footer">
        <el-button @click="mergeCodeVisible = false">取消</el-button>
        <el-button type="primary" v-if="canUpdate" @click="previewSqlSubmit()">提交</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import { info, save, update, projectAll, tagAll, getDolphinFlowList, getResourceList, getAllDataSourceList, getDolphinTaskId } from '@/api/dispatch/taskManag'
import { codemirror } from 'vue-codemirror'
import diff from '@/assets/js/diff.min.js'
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
    codemirror
  },
  data () {
    return {
      visible: false,
      mergeCodeVisible: false,
      id: '',
      rowData: { // 修改时数据内容
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      },
      updateUser: '',
      updateTime: '',
      dataForm: {},
      dolphinProcessList: [],
      dataSourceList: [],
      tempDataForm: {
        taskName: '',
        createUser: '',
        id: '',
        projectId: '',
        taskType: '',
        tags: '',
        taskDescribe: '',
        taskDisable: 1,
        failRepeatTrigger: 3,
        isRunAgain: 1,
        alarmTypes: ['ding']
      },
      calculateTasks: [],
      tempCalculateTasks: [
        {
          jobNo: 1,
          jobType: '',
          jobDesc: '',
          jobScript: '',
          resourceList: [],
          dataSourceId: '',
          dolphinTaskId: '',
          placeholder: '请勿在第一行添加注释，否则脚本运行有误！'
        }
      ],
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        createUser: [
          { required: true, message: '请输入负责人', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        dolphinProcessName: [
            { required: true, message: '请选择所属工作流', trigger: 'change' }
        ],
        jobType: [
            { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        jobNo: [
          { required: true, message: '请输入作业序号', trigger: 'blur' }
        ],
        jobScript: [
          { required: true, message: '请输入任务语句', trigger: 'change' }
        ],
        taskDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        failRepeatTrigger: [
          {required: true, message: '请输入重跑次数', trigger: 'change'}
        ],
        alarmTypes: [
          {required: true, message: '请选择失败预警方式(可多选)', trigger: 'change'}
        ]
      },
      allSystemList: [],
      tagList: [],
      extraParamList: [],
      resourceInfoList: [],
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
      canUpdate: true,
      updateRowNum: 0,
      originpreviewSql: '', // 保留一份原始的连贯数据，用于做对比
      previewSql: '',
      sqlLineDist: [], // 保存连贯代码时的各作业title
      sqlLineWorkIndex: [] // 保存连贯排序后的作业序号，用来处理重新渲染时查找元素用
    }
  },
  computed: {
    previreCodemirror () {
      return this.$refs.previewSql.codemirror
    }
  },
  methods: {
    init (id, canUpdate) {
      this.id = id ? id.id : ''
      this.rowData = {
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      }
      this.rowData = id ? deepClone(id) : this.rowData
      this.canUpdate = canUpdate
      this.dataForm = deepClone(this.tempDataForm)
      this.calculateTasks = deepClone(this.tempCalculateTasks)
      this.getAllSystem()
      this.getAllDataSourceList()
      this.getTag()
      this.getResourceList()
      this.visible = true
      this.$nextTick(() => {
        document.getElementById('title').scrollIntoView()
        this.$refs['dataForm1'].resetFields()
        this.$refs['dataForm2'].resetFields()
        if (id) {
          info(this.id).then(({data}) => {
            if (data.code !== 0) {
              return this.$message.error(data.msg || '获取数据异常')
            }
            if (!data.data.calculateTasks.length) {
              return this.$message.error('获取数据异常')
            }
            this.createUser = data.data.createUser
            this.updateUser = data.data.updateUser
            this.updateTime = data.data.updateTime
            this.dataForm.id = data.data.id
            this.dataForm.taskDescribe = data.data.taskDescribe
            this.dataForm.projectId = data.data.projectId
            this.getDolphinFlowList(data.data.projectId)
            this.dataForm.taskType = data.data.taskType
            this.dataForm.alarmTypes = data.data.alarmTypes
            this.dataForm.tags = data.data.tags
            this.dataForm.taskDisable = data.data.taskDisable
            // 是否重跑判断
            if (data.data.failRepeatTrigger !== 1) {
                this.dataForm.isRunAgain = 1
                this.dataForm.failRepeatTrigger = 3
            } else {
                this.dataForm.isRunAgain = 0
                this.dataForm.failRepeatTrigger = data.data.failRepeatTrigger
            }
              this.calculateTasks = data.data.calculateTasks
              this.dataForm.taskName = data.data.taskName
              this.dataForm.createUser = data.data.createUser
          })
        }
      })
    },
    getTag () {
        tagAll().then(({data}) => {
        this.tagList = data.data
      })
    },
    getResourceList () {
        getResourceList().then(({data}) => {
        this.resourceInfoList = data.data
      })
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = data.data
      })
    },
    getAllDataSourceList () {
        getAllDataSourceList().then(({data}) => {
        this.dataSourceList = data.data
      })
    },
    getDolphinTaskId() {
        // 使用 return 将 Promise 对象返回
        return getDolphinTaskId().then(({ data }) => {
            // 返回 data.data
            return data.data
        })
    },
    getDolphinFlowList (item) {
        console.log(item)
        getDolphinFlowList(Number(item)).then(({data}) => {
            this.dolphinProcessList = data.data
        })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    handleChange (val) {
      console.log(val)
    },
    mergeSql () { // 代码连贯操作
      // 判断作业序号是否重复，若重复就报错，不然连贯后再渲染会有问题
      let indexArr = []
      this.calculateTasks.forEach(item => {
        indexArr.push(item.jobNo * 1)
      })
      let uniqueIndexArr = Array.from(new Set(indexArr))
      if (uniqueIndexArr.length < indexArr.length) {
        return this.$message.error('作业序号不可重复，请重新填写后再操作')
      }
      this.previewSql = ''
      this.sqlLineDist = []
      this.sqlLineWorkIndex = []
      this.updateRowNum = 0
      let newWorkForm = deepClone(this.calculateTasks) // 对数组进行排序
      newWorkForm.sort((a, b) => {
        return a.jobNo * 1 - b.jobNo * 1
      })
      newWorkForm.forEach((item, index) => {
        let sqlLineTitle = '<作业序号:' + item.jobNo + '>'
        this.sqlLineDist.push(sqlLineTitle)
        this.sqlLineWorkIndex.push(item.jobNo)
        let sqlJob = sqlLineTitle + '\n' + item.jobScript + '\n'
        this.previewSql += sqlJob
      })
      this.originpreviewSql = this.previewSql
      this.mergeCodeVisible = true
    },
    sqlPreviewChange (line) { // 连贯代码改变时
      let originArr = this.originpreviewSql.split('\n')
      let curArr = this.previewSql.split('\n')
      let changeArry = []
      let changeNum = 0
      changeArry = diff.compare(originArr, curArr)
      let changeArryLen = changeArry.length
      if (changeArryLen > 0) {
        changeNum = changeArryLen
        for (let i = 0, j = changeArryLen; i < j; i++) {
          let tempnum = changeArry[i][2].length
          if (tempnum > 1) {
            changeNum = changeNum + tempnum - 1
          }
        }
      }
      this.updateRowNum = changeNum
      // 输入提示
      if (!this.previewSql) {
        this.$nextTick(() => {
          this.$refs.previewSql.codemirror.setOption('lint', false)
        })
        return
      }
      this.$refs.previewSql.codemirror.setOption('lint', false)
      this.$nextTick(() => {
        this.$refs.previewSql.codemirror.setOption('lint', true)
      })
    },
    sqlPreviewKeyDown (event) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.previewSql.codemirror.showHint({ completeSingle: false })
      }
    },
    sqlPreviewFocus () {
      this.previewSqlDefaultRow()
    },
    previewSqlSubmit () { // 连贯代码提交
      let sqlValue = this.previewSql
      let tempValStartIndex = 0
      let tempValEndIndex = 0
      let tempValue = null
      let titleLength = 0
      for (let i = 0, j = this.sqlLineDist.length; i < j; i++) {
        titleLength = this.sqlLineDist[i].length + 1 // +1去掉回车
        tempValStartIndex = sqlValue.indexOf(this.sqlLineDist[i])
        if (this.sqlLineDist[i + 1] != undefined) {
          tempValEndIndex = sqlValue.indexOf(this.sqlLineDist[i + 1])
        } else {
          tempValEndIndex = sqlValue.length
        }
        tempValue = sqlValue.substring(tempValStartIndex + titleLength, tempValEndIndex)
        let index = this.findIndex(this.sqlLineWorkIndex[i])
        let tempArr = tempValue.split('\n').filter(item => item !== '') // 把多余的回车去掉
        this.calculateTasks.splice(index, 1, { ...this.calculateTasks[index], jobScript: tempArr.join('\n') })
      }
      this.mergeCodeVisible = false
    },
    findIndex (n) {
      let i = 0
      this.calculateTasks.forEach((item, index) => {
        if (item.jobNo * 1 === n * 1) {
          i = index
        }
      })
      return i
    },
    workItemChanges (cm, item, ref, index) { // 内容更新时，不为空时将报错信息去除
      let curSql = item.jobScript
      if (curSql !== '') {
        this.$refs[ref][0].clearValidate()
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '' })
      } else {
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '请勿在第一行添加注释，否则脚本运行有误！' })
      }
      if (!curSql) {
        this.$nextTick(() => {
          this.$refs['code-' + index][0].codemirror.setOption('lint', false)
        })
      } else {
        this.$refs['code-' + index][0].codemirror.setOption('lint', false)
        this.$nextTick(() => {
          this.$refs['code-' + index][0].codemirror.setOption('lint', true)
        })
      }
    },
    // 按下键盘事件处理函数
    workItemKeyDown (event, index) {
      const keyCode = event.keyCode || event.which || event.charCode
      const keyCombination = event.ctrlKey || event.altKey || event.metaKey
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs['code-' + index][0].codemirror.showHint({ completeSingle: false })
      }
    },
    previewSqlDefaultRow () { // 设置每个作业的title不可修改
      let lineNum = 0
      let sqlPreFormatArry = []
      this.previreCodemirror.eachLine(line => {
        if (line.text.indexOf('<作业序号') > -1) {
          let strNum = line.text.length
          this.previreCodemirror.markText({line: lineNum, ch: 0}, {line: lineNum, ch: strNum}, {className: 'styled-background', readOnly: true})
        }
        sqlPreFormatArry.push(line.text) // 记录最开始每一行
        lineNum++
      })
    },
    addWork () { // 增加一条作业内容
      this.calculateTasks.push({
        jobNo: '',
        jobType: '',
        jobDesc: '',
        jobScript: '',
        resourceList: [],
        dataSourceId: '',
        dolphinTaskId: '',
        placeholder: '请勿在第一行添加注释，否则脚本运行有误！'
      })
      this.updateWorkIndex()
    },
    deleteWork (index) { // 删除作业内容
      this.calculateTasks.splice(index, 1)
      this.updateWorkIndex()
    },
    updateWorkIndex () { // 增加或删除时重新排序
      this.calculateTasks.forEach((item, index) => {
        item.jobNo = index + 1
      })
    },
    // 提交
    dataFormSubmit (form) {
      let flag = true
      this.$refs['dataForm1'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['dataForm2'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['calculateTasks'].forEach(item => {
        item.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      })
      console.log(1, this.dataForm, this.calculateTasks)
      if (flag) {
        let indexArr = []
        this.calculateTasks.forEach(item => {
          indexArr.push(item.jobNo * 1)
        })
        let uniqueIndexArr = Array.from(new Set(indexArr))
        if (uniqueIndexArr.length < indexArr.length) {
          return this.$message.error('作业序号不可重复，请重新填写后再操作')
        }
        console.log(this.dataForm, this.calculateTasks)
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        let params = {
          ...this.dataForm,
          authOwner: this.rowData.authOwner,
          authOtherList: this.rowData.authOtherList,
          authOthers: this.rowData.authOthers,
          tenantId: sessionStorage.getItem('tenantId'),
          taskName: `${this.dataForm.taskName}`,
          createUser: `${this.dataForm.createUser}`,
          taskType: this.dataForm.taskType,
          calculateTasks: this.calculateTasks
        }
        if (params.isRunAgain === 1) {
          params.failRepeatTrigger = params.failRepeatTrigger
        } else {
          params.failRepeatTrigger = 0
        }
        url(params).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: data.msg || '操作成功"',
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
  .work-content {
    border: 1px #cccccc dashed;
    padding: 20px 20px 10px 0;
    margin: 20px 0;
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
</style>
