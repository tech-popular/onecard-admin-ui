<template>
  <div>
    <el-dialog
      :title="canUpdate? !dataForm.id ? '新增' : '修改' :'查看'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        :disabled="!canUpdate"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="150px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="任务名称"></el-input>
        </el-form-item>
        <el-form-item label="输入数据源" prop="inDatasource">
          <el-select v-model="dataForm.inDatasource" placeholder="请选择">
            <el-option
              v-for="item in datasourceoptions"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(outdata, index) in dataForm.honeycombOutDatasourceEntitys"
          :label="'输出数据源' + index"
          :key="outdata.key"
        >
          <el-row :gutter="24">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-select
                  v-model="outdata.outDatasource"
                  @change="selectOutData(index)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in datasourceoptions"
                    :key="item.id"
                    :label="item.datasourceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="9" v-if="!redisListData[index] || !redisListData[index].show">
              <div class="grid-content bg-purple">
                <el-input v-model="outdata.outTableName"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-button @click.prevent="removeDomain(outdata, index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
          <div v-if="redisListData[index] && redisListData[index].show" class='redis-config' style="marginLeft: -130px">
            <el-form-item class="el-redis-item" label="redis数据格式">
              <el-select v-model="redisListData[index].name" placeholder="redis数据格式" clearable @change="val => redisNameChange(val, index)">
                <el-option
                  v-for="item in redisNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="el-redis-item" label="redisKey">
              <el-input v-model="redisListData[index].key" placeholder="redisKey" clearable></el-input>
            </el-form-item>
            <el-form-item class="el-redis-item" :label="redisListData[index].label + 'Value'" v-if="!!redisListData[index].name">
              <el-input v-model="redisListData[index].value" :placeholder="redisListData[index].label + 'Value'" clearable></el-input>
            </el-form-item>
            <el-form-item class="el-redis-item" label="score" v-if="redisListData[index].name === 'redisTypeZSet'">
              <el-input v-model="redisListData[index].score" placeholder="score" clearable></el-input>
            </el-form-item>
            <el-form-item class="el-redis-item" label="key拼接时间">
              <el-select v-model="redisListData[index].type" placeholder="key拼接时间" clearable>
                <el-option v-for="item in redisTypes" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="el-redis-item" label="key失效时间">
              <el-input
                v-model="redisListData[index].time"
                placeholder="key失效时间"
                clearable
                @input="redisListData[index].time = redisListData[index].time.replace(/[^\d]/g,'')"
              >
                <el-select v-model="redisListData[index].unit" slot="append">
                  <el-option
                    v-for="item in redisUnits"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDomain">新增输出数据源</el-button>
        </el-form-item>
        <!-- <el-form-item label="SQL列" prop="sqlFields">
          <el-input v-model="dataForm.sqlFields" placeholder="必须和SQL对应"></el-input>
        </el-form-item> -->
        <el-form-item label="SQL" prop="sql">
          <el-input type="textarea" v-model="dataForm.sql" placeholder="SQL" :rows="10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="testSQL">测试一下SQL</el-button>
        </el-form-item>
        <el-form-item label="cron表达式" prop="cron">
          <el-input v-model="dataForm.cron" placeholder="cron表达式"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"  v-if="canUpdate" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 测试 sql -->
    <el-dialog :visible.sync="sqlVisible" width="800px">
      <el-form :model="dataSql" ref="dataSql" :rules="sqlRule">
        <el-form-item label="任务列表">
          <el-input v-model="dataSql.taskId" placeholder="周期" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item prop="datasourceId" label="数据源">
          <el-input v-model="dataSql.datasourceId" placeholder="周期" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item prop="sql">
          <!-- <textarea
            ref="mycode"
            class="codesql"
            v-model="dataSql.sql"
            style="height:200px;width:100%"
          ></textarea>-->
          <codemirror
            ref="mycode"
            :value="dataSql.sql"
            :options="cmOptions"
            @changes="changes"
            class="code"
          ></codemirror>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataSqlSubmit()">执行</el-button>
          <el-button type="primary" @click="stopMaxcomputepreview()">停止</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="执行状态" name="first">
          <el-input type="textarea" ref="returnData" v-model="returnStatus" autosize min="4"></el-input>
        </el-tab-pane>
        <el-tab-pane label="执行结果" name="second">
          <el-input type="textarea" ref="returnData" v-model="returnData" autosize min="4"></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import { deepClone } from '@/utils'
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
    const validateNull = (rule, value, callback) => {
      value = (value + '').trim()
      if (!value) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      showCronBox: false,
      visible: false,
      sqlVisible: false,
      canUpdate: true, // 查看时不可编辑
      dataFormOrigin: {
        id: 0,
        name: '',
        inDatasource: '',
        // sqlFields: '',
        sql: '',
        transformerConfig: '',
        outDatasource: '',
        cron: '',
        honeycombOutDatasourceEntitys: [
          {
            outTableName: '',
            outDatasource: 1,
            enable: 1,
            taskId: 0
          }
        ]
      },
      dataForm: {},
      datasourceoptions: [],
      tenantoptions: [],
      computeTypeoptions: [],
      idRuleoptions: [],
      dataRule: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blur', validator: validateNull }
        ],
        inDatasource: [
          { required: true, message: '输入数据源不能为空', trigger: 'change' }
        ],
        cron: [{ required: true, message: 'cron不能为空', trigger: 'blur', validator: validateNull }]
      },
      dataSql: {
        datasourceId: '',
        sql: '',
        taskId: ''
      },
      instanceId: '',
      returnData: '',
      returnStatus: '',
      activeName: 'first',
      sqlRule: {
        datasourceId: [
          { required: true, message: '输入数据源不能为空', trigger: 'blur' }
        ],
        sql: [{ required: true, message: 'sql不能为空', trigger: 'blur' }]
      },
      cmOptions: {
        mode: 'text/x-mariadb',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // autofocus: true,
        extraKeys: { Ctrl: 'autocomplete' }, // 自定义快捷键
        hintOptions: {
          tables: {}
        }
      },
      redis: {
        name: '',
        key: '',
        type: '',
        time: '',
        unit: ''
      },
      redisListData: [],
      redisNames: [
        {
          value: 'redisTypeString',
          label: 'string'
        },
        {
          value: 'redisTypeList',
          label: 'list'
        },
        {
          value: 'redisTypeSet',
          label: 'set'
        },
        {
          value: 'redisTypeZSet',
          label: 'zSet'
        },
        {
          value: 'redisTypeHash',
          label: 'hash'
        }
      ],
      redisTypes: [
        'yyyy-MM-dd HH:mm:ss',
        'yyyyMMdd',
        'yyyy-MM-dd',
        'yyyy_MM_dd',
        'yyyy',
        'MM',
        'dd'
      ],
      redisUnits: [
        {
          value: '1',
          label: '秒'
        },
        {
          value: '2',
          label: '分钟'
        },
        {
          value: '3',
          label: '小时'
        },
        {
          value: '4',
          label: '天'
        }
      ]
    }
  },
  created () {
    this.dataForm = deepClone(this.dataFormOrigin)
  },
  computed: {
    codemirror () {
      return this.$refs.mycode.codemirror
    }
  },
  methods: {
    addDomain () {
      this.dataForm.honeycombOutDatasourceEntitys.push({
        outTableName: '',
        key: Date.now()
      })
    },
    testSQL () {
      this.sqlVisible = true
      this.returnData = ''
      this.returnStatus = ''
      this.dataSql = {
        datasourceId: this.dataForm.inDatasource,
        sql: this.dataForm.sql,
        taskId: this.dataForm.id
      }
    },
    removeDomain (item, i) {
      var index = this.dataForm.honeycombOutDatasourceEntitys.indexOf(item)
      if (index !== -1) {
        this.dataForm.honeycombOutDatasourceEntitys.splice(index, 1)
      }
      this.redisListData.splice(i, 1)
    },
    redisNameChange (val, index) {
      let label = this.redisNames.filter(item => item.value === val)[0].label
      this.redisListData.splice(index, 1, { ...this.redisListData[index], label: label })
    },
    init (row, canUpdate) {
      this.redisListData = []
      this.dataForm = deepClone(this.dataFormOrigin)
      this.dataForm.id = row ? row.id : 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (!this.checkRedisList()) {
        return false
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
        }
      })
    },
    changes (value) {
      this.dataSql.sql = this.codemirror.getValue()
    },
    // sql表单提交
    dataSqlSubmit () {
      this.$refs['dataSql'].validate(valid => {
        if (valid) {
          this.returnData = ''
          this.returnStatus = ''
        }
      })
    },
    stopMaxcomputepreview () {
      this.$refs['dataSql'].validate(valid => {
        if (valid) {
        }
      })
    },
    // 输出源
    selectOutData (index) {
      this.$set(this.redisListData, index, {
        name: '',
        key: '',
        value: '',
        label: '',
        score: '',
        time: '',
        type: '',
        unit: '1'
      })
      let id = this.dataForm.honeycombOutDatasourceEntitys[index].outDatasource
      let datasource = this.datasourceoptions.filter(item => item.id == id)
      if (datasource[0].datasourceType == 'redis' || datasource[0].datasourceType == 'singleRedis') {
        this.$set(this.redisListData, index, {
          show: true,
          unit: '1'
        })
      } else {
        this.$set(this.redisListData, index, {
          show: false
        })
      }
    },
    checkRedisList () {
      for (let i = 0; i < this.redisListData.length; i++) {
        if (this.redisListData[i].show && !this.redisListData[i].name) {
          this.$message({
            type: 'warning',
            message: '请输入redis数据格式'
          })
          return false
        }
      }
      return true
    }
  },
  watch: {
    redisListData: {
      handler (newVal, oldVal) {
        let unitCount = {
          '1': 1,
          '2': 60,
          '3': 60 * 60,
          '4': 60 * 60 * 24
        }
        newVal.forEach((item, index) => {
          if (item.show) {
            let time = 0
            for (let key in unitCount) {
              if (item.unit == key) {
                time = item.time ? Number(item.time) * unitCount[key] : ''
              }
            }
            let outTableName =
              item.name +
              '#' +
              (item.key ? item.key : ' ') +
              '#' +
              (item.type ? item.type : ' ') +
              '#' +
              (time || ' ') +
              '#' +
              item.value +
              '#' +
              (item.score ? item.score : ' ') +
              '#'
            this.$set(
              this.dataForm.honeycombOutDatasourceEntitys[index],
              'outTableName',
              outTableName
            )
            console.log(this.dataForm.honeycombOutDatasourceEntitys)
          }
        })
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="scss">
.el-redis-item {
  margin-top: 20px !important;
}
.redis-config .el-input-group__append {
  width: 80px;
}
</style>
