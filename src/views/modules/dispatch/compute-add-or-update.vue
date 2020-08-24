<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{dataForm.id ? '编辑计算任务' : '新增计算任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3 id="title">作业信息<span v-if="!!dataForm.id">最近修改人：<i>admin</i> 最近修改时间：<i>2020-07-20</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm1" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="任务名称" prop="taskName">
            <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 400px">
              <template slot="prepend">{{formDs}}_</template>
            </el-input>
          </el-form-item>
          <el-form-item label="任务ID" prop="id">
            <el-input v-model="dataForm.id" placeholder="任务ID" disabled  style="width: 300px" />
          </el-form-item>
        </div>
        <el-form-item label="所属系统" prop="projectId">
          <el-select v-model="dataForm.projectId" placeholder="所属系统" style="width: 400px" filterable>
            <el-option :label="item.projectSystemName" :value="item.id" v-for="(item, index) in allSystemList" :key="index"></el-option>
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
        <el-form :model="item" :rules="dataRule" ref="calculateTasks">
          <el-form-item label="作业序号" prop="jobNo" label-width="120px">
            <el-input-number v-model="item.jobNo" placeholder="作业序号" :min="1"></el-input-number>
          </el-form-item>
          <div class="work-type-pane">
            <el-form-item label="作业类型" prop="jobType" label-width="120px">
              <el-select v-model="item.jobType" placeholder="请选择数据源类型" @change="val => dataSourceTypeChange(index, val)" filterable>
                <el-option :label="citem.name" :value="citem.name" v-for="(citem, cindex) in allDatasourceList" :key="cindex"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="datasourceId" label-width="10px">
              <el-select v-model="item.datasourceId" placeholder="请选择数据源名称" @change="val => dataSourceNameChange(index, val)" filterable>
                <el-option :label="citem.dataSourceName" :value="citem.id" v-for="(citem, cindex) in item.allDatasourceNameList" :key="cindex"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="accountId" label-width="10px" v-if="item.jobType !== 'KAFKA' && item.jobType !== 'REDIS'">
              <el-select v-model="item.accountId" placeholder="请选择账户" filterable>
                <el-option-group v-for="(val, key, i) in item.allAccountList" :key="i" :label="key * 1 === 0 ? '公共账号' : '个人帐号'">
                  <el-option
                    v-for="item in val"
                    :key="item.id"
                    :label="item.datasourceUser"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;">
                （如需配置账户，请<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
            </el-form-item>
          </div>
          <el-form-item label="作业描述" prop="jobDescribe" label-width="120px">
            <el-input type="textarea" v-model="item.jobDescribe" placeholder="作业描述" />
          </el-form-item>
          <el-form-item prop="jobSql" label="作业语句" :ref="'mycode-' + index" label-width="120px">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                :ref="'code-' + index"
                v-model="item.jobSql"
                :options="cmOptions"
                @changes="cm => workItemChanges(cm, item, 'mycode-' + index, index)"
                @keydown.native="e => workItemKeyDown(e, index)"
                class="code"
                style="padding-bottom: 0px"
              ></codemirror>
              <span style="color:#6da7ff; position:absolute;left: 40px;top:4px;">{{item.placeholder}}</span>
            </div>
          </el-form-item>
          <div style="margin-bottom: 10px; text-align: right;">
            <el-button type="primary" @click="addWork">新增</el-button>
            <el-button type="danger" @click="deleteWork(index)">删除</el-button>
          </div>
        </el-form>
      </div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" label-width="120px">
        <div class="work-type-pane">
          <el-form-item label="状态：" prop="dispatchStatus" label-width="120px">
            <el-radio-group v-model="dataForm.dispatchStatus">
              <el-radio :label="0">有效</el-radio>
              <el-radio :label="1">无效</el-radio>
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
        <el-button type="primary" @click="previewSqlSubmit()">提交</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import { info, save, update, projectAll, dataSourceAll, accountAll } from '@/api/dispatch/taskManag'
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
      formDs: 'mc',
      dataForm: {
        taskName: '',
        id: '',
        projectId: '',
        taskDescribe: '',
        dispatchStatus: 0,
        requestedUser: ''
      },
      calculateTasks: [
        {
          jobNo: 1,
          jobType: '',
          datasourceId: '',
          accountId: '',
          jobDescribe: '',
          jobSql: '',
          allDatasourceNameList: [],
          allAccountList: [],
          placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
        }
      ],
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        jobNo: [
          { required: true, message: '请输入作业序号', trigger: 'blur' }
        ],
        jobType: [
          { required: true, message: '请输入作业类型', trigger: 'change' }
        ],
        datasourceId: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        accountId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        jobSql: [
          { required: true, message: '请输入任务语句', trigger: 'change' }
        ],
        requestedUser: [
          { required: true, message: '请输入任务需求人', trigger: 'blur' }
        ],
        dispatchStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      allSystemList: [],
      allDatasourceList: [],
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
    init (id) {
      this.id = id ? id.id : ''
      this.getAllSystem()
      this.getAllDatasource()
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
            // this.dataForm.taskName = data.data.taskName
            this.dataForm.id = data.data.id
            this.dataForm.taskDescribe = data.data.taskDescribe
            this.dataForm.projectId = data.data.projectId
            this.dataForm.dispatchStatus = data.data.dispatchStatus
            this.dataForm.requestedUser = data.data.requestedUser
            this.calculateTasks = data.data.calculateTasks
            this.calculateTasks.forEach((item, index) => {
              let filterArr = this.allDatasourceList.filter(citem => citem.name === item.jobType)[0]
              item.allDatasourceNameList = filterArr.source
              this.getAllAccount(index, data.data.calculateTasks.datasourceId)
            })
            let filterInArr = this.allDatasourceList.filter(item => item.name === this.calculateTasks[0].jobType)[0]
            this.formDs = filterInArr.alias
            this.dataForm.taskName = data.data.taskName.substr(this.formDs.length + 1)
          })
        }
      })
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = data.data
      })
    },
    getAllDatasource () {
      dataSourceAll('CALCULATE', 'IN').then(({data}) => {
        this.allDatasourceList = data.data
      })
    },
    dataSourceTypeChange (index, val) {
      this.calculateTasks.datasourceId = ''
      let filterArr = this.allDatasourceList.filter(item => item.name === val)[0]
      this.calculateTasks.splice(index, 1, { ...this.calculateTasks[index], datasourceId: '', allDatasourceNameList: filterArr.source })
      if (index === 0) {
        this.formDs = filterArr.alias
      }
    },
    dataSourceNameChange (index, val) {
      this.calculateTasks.splice(index, 1, { ...this.calculateTasks[index], accountId: '' })
      this.getAllAccount(index, val)
    },
    getAllAccount (index, id) {
      accountAll({
        id: id
      }).then(({data}) => {
        this.calculateTasks.splice(index, 1, { ...this.calculateTasks[index], allAccountList: data.data })
      })
    },
    gotoDataSource () {
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
      this.$router.push({ name: 'dispatch-dataSource' })
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
        let sqlLineTitle = '<作业序号:' + item.jobNo + ';作业类型:' + item.jobType + '>'
        this.sqlLineDist.push(sqlLineTitle)
        this.sqlLineWorkIndex.push(item.jobNo)
        let sqlJob = sqlLineTitle + '\n' + item.jobSql + '\n'
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
        this.calculateTasks.splice(index, 1, { ...this.calculateTasks[index], jobSql: tempArr.join('\n') })
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
      let curSql = item.jobSql
      if (curSql !== '') {
        this.$refs[ref][0].clearValidate()
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '' })
      } else {
        this.calculateTasks.splice(index, 1, { ...item, placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！' })
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
        datasourceId: '',
        accountId: '',
        jobDescribe: '',
        jobSql: '',
        placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
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
        this.calculateTasks.forEach(item => {
          item.allDatasourceNameList = []
          item.allAccountList = []
        })
        let url = save
        if (this.dataForm.id) {
          url = update
        }
        url({
          ...this.dataForm,
          taskName: `${this.formDs}_${this.dataForm.taskName}`,
          taskType: 'CALCULATE',
          calculateTasks: this.calculateTasks
        }).then(({data}) => {
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
