<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-tabs v-model="activeName" @tab-click="topHandleClick">
    <el-tab-pane label="任务基本信息" name="1" :disabled="disabledNum == '1'"></el-tab-pane>
    <el-tab-pane label="任务参数详细配置" name="2" :disabled="disabledNum == '2'"></el-tab-pane>
    <!-- <el-tab-pane label="步骤 3" name="3"></el-tab-pane> -->
  </el-tabs>

  <div v-show="activeName == '1'">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="datatype">
        <el-select v-model="dataForm.datatype" placeholder="请选择">
          <el-option v-for="item in datatypeoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源类型" prop="datasource">
        <el-select v-model="dataForm.datasource" placeholder="请选择">
          <el-option
            v-for="item in datasourceoptions"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="in数据源类型" prop="inDatasource">
        <el-select v-model="dataForm.inDatasource" placeholder="请选择">
          <el-option
            v-for="item in datasourceoptions"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="out数据源类型" prop="outDatasource">
        <el-select v-model="dataForm.outDatasource" placeholder="请选择">
          <el-option
            v-for="item in datasourceoptions"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计算类型" prop="computeType">
        <el-select v-model="dataForm.computeType" placeholder="请选择">
          <el-option v-for="item in computeTypeoptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源" prop="topic">
        <el-input type="textarea" v-model="dataForm.topic" placeholder="数据源" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label=" 历史数据生成sql" prop="cacheSql">
        <el-input type="textarea" v-model="dataForm.cacheSql" placeholder="cache_sql" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="sql" prop="sql">
        <el-input type="textarea" v-model="dataForm.sql" placeholder="sql" :rows="12"></el-input>
      </el-form-item>
      <el-form-item label="频率(秒)" prop="howOften">
        <el-input v-model="dataForm.howOften" placeholder="频率"></el-input>
      </el-form-item>
      <el-form-item label="周期" prop="period">
        <el-input v-model="dataForm.period" placeholder="周期"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input v-model="dataForm.tags" placeholder="标签"></el-input>
      </el-form-item>
      <el-form-item label="cron" prop="cron">
        <el-input v-model="dataForm.cron" placeholder="*/10 * * * * ?"></el-input>
      </el-form-item>
      <el-form-item label="dependTask" prop="dependTask">
        <el-input v-model="dataForm.dependTask" placeholder="dependTask"></el-input>
      </el-form-item>
      <el-form-item label="outType" prop="outType">
        <el-input v-model="dataForm.outType" placeholder="outType"></el-input>
      </el-form-item>
      <el-form-item label="table" prop="table">
        <el-input v-model="dataForm.table" placeholder="table"></el-input>
      </el-form-item>
      <el-form-item label="transformerConfig" prop="transformerConfig">
        <el-input v-model="dataForm.transformerConfig" placeholder="transformerConfig"></el-input>
      </el-form-item>
      <el-form-item label="version" prop="version">
        <el-input v-model="dataForm.version" placeholder="version"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

  </div>
  <div v-show="activeName == '2'">
    <el-form :model="parentData">
      <!-- 详参配置二级Tab栏 -->
      <el-tabs v-model="parentData.editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-remove="removeTab">
        <el-tab-pane
          @click='changeEditableTab()'
          :key="item.index"
          v-for="(item, index) in parentData.editableTabs"
          :label="item.title"
          :name="item.sort"
          >
          <!-- serviceId目标选取 -->
          <el-form-item label="serviceId" prop="serviceId">
            <el-select v-model="item.serviceId" @change= "blurOption(item)" placeholder="请选择">
              <el-option v-for="item in projects"   :key="item.id" :label="item.project" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- serviceId_End -->

          <!-- 轻中重等级栏目 -->
          <el-tabs v-model="task_activeName" @tab-click="levelHandleClick()">
            <el-tab-pane label="轻" name="oneLevel">
              <el-form :model="item.oneLevel" :rules="dataRule_threshold" ref="dataForm_threshold">
                <el-form-item label="阈值表达式" prop="thresholdExpression">
                  <el-input type="textarea" v-model="item.oneLevel.threshold.thresholdExpression" placeholder="阈值表达式"></el-input>
                </el-form-item>
                <el-form-item label="连续错误次数" prop="mostConsecutiveLosses">
                  <el-input-number v-model="item.oneLevel.threshold.mostConsecutiveLosses" :min="1" :max="10" label="错误连续次数"></el-input-number>
                  <el-tooltip class="item" effect="dark" content="连续错误多少次触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="非连续错误次数" prop="incontinuity">
                  <el-input-number v-model="item.oneLevel.threshold.incontinuity" :min="1" :max="10" label="检查点内错误次数"></el-input-number>
                  <el-tooltip class="item" effect="dark" content="10次检查中不通过的次数总和触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <hr>
                <!-- 选择用户群组 -->
                选择用户群组
                <el-transfer v-model="item.oneLevel.userGroupStr" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allUsergroup" :titles="['全部', '选中']" :filterable="true">
                </el-transfer>
                <hr>
                <!-- 通道 -->
                选择报警渠道
                <el-transfer v-model="item.oneLevel.pipelieStr" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allPipeline" :titles="['全部', '选中']" :filterable="true">
                </el-transfer>
              </el-form>
            </el-tab-pane>
            <!-- 2级 -->
            <el-tab-pane label="中" name="twoLevel">
              <el-form :model="item.twoLevel" :rules="dataRule_threshold" ref="dataForm_threshold">
                <el-form-item label="阈值表达式" prop="thresholdExpression">
                  <el-input type="textarea" v-model="item.twoLevel.threshold.thresholdExpression" placeholder="阈值表达式"></el-input>
                </el-form-item>
                <el-form-item label="连续错误次数" prop="mostConsecutiveLosses">
                  <el-input-number v-model="item.twoLevel.threshold.mostConsecutiveLosses" :min="1" :max="10" label="错误连续次数"></el-input-number>
                  <el-tooltip class="item" effect="dark" content="连续错误多少次触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="非连续错误次数" prop="incontinuity">
                  <el-input-number v-model="item.twoLevel.threshold.incontinuity" :min="1" :max="10" label="检查点内错误次数"></el-input-number>
                   <el-tooltip class="item" effect="dark" content="10次检查中不通过的次数总和触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <hr>
                选择用户群组
                <el-transfer v-model="item.twoLevel.userGroupStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allUsergroup" :filterable="true">
                </el-transfer>
                <hr>
                <!-- 通道 -->
                选择报警渠道
                <el-transfer v-model="item.twoLevel.pipelieStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allPipeline" :filterable="true">
                </el-transfer>
              </el-form>
            </el-tab-pane>
            <!-- 重 -->
            <el-tab-pane label="重" name="threeLevel">
              <el-form :model="item.threeLevel" :rules="dataRule_threshold" ref="dataForm_threshold">
                <el-form-item label="阈值表达式" prop="thresholdExpression">
                  <el-input type="textarea" v-model="item.threeLevel.threshold.thresholdExpression" placeholder="阈值表达式"></el-input>
                </el-form-item>
                <el-form-item label="连续错误次数" prop="mostConsecutiveLosses">
                  <el-input-number v-model="item.threeLevel.threshold.mostConsecutiveLosses" :min="1" :max="10" label="错误连续次数"></el-input-number>
                   <el-tooltip class="item" effect="dark" content="连续错误多少次触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="非连续错误次数" prop="incontinuity">
                  <el-input-number v-model="item.threeLevel.threshold.incontinuity" :min="1" :max="10" label="检查点内错误次数"></el-input-number>
                  <el-tooltip class="item" effect="dark" content="10次检查中不通过的次数总和触发报警" placement="top">
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-form-item>
                <hr>
                选择用户群组
                <el-transfer v-model="item.threeLevel.userGroupStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allUsergroup" :filterable="true">
                </el-transfer>
                <hr>
                <!-- 通道 -->
                选择报警渠道
                <el-transfer v-model="item.threeLevel.pipelieStr" :titles="['全部', '选中']" :props="{
                        key: 'id',
                        label: 'name'
                      }" :data="parentData.allPipeline" :filterable="true">
                </el-transfer>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <!-- end -->
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
  <span slot="footer" class="dialog-footer">
    <el-button style="margin-top: 12px;" v-show="nextButton" @click="nextPage()">下一步</el-button>
    <el-button @click="closeUpdateBox">取消</el-button>
    <el-button v-show="dataForm.id" type="primary" @click="dataFormSubmit()">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  name: 'add_update',
  data () {
    return {

      disabledNum: '', // disableTab
      nextButton: true,
      visible: false,
      parentData: { // 返显数据
        addtabs: [],
        deltabs: [],
        editableTabsValue: '1',
        editableTabs: [],
        allUsergroup: [],
        allPipeline: []
      },
      options: [],
      datasourceoptions: [],
      dataForm: {
        id: 0,
        name: '',
        datatype: '',
        datasource: '',
        computeType: '',
        topic: '',
        cacheSql: '',
        sql: '',
        howOften: '60',
        period: 0,
        tags: '',
        projectId: '',
        enable: 1,
        cron: '',
        dependTask: '',
        inDatasource: '',
        outDatasource: '',
        outType: '',
        table: '',
        transformerConfig: '',
        version: 1
      },
      dataRule: {
        name: [{
          required: true,
          message: '任务名称不能为空',
          trigger: 'blur'
        }],
        datatype: [{
          required: true,
          message: '数据类型不能为空',
          trigger: 'blur'
        }],
        datasource: [{
          required: true,
          message: '数据源不能为空',
          trigger: 'blur'
        }],
        computeType: [{
          required: true,
          message: '计算类型不能为空',
          trigger: 'blur'
        }],
        topic: [{
          required: true,
          message: '主题不能为空',
          trigger: 'blur'
        }],
        // cacheSql: [{
        //   required: true,
        //   message: 'cache_sql不能为空',
        //   trigger: 'blur'
        // }],
        // sql: [{
        //   required: true,
        //   message: 'sql不能为空',
        //   trigger: 'blur'
        // }],
        // howOften: [{
        //   required: true,
        //   message: '频率不能为空',
        //   trigger: 'blur'
        // },
        // {
        //   type: 'number',
        //   message: '请输入数字类型'
        // }],
        // projectId: [{
        //   required: true,
        //   message: '项目Id不能为空',
        //   trigger: 'blur'
        // }],
        enable: [{
          required: true,
          message: '是否启用不能为空',
          trigger: 'blur'
        }]
      },
      dataRule_threshold: {
        channel: [{
          required: true,
          message: '渠道不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        value: [{
          required: true,
          message: 'pipe值不能为空',
          trigger: 'blur'
        }],
        templateId: [{
          required: true,
          message: '模板Id不能为空',
          trigger: 'blur'
        }],
        enable: [{
          required: true,
          message: '是否启用不能为空',
          trigger: 'blur'
        }]
      },
      computeTypeoptions: [],
      // datasourceoptions: [{
      //   value: 1,
      //   label: 'kafka'
      // }, {
      //   value: 2,
      //   label: '常规数据源'
      // }, {
      //   value: 3,
      //   label: 'MYSQL'
      // }, {
      //   value: 4,
      //   label: 'Healthcheck'
      // }],
      datatypeoptions: [{
        value: 1,
        label: 'METRIC'
      }, {
        value: 2,
        label: 'ZIPKIN'
      }, {
        value: 3,
        label: 'MYSQL'
      }, {
        value: 4,
        label: 'Healthcheck'
      }],
      projects: [],
      activeName: '1',
      value1: [],
      userdata: [],
      task_activeName: 'oneLevel'

    }
  },
  methods: {
    blurOption (item) {
      this.parentData.editableTabs[(+item.index) - 1].title = this.projects[item.serviceId]['project']
    },
    dataType (obj) {
      if (obj === null) return 'Null'
      if (obj === undefined) return 'Undefined'
      return Object.prototype.toString.call(obj).slice(8, -1)
    },
    /**
     * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
     **/
    dealObjectValue (obj) {
      var param = {}
      if (obj === null || obj === undefined || obj === '') return param
      for (var key in obj) {
        if (this.dataType(obj[key]) === 'Object') {
          param[key] = this.dealObjectValue(obj[key])
        } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
          param[key] = obj[key]
        }
      }
      return param
    },
    closeUpdateBox () {
      this.$emit('closeUpdateBox')
    },
    /**
     * @function fetchThresholdData 【获取阈值信息】
     */
    fetchThresholdData () {
      return this.$http({
        url: this.$http.adornUrl(`/canary/second/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        console.log(data)
        if (data && data.code === 0) {
          this.$set(this.$data, 'parentData', Object.assign({}, this.parentData, this.dealObjectValue(data.data)))
        }
      })
    },
    fetchProjectsData () {
      return this.$http({
        url: this.$http.adornUrl(`/canary/canaryproject/select`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.projects = data.allProjects
        }
      })
    },
    /**
     * @function fetchTaskData 【获取步骤1】
     */
    fetchTaskData () {
      return this.$http({
        url: this.$http.adornUrl(`/canary/first/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataForm = data.canaryTask
        }
      })
    },
    /**
     * @function submitThresholdData 【提交阈值信息】
     */
    submitThresholdData () {
      this.$http({
        url: this.$http.adornUrl(`/canary/second/${!this.dataForm.id ? 'save' : 'update'}`),
        method: 'post',
        params: this.$http.adornParams(),
        data: this.$http.adornData(this.parentData)
      }).then(({
        data
      }) => {
        console.log(data)
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('closeUpdateBox')
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      // 20190703 下拉框数组-》数据源
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictitem/selectalltaskpage`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.computeTypeoptions = data.taskDicts.task_compute_type
        }
      })
      this.$http({
        url: this.$http.adornUrl(`/canary/canarydatasourceconfig/select`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.datasourceoptions = data.canaryDatasourceConfigEntities
        }
      })
      // 步骤一渲染
      this.fetchProjectsData().then(() => {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.fetchTaskData()
          }
        })
      })
      // 新增加不需要调取步骤2
      if (!this.dataForm.id) {
        this.disabledNum = '2'
      } else {
        this.fetchThresholdData()
        this.disabledNum = ''
      }
    },

    // 下一步（第三tab无下一步操作）
    nextPage () {
      let activeNum = parseInt(this.activeName)
      if (activeNum >= 1) {
        this.nextButton = false
      }
      activeNum++
      this.submitActiveOne().then(data => {
        if (data && data.code === 0 && data['data']) {
          this.dataForm.id = data.data.id
          this.fetchThresholdData()
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.disabledNum = ''
              this.activeName = activeNum.toString()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 顶部tab切换
    topHandleClick (tab, event) {
      if (parseInt(this.activeName) === 2) {
        this.nextButton = false
      } else {
        this.nextButton = true
      }
      this.activeName = tab.name
    },
    // levelHandleClick
    levelHandleClick () {
      console.log(123)
    },
    // 提交步骤一
    submitActiveOne () {
      return this.$http({
        url: this.$http.adornUrl(`/canary/first/${!this.dataForm.id ? 'save' : 'update'}`),
        method: 'post',
        data: this.$http.adornData({
          'id': this.dataForm.id || undefined,
          'name': this.dataForm.name,
          'datatype': this.dataForm.datatype,
          'datasource': this.dataForm.datasource,
          'computeType': this.dataForm.computeType,
          'topic': this.dataForm.topic,
          'cacheSql': this.dataForm.cacheSql,
          'sql': this.dataForm.sql,
          'howOften': this.dataForm.howOften,
          'period': this.dataForm.period,
          'tags': this.dataForm.tags,
          'projectId': this.dataForm.projectId,
          'enable': this.dataForm.enable,
          'cron': this.dataForm.cron,
          'table': this.dataForm.table,
          'dependTask': this.dataForm.dependTask,
          'inDatasource': this.dataForm.inDatasource,
          'outDatasource': this.dataForm.outDatasource,
          'outType': this.dataForm.outType,
          'transformerConfig': this.dataForm.transformerConfig,
          'version': this.dataForm.version
        })
      }).then(({
        data
      }) => {
        return data
      })
    },
    // 表单提交
    dataFormSubmit () {
      if (this.activeName === '2') {
        this.submitThresholdData()
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submitActiveOne().then((data) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('closeUpdateBox')
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    unique () {
      return this.filter((v, i) => this.indexOf(v) === i)
    },
    removeTab (targetName) {
      let newArr = []
      if (this.parentData.editableTabs.length <= 1 || this.parentData.editableTabs.length > targetName) {
        return
      }
      let tabs = this.parentData.editableTabs
      let activeName = this.parentData.editableTabsValue
      console.log(targetName)
      console.log(this.parentData.editableTabs.length)
      this.parentData.deltabs.push(this.parentData.editableTabs[(+targetName) - 1]['sort'])
      this.parentData.deltabs.forEach(function (e) {
        if (!newArr.includes(e)) {
          newArr.push(e)
        }
      })
      this.parentData.deltabs = newArr
      console.log(this.parentData.deltabs)
      if (activeName === targetName) {
        tabs.forEach((tab, _index) => {
          if (tab.index === targetName) {
            let nextTab = tabs[_index + 1] || tabs[_index - 1]
            if (nextTab) {
              activeName = nextTab.index
            }
          }
        })
      }

      this.parentData.editableTabsValue = activeName
      this.parentData.editableTabs = tabs.filter(tab => tab.index !== targetName)
    },
    //
    handleTabsEdit (targetName, action) {
      let initTabsData = {
        'serviceId': 0,
        'sort': '0',
        'index': '',
        'oneLevel': {
          'threshold': {
            'id': null,
            'taskId': 1,
            'level': 1,
            'serviceId': 1,
            'thresholdExpression': '',
            'mostConsecutiveLosses': 0,
            'incontinuity': 1,
            'enable': 1,
            'tenantId': null
          },
          'usergroup': [],
          'userGroupStr': [],
          'pipeline': [],
          'pipelieStr': []
        },
        'twoLevel': {
          'threshold': {
            'id': null,
            'level': 2,
            'serviceId': 3,
            'thresholdExpression': '',
            'mostConsecutiveLosses': 1,
            'incontinuity': 1,
            'enable': 1,
            'tenantId': null
          },
          'usergroup': [],
          'userGroupStr': [],
          'pipeline': [],
          'pipelieStr': []
        },
        'threeLevel': {
          'threshold': {
            'id': 8,
            'taskId': 1,
            'level': 3,
            'serviceId': 1,
            'thresholdExpression': '',
            'mostConsecutiveLosses': 3,
            'incontinuity': 5,
            'enable': 1,
            'tenantId': null
          },
          'usergroup': [],
          'userGroupStr': [],
          'pipeline': [],
          'pipelieStr': []
        }
      }
      if (action === 'add') {
        if (this.parentData.editableTabs.length === 0) {
          initTabsData.sort = '1'
        } else {
          initTabsData.sort = (+this.parentData.editableTabs[this.parentData.editableTabs.length - 1]['sort']) + 1 + ''
        }
        initTabsData.index = this.parentData.editableTabs.length + 1 + ''
        initTabsData.title = 'default'
        let newTabName = this.parentData.editableTabs.length + 1 + ''
        this.parentData.editableTabs.push(initTabsData)
        this.parentData.editableTabsValue = newTabName
        this.parentData.addtabs.push(initTabsData.sort)
      }
      // if (action === 'remove') {
      //   let tabs = this.parentData.editableTabs
      //   debugger
      //   let activeName = this.parentData.editableTabsValue
      //   this.parentData.deltabs.push(this.parentData.editableTabs[(+activeName) + 1]['sort'])
      //   if (activeName === targetName) {
      //     tabs.forEach((tab, _index) => {
      //       if (tab.index === targetName) {
      //         let nextTab = tabs[_index + 1] || tabs[_index - 1]
      //         if (nextTab) {
      //           activeName = nextTab.index
      //         }
      //       }
      //     })
      //   }
      //
      //   this.parentData.editableTabsValue = activeName
      //   this.parentData.editableTabs = tabs.filter(tab => tab.index !== targetName)
      // }
    }
  }
}
</script>
<style>
  .el-transfer-panel{
    width: 330px;
  }

</style>
