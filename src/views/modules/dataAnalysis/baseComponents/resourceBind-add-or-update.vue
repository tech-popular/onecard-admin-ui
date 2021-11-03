<template>
	<el-dialog  width="800px" :title="tag === 'view' ? '查看' : dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
		<el-form  v-loading="dataLoading" label-width="160px" :model="dataForm"  :rules="baseRule" ref="dataForm" :disabled="viewVisible">
			<el-form-item label="名称" prop="resourceName" :rules="{ required: true, message: '请输入名称', trigger: 'blur' }">
				<el-input v-model="dataForm.resourceName" placeholder="请输入名称" style="width: 400px"></el-input>
			</el-form-item>
      <el-form-item label="所属渠道" prop="channelCode" :rules="{ required: true, message: '请选择所属渠道', trigger: 'blur' }">
				<el-select
					v-model="dataForm.channelCode"
					@change="channelIdChange"
					filterable
					style="width: 400px"
				>
					<template v-for="(item, index) in channelList">
						<el-option
							:key="index"
							:label="item.text"
							:value="item.value"
							:disabled="item.disabled"
						></el-option>
					</template>
				</el-select>
				</el-form-item>
			<el-form-item label="类型" prop="type"> 
				<el-select v-model="dataForm.type" @change="changeType" style="width: 400px">
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
				</el-select>
			</el-form-item>
      <!-- kafka -->
      <div style="display:flex">
        <el-form-item v-if="dataForm.editType === '0' && dataForm.type === 'kafka'" label="topic" prop="resourceId" :rules="{ required: true, message: '请选择topic', trigger: 'blur' }">
          <el-select v-model="dataForm.resourceId" @change="kafkaServerChange" style="margin-right:15px;width: 400px;">
            <el-option
              v-for="item in kafkaServerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <el-tooltip placement="top" v-if="dataForm.editType === '0' && dataForm.type === 'kafka' && dataForm.resourceId">
          <div slot="content">{{target}}</div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
        </el-tooltip>
      </div>
      <!-- 短信 -->
      <el-form-item label="配置方式" v-if="dataForm.type === 'sms'" prop="editType">
        <el-radio v-model="dataForm.editType" @change="changeEditType"  label="0">标准模板</el-radio>
        <el-radio v-model="dataForm.editType" @change="changeEditType"  label="1">自定义模板</el-radio>
      </el-form-item>
			 <el-form-item  prop="channelId" v-if="dataForm.editType === '0' && dataForm.type === 'sms'" label="短信渠道" :rules="{ required: true, message: '请选择短信渠道', trigger: 'blur' }">
        <el-select v-model="dataForm.channelId" filterable  @change="getDate(dataForm.channelId,true)" placeholder="请选择渠道" style="width: 400px">
          <el-option v-for="(item, index) in issueChannelList" :key="index" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <div style="display:flex">
        <el-form-item prop="resourceCode" v-if="dataForm.editType === '0' && dataForm.type === 'sms'" label="短信模板" :rules="{ required: true, message: '请选择短信模板', trigger: 'blur' }">
          <el-select v-model="dataForm.resourceCode" filterable  @change="getSmsTemplate" placeholder="请选择模板" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in issueTemplateList" :key="index" :value="item.tempCode" :label="item.smsDesc"></el-option>
          </el-select>
        </el-form-item>
        <el-tooltip placement="top" v-if="dataForm.editType === '0' && dataForm.type === 'sms' && dataForm.resourceCode">
          <div slot="content">{{dataForm.resourceCode}}</div>
          <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
        </el-tooltip>
      </div>
      <el-form-item prop="smsTemplate" v-if="dataForm.editType === '0' && dataForm.type === 'sms'" label="模板详情">
        <el-input type="textarea" autosize v-model="dataForm.smsTemplate" :disabled="true" >
				</el-input>
					<p style="margin:0" v-if="dataForm.resourceCode">
              需要选择
            <span style="color:red" v-text="paramsNum"></span> 个参数
          </p>
      </el-form-item>
      <div v-if="dataForm.editType === '1' && dataForm.type === 'sms'">
        <el-form-item label="短信类型"   prop="cusSmsType">
          <el-select v-model="dataForm.cusSmsType"  filterable   placeholder="请选择" style="width: 400px;margin-right:15px;">
              <el-option v-for="(item, index) in cusSmsTypeList" :key="index" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信签名" v-if="dataForm.editType === '1' && dataForm.type === 'sms'"  prop="productNo">
          <el-select v-model="dataForm.productNo" filterable  @change="changeproductNo"  placeholder="请选择" style="width: 400px;margin-right:15px;">
              <el-option v-for="(item, index) in productNoList" :key="index" :value="item.code" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="短信内容" prop="smsContent" v-if="dataForm.editType === '1' && dataForm.type === 'sms'">
            <el-input type="textarea"  class="base-pane-item" @input="changesmsContent" v-model="dataForm.smsContent" maxlength="300" :autosize="{ minRows: 3, maxRows: 5}"  show-word-limit />
          </el-form-item>
          <el-form-item  prop="extraParams"  label="额外出参">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						:disabled="viewVisible"
            @open="openParamsSelect"
						@input="changeOption"
						@select="outParamsSelect"
						@deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.extraParams"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
      </div>
        <!-- ai -->
      <el-form-item prop="resourceId" v-if="dataForm.type === 'ai' " label="AI模板" :rules="{ required: true, message: '请选择模板', trigger: 'blur' }">
        <el-select v-model="dataForm.resourceId" filterable  @change="changeTelTemplate" placeholder="请选择模板" style="width: 400px;margin-right:15px;">
          <el-option v-for="(item, index) in telOrAiList" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <!-- 电销 -->
      <el-form-item prop="telTemplateValue" v-if="dataForm.type === 'tel'" label="电销模板">
        <el-autocomplete
          class="inline-input"
          style="width: 400px;"
          v-model="dataForm.telTemplateValue"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          @blur="blurInputTle"
          ></el-autocomplete>
        </el-form-item>
      <!-- 红包卡券 -->
      <el-form-item v-if="dataForm.type === 'card'" label="红包/卡券类型" prop="cardType" >
        <el-select v-model="dataForm.cardType" filterable  @change="cardTypeChange"  placeholder="请选择" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in cardTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="红包/卡券名称" v-if="dataForm.type === 'card'" prop="resourceCode" :rules="{ required: true, message: '请选择名称', trigger: 'blur' }">
        <el-select v-model="dataForm.resourceCode" filterable   placeholder="请选择" style="width: 400px;margin-right:15px;">
            <el-option v-for="(item, index) in cardNameList" :key="index" :value="item.rsId" :label="item.rsName"></el-option>
        </el-select>
      </el-form-item>
      <!-- HTTP -->
      <div v-if="dataForm.type === 'http'">
        <el-form-item label="URL" prop="url" :rules="baseRule.url">
          <el-input v-model="dataForm.url" placeholder="请输入URL"/>
        </el-form-item>
        <!-- <el-form-item label="请求参数的fieldId数组" prop="requestFields" :rules="baseRule.requestFields">
        <el-input v-model="dataForm.requestFields" placeholder="param1,param2(多个参数逗号隔开)"/>
        </el-form-item> -->
        <el-form-item  prop="extraParams"  label="请求入参" :rules="{ required: true, message: '请选择名称', trigger: 'input' }">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						:disabled="viewVisible"
            @open="openParamsSelect"
						@input="changeOption"
						@select="outParamsSelect"
						@deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.extraParams"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
        <el-form-item label="请求head入参" prop="requestHeadFields">
        <el-input v-model="dataForm.requestHeadFields" placeholder="请输入请求head入参"/>
        </el-form-item>
        <el-form-item label="入参生成方式">
          <el-radio-group v-model="dataForm.requestParamTemplateStatus">
            <el-radio :label="0">普通生成</el-radio>
            <el-radio :label="1">模板生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="templateContent" label="模板内容" v-if="dataForm.requestParamTemplateStatus == '1'" :rules="baseRule.templateContent">
          <el-input type="textarea"  class="base-pane-item" v-model="dataForm.templateContent"  :autosize="{ minRows: 2}" />
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="responseFields" :rules="baseRule.responseFields">
        <el-input v-model="dataForm.responseFields" placeholder="result1,result2(多个结果逗号隔开)"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="responseType" :rules="baseRule.responseType"> 
          <el-select v-model="dataForm.responseType" placeholder="请选择响应参数的数据类型">
            <el-option
              v-for="item in httpResponseTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
         </el-form-item>
        <el-form-item label="判断表达式" prop="expression" :rules="baseRule.expression">
          <el-input v-model="dataForm.expression" placeholder="请输入缓存生成的key需要的字段"/>
        </el-form-item>
        <el-form-item label="switch判断项集合" prop="switchTemplate" :rules="baseRule.switchTemplate">
          <el-input v-model="dataForm.switchTemplate" placeholder="请输入缓存生成的key需要的字段"/>
        </el-form-item>
      </div>
      <!-- push -->
      <el-form-item label="推送方式：" prop="flag" v-if="dataForm.type === 'push'" :rules="{ required: true, message: '请选择推送方式', trigger: 'blur' }">
        <el-checkbox v-model="dataForm.flag" label="pushFlag" @change="checked=>changeDistribution(checked, 'pushFlag')">push</el-checkbox>
        <el-checkbox v-model="dataForm.flag " label="msgFlag" @change="checked=>changeDistribution(checked, 'msgFlag')">个人消息</el-checkbox>
      </el-form-item>
    <!-- 参数 -->
      <el-form-item  prop="fixedParams"  label="固定出参" v-if="fixedParamsvisible">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						disabled
            placeholder=""
						v-model="dataForm.fixedParams"
						class="base-pane-item"
					/>
			</el-form-item>
      <el-form-item  prop="extraParams"  label="额外出参" v-if="extraParamsVisible" :rules="{ required: true, message: '请选择名称', trigger: 'input' }">
				  <Treeselect
						:options="outParamsList"
						:disable-branch-nodes="true"
						:show-count="true"
						:multiple="true"
						:load-options="loadOptions"
						:searchable="true"
						:clearable="true"
						:disabled="viewVisible"
            @open="openParamsSelect"
						@input="changeOption"
						@select="outParamsSelect"
						@deselect="outParamsDeselect"
						noChildrenText="暂无数据"
						v-model="dataForm.extraParams"
						placeholder="请选择"
						class="base-pane-item"
					/>
			</el-form-item>
      <div v-if="dataForm.type === 'push' && dataForm.flag.includes('pushFlag')">
        <el-divider content-position="center">push</el-divider>
        <el-form-item label="Push类型：" prop="pushType" :rules="{ required: true, message: '请选择Push类型', trigger: 'blur' }">
          <el-select v-model="dataForm.pushType">
            <el-option value="PUM" label="服务通知"></el-option>
            <el-option value='SYS' label="系统公告"></el-option>
            <el-option value="ACTIVITY" label="精选活动"></el-option>
            <el-option value="BONUS" label="专属福利"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查看详情跳转目标：" prop="pageType" v-if="dataForm.pushType === 'ACTIVITY' || dataForm.pushType === 'BONUS'" :rules="{ required: true, message: '请选择查看详情跳转目标', trigger: 'blur' }">
          <el-radio label="internal" v-model="dataForm.pageType">新H5</el-radio>
          <el-radio label="external" v-model="dataForm.pageType">外部H5</el-radio>
        </el-form-item>
        <el-form-item label="查看详情跳转链接：" prop="linkUrl" v-if="dataForm.pushType === 'ACTIVITY' || dataForm.pushType === 'BONUS'" :rules="{ required: true, message: '请输入查看详情跳转链接', trigger: 'blur' }">
          <el-input v-model="dataForm.linkUrl" ></el-input>
        </el-form-item>
        <el-form-item label="Push标题：" prop="pushTitle" :rules="{ required: true, message: '请输入Push标题', trigger: 'blur' }">
          <el-input v-model="dataForm.pushTitle" placeholder="请输入Push标题"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="pushContent" :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
          <el-input type="textarea"  v-model="dataForm.pushContent" :autosize="{ minRows: 3}"  show-word-limit />
        </el-form-item>
      </div>
      <div v-if="dataForm.type === 'push' && dataForm.flag.includes('msgFlag')">
        <el-divider content-position="center">个人消息</el-divider>
        <el-form-item label="App跳转目标：" prop="pageType" :rules="{ required: true, message: '请选择App跳转目标', trigger: 'blur' }">
          <el-radio label="native" v-model="dataForm.pageType">原生页</el-radio>
          <el-radio label="internal" v-model="dataForm.pageType">新H5</el-radio>
          <el-radio label="h5" v-model="dataForm.pageType">老H5</el-radio>
          <el-radio label="external" v-model="dataForm.pageType">外部H5</el-radio>
        </el-form-item>
        <el-form-item label="App跳转链接：" prop="msgUrl" :rules="{ required: true, message: '请输入App跳转链接', trigger: 'blur' }">
          <el-input v-model="dataForm.msgUrl" ></el-input>
        </el-form-item>
        <el-form-item label="标题：" prop="msgTitle" :rules="{ required: true, message: '请输入标题', trigger: 'blur' }">
          <el-input v-model="dataForm.msgTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
      <el-form-item label="内容：" prop="msgContent" :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
            <el-input type="textarea"  v-model="dataForm.msgContent" :autosize="{ minRows: 3}"  show-word-limit />
      </el-form-item>
      <!--  -->
      </div>
		</el-form>
		<div slot="footer" class="foot">
      <el-button type="primary" @click="submitData" v-if="!viewVisible">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
	</el-dialog>
</template>
<script>
import { dataTransferManageOutParams, dataTransferManageKafka, getAllSmsChannels, getSmsCodeInfo } from '@/api/dataAnalysis/dataTransferManage'
import { getChannelist, addDataInfo, editDataInfo, lookDataList, getFixedParams, getResourceInfoFromType, getSmsStyleInfo, getSmsSignInfo, getCardInfo } from '@/api/dataAnalysis/sourceBinding'
import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  data () {
    /**
   * 空格校验
   * @param rule
   * @param value
   * @param callback
   * @constructor
   */
    let NullKongGeRule = (rule, value, callback) => {
      const nullValue = /^[^\s]+$/
      if (value !== '' && value !== null && value !== undefined) {
        if (!nullValue.test(value)) {
          callback(new Error('不能输入含空格'))
        }
      }
      callback()
    }
    // let FlowCode = (rule, value, callback) => {
    //   const nullValue = /^\w+$/
    //   if (value !== '' && value !== null && value !== undefined) {
    //     if (!nullValue.test(value)) {
    //       callback(new Error('请输入正确格式'))
    //     }
    //   }
    //   callback()
    // }
    return {
      visible: false,
      extraParamsVisible: false,
      fixedParamsvisible: false,
      viewVisible: false,
      dataLoading: false,
      tag: '',
      createTime: '', // 创建时间
      createUser: '', // 创建人
      target: '',
      dataForm: {
        id: '',
        type: '',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        channelId: '',
        smsTemplate: '',
        editType: '0', // 编辑类型
        productNo: '', // 签名
        cusSmsType: '', // 短信类型
        smsContent: '', // 短信内容
        fixedParams: [], // 固定出参
        extraParams: [], // 额外出参
        channelCode: '', // 用户渠道
        // outParams: [] // 绑定的出参
        telTemplateValue: '',
        /* push参数 */
        pushType: '',
        pushTitle: '',
        pageType: '',
        flag: [],
        linkUrl: '',
        pushContent: '',
        msgTitle: '',
        msgUrl: '',
        msgContent: '',
        // HTTP参数
        url: '',  // url
        // requestFields: '',
        requestHeadFields: '',
        responseFields: '',
        templateContent: '',
        requestParamTemplateStatus: 1,
        responseType: '', // 两个选项map和list 默认是map
        expression: '', // 判断表达式
        switchTemplate: '', // switch判断项集合
        cardType: ''
      },
      paramsNum: 0,
      outParamsList: [],
      fixedParams: [], // 固定出参
      extraParams: [], // 额外出参
      // outParams: [], // 分群出参提交格式
      issueChannelList: [],
      issueTemplateList: [],
      telOrAiList: [],
      channelList: [],
      kafkaServerList: [],
      mysqlServerList: [],
      cusSmsTypeList: [], // 短信类型list
      productNoList: [], // 短信签名list
      cardNameList: [], // 红包卡券name的list
      cardDataList: [],
      httpResponseTypeOptions: [{
        value: 'map',
        label: 'map'
      }, {
        value: 'list',
        label: 'list'
      }, {
        value: 'object',
        label: 'object'
      }],
      typeOptions: [{
        value: 'kafka',
        label: 'kafka'
      },
      {
        value: 'sms',
        label: '短信'
      }, {
        value: 'tel',
        label: '电销'
      }, {
        value: 'ai',
        label: 'AI'
      }, {
        value: 'push',
        label: 'Push'
      }, {
        value: 'http',
        label: 'HTTP'
      },
      {
        value: 'card',
        label: '红包/卡券'
      }
      ],
      cardTypeList: [{
        value: 1,
        label: '还款红包'
      }, {
        value: 2,
        label: '借款红包'
      }, {
        value: 3,
        label: '免息红包'
      }, {
        value: 4,
        label: '提额红包'
      }, {
        value: 5,
        label: '商城满减红包'
      }, {
        value: 6,
        label: '接口红包'
      }, {
        value: 7,
        label: '积分（无资源）'
      }, {
        value: 8,
        label: '接口资源提额红包 '
      }, {
        value: 9,
        label: '降息红包'
      }, {
        value: 12,
        label: '减息券'
      }],
      baseRule: { // 基本信息校验规则
        type: [
          { required: true, message: '请选择下发类型', trigger: 'blur' }
        ],
        // extraParams: [
        //   { required: true, message: '请选择额外出参', trigger: 'input' }
        // ],
        editType: [
          { required: true, message: '请选择配置方式', trigger: 'blur' }
        ],
        cusSmsType: [
          { required: true, message: '请选择短信类型', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '请选择短信签名', trigger: 'blur' }
        ],
        smsContent: [
          { required: true, message: '请输入短信内容', trigger: 'blur' }
        ],
        //  HTTP
        url: [
          { required: true, message: '请输入URL地址', trigger: 'blur' },
          { required: true, validator: NullKongGeRule, trigger: 'change' }
        ],
        responseType: [
          { required: true, message: '请选择响应参数的数据类型', trigger: 'blur' },
          { required: false, validator: NullKongGeRule, trigger: 'change' }
        ],
        expression: [
          { required: true, message: '请输入判断表达式', trigger: 'blur' }
        ],
        switchTemplate: [
          { required: true, message: '请输入switch判断项集合', trigger: 'blur' }
        ],
        templateContent: [
          { required: true, message: '请输入模板内容', trigger: 'blur' }
        ],
        telTemplateValue: [
          { required: true, message: '请选择模板内容', trigger: 'input' }
        ],
        cardType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      }
    }
  },
  components: { Treeselect },
  methods: {
     // 树加载
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    init (row, tag) {
      this.fixedParamsvisible = false
      this.extraParamsVisible = false
      this.getChannelsList()
      this.outParamsList = []
      this.tag = row ? tag : ''
      if (this.tag === 'view') {
        this.viewVisible = true
      } else {
        this.viewVisible = false
      }
      this.dataForm = {
        id: '',
        channelCode: '',
        type: '',
        resourceId: '',
        resourceName: '',
        resourceCode: '',
        channelId: '',
        smsTemplate: '',
        editType: '0', // 编辑类型
        productNo: '', // 签名
        cusSmsType: '', // 短信类型
        smsContent: '', // 短信内容
        extraParams: [],
        fixedParams: [],
        telTemplateValue: '',
        /* push参数 */
        pushType: '',
        pushTitle: '',
        pageType: '',
        flag: [],
        linkUrl: '',
        pushContent: '',
        msgTitle: '',
        msgUrl: '',
        msgContent: '',
         // HTTP参数
        url: '',  // url
        // requestFields: '',
        requestHeadFields: '',
        responseFields: '',
        templateContent: '',
        requestParamTemplateStatus: 1,
        responseType: '', // 两个选项map和list 默认是map
        expression: '', // 判断表达式
        switchTemplate: '', // switch判断项集合
        cardType: ''
      }
      this.target = ''
      this.createTime = ''
      this.createUser = ''
      this.paramsNum = 0
      this.extraParams = []
      this.fixedParams = []
      this.telOrAiList = []
      this.visible = true
      if (row) {
        this.createTime = row.createTime
        this.createUser = row.createUser
        this.dataLoading = true
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {
      lookDataList(row.id).then(res => {
        if (res.data.status === '1') {
          // console.log('res.data: ', res.data)
          this.dataForm.id = row.id
          this.dataForm.channelCode = res.data.data.bindingConfig.channelCode
          this.dataForm.resourceName = res.data.data.bindingConfig.resourceName
          this.dataForm.type = res.data.data.bindingConfig.type
          if (res.data.data.bindingConfig.content) {
            let bindingContent = JSON.parse(res.data.data.bindingConfig.content)
            if (row.type === 'sms') {
              this.getSmsSignInfo()
              this.getSmsStyleInfo()
              this.getAllSmsChannels()
              this.dataForm.editType = '1'
              this.extraParamsVisible = false
              this.dataForm.resourceName = this.dataForm.resourceName.split('自定义短信_')[1]
              this.dataForm.cusSmsType = bindingContent.cusSmsType
              this.dataForm.productNo = bindingContent.productNo
              this.dataForm.smsContent = bindingContent.content
            }
            if (row.type === 'push') {
              let pushExtraKeys = JSON.parse(bindingContent.pushExtraKeys)
              this.dataForm.pushType = bindingContent.pushType
              this.dataForm.pushTitle = bindingContent.pushTitle
              this.dataForm.pageType = pushExtraKeys.pageType
              this.dataForm.linkUrl = pushExtraKeys.linkUrl
              this.dataForm.pushContent = bindingContent.pushContent
              this.dataForm.msgUrl = bindingContent.msgUrl
              this.dataForm.msgContent = bindingContent.msgContent
              this.dataForm.msgTitle = bindingContent.msgTitle
              if (bindingContent.pushFlag === 'Y') {
                this.dataForm.flag.push('pushFlag')
              }
              if (bindingContent.msgFlag === 'Y') {
                this.dataForm.flag.push('msgFlag')
              }
            }
            if (row.type === 'http') {
              this.dataForm.url = bindingContent.url
              // this.dataForm.requestFields = bindingContent.requestFields
              this.dataForm.requestHeadFields = bindingContent.requestHeadFields
              this.dataForm.responseFields = bindingContent.responseFields
              this.dataForm.templateContent = bindingContent.templateContent
              this.dataForm.requestParamTemplateStatus = bindingContent.requestParamTemplateStatus
              this.dataForm.responseType = bindingContent.responseType
              this.dataForm.expression = bindingContent.expression
              this.dataForm.switchTemplate = bindingContent.switchTemplate
            }
          } else {
            this.dataForm.editType = '0'
            this.dataForm.resourceCode = res.data.data.bindingConfig.resourceCode
            this.dataForm.resourceId = parseInt(res.data.data.bindingConfig.resourceId)
            if (row.type === 'sms') {
              this.getSmsSignInfo()
              this.getSmsStyleInfo()
              this.getAllSmsChannels()
              this.dataForm.resourceName = this.dataForm.resourceName.split('标准短信_')[1]
              this.dataForm.channelId = res.data.data.resourceData.channelId
              this.dataForm.smsTemplate = res.data.data.resourceData.smsTemplate
              this.paramsNum = res.data.data.resourceData.smsTemplate.split('%s').length - 1
              this.getDate(res.data.data.resourceData.channelId, false)
            }
            if (res.data.data.bindingConfig.type === 'tel' || res.data.data.bindingConfig.type === 'ai') {
              this.extraParamsVisible = false
              getResourceInfoFromType(res.data.data.bindingConfig.type).then(({data}) => {
                if (data && data.status === '1') {
                  data.data && data.data.forEach(item => {
                    item.value = item.name
                    if (item.code == this.dataForm.resourceCode) {
                      this.dataForm.telTemplateValue = item.name
                    } else {
                      this.dataForm.telTemplateValue = this.dataForm.resourceCode
                    }
                  })
                  this.telOrAiList = data.data
                }
              })
            }
            if (res.data.data.bindingConfig.type === 'kafka') {
              this.getKafkaServerList(res.data.data.bindingConfig.resourceId)
            }
            if (res.data.data.bindingConfig.type === 'card') {
              this.extraParamsVisible = false
              this.getcardVoucherData('edit')
            }
          }
          this.getOutParamsList(row, res.data.data.extraParams)
        }
      })
    },
    getChannelsList () {
      getChannelist().then(res => {
        if (res.data.status * 1 !== 1) {
          this.channelList = []
          return
        }
        this.channelList = res.data.data.map(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
          return item
        })
      })
    },
      // kafka 数据源
    getKafkaServerList (resourceId) {
      let params = {
        type: 'kafka'
      }
      dataTransferManageKafka(params).then(({data}) => {
        if (data && data.status === '1') {
          this.kafkaServerList = data.data
          if (resourceId) {
            this.target = data.data.filter(item => item.id == resourceId)[0].target
          }
        }
      })
    },
    // kafka选择时
    kafkaServerChange (value) {
      let arr = this.kafkaServerList.filter(item => item.id === value)
      this.dataForm.resourceCode = arr[0].code
      this.target = arr[0].target
    },
     // 短信签名
    getSmsSignInfo () {
      getSmsSignInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.productNoList = data.data
        } else {
          this.productNoList = []
        }
      })
    },
    // 短信类型
    getSmsStyleInfo () {
      getSmsStyleInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.cusSmsTypeList = data.data
        } else {
          this.cusSmsTypeList = []
        }
      })
    },
    // 短信渠道
    getAllSmsChannels() {
      getAllSmsChannels().then(({data}) => {
        if (data.status === '1') {
          this.issueChannelList = data.data
        }
      })
    },
    getDate (value, isChange) {
      getSmsCodeInfo(value).then(({data}) => {
        if (data.status === '1') {
          this.issueTemplateList = data.data
          if (isChange) {
            this.dataForm.resourceCode = ''
            this.dataForm.smsTemplate = ''
            this.target = ''
          }
        }
      })
    },
    // 获取分群出参 指标列表
    getOutParamsList (row, extraParams) {
      dataTransferManageOutParams({ channelCode: this.dataForm.channelCode, flag: this.dataForm.id ? '-1' : '1' }).then(({data}) => {
        if (data && data.status === '1') {
          this.outParamsList = this.filterAllCata(data.data)
          if (row) {
            this.getFixedParams()
            // this.getOutParamsEditList(extraParams, fixedParams, this.filterAllCata(data.data))
            this.getOutParamsEditList(extraParams, this.filterAllCata(data.data))
            this.dataLoading = false
          }
        } else {
          this.outParamsList = []
          this.dataLoading = false
        }
      })
    },
    // 清洗数据，按selectVue的格式重新组织指标数据
    filterAllCata (tree) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach((item, index) => {
          let obj = {}
          if (item.fieldType) {
            obj.id = item.englishName + '-' + item.id
            obj.englishName = item.englishName
            obj.label = item.chineseName
            obj.fieldType = item.fieldType
            obj.enumTypeNum = item.enumTypeNum
            obj.sourceTable = item.sourceTable
            obj.dataStandar = item.dataStandar
            obj.fieldId = item.id
            obj.channelCode = item.channelCode
          } else {
            obj.id = item.id
            obj.label = item.name
          }
          // if (this.filterAllCata(item.dataCataLogList).length) { // 指标层 ，无children
          //   obj.children = this.filterAllCata(item.dataCataLogList)
          //   arr.push(obj)
          if (this.filterAllCata(item.dataCata).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCata) // 指标集合
            arr.push(obj)
          } else if (this.filterAllCata(item.dataIndex).length) {
            obj.children = this.filterAllCata(item.dataIndex) // 指标集合
            arr.push(obj)
          } else {
            if (!item.fieldType) {
              obj.children = null
            } else {
              arr.push(obj)
            }
          }
        })
      }
      return arr
    },
    channelIdChange () {
      // 用户渠道改变时，重新过滤指标数据
      if (this.dataForm.channelCode.length === 0) {
        this.channelList.forEach(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      this.getOutParamsList()
      this.getFixedParams()
    },
    // // 修改，回显时查询分群出参选中
    getOutParamsEditList (extraParams, outList) {
      if (extraParams) {
        let out = []
        let fixedData = extraParams.split(',')
        fixedData.forEach(item => {
          out.push(item.split('@')[0] + '-' + item.split('@')[1])
           this.extraParams.push(item.split('@')[1])
        })
        this.dataForm.extraParams = Array.from(new Set(out))
        this.outParamsList = this.updateOutParamsList(this.dataForm.extraParams, outList)
        if (this.dataForm.type === 'sms' && this.dataForm.editType === '0') {
          this.extraParamsVisible = true
        } else {
          this.extraParamsVisible = false
        }
      } else {
        this.dataForm.extraParams = []
        this.extraParamsVisible = false
      }
      // if (fixedParams) {
      //   let out = []
      //   let fixedData = fixedParams.split(',')
      //   fixedData.forEach(item => {
      //     out.push(item.split('@')[0] + '-' + item.split('@')[1])
      //      this.fixedParams.push(item.split('@')[1])
      //   })
      //   this.dataForm.fixedParams = Array.from(new Set(out))
      //   this.outParamsList = this.updateOutParamsList(this.dataForm.fixedParams, outList)
      //   this.fixedParamsvisible = true
      // }
      // data.forEach(item => {
      //   out.push(item.englishName + '-' + item.id)
      //   type === 'extraParams' ? this.extraParams.push(item.id) : this.fixedParams.push(item.id)
      // })
    },
    // 获取出参，默认展开列表
    updateOutParamsList (data, indexList) {
      let indexListArr = deepClone(indexList)
      data.forEach(item => {
        let indexPath = findVueSelectItemIndex(indexListArr, item) + ''
        let indexPathArr = indexPath.split(',')
        let a = indexListArr
        indexPathArr.forEach((pitem, index) => {
          if (index < indexPathArr.length - 1) {
            a[pitem].isDefaultExpanded = true
            a = a[pitem].children
          }
        })
      })
      return indexListArr
    },
    // 类型改变
    changeType (value) {
      if (value === 'tel' || value === 'ai' || value === 'push' || value === 'http' || value === 'card') {
        this.extraParamsVisible = false
      } else {
        this.extraParamsVisible = true
      }
      this.dataForm = {
        id: this.dataForm.id,
        channelCode: this.dataForm.channelCode,
        type: this.dataForm.type,
        resourceName: this.dataForm.resourceName,
        resourceId: '',
        resourceCode: '',
        channelId: '',
        smsTemplate: '',
        editType: '0', // 编辑类型
        productNo: '', // 签名
        cusSmsType: '', // 短信类型
        smsContent: '', // 短信内容
        extraParams: [],
        fixedParams: [],
        telTemplateValue: '',
        /* push参数 */
        pushType: '',
        pushTitle: '',
        pageType: '',
        flag: [],
        linkUrl: '',
        pushContent: '',
        msgTitle: '',
        msgUrl: '',
        msgContent: '',
         // HTTP参数
        url: '',  // url
        // requestFields: '',
        requestHeadFields: '',
        responseFields: '',
        templateContent: '',
        requestParamTemplateStatus: 1,
        responseType: '', // 两个选项map和list 默认是map
        expression: '', // 判断表达式
        switchTemplate: '',  // switch判断项集合
        cardType: ''
      }
      this.target = ''
      this.extraParams = []
      this.getFixedParams()
      if (value === 'sms') {
        this.getSmsSignInfo()
        this.getSmsStyleInfo()
        this.getAllSmsChannels()
      }
      if (value === 'kafka') {
        this.getKafkaServerList()
      }
      if (value === 'tel' || value === 'ai') {
        getResourceInfoFromType(value).then(({data}) => {
          if (data && data.status === '1') {
            this.telOrAiList = data.data
          } else {
            this.telOrAiList = []
          }
        })
      }
      if (value === 'card') {
        this.getcardVoucherData()
      }
    },
     // 编辑类型改变
    changeEditType () {
      if (this.dataForm.type === 'sms') {
        if (this.dataForm.editType === '0') {
          this.dataForm.productNo = ''
          this.dataForm.cusSmsType = ''
          this.dataForm.smsContent = ''
        } else {
          this.extraParamsVisible = false
          this.dataForm.resourceId = ''
          this.dataForm.resourceCode = ''
          this.dataForm.smsTemplate = ''
          this.dataForm.channelId = ''
          this.dataForm.extraParams = []
          this.extraParams = []
          this.paramsNum = 0
        }
      }
    },
    // 短信自定义
    changecusSmsType (val) {
      if (val) {
        this.$set(this.dataForm, this.dataForm.cusSmsType, val)
      } else {
        this.$set(this.dataForm, this.dataForm.cusSmsType, '')
      }
    },
    changeproductNo (val) {
      if (val) {
        this.$set(this.dataForm, this.dataForm.productNo, val)
      } else {
        this.$set(this.dataForm, this.dataForm.productNo, '')
      }
    },
    changesmsContent (val) {
      if (val) {
        this.$set(this.dataForm, this.dataForm.smsContent, val)
      } else {
        this.$set(this.dataForm, this.dataForm.smsContent, '')
      }
    },
     // 电销
    querySearch(queryString, cb) {
      let telOrAiList = this.telOrAiList
      telOrAiList.length && telOrAiList.forEach(item => {
        item.value = item.name
      })
      let results = queryString ? telOrAiList.filter(this.createFilter(queryString)) : telOrAiList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (telOrAiList) => {
        return (telOrAiList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.dataForm.telTemplateValue = item.value
      this.dataForm.resourceCode = item.code
      this.dataForm.resourceId = item.id
    },
    blurInputTle(e) {
      if (e.target.value) {
        this.dataForm.telTemplateValue = e.target.value
        this.dataForm.resourceCode = e.target.value
        this.dataForm.resourceId = ''
      }
    },
    // push通知方式
    changeDistribution (checked, val) {
      if (!checked && val === 'pushFlag') {
        this.dataForm.pushType = ''
        this.dataForm.pushTitle = ''
        this.dataForm.pageType = ''
        this.dataForm.linkUrl = ''
        this.dataForm.pushContent = ''
      }
      if (!checked && val === 'msgFlag') {
        this.dataForm.msgUrl = ''
        this.dataForm.msgContent = ''
        this.dataForm.msgTitle = ''
      }
    },
    // 固定参数
    getFixedParams() {
      if (this.dataForm.type !== 'kafka' && this.dataForm.type !== 'http' && this.dataForm.channelCode && this.dataForm.type) {
        let out = []
        this.fixedParams = []
        let params = {
          channelCode: this.dataForm.channelCode,
          type: this.dataForm.type
        }
        getFixedParams(params).then(({data}) => {
          if (data && data.status === '1') {
            if (data.data) {
              let fixedData = data.data.split(',')
              fixedData.forEach(item => {
                out.push(item.split('@')[0] + '-' + item.split('@')[1])
                this.fixedParams.push(item.split('@')[1])
              })
              this.dataForm.fixedParams = Array.from(new Set(out))
              console.log('this.dataForm.fixedParams: ', this.dataForm.fixedParams)
              this.fixedParamsvisible = true
            } else {
              this.fixedParamsvisible = false
              this.dataForm.fixedParams = []
              this.fixedParams = []
              return this.$message.error(`请联系管理员配置固定流程参数`)
            }
          }
        })
      } else {
        this.fixedParamsvisible = false
        this.dataForm.fixedParams = []
        this.fixedParams = []
      }
    },
    getSmsTemplate () {
      this.dataForm.smsTemplate = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsTemplate
      this.paramsNum = this.dataForm.smsTemplate.split('%s').length - 1
      if (!this.paramsNum) {
        this.extraParamsVisible = false
        this.extraParams = []
      } else {
        this.extraParamsVisible = true
      }
      // this.dataForm.resourceName = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].smsDesc
      this.dataForm.resourceId = this.issueTemplateList.filter(item => item.tempCode === this.dataForm.resourceCode)[0].id
    },
     // AI模板
    changeTelTemplate () {
      this.dataForm.resourceCode = this.telOrAiList.filter(item => item.id === this.dataForm.resourceId)[0].code
    },
    //  红包卡券
    getcardVoucherData (edit) {
      getCardInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.cardDataList = data.data
          if (edit === 'edit') {
            this.dataForm.cardType = data.data.filter(item => item.rsId === this.dataForm.resourceCode)[0].rsType
            this.cardTypeChange('edit')
          }
        } else {
          this.cardDataList = []
        }
      })
    },
    cardTypeChange (edit) {
      this.cardNameList = []
      if (edit !== 'edit') {
        this.dataForm.resourceCode = ''
      }
      this.cardDataList.forEach(item => {
        if (item.rsType === this.dataForm.cardType) {
          this.cardNameList.push(item)
        }
      })
    },
    changeOption () {
      // 出参选择
      this.$refs.dataForm.clearValidate('extraParams')
    },
    // 选中出参
    outParamsSelect (node) {
      this.extraParams.push(node.fieldId)
      if (this.extraParams.length) {
        this.$refs.dataForm.clearValidate('extraParams')
      }
    },
    // 删除出参
    outParamsDeselect (node) {
      this.extraParams = this.extraParams.filter(item => Number(item) !== node.fieldId)
    },
    // 打开出参菜单
    openParamsSelect () {
      if (!this.dataForm.channelCode) return this.$message.error('请先选择所属渠道')
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.type !== 'kafka' && this.dataForm.type !== 'http' && this.fixedParams.length === 0) {
            return this.$message.error(`请联系管理员配置固定流程参数`)
          }
          if ((this.dataForm.type === 'sms' && this.dataForm.editType === '0') && this.extraParams.length !== this.paramsNum) {
            return this.$message.error(`请选择${this.paramsNum}个参数`)
          }
          let smsContent = {
            'cusSmsType': this.dataForm.cusSmsType,
            'productNo': this.dataForm.productNo,
            'content': this.dataForm.smsContent
          }
          let httpContent = {
            url: this.dataForm.url,
            // requestFields: this.dataForm.requestFields,
            requestHeadFields: this.dataForm.requestHeadFields,
            responseFields: this.dataForm.responseFields,
            templateContent: this.dataForm.requestParamTemplateStatus == '1' ? this.dataForm.templateContent : '',
            requestParamTemplateStatus: this.dataForm.requestParamTemplateStatus,
            responseType: this.dataForm.responseType,
            expression: this.dataForm.expression,
            switchTemplate: this.dataForm.switchTemplate
          }
          let pushExtraKeys = {
              pageType: this.dataForm.pageType,
              linkUrl: this.dataForm.linkUrl
          }
          let pushContent = {
            pushFlag: this.dataForm.flag.includes('pushFlag') ? 'Y' : 'N',
            msgFlag: this.dataForm.flag.includes('msgFlag') ? 'Y' : 'N',
            pushType: this.dataForm.pushType,
            pushTitle: this.dataForm.pushTitle,
            // pageType: this.dataForm.pageType,
            // linkUrl: this.dataForm.linkUrl,
            pushContent: this.dataForm.pushContent,
            msgTitle: this.dataForm.msgTitle,
            msgUrl: this.dataForm.msgUrl,
            msgContent: this.dataForm.msgContent,
            pushExtraKeys: JSON.stringify(pushExtraKeys)
          }
          let params = {
            id: this.dataForm.id,
            type: this.dataForm.type,
            resourceName: this.dataForm.resourceName,
            channelId: this.dataForm.channelId,
            resourceCode: this.dataForm.resourceCode,
            channelCode: this.dataForm.channelCode,
            resourceId: this.dataForm.resourceId ? this.dataForm.resourceId.toString() : null,
            fixedParams: this.fixedParams.join(','),
            extraParams: this.extraParams.join(','),
            content: ''
          }
          if (this.dataForm.type === 'sms') {
            params.content = this.dataForm.editType === '0' ? '' : JSON.stringify(smsContent)
            params.resourceName = this.dataForm.editType === '0' ? '标准短信_' + this.dataForm.resourceName : '自定义短信_' + this.dataForm.resourceName
            // params.resourceId = this.dataForm.editType === '0' ? params.resourceId : null
          }
          if (this.dataForm.type === 'push') {
            params.content = JSON.stringify(pushContent)
            // params.resourceId = null
          }
          if (this.dataForm.type === 'http') {
            params.content = JSON.stringify(httpContent)
            // params.resourceId = null
          }
          if (!this.dataForm.id) {
              addDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
              params.createTime = this.createTime
              params.createUser = this.createUser
              editDataInfo(params).then(({data}) => {
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            }
          }
        })
    }
  }
}
</script>