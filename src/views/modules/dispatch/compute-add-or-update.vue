<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1000px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{dataFormValue ? '查看' : dataForm.id ? '修改' : '新增/编辑计算任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <h3>作业信息<span>最近修改人：<i>admin</i> 最近修改时间：<i>2020-07-20</i></span></h3>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="dataForm.taskName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="任务ID" prop="taskId">
          <el-input v-model="dataForm.taskId" placeholder="任务ID" disabled />
        </el-form-item>
        <el-form-item label="所属系统" prop="taskSys">
          <el-select v-model="dataForm.taskSys" placeholder="所属系统">
            <el-option label="earliest" value="earliest"></el-option>
            <el-option label="latest" value="latest"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <el-input type="textarea" v-model="dataForm.remark" placeholder="任务描述" />
        </el-form-item>
      </el-form>
      <div class="btn-code-continue">
        <el-button type="success" @click="mergeSql">代码连贯模式</el-button>
      </div>
      <div class="work-content" v-for="(item, index) in workForm" :key="index">
        <el-form :model="item" :rules="dataRule" ref="workForm" label-width="120px">
          <el-form-item label="作业序号" prop="workIndex">
            <el-input v-model="item.workIndex" placeholder="作业序号" />
          </el-form-item>
          <el-form-item label="作业类型" prop="workType">
            <el-select v-model="item.workType" placeholder="请选择作业类型">
              <el-option label="earliest" value="earliest"></el-option>
              <el-option label="latest" value="latest"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSource">
            <el-select v-model="item.dataSource" placeholder="请选择数据源">
              <el-option label="earliest" value="earliest"></el-option>
              <el-option label="latest" value="latest"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户" prop="account">
            <el-select v-model="item.account" placeholder="请选择" @change="handleChange">
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
              （如需配置账户/无账户信息，请前往
              <router-link :to="{name:'dispatch-dataSource'}">配置</router-link>）
            </span>
          </el-form-item>
          <el-form-item label="作业描述" prop="workDesc">
            <el-input type="textarea" v-model="item.workDesc" placeholder="kafka地址" />
          </el-form-item>
          <el-form-item prop="sql" label="作业语句" :ref="'mycode-' + index">
            <div style="border:1px solid #dcdfe6; border-radius: 4px; position:relative">
              <codemirror
                ref="mycode"
                v-model="item.sql"
                :options="cmOptions"
                @changes="changes(item, 'mycode-' + index, index)"
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
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <el-dialog
      title="代码连贯模式"
      :visible.sync="mergeCodeVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="50%"
    >
      <div style="position:relative">
        <codemirror
          ref="previewSql"
          v-model="previewSql"
          :options="previewSqlOptions"
          @changes="sqlPreviewChange"
          @click.native="sqlPreviewFocus"
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
import { infoBeeTask, saveorupt } from '@/api/workerBee/kafka'
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')

export default {
  name: 'codeMirror',
  components: {
    codemirror
  },
  data () {
    return {
      visible: false,
      mergeCodeVisible: false,
      dataForm: {
        taskName: '',
        taskId: '',
        taskSys: '',
        remark: ''
      },
      workForm: [
        {
          workIndex: 1,
          workType: '',
          dataSource: '',
          account: '',
          workDesc: '',
          sql: '',
          placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
        }
      ],
      dataFormValue: '',
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskSys: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        workIndex: [
          { required: true, message: '请输入作业序号', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请输入作业类型', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        sql: [
          { required: true, message: '请输入任务语句', trigger: 'change' }
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
        mode: 'text/x-sql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autofocus: false,
        styleActiveLine: true,
        styleSelectedText: true,
        lineWrapping: true,
        extraKeys: {},
        hintOptions: {
          completeSingle: true,
          tables: {}
        }
      },
      diffToCompare: window.diff.compare,
      updateRowNum: 0,
      originpreviewSql: '', // 保留一份原始的连贯数据，用于做对比
      previewSql: '',
      sqlLineDist: [],
      sqlLineWorkIndex: [],
      previewSqlOptions: {
        mode: 'text/x-mariadb',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        hintOptions: {
          tables: {}
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    previreCodemirror () {
        return this.$refs.previewSql.codemirror
      }
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
          infoBeeTask(dataBody).then(({ data }) => { })
        }
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
      this.previewSql = ''
      let newWorkForm = deepClone(this.workForm) // 对数组进行排序
      newWorkForm.sort((a, b) => {
        return a.workIndex * 1 - b.workIndex * 1
      })
      newWorkForm.forEach((item, index) => {
        let sqlLineTitle = '<作业序号:' + item.workIndex + ';作业类型:' + item.workType + '>'
        this.sqlLineDist.push(sqlLineTitle)
        this.sqlLineWorkIndex.push(item.workIndex)
        let sqlJob = sqlLineTitle + '\n' + item.sql + '\n'
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
      changeArry = this.diffToCompare(originArr, curArr)
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
    },
    sqlPreviewFocus () {
      this.previewSqlDefaultRow()
    },
    previewSqlSubmit () { // 连贯代码提交
      console.log(this.sqlLineDist)
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
        // if(this.workForm[i].sql != undefined){
        //   codesList[i].setValue(tempValue)
        // }
        let index = this.findIndex(this.sqlLineWorkIndex[i])
        console.log(index, tempValue, this.workForm)
        this.workForm.splice(index, 1, { ...this.workForm[i], sql: tempValue })
      }
      this.mergeCodeVisible = false
    },
    findIndex (n) {
      let i = 0
      this.workForm.forEach((item, index) => {
        if (item.workIndex === n) {
          i = index
        }
      })
      console.log(i)
      return i
    },
    changes (item, ref, index) { // 内容更新时，不为空时将报错信息去除
      let curSql = item.sql
      if (curSql !== '') {
        this.$refs[ref][0].clearValidate()
        this.workForm.splice(index, 1, { ...item, placeholder: '' })
      } else {
        this.workForm.splice(index, 1, { ...item, placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！' })
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
      this.workForm.push({
        workIndex: '',
        workType: '',
        dataSource: '',
        account: '',
        workDesc: '',
        sql: '',
        placeholder: '请勿在第一行添加注释，否则脚本运行有误！MaxComputer脚本只能有一个SQL语句，且以分号分割！'
      })
      this.updateWorkIndex()
    },
    deleteWork (index) { // 删除作业内容
      this.workForm.splice(index, 1)
      this.updateWorkIndex()
    },
    updateWorkIndex () { // 增加或删除时重新排序
      this.workForm.forEach((item, index) => {
        item.workIndex = index + 1
      })
    },
    // 提交
    dataFormSubmit (form) {
      let flag = true
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      this.$refs['workForm'].forEach(item => {
        item.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      })
      console.log(1, this.dataForm, this.workForm)
      if (flag) {
        console.log(this.dataForm, this.workForm)
        console.log(saveorupt)
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
<style scoped>
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
    height: 300px
  }
  .styled-background {
    color: red
  }
</style>
