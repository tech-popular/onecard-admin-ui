<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" >
    <el-form-item label="任务列表">
      <el-select v-model="taskId" filterable placeholder="请选择可搜索" style="width: 250px">
        <el-option
          v-for="item in taskIdOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="datasourceId" label="数据源">
      <el-select v-model="dataForm.datasourceId" placeholder="请选择">
        <el-option
          v-for="item in datasourceoptions"
          :key="item.id"
          :label="item.datasourceName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="sql">
      <el-input type="textarea" ref="mycode" v-model="dataForm.sql" :rows="10"></el-input>
      <!--<textarea ref="mycode" class="codesql" v-model="dataForm.sql" style="height:200px;width:600px;"></textarea>-->

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="dataFormSubmit()">执行</el-button>
      <el-button type="primary" @click="stopMaxcomputepreview()">停止</el-button>
      <el-button type="primary" @click="test()">测试</el-button>
    </el-form-item>
    <el-form-item>
      <el-input type="textarea" ref="returnData" v-model="returnData" :rows="10"></el-input>
    </el-form-item>
  </el-form>

</template>

<script>
  /** import 'codemirror/theme/ambiance.css'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/hint/show-hint.css'

  let CodeMirror = require('codemirror/lib/codemirror')
  require('codemirror/addon/edit/matchbrackets')
  require('codemirror/addon/selection/active-line')
  require('codemirror/mode/sql/sql')
  require('codemirror/addon/hint/show-hint')
  require('codemirror/addon/hint/sql-hint')**/
  export default {
    name: 'codeMirror',
    data () {
      return {
        dataForm: {
          datasourceId: this.$route.params.datasourceId || '',
          sql: this.$route.params.sql || ''
        },
        taskId: this.$route.params.taskId || '',
        taskIdOptions: [],
        datasourceoptions: [],
        instanceId: '',
        returnData: '',
        dataRule: {
          datasourceId: [
            { required: true, message: '输入数据源不能为空', trigger: 'blur' }
          ],
          sql: [
            { required: true, message: 'sql不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    activated () {
      this.selectOption()
    },
    mounted () {
      /** let mime = 'text/x-mariadb'
      // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
      let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // theme: theme,
        // autofocus: true,
        extraKeys: {'Ctrl': 'autocomplete'}, // 自定义快捷键
        hintOptions: { // 自定义提示选项
          tables: {
            // users: ['name', 'score', 'birthDate'],
            // countries: ['name', 'population', 'size']
          }
        }
      })
      editor.setValue(this.dataForm.sql)
      // 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      editor.on('cursorActivity', function () {
        editor.showHint()
      })**/
    },
    methods: {
      selectOption () {
        // 下拉框
        this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombtask/all/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.taskIdOptions = data.allTask
          }
        })
        // 数据源下拉框
        this.$http({
          url: this.$http.adornUrl(`/honeycomb/honeycombdatasourceconfig/select`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.datasourceoptions = data.honeycombDatasourceConfigEntities
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtaskpreview/preview/sql`),
              method: 'post',
              data: this.$http.adornData(this.dataForm
              )
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.resultBean)
                this.returnData += JSON.stringify(data.resultBean)
                if (data.resultBean.status === '2') {
                  this.instanceId = data.resultBean.traceId
                  this.returnData += '\n继续执行\n'
                  this.continueMaxcomputepreview()
                } else {
                  clearInterval(window.clearnum)
                  this.instanceId = ''
                }
              } else {
                this.$message.error(data.msg)
                this.returnData += data.msg
              }
            })
          }
        })
      },
      test () {
        let json1 = '{"msg":"success","code":0,"page":{"totalCount":148,"pageSize":10,"totalPage":15,"currPage":1,"list":[{"id":1,"name":"韩要翔","dingding":"18610245602","mobile":"18610245602","email":"hanyaoxiang@9fbank.com.cn","enable":1,"tenantId":null},{"id":2,"name":"成天华","dingding":"18911130732","mobile":"18911130732","email":"chengtianhua@9fbank.cc","enable":1,"tenantId":null},{"id":3,"name":"刘慧勇","dingding":"13683546933","mobile":"13683546933","email":"liuhuiyong@9fbank.cc","enable":1,"tenantId":null},{"id":8,"name":"李国鹏","dingding":"15011170289","mobile":"15011170289","email":"liguopeng1@9fbank.cc","enable":1,"tenantId":null},{"id":9,"name":"吴传鹏","dingding":"18070147019","mobile":"18070147019","email":"wuchuanpeng@9fbank.com.cn","enable":1,"tenantId":null},{"id":11,"name":"杨志","dingding":"18500153676","mobile":"18500153676","email":"yangzhi@9fbank.cc","enable":1,"tenantId":null},{"id":12,"name":"赵卫国","dingding":"18635066165","mobile":"18635066165","email":"zhaoweiguo@9fbank.com.cn","enable":1,"tenantId":null},{"id":13,"name":"陈炎龙","dingding":"18500683126","mobile":"18500683126","email":"jigoudaihou@9fbank.com.cn","enable":1,"tenantId":null},{"id":14,"name":"王勇刚","dingding":"18010476582","mobile":"18010476582","email":"wangyonggang@ithro.com.cn","enable":1,"tenantId":null},{"id":15,"name":"李宁宁","dingding":"18911213535","mobile":"18911213535","email":"liningning@9fbank.com.cn","enable":1,"tenantId":null}]}}'
        var person = JSON.parse(json1)
        var keys = Object.keys(person)
        console.log('==================' + keys)
        var value = []
        for (var i = 0, len = keys.length; i < len; i++) {
          var key = keys[i]
          value[i] = person[key]
          console.log(typeof value[i])
          console.log('-----person==== ', key, ': ', value[i])
        }
      },
      continueMaxcomputepreview () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtaskpreview/preview/maxcompute`),
              method: 'post',
              data: this.$http.adornData({
                'instanceId': this.instanceId || undefined,
                'datasourceId': this.dataForm.datasourceId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.resultBean)
                this.returnData += JSON.stringify(data.resultBean)
                if (data.resultBean.status === '2') {
                  this.returnData += '\n继续执行\n'
                  clearInterval(window.clearnum)
                  window.clearnum = setTimeout(() => {
                    this.continueMaxcomputepreview()
                  }, 1000)
                } else {
                  this.instanceId = ''
                  clearInterval(window.clearnum)
                }
              } else {
                this.returnData += '\ndata.msg\n'
              }
            })
          }
        })
      },
      stopMaxcomputepreview () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/honeycomb/honeycombtaskpreview/preview/stopmaxcompute`),
              method: 'post',
              data: this.$http.adornData({
                'instanceId': this.instanceId || undefined,
                'datasourceId': this.dataForm.datasourceId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data.resultBean)
                clearInterval(window.clearnum)
                this.returnData += '\n停止执行\n'
              } else {
                this.$message.error(data.msg)
                alert('操作失败')
              }
            })
          }
        })
      }
    }
  }
</script>

<style>
  .codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>
