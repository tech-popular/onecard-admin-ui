<template>
  <el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1100px"
    class="api-manage-drawer"
  >
    <div slot="title" class="drawer-title">{{canUpdate ? !!id ? '编辑数据同步任务' : '新增数据同步任务' : '查看数据同步任务'}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap" v-loading="loading">
        <el-form :model="acquisitionTask" :rules="dataRule" ref="acquisitionTask">
          <div class="work-type-pane">
            <el-form-item label="数据来源：" prop="inDatasourceType" label-width="120px">
              <el-select v-model="acquisitionTask.inDatasourceType" placeholder="请选择数据实例" filterable>
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in getAllinDatasourceList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inAccountId" label-width="10px">
              <el-select v-model="acquisitionTask.inAccountId" placeholder="请选择账户" filterable>
                <el-option-group v-for="(val, key, i) in allinAccountList" :key="i" :label="key * 1 === 0 ? '公共账号' : '个人帐号'">
                  <el-option
                    v-for="item in val"
                    :key="item.id"
                    :label="item.datasourceUser"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && Object.keys(allinAccountList).length">
                （如需配置账户，请<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && !Object.keys(allinAccountList).length">
                （无账户信息，请前往<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">配置</i>）
              </span>
            </el-form-item>
					</div>
		   	</el-form>
      <div class="work-content-1">
				<el-form>
					 <div class="work-type-pane">
					<el-form-item label="过滤规则：" label-width="120px">
						<el-input v-model="radio"></el-input>
					</el-form-item>
					<el-form-item style="margin-left:20px;margin-right:20px">
						<el-radio v-model="radio" label="1">包含</el-radio>
            <el-radio v-model="radio" label="2">不包含</el-radio>
					</el-form-item>
					<el-form-item>
						<el-button>添加</el-button>
					</el-form-item>
					</div>
				</el-form>
				<el-table style="width:90%; margin-left:40px" border>
					<el-table-column label="规则"></el-table-column>
					<el-table-column label="包含"></el-table-column>
				</el-table>
       </div>
			 <div class="work-content-1">
				<el-form>
					 <div class="work-type-pane">
					<el-form-item label="原表：" label-width="100px">
						<el-input v-model="radio"></el-input>
					</el-form-item>
					<el-form-item label="目标表：" label-width="120px">
						<el-input v-model="radio"></el-input>
					</el-form-item>
					<el-form-item style="margin-left:20px">
						<el-button>添加</el-button>
					</el-form-item>
					</div>
				</el-form>
				<el-table style="width:90%; margin-left:40px" border>
					<el-table-column label="原表"></el-table-column>
					<el-table-column label="目标表"></el-table-column>
				</el-table>
       </div>
			 <el-form :model="acquisitionTask" :rules="dataRule" ref="acquisitionTask">
          <div class="work-type-pane">
            <el-form-item label="输出表来源：" prop="inDatasourceType" label-width="135px">
              <el-select v-model="acquisitionTask.inDatasourceType" placeholder="请选择数据实例" filterable>
                <el-option :label="item.name" :value="item.name" v-for="(item, index) in getAllinDatasourceList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="inAccountId" label-width="10px">
              <el-select v-model="acquisitionTask.inAccountId" placeholder="请选择账户" filterable>
                <el-option-group v-for="(val, key, i) in allinAccountList" :key="i" :label="key * 1 === 0 ? '公共账号' : '个人帐号'">
                  <el-option
                    v-for="item in val"
                    :key="item.id"
                    :label="item.datasourceUser"
                    :value="item.id"
                  ></el-option>
                </el-option-group>
              </el-select>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && Object.keys(allinAccountList).length">
                （如需配置账户，请<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">点击</i>）
              </span>
              <span style="color:red;font-size:10px;" v-if="acquisitionTask.inDatasourceId && !Object.keys(allinAccountList).length">
                （无账户信息，请前往<i style="font-style: normal;color:blue;cursor:pointer" @click="gotoDataSource">配置</i>）
              </span>
            </el-form-item>
					</div>
					<el-form-item style="margin-left:30px;">
						<el-radio v-model="radio" label="1">实时</el-radio>
            <el-radio v-model="radio" label="2">离线</el-radio>
					</el-form-item>
					<el-form-item label="cron表达式：" label-width="135px">
						<el-input v-model="radio"></el-input>
					</el-form-item>
		   	</el-form>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="canUpdate" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      canUpdate: true, // 查看时不可编辑
      id: '',
      rowData: { // 修改时数据内容
        authOwner: '',
        authOtherList: [],
        authOthers: ''
      },
      formDs: '',
      toDs: '',
      updateUser: '',
      updateTime: '',
      dataForm: {},
      radio: '',
      tempDataForm: {
        taskName: '',
        id: '',
        projectId: '',
        taskDescribe: '',
        taskDisable: 0,
        requestedUser: '',
        failRepeatTrigger: 3,
        isRunAgain: 0
      },
      filterRules: {

      },
      acquisitionTask: {
        inDatasourceType: '',
        inDatasourceId: '',
        inAccountId: '',
         outDatasourceId: '', // 输出数据源Id
        outAccountId: '', // 输出数据源对应帐户Id
        addRuleFields: ''
      },
      dataRule: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        inDatasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'change' }
        ],
        inDatasourceId: [
          { required: true, message: '请选择数据源名称', trigger: 'change' }
        ],
        inAccountId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        estimatedDataVolume: [
          { required: true, message: '请选择预估数据量', trigger: 'change' }
        ],
        inDataSql: [
          { required: true, message: '请输入作业开始前SQL', trigger: 'change' }
        ],
        sqlField: [
          { required: true, message: '请选择输出字段', trigger: 'change' }
        ],
        outAccountId: [
          { required: true, message: '请选择帐户', trigger: 'change' }
        ],
        outDatasourceType: [
          { required: true, message: '请选择数据源类型', trigger: 'change' }
        ],
        outDatasourceId: [
          { required: true, message: '请选择数据源名称', trigger: 'change' }
        ],
        outDataTable: [
          { required: true, message: '请输入输出数据表', trigger: 'blur' }
        ],
        addDataRule: [
          { required: true, message: '请选择下发类型', trigger: 'change' }
        ],
        taskDisable: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        requestedUser: [
          { required: true, message: '请输入需求提出人', trigger: 'blur' }
        ],
        addRuleFields: [
           { required: true, message: '请输入增量规则', trigger: 'blur' }
        ],
        isRunAgain: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        failRepeatTrigger: [
          {required: true, message: '请输入重跑次数', trigger: 'change'}
        ],
        //
        redisName: [
          { required: true, message: '请选择redis数据格式', trigger: 'change' }
        ],
        redisKey: [
          { required: true, message: '请输入redisKey', trigger: 'blur' }
        ],
        redisValue: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        // redisJoinType: [
        //   {required: true, message: '请选择key拼接时间', trigger: 'change'}
        // ],
        // redisUneffectTime: [
        //   {required: true, message: '请输入key失效时间', trigger: 'blur'}
        // ],
        idColumn: [
          {required: true, message: '请输入ID列', trigger: 'blur'}
        ]
      },
      allSystemList: [],
      getAllinDatasourceList: [],
      getAllinDatasourceNameList: [],
      getAlloutDatasourceList: [],
      getAlloutDatasourceNameList: [],
      allAccountList: [],
      allinAccountList: [],
      alloutAccountList: ''
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
      this.visible = true
      this.rowData = id ? deepClone(id) : this.rowData
      this.canUpdate = canUpdate
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.addOrUpdateVisible = false
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
  .work-content-1 {
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
