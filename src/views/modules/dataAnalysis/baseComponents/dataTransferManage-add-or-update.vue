<template>
<el-drawer
    :append-to-body="false"
    :visible.sync="visible"
    :show-close="false"
    :wrapperClosable="false"
    size="1200px"
    class="data-transfer-manage-drawer"
  >
  <div slot="title" class="drawer-title">{{tag}}<i class="el-icon-close drawer-close" @click="drawerClose"></i></div>
    <div class="wrap">
      <el-form v-loading="loading" label-width="80px" :model="baseForm" :rules="baseRule" ref="baseForm" class="base-form" :disabled="!canUpdate">
        <div class="base-pane">
          <h3 ref="baseTitle">基本信息</h3>
            <el-form-item label="决策方式" prop="decisionType" style="width:50%" >
              <el-radio v-model="baseForm.decisionType" :disabled="!!baseForm.id" @change="decisionTypeChange" label="0">下发数据源</el-radio>
              <el-radio v-model="baseForm.decisionType" :disabled="!!baseForm.id"  @change="decisionTypeChange" label="1"  style="margin-left:5px;">决策画布</el-radio>
            </el-form-item>
            <el-form-item v-if="baseForm.decisionType === '0'" label="下发类型" prop="triggerMode" style="width:50%">
              <el-radio v-model="baseForm.triggerMode" label="0" class="radio-item radio-initiative">主动型</el-radio>
              <el-tooltip placement="top">
                <div slot="content">根据调度时间配置进行数据下发</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
              <el-radio v-model="baseForm.triggerMode" label="1" class="radio-item radio-passive">被动型</el-radio>
              <el-tooltip placement="top">
                <div slot="content">根据下游接口调用进行数据下发</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="分群名称" prop="templateId">
              <el-select
                filterable
                v-model="baseForm.templateId"
                placeholder="请选择"
                @change="currentSel">
                <el-option
                  v-for="item in templateIdList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下发方式"  v-if="baseForm.decisionType === '0'"  prop="transferCategory">
              <el-radio v-model="baseForm.transferCategory" @change="changeTransferCategory" label="0">普通下发</el-radio>
              <el-radio v-model="baseForm.transferCategory" @change="changeTransferCategory" label="1">智能下发</el-radio>
            </el-form-item>
            <el-form-item label="任务名称" prop="transferName" style="width:50%">
              <el-input v-model.trim="baseForm.transferName" class="base-pane-item"/>
            </el-form-item>
            <!-- <el-form-item label="分群出参" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '0'" prop="outParams">
              <Treeselect
                :options="outParamsList"
                :disable-branch-nodes="true"
                :show-count="true"
                :multiple="true"
                :load-options="loadOptions"
                :searchable="true"
                :clearable="true"
                :disabled="isR3DefaultOut || !canUpdate"
                @input="changeOption"
                @select="outParamsSelect"
                @deselect="outParamsDeselect"
                noChildrenText="暂无数据"
                v-model="baseForm.outParams"
                placeholder="请选择"
                class="base-pane-item"
              />
            </el-form-item> -->
            <el-form-item label="任务描述" v-if="baseForm.decisionType === '0'">
              <el-input type="textarea"  class="base-pane-item" v-model="baseForm.taskDescribtion" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
              <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - baseForm.taskDescribtion.length"></span>个字符</p>
            </el-form-item>
        </div>
        <div class="base-pane" v-if="baseForm.triggerMode !== '1' || baseForm.decisionType === '1' ">
          <h3>调度时间</h3>
            <el-form-item label="周期">
              <template>
                <el-radio-group v-model="baseForm.jobType">
                  <el-radio :label="1">运行一次</el-radio>
                  <el-radio :label="2">周期运行</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <!-- 运行一次 -->
            <el-row v-if="baseForm.jobType === 1">
              <el-col :span="12">
                <div>
                  <el-form-item label="运行时间">
                    <el-date-picker
                      v-model="baseForm.onceRunTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="timestamp"
                      placeholder="选择日期时间">
                    </el-date-picker>
                    {{baseForm.decisionType === '0' ? '（未指定运行时间，默认立即下发）': '（未指定运行时间，默认立即运营）' }}
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- 周期运行 -->
            <el-row v-if="baseForm.jobType === 2">
              <el-col :span="7">
                <el-form-item label="调度周期">
                  <el-select v-model="baseForm.runCycle" placeholder="请选择" style="width:220px;" @change="disTimeTurnOff (baseForm.runCycle)">
                    <el-option
                      v-for="item in dispatchCycleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="baseForm.runCycle === 'WEEK'">
                <el-form-item label="具体时间"  prop="dayOfWeeks">
                  <el-select
                    v-model= "baseForm.dayOfWeeks"
                    multiple
                    collapse-tags
                    placeholder="请选择">
                    <el-option
                      v-for="item in dayOfWeeksList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="baseForm.runCycle === 'MONTH'">
                <el-form-item label="具体时间" prop="dayOfMonths">
                  <el-select
                    v-model="baseForm.dayOfMonths"
                    multiple
                    collapse-tags
                    placeholder="请选择">
                    <el-option
                      v-for="item in dayOfMonthsList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-if="baseForm.runCycle !== 'MINUTE' && baseForm.runCycle !== 'HOUR'">
                <el-form-item class="label-remove-margin" prop="runTime">
                  <el-time-picker
                    v-model="baseForm.runTime"
                    value-format="timestamp"
                    placeholder="时:分:秒">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="baseForm.jobType === 2 && (baseForm.runCycle === 'MINUTE' || baseForm.runCycle === 'HOUR')">
              <el-col :span="7">
                <el-form-item label="开始时间" prop="startTime">
                  <el-time-picker
                    v-model="baseForm.startTime"
                    :clearable=false
                    value-format="timestamp"
                    format="HH:mm"
                    placeholder="时:分">
                  </el-time-picker>
                </el-form-item>
                </el-col>
                <el-col :span="7">
                <el-form-item label="时间间隔" prop="timeInterval">
                  <el-select v-model="baseForm.timeInterval" placeholder="请选择">
                    <el-option
                      v-for="item in timeIntervalList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span>{{ disIntervalMess }}</span>
                </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item label="结束时间" prop="endTime">
                  <el-time-picker
                    v-model="baseForm.endTime"
                    :clearable=false
                    value-format="timestamp"
                    format="HH:mm"
                    placeholder="时:分">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
        </div>
        <div class="pane-rules" >
          <h3>下发方式</h3>
          <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '0'">
             <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="kafka" name="transferType" @change="checked=>changeDistribution(checked, 'kafka')" v-model="baseForm.transferType" style="margin-left: 8px;"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex">
              <el-form-item prop="kafkaServer">
                <el-select
                  v-model= "baseForm.kafkaServer"
                  filterable
                  clearable
                  @change="kafkaSelectChange"
                  style="margin-right:10px; width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in kafkaServerList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <el-tooltip placement="top" v-if="baseForm.kafkaServer">
                  <div slot="content">{{baseForm.kafkaParams}}</div>
                  <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('kafka') > -1" style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('kafka')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '1'">
            <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="sms" name="transferType" v-model="baseForm.transferType" 
                @change="checked=>changeDistribution(checked, 'sms')"
                style="margin-left: 8px;">短信</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex;">
              <el-form-item prop="smsId">
                <el-select
                  v-model= "baseForm.smsId"
                  clearable
                  filterable
                  @change="smsSelectChange"
                  style="margin-right:10px;width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in smsIdList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
               <el-tooltip placement="top" v-if="baseForm.smsId">
                <div slot="content">{{baseForm.smsParams}}</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('sms') > -1 " style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('sms')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '1'">
             <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="tel" name="transferType" v-model="baseForm.transferType" 
                @change="checked=>changeDistribution(checked, 'tel')"
                style="margin-left:8px;">电销</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex;">
              <el-form-item prop="telId">
                <el-select
                  v-model= "baseForm.telId"
                  clearable
                  filterable
                  @change="telSelectChange"
                  style="margin-right:10px;  width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in telIdList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <el-tooltip placement="top" v-if="baseForm.telId">
                  <div slot="content">{{baseForm.telParams}}</div>
                  <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('tel') > -1" style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('tel')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '1'">
             <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="ai" name="transferType" v-model="baseForm.transferType" 
                @change="checked=>changeDistribution(checked, 'ai')"
                style="margin-left: 8px;">AI</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex;">
              <el-form-item prop="aiId">
                <el-select
                  v-model= "baseForm.aiId"
                  clearable
                  filterable
                  @change="aiSelectChange"
                  style="margin-right:10px; width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in aiIdList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
               <div>
                <el-tooltip placement="top" v-if="baseForm.aiId">
                  <div slot="content">{{baseForm.aiParams}}</div>
                  <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('ai') > -1 " style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('ai')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
           <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '1'">
             <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="push" name="transferType" v-model="baseForm.transferType" 
                @change="checked=>changeDistribution(checked, 'push')"
                style="margin-left: 8px;">Push</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex;">
              <el-form-item prop="pushId">
                <el-select
                  v-model= "baseForm.pushId"
                  clearable
                  filterable
                  @change="pushSelectChange"
                  style="margin-right:10px; width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in pushIdList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
               <div>
                <el-tooltip placement="top" v-if="baseForm.pushId">
                  <div slot="content">{{baseForm.pushParams}}</div>
                  <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('push') > -1" style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('push')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="baseForm.decisionType === '0' && baseForm.transferCategory === '1'">
             <el-col style="width: 8.33333%;">
              <el-form-item  prop="transferType">
                <el-checkbox label="card" name="transferType" v-model="baseForm.transferType" 
                @change="checked=>changeDistribution(checked, 'card')"
                style="margin-left: 8px;">红包/卡券</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="display:flex;">
              <el-form-item prop="cardId">
                <el-select
                  v-model= "baseForm.cardId"
                  clearable
                  filterable
                  @change="cardSelectChange"
                  style="margin-right:10px; width:270px;"
                  placeholder="请选择">
                  <el-option
                    v-for="item in cardIdList"
                    :key="item.id"
                    :label="item.resourceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
               <div>
                <el-tooltip placement="top" v-if="baseForm.cardId">
                  <div slot="content">{{baseForm.cardIdParams}}</div>
                  <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
                </el-tooltip>
                <div v-if="this.baseForm.transferType.indexOf('card') > -1" style="margin-top:5px;cursor:pointer;font-size:12px;color:#8c8c94;" @click="editConfigure('card')">{{canUpdate? '配置' : '查看' }}</div>
              </div>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20" v-if="baseForm.transferCategory === '0'">
            <el-col style="width: 8.33333%;">
              <el-form-item class="label-remove-margin" prop="transferType">
                  <el-checkbox label="mysql" v-model="baseForm.transferType" style="margin-left: 8px;"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item  prop="mysqlServer">
                  <el-select
                    v-model= "baseForm.mysqlServer"
                    collapse-tags
                    filterable
                    style="margin-left: 5px; width:220px;"
                    placeholder="请选择">
                    <el-option
                      v-for="item in mysqlServerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            </el-row> -->
            <!-- <el-row :gutter="20" v-if="baseForm.transferCategory === '0'">
              <el-col style="width: 8.33333%;">
                <el-form-item class="label-remove-margin" prop="transferType">
                    <el-checkbox label="sqlServer" v-model="baseForm.transferType" @change="transferTypeChage" style="margin-left: 8px;"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="sqlServer" inline>
                    <el-select
                      v-model= "baseForm.sqlServer"
                      collapse-tags
                      filterable
                      style="margin-left: 5px; width:220px;"
                      @change="sqlServerChange"
                      placeholder="请选择">
                      <el-option
                        v-for="item in sqlServerList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-button type="success" class="transfer-log" @click="viewLog" size="mini" v-if="baseForm.transferType.includes('sqlServer') && baseForm.sqlServer">下发日志</el-button>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-form-item label="智能下发" prop="intelligentDistribution">             
              <el-checkbox v-model="baseForm.intelligentDistribution" label="sms" @change="changeDistribution" style="margin-right:0">短信</el-checkbox>
                <span style="font-size:14px;margin-right:30px;">
                <i style="font-style: normal;cursor:pointer" v-if="setSmsTemplteVisible" @click="setSmsTemplte">(配置)</i>
              </span>
              <el-checkbox v-model="baseForm.intelligentDistribution" label="tel" @change="changetelDistribution">电销</el-checkbox>
              <el-checkbox v-model="baseForm.intelligentDistribution" label="ai" @change="changeAiDistribution">AI</el-checkbox>
            </el-form-item> -->
            <el-form-item label="下发模式" prop="increModel">
              <el-radio v-model="baseForm.increModel" :label="0">全量</el-radio>
              <el-radio v-model="baseForm.increModel" :label="1" v-bind:disabled="isStatic" class="radio-incremodel">增量</el-radio>
              <el-tooltip placement="top" v-if="isStatic">
                <div slot="content">静态分群不支持增量</div>
                <i class="el-icon-info cursor-pointer" style="color:#409eff"></i>
              </el-tooltip>
            </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        type="success"
        @click="copyHandle"
        size="small"
        v-if="!!baseForm.id && baseForm.decisionType === '0'"
      >复制创建新任务</el-button>
      <el-button type="primary" v-if="baseForm.decisionType === '1'"  @click="decisionCanvas" size="small">决策画布</el-button>
      <el-button type="primary" v-if="canUpdate && baseForm.decisionType === '0'"  @click="saveHandle" size="small">保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <transfer-log v-if="transferLogVisible" ref="transferLog" :data="transferLogList"></transfer-log>
    <kafkaNode v-if="kafkaNodeVisible" ref="kafkaNode" @updateList="changeDistribution"></kafkaNode>
    <smsNode v-if="smsNodeVisible" ref="smsNode" @updateList="changeDistribution"></smsNode>
    <telNode v-if="telNodeVisible" ref="telNode" @updateList="changeDistribution"></telNode>
    <aiNode v-if="aiNodeVisible" ref="aiNode" @updateList="changeDistribution"></aiNode>
    <pushNode v-if="pushNodeVisible" ref="pushNode" @updateList="changeDistribution"></pushNode>
    <cardVoucherNode v-if="cardVoucherVisible" ref="cardVoucherNode" @updateList="changeDistribution"></cardVoucherNode>
  </el-drawer>
</template>
<script>
  import { addDataTransferManage, updateDataTransferManage, dataTransferManageOutParams,
  // dataTransferManageOutParamsEdit,
  dataTransferManageCuster,
  // dataTransferManageKafka,
  // dataTransferManageMysql,
  infoDataTransferManage,
  // defaultOutParams,
  selectResourceBindingList,
  validTransferName
  // getSmsAllMessage
  } from '@/api/dataAnalysis/dataTransferManage'
  import { deepClone, findVueSelectItemIndex } from '../dataAnalysisUtils/utils'
  import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import transferLog from './data-transfer-r3-log'
  import kafkaNode from './transconfigureNode/kafkaNode'
  import smsNode from './transconfigureNode/smsNode'
  import telNode from './transconfigureNode/telNode'
  import aiNode from './transconfigureNode/aiNode'
  import pushNode from './transconfigureNode/pushNode'
  import cardVoucherNode from './transconfigureNode/cardVoucherNode'
  export default {
    data () {
      // 验证枚举类型的函数
      let validateKafkaServer = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('kafka') > -1 && this.baseForm.kafkaServer === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      let validateSmaId = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('sms') > -1 && this.baseForm.smsId === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      let validateTelId = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('tel') > -1 && this.baseForm.telId === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      let validateAiId = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('ai') > -1 && this.baseForm.aiId === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
       let validatePushId = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('push') > -1 && this.baseForm.pushId === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      let validatecardVoucherId = (rule, value, callback) => {
        if (this.baseForm.transferType.indexOf('card') > -1 && this.baseForm.cardId === '') {
          callback(new Error('请选择'))
        } else {
          callback()
        }
      }
      // let validateMysqlServer = (rule, value, callback) => {
      //   if (this.baseForm.transferType.indexOf('mysql') > -1 && this.baseForm.mysqlServer === '') {
      //     callback(new Error('请选择数据源'))
      //   } else {
      //     callback()
      //   }
      // }

      // let validateSqlServer = (rule, value, callback) => {
      //   if (this.baseForm.transferType.indexOf('sqlServer') > -1 && this.baseForm.sqlServer === '') {
      //     callback(new Error('请选择数据源'))
      //   } else {
      //     callback()
      //   }
      // }

      let validateTime = (rule, value, callback) => {
        let tempTime1 = new Date(this.baseForm.startTime)
        let tempTime2 = new Date(this.baseForm.endTime)
        let hour1 = tempTime1.getHours()
        let minute1 = tempTime1.getMinutes()
        let hour2 = tempTime2.getHours()
        let minute2 = tempTime2.getMinutes()
        let tempDate = new Date()
        if (tempDate.setHours(hour1, minute1) >= tempDate.setHours(hour2, minute2)) {
          callback(new Error('开始时间大于等于结束时间'))
        } else {
          this.$refs.baseForm.clearValidate('startTime')
          this.$refs.baseForm.clearValidate('endTime')
          callback()
        }
      }

      return {
        loading: false,
        visible: true,
        isStatic: false,
        setSmsTemplteVisible: false,
        channelCode: '',
        // originOutParamsList: [],
        baseForm: {
          id: '',
          beeFlowId: '', // 工蜂流程Id
          taskUniqueFlag: null, // 蜂巢任务ID
          dolphinProcessId: null,
          transferName: '', // 任务名称
          templateId: '', // 分群名称
          transferCategory: '0', // 下发方式
          outParams: [],
          taskDescribtion: '', // 描述
          jobType: 1, // 周期
          onceRunTime: '', // 运行一次运行时间
          runTime: '', // 周期运行具体时间
          runCycle: 'MINUTE', // 调度周期
          timeInterval: '',
          startTime: '',
          endTime: '',
          dayOfWeeks: [], // 周
          dayOfMonths: [], // 月
          transferType: [], // 下发数据源
          // intelligentDistribution: [], // 业务下发
          increModel: 0, // 下发模式
          kafkaServer: '', // 已绑定的kafka
          kafkaParams: '', // kafka出参
          topic: '',
          // mysqlServer: '', // sftp数据源地址
          // sqlServer: '',
          smsId: '', // 短信绑定ID
          smsParams: '',
          telId: '',
          telParams: '',
          aiId: '',
          aiParams: '',
          pushId: '',
          pushParams: '',
          cardId: '',
          cardIdParams: '',
          triggerMode: '0', // 下发类型，默认0主动型 1被动
          decisionType: '0'
        },
        tag: '新建', // 说明是否是“查看”
        readonly: false, // 不可编辑
        disIntervalMess: '分钟',
        templateIdList: [],
        outParams: [], // 分群出参提交格式
        outParamsList: [ // 分群出参list
        ],
        timeIntervalList: [],
        dispatchCycleList: [
          // {value: 'MINUTE', label: '分钟'},
          {value: 'HOUR', label: '小时'},
          {value: 'DAY', label: '日'},
          // {value: 'WEEK', label: '周'},
          {value: 'MONTH', label: '月'}
        ],
        dayOfWeeksList: [
          {value: '1', label: '周日'},
          {value: '2', label: '周一'},
          {value: '3', label: '周二'},
          {value: '4', label: '周三'},
          {value: '5', label: '周四'},
          {value: '6', label: '周五'},
          {value: '7', label: '周六'}
        ],
        dayOfMonthsList: [
        ],
        kafkaServerList: [],
        mysqlServerList: [],
        sqlServerList: [],
        smsIdList: [],
        telIdList: [],
        aiIdList: [],
        pushIdList: [],
        cardIdList: [],
        intelligentDistributionParams: [],
        transferLogVisible: false,
        transferLogList: [],
        kafkaNodeVisible: false,
        smsNodeVisible: false,
        telNodeVisible: false,
        aiNodeVisible: false,
        pushNodeVisible: false,
        cardVoucherVisible: false,
        baseRule: {
          decisionType: [
            { required: true, message: '请选择决策方式', trigger: 'change' }
          ],
          templateId: [
            { required: true, message: '请选择分群名称', trigger: 'change' }
          ],
          transferName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          transferCategory: [
            { required: true, message: '请选择下发方式', trigger: 'change' }
          ],
          outParams: [
            { required: true, message: '请选择分群出参', trigger: 'input' }
          ],
          // onceRunTime: [
          //   {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          // ],
          runTime: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          dayOfWeeks: [
            {type: 'array', required: true, message: '请选择具体时间', trigger: 'change'}
          ],
          dayOfMonths: [
            {type: 'array', required: true, message: '请选择具体时间', trigger: 'change'}
          ],
          startTime: [
            // {type: 'date', required: true, message: '请选择开始时间', trigger: 'change'},
            { validator: validateTime }
          ],
          timeInterval: [
            {type: 'number', required: true, message: '请选择间隔时间', trigger: 'change'}
          ],
          endTime: [
            // {type: 'date', required: true, message: '请选择结束时间', trigger: 'change'},
            { validator: validateTime }
          ],
          // transferType: [
          //   { type: 'array', required: true, message: '请选择下发方式', trigger: 'change' }
          // ]
          // intelligentDistribution: [
          //   { type: 'array', required: true, message: '请选择业务下发方式', trigger: 'change' }
          // ],
          kafkaServer: [
            { validator: validateKafkaServer }
          ],
          smsId: [
            { validator: validateSmaId }
          ],
           telId: [
            { validator: validateTelId }
          ],
           aiId: [
            { validator: validateAiId }
          ],
          pushId: [
            {validator: validatePushId}
          ],
          cardId: [
            {validator: validatecardVoucherId}
          ]
          //  kafkaServer: [
          //  { required: true, message: '请选择数据源', trigger: 'change' }
          // ],
          // mysqlServer: [
          //   { validator: validateMysqlServer }
          // ],
          // sqlServer: [
          //   { validator: validateSqlServer }
          // ]
        },
        isR3DefaultOut: false, // 选中R3下发源，且有默认出参时，不可再操作出参
        rowData: { // 修改时数据内容
          authOwner: '',
          authOtherList: [],
          authOthers: ''
        },
        canUpdate: true // 可编辑
      }
    },
    mounted () {
      this.dataAssembly()
      this.disTimeTurnOff('MINUTE')
      // this.getKafkaServerList()
      // this.getMysqlServerList()
      // this.getSqlServerList()
    },

    computed: {

    },

    components: { Treeselect, transferLog, kafkaNode, smsNode, telNode, aiNode, pushNode, cardVoucherNode },

    methods: {
      // 树加载
      async loadOptions ({ action, parentNode, callback }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          callback()
        }
      },
      //  调度周期 月 数据组装
      dataAssembly () {
        let tempArry = []
        for (let i = 1, j = 32; i < j; i++) {
          tempArry.push({value: i.toString(), label: '每月' + i + '号'})
        }
        tempArry.push({value: '-1', label: '每月最后一天'})
        this.dayOfMonthsList = tempArry
      },
      //  调度 时间间隔 数据切换
      disTimeTurnOff (disType) {
        let tempArry = []
        if (disType === 'MINUTE') {
          for (let i = 5, j = 60; i < j; i += 5) {
            tempArry.push({value: i, label: i})
          }
          this.disIntervalMess = '分钟'
        } else if (disType === 'HOUR') {
          for (let i = 1, j = 24; i < j; i++) {
            tempArry.push({value: i, label: i})
          }
          this.disIntervalMess = '小时'
        }
        this.baseForm.timeInterval = ''
        this.timeIntervalList = tempArry
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
      // 获取分群名称
      getCusterList (tag, fn) {
        dataTransferManageCuster().then(({data}) => {
          if (data && data.status === '1') {
            this.templateIdList = data.data
          } else {
            this.templateIdList = []
          }
          if (!tag) {
            this.$nextTick(() => {
              this.loading = false
            })
          }
          if (fn) {
            fn(this.templateIdList)
          }
        })
      },
      // 获取分群出参 指标列表
      getOutParamsList (sourceBindingIds) {
        let code = this.channelCode.split(',').filter(item => item !== '')
        dataTransferManageOutParams({ channelCode: code, flag: this.baseForm.id ? '-1' : '1' }).then(({data}) => {
          if (data && data.status === '1') {
            this.outParamsList = this.filterAllCata(data.data)
            if (sourceBindingIds) {
              this.baseForm.transferType.forEach(item => {
                this.dataTransferDisplay(item, sourceBindingIds)
            })
            }
          } else {
            this.outParamsList = []
          }
          if (this.baseForm.decisionType === '1') {
            this.loading = false
          }
        })
      },
      // // 修改，回显时查询分群出参选中
      // getOutParamsEditList (id, outList) {
      //   dataTransferManageOutParamsEdit(id).then(({data}) => {
      //     if (data && data.status === '1') {
      //       let out = []
      //       this.outParams = []
      //       data.data.forEach(item => {
      //         out.push(item.fieldCode + '-' + item.fieldId)
      //         this.outParams.push({value: item.fieldCode, id: item.fieldId, sourceTable: item.sourceTable})
      //       })
      //       this.baseForm.outParams = Array.from(new Set(out))
      //       this.outParamsList = this.updateOutParamsList(outList)
      //       this.$nextTick(() => {
      //         this.loading = false
      //       })
      //     }
      //   })
      // },
       // // 修改，回显时查询分群出参选中
    getOutParamsEditList (data, outList, arr) {
      outList && outList.forEach(item => {
        if (!item.children) {
          if (data.filter(x => x == item.fieldId).length) {
            arr.push(item.label)
          }
        } else {
          this.getOutParamsEditList(data, item.children, arr)
        }
      })
      return arr
    },
      // // kafka 数据源
      // getKafkaServerList () {
      //   let params = {
      //     type: 'kafka'
      //   }
      //   dataTransferManageKafka(params).then(({data}) => {
      //     if (data && data.status === '1') {
      //       this.kafkaServerList = data.data
      //     }
      //   })
      // },
      // // mysql 数据源
      // getMysqlServerList () {
      //   let params = {
      //     type: 'mysql'
      //   }
      //   dataTransferManageMysql(params).then(({data}) => {
      //     if (data && data.status === '1') {
      //       this.mysqlServerList = data.data
      //     }
      //   })
      // },
      // // mysql 数据源
      // getSqlServerList () {
      //   let params = {
      //     type: 'sqlServer'
      //   }
      //   dataTransferManageMysql(params).then(({data}) => {
      //     if (data && data.status === '1') {
      //       this.sqlServerList = data.data
      //     }
      //   })
      // },
      // sqlServerChange (val) { // 选中sqlServer时
      //   if (this.baseForm.transferType.includes('sqlServer')) {
      //     let code = this.channelCode.split(',').filter(item => item !== '')
      //     if (code.includes('2001') && !code.includes('1001')) { // 商城渠道时，把万卡渠道也传过去
      //       code.push('1001')
      //     }
      //     this.getSqlServerDefaultOutParams({channelCode: code}, val) // 渠道多选后，传参方式改变
      //   }
      // },
      // getSqlServerDefaultOutParams (channelCode, id) { // 选择r3下发数据源时，先判断是否需要指定默认出参
      //   defaultOutParams(channelCode, id).then(({data}) => {
      //     if (data && data.status === '1') {
      //       if (!data.data || !data.data.length) return
      //       let out = []
      //       this.outParams = []
      //       data.data.forEach(item => {
      //         out.push(item.value + '-' + item.id)
      //         this.outParams.push({value: item.value, id: item.id, sourceTable: item.sourceTable})
      //       })
      //       this.baseForm.outParams = Array.from(new Set(out))
      //       this.outParamsList = this.updateOutParamsList(this.outParamsList)
      //       this.isR3DefaultOut = true
      //     }
      //   })
      // },
      transferTypeChage (val) { // 选中sqlServer与否
        if (!this.baseForm.transferType.includes('sqlServer')) { // 取消选中sqlServer时。出参变为可选状态，且清除原有的
          if (this.isR3DefaultOut) {
            this.isR3DefaultOut = false
            this.baseForm.outParams = []
            this.outParams = []
          }
        } else { // 选中时，之前有选择下拉项则直接请求接口数据，获取出参
          if (this.baseForm.sqlServer != '') {
            this.getSqlServerDefaultOutParams(this.channelCode, this.baseForm.sqlServer)
          }
        }
      },
      // 决策方式改变 任务名称改变
      decisionTypeChange (selVal) {
        let obj = {}
        if (this.baseForm.templateId) {
          obj = this.templateIdList.find((item) => {
            return item.value === this.baseForm.templateId
          })
          this.baseForm.transferName = obj.text + (selVal === '0' ? '下发任务' : '智能运营任务')
        }
        if (selVal === '0') {
          this.baseForm.transferType = ['kafka']
        } else {
          this.baseForm.transferType = []
        }
      },
      // 下发方式改变
      changeTransferCategory (val) {
        this.baseForm.kafkaServer = ''
        this.baseForm.kafkaParams = ''
        this.baseForm.smsId = ''
        this.baseForm.telId = ''
        this.baseForm.aiId = ''
        this.baseForm.pushId = ''
        this.baseForm.smsParams = ''
        this.baseForm.telParams = ''
        this.baseForm.aiParams = ''
        this.baseForm.pushParams = ''
        this.kafkaServerList = []
        this.smsIdList = []
        this.telIdList = []
        this.aiIdList = []
        this.pushIdList = []
        if (val === '0') {
          this.baseForm.transferType = ['kafka']
          this.changeDistribution(true, 'kafka')
        } else {
          this.baseForm.transferType = []
        }
      },
      // 分群名称改变任务名称改变
      currentSel (selVal) {
        let obj = {}
        obj = this.templateIdList.find((item) => {
          if (item.value === selVal) {
            this.channelCode = item.channelCode
          }
          if (item.value === selVal && item.type === 'static') {
            this.isStatic = true
          } else {
            this.isStatic = false
          }
          this.baseForm.increModel = 0
          return item.value === selVal
        })
        this.baseForm.transferName = obj.text + (this.baseForm.decisionType === '0' ? '下发任务' : '智能运营任务')
        // 改变分群名称时，出参及sqlserver选项都初始化，因为他们依赖分群
        this.getOutParamsList()
        this.baseForm.outParams = []
        this.outParams = []
         this.baseForm.kafkaServer = ''
        this.baseForm.kafkaParams = ''
        this.baseForm.smsId = ''
        this.baseForm.telId = ''
        this.baseForm.aiId = ''
        this.baseForm.pushId = ''
        this.baseForm.smsParams = ''
        this.baseForm.telParams = ''
        this.baseForm.aiParams = ''
        this.baseForm.pushParams = ''
        this.kafkaServerList = []
        this.smsIdList = []
        this.telIdList = []
        this.aiIdList = []
        this.pushIdList = []
        this.isR3DefaultOut = false
        if (this.baseForm.transferCategory === '0') {
          this.baseForm.transferType = ['kafka']
          this.changeDistribution(true, 'kafka')
        } else {
          this.baseForm.transferType = []
        }
      },
      // 选中出参
      outParamsSelect (node) {
        this.outParams.push({
          value: node.englishName,
          id: node.fieldId,
          sourceTable: node.sourceTable
        })
        if (this.outParams.length) {
          this.$refs.baseForm.clearValidate('outParams')
        }
      },
      // 删除出参
      outParamsDeselect (node) {
        this.outParams = this.outParams.filter(item => item.id !== node.fieldId)
      },
      // 获取出参，默认展开列表
      updateOutParamsList (indexList) {
        let indexListArr = deepClone(indexList)
        this.baseForm.outParams.forEach(item => {
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
      // 下发日志
      viewLog () {
        this.transferLogVisible = true
        this.$nextTick(() => {
          this.$refs.transferLog.init(this.baseForm.id)
        })
      },
      // 提交数据格式化
      formatPostData (data, outParams) {
        let postData = {}
        postData.id = data.id ? data.id : ''
        postData.beeFlowId = data.beeFlowId ? data.beeFlowId : ''
        postData.decisionType = data.decisionType
        postData.triggerMode = data.triggerMode
        postData.transferCategory = data.transferCategory
        postData.taskUniqueFlag = data.taskUniqueFlag
        postData.dolphinProcessId = data.dolphinProcessId
        postData.transferName = data.transferName
        postData.templateId = data.templateId
        postData.transferType = data.transferType.join(',')
        postData.taskDescribtion = data.taskDescribtion
        // postData.outParams = outParams
        postData.authOwner = this.rowData.authOwner
        postData.authOtherList = this.rowData.authOtherList
        postData.authOthers = this.rowData.authOthers
        // postData.datasourceParams = []
        postData.sourceBindingIds = []
        if (data.kafkaServer != '' && data.transferType.includes('kafka')) {
          postData.sourceBindingIds.push(data.kafkaServer)
        }
        if (data.smsId != '' && data.transferType.includes('sms')) {
          postData.sourceBindingIds.push(data.smsId)
        }
        if (data.telId != '' && data.transferType.includes('tel')) {
          postData.sourceBindingIds.push(data.telId)
        }
        if (data.aiId != '' && data.transferType.includes('ai')) {
          postData.sourceBindingIds.push(data.aiId)
        }
        if (data.pushId != '' && data.transferType.includes('push')) {
          postData.sourceBindingIds.push(data.pushId)
        }
        if (data.cardId != '' && data.transferType.includes('card')) {
          postData.sourceBindingIds.push(data.cardId)
        }
        postData.increModel = data.increModel
        postData.taskScheduleConfig = {}
        console.log('data.onceRunTime:111 ', data.onceRunTime);
        let tempTime = new Date(data.jobType == 1 ? data.onceRunTime : data.runTime)
        let year = tempTime.getFullYear().toString()
        console.log('year: ', year);
        let month = (tempTime.getMonth() + 1) < 10 ? '0' + (tempTime.getMonth() + 1) : tempTime.getMonth().toString()
        console.log('month: ', month);
        let day = tempTime.getDate() < 10 ? '0' + tempTime.getDate() : tempTime.getDate().toString()
        let hour = tempTime.getHours() < 10 ? '0' + tempTime.getHours() : tempTime.getHours().toString()
        let minute = tempTime.getMinutes() < 10 ? '0' + tempTime.getMinutes() : tempTime.getMinutes().toString()
        let second = tempTime.getSeconds() < 10 ? '0' + tempTime.getSeconds() : tempTime.getSeconds().toString()
          
          console.log('data.onceRunTime: ', data.onceRunTime);
          console.log('data.jobType: ', data.jobType);
        if (data.jobType == 1) {
          postData.taskScheduleConfig.jobType = 'ONCE_ONLY'
          if (data.onceRunTime !== ''&& data.onceRunTime !== null) {
            let obgExec = {
              year: year,
              month: month,
              day: day,
              hour: hour,
              minute: minute,
              second: second
            }
            postData.taskScheduleConfig.execTime = obgExec
          }
        } else {
          postData.taskScheduleConfig.jobType = data.runCycle
          if (data.runCycle == 'WEEK') {
            postData.taskScheduleConfig.jobValue = data.dayOfWeeks.join(',')
          } else if (data.runCycle == 'MONTH') {
            postData.taskScheduleConfig.jobValue = data.dayOfMonths.join(',')
          } else if (data.runCycle == 'MINUTE' || data.runCycle == 'HOUR') {
            let startTime = new Date(typeof this.baseForm.startTime === 'object' ? this.baseForm.startTime : parseInt(this.baseForm.startTime))
            let startHour = startTime.getHours() < 10 ? '0' + startTime.getHours() : startTime.getHours().toString()
            let startMinute = startTime.getMinutes() < 10 ? '0' + startTime.getMinutes() : startTime.getMinutes().toString()
            let endTime = new Date(typeof this.baseForm.endTime === 'object' ? this.baseForm.endTime : parseInt(this.baseForm.endTime))
            let endHour = endTime.getHours() < 10 ? '0' + endTime.getHours() : endTime.getHours().toString()
            let endMinute = endTime.getMinutes() < 10 ? '0' + endTime.getMinutes() : endTime.getMinutes().toString()
            let obgStart = {
              hour: startHour,
              minute: startMinute
            }
            let obgEnd = {
              hour: endHour,
              minute: endMinute
            }
            postData.taskScheduleConfig.startTime = obgStart
            postData.taskScheduleConfig.endTime = obgEnd
            postData.taskScheduleConfig.interval = this.baseForm.timeInterval
          }
          if ((data.runCycle !== 'WEEK' || data.runCycle !== 'MONTH') && data.runTime !== '') {
            let obgExec = {
              hour: hour,
              minute: minute,
              second: second
            }
            postData.taskScheduleConfig.execTime = obgExec
          }
        }
        return postData
      },
      // 数据回显
      dataDisplay (row) {
        infoDataTransferManage(row.id).then(({data}) => {
          if (data && data.status === '1') {
            let disData = data.data
            this.baseForm.id = disData.id
            this.baseForm.beeFlowId = disData.beeFlowId
            this.baseForm.transferCategory = disData.transferCategory ? disData.transferCategory.toString() : '0'
            this.baseForm.decisionType = disData.decisionType ? disData.decisionType : '0'
            this.baseForm.taskUniqueFlag = disData.taskUniqueFlag
            this.baseForm.dolphinProcessId = disData.dolphinProcessId
            this.baseForm.templateId = disData.templateId
            this.baseForm.transferName = disData.transferName
            this.baseForm.triggerMode = disData.triggerMode ? disData.triggerMode + '' : '0'
            this.baseForm.taskDescribtion = disData.taskDescribtion === null ? '' : disData.taskDescribtion
            if (disData.decisionType === '1') {
              this.$store.commit('canvasFlow/setEditData', disData)
            } else {
              this.baseForm.transferType = (disData.transferType || '').split(',')
            }
            // 要先拿到this.templateIdList
            this.channelCode = this.templateIdList.filter(item => item.value === disData.templateId)[0].channelCode
            let custerType = this.templateIdList.filter(item => item.value === disData.templateId)[0].type
            // if (this.channelCode !== '0000') {
            //   this.templateIdList = this.templateIdList.filter(item => item.channelCode !== '0000')
            // } else {
            //   this.templateIdList = this.templateIdList
            // }
            this.templateIdList = this.templateIdList
            // 要先拿到this.channelCode,才能去获取对应的出参列表
            this.getOutParamsList(disData.sourceBindingIds)
            if (custerType === 'static') {
              this.isStatic = true
            } else {
              this.isStatic = false
            }
            this.baseForm.increModel = disData.increModel == -1 ? 0 : disData.increModel
            let tempTime = disData.taskScheduleConfig
            switch (disData.taskScheduleConfig.jobType) {
              case 'ONCE_ONLY':
                this.baseForm.jobType = 1
                if (tempTime.execTime != null && tempTime.execTime.hasOwnProperty('year')) {
                  this.baseForm.onceRunTime = new Date(parseInt(tempTime.execTime.year), parseInt(tempTime.execTime.month) - 1, parseInt(tempTime.execTime.day), parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second)).getTime()
                } else {
                  this.baseForm.onceRunTime = ''
                }
                break
              case 'MINUTE':
                this.disTimeTurnOff('MINUTE')
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'MINUTE'
                this.baseForm.startTime = new Date(2020, 3, 4, parseInt(tempTime.startTime.hour), parseInt(tempTime.startTime.minute), 0)
                this.baseForm.endTime = new Date(2020, 3, 4, parseInt(tempTime.endTime.hour), parseInt(tempTime.endTime.minute), 0)
                this.baseForm.timeInterval = tempTime.interval
                break
              case 'HOUR':
                this.disTimeTurnOff('HOUR')
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'HOUR'
                this.baseForm.startTime = new Date(2020, 3, 4, parseInt(tempTime.startTime.hour), parseInt(tempTime.startTime.minute), 0)
                this.baseForm.endTime = new Date(2020, 3, 4, parseInt(tempTime.endTime.hour), parseInt(tempTime.endTime.minute), 0)
                this.baseForm.timeInterval = tempTime.interval
                break
              case 'DAY':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'DAY'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                break
              case 'WEEK':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'WEEK'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                this.baseForm.dayOfWeeks = tempTime.jobValue.split(',')
                break
              case 'MONTH':
                this.baseForm.jobType = 2
                this.baseForm.runCycle = 'MONTH'
                this.baseForm.runTime = new Date(2020, 3, 4, parseInt(tempTime.execTime.hour), parseInt(tempTime.execTime.minute), parseInt(tempTime.execTime.second))
                this.baseForm.dayOfMonths = tempTime.jobValue.split(',')
                break
            }
          }
        })
      },
      // 下发方式回显
      dataTransferDisplay (type, sourceBindingIds) {
        let params = {
          type: type,
          channelCode: this.channelCode
        }
        selectResourceBindingList(params).then(({data}) => {
          if (data && data.status === '1') {
            if (type === 'kafka') {
              this.kafkaServerList = data.data
               data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.kafkaServer = item.id
                  this.kafkaSelectChange()
                }
              })
            } else if (type === 'sms') {
              this.smsIdList = data.data
              data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.smsId = item.id
                  this.smsSelectChange()
                }
              })
            } else if (type === 'tel') {
              this.telIdList = data.data
              data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.telId = item.id
                  this.telSelectChange()
                }
              })
            } else if (type === 'ai') {
              this.aiIdList = data.data
              data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.aiId = item.id
                  this.aiSelectChange()
                }
              })
            } else if (type === 'push') {
              this.pushIdList = data.data
              data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.pushId = item.id
                  this.pushSelectChange()
                }
              })
            } else if (type === 'card') {
              this.cardIdList = data.data
              data.data.filter(item => {
                if (sourceBindingIds.indexOf(item.id) > -1) {
                  this.baseForm.cardId = item.id
                  this.cardSelectChange()
                }
              })
            }
          }
          this.$nextTick(() => {
            this.loading = false
          })
        })
      },
      // // 分群出参
      // changeOption () {
      //   this.$refs.baseForm.validateField('outParams')
      // },
      // 打开抽屉弹窗
      init (row, tag, canUpdate) {
        this.baseForm.taskUniqueFlag = null
        this.baseForm.dolphinProcessId = null
        this.baseForm.id = ''
        this.baseForm.transferName = ''
        this.baseForm.taskDescribtion = ''
        this.baseForm.jobType = 1
        this.baseForm.onceRunTime = ''
        this.baseForm.runTime = ''
        this.baseForm.runCycle = 'MINUTE'
        this.baseForm.startTime = ''
        this.baseForm.endTime = ''
        this.baseForm.timeInterval = ''
        this.baseForm.dayOfWeeks = []
        this.baseForm.dayOfMonths = []
        // this.baseForm.transferType = ['kafka']
        this.baseForm.transferType = []
        this.isStatic = false
        this.baseForm.increModel = 0
        this.baseForm.kafkaServer = ''
        // this.baseForm.topic = ''
        // this.baseForm.mysqlServer = ''
        // this.baseForm.sqlServer = ''
        // this.baseForm.outParams = []
        this.baseForm.kafkaParams = ''
        this.baseForm.smsId = ''
        this.baseForm.smsParams = ''
        this.baseForm.telId = ''
        this.baseForm.telParams = ''
        this.baseForm.aiId = ''
        this.baseForm.aiParams = ''
        this.baseForm.pushId = ''
        this.baseForm.pushParams = ''
        this.baseForm.cardId = ''
        this.baseForm.cardIdParams = ''
        this.baseForm.templateId = ''
        this.rowData.authOwner = ''
        this.rowData.authOtherList = []
        this.rowData.authOthers = ''
        this.tag = canUpdate ? tag == 'edit' ? '编辑' : '新建' : '查看'
        this.canUpdate = canUpdate
        this.visible = true
        this.loading = true
        this.outParamsList = []
        // this.intelligentDistributionParams = []
        // this.baseForm.intelligentDistribution = []
        if (tag) {
           if (canUpdate) {
            this.rowData.authOwner = row.authOwner
            this.rowData.authOtherList = row.authOtherList
            this.rowData.authOthers = row.authOthers
          }
          this.getCusterList(tag, (data) => {
            this.dataDisplay(row) // 选获取到分群列表再去渲染页面
            this.$nextTick(() => {
              this.$refs['baseForm'].resetFields()
            })
          })
        } else {
          this.getCusterList(tag)
          // this.getOutParamsList()
          this.$nextTick(() => {
            this.$refs['baseForm'].resetFields()
          })
        }
      },
      // 关闭抽屉弹窗
      drawerClose () {
        this.visible = false
        this.$parent.addOrUpdateVisible = false
      },
      // 保存
      saveHandle () {
        // console.log(this.formatPostData(this.baseForm, this.outParams))
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            if (this.baseForm.decisionType === '0' && !this.baseForm.transferType.length) return this.$message.error('请选择下发方式')
            let params = this.formatPostData(this.baseForm)
            this.loading = true
            if (!this.baseForm.id) {
              addDataTransferManage(params).then(({data}) => {
                this.loading = false
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                      this.visible = false
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            } else {
              updateDataTransferManage(params).then(({data}) => {
                this.loading = false
                if (data && data.status === '1') {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                      this.visible = false
                    }
                  })
                } else {
                  this.$message.error(data.message || '数据异常')
                }
              })
            }
          }
        })
      },
      copyHandle () { // 复制功能
        this.$confirm('流转已复制，点击“确定”开始编辑新流转任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 确认创建分群时的操作
          this.tag = '新建'
          this.baseForm.transferName = '复制' + this.baseForm.transferName
          this.baseForm.id = ''
          this.baseForm.taskUniqueFlag = null
          this.baseForm.dolphinProcessId = null
          this.canUpdate = true
          this.rowData.authOwner = ''
          this.rowData.authOtherList = []
          this.rowData.authOthers = ''
          this.$refs.baseTitle.scrollIntoView() // 滚动到页面最上面
        }).catch(() => {
          console.log('cancel')
        })
      },
      // 决策画布
      decisionCanvas () {
        console.log('cancel')
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            let params = this.formatPostData(this.baseForm, [])
            let obj = {}
            if (this.baseForm.templateId) {
              obj = this.templateIdList.find((item) => {
              return item.value === this.baseForm.templateId
              })
            }
            params.canUpdate = this.canUpdate
            this.$store.commit('canvasFlow/setGroupNodeName', obj.text)
            // this.$store.commit('canvasFlow/setRowData', this.rowData)
            this.$store.commit('canvasFlow/setSaveDate', params)
            this.$store.commit('canvasFlow/setChannelCode', this.channelCode)
            if (!this.baseForm.id) {
              validTransferName(this.baseForm.transferName).then(({data}) => {
                if (data && data.status === '1') {
                  this.$router.replace({ path: 'dataAnalysis-canvasFlow', query: { time: new Date().getTime() } })
                } else {
                  this.$message.error(data.message)
                }
              })
            } else {
              this.$router.replace({ path: 'dataAnalysis-canvasFlow', query: { id: this.baseForm.id, time: new Date().getTime() } })
            }
          }
        })
      },
      changeDistribution (checked, val) { // 业务下发方式短信弹框
        if (this.channelCode) {
          if (checked) {
            let params = {
              type: val,
              channelCode: this.channelCode
            }
            selectResourceBindingList(params).then(({data}) => {
              if (data && data.status === '1') {
                if (val === 'kafka') {
                  this.kafkaServerList = data.data
                } else if (val === 'sms') {
                  this.smsIdList = data.data
                } else if (val === 'tel') {
                  this.telIdList = data.data
                } else if (val === 'ai') {
                  this.aiIdList = data.data
                } else if (val === 'push') {
                  this.pushIdList = data.data
                } else if (val === 'card') {
                  this.cardIdList = data.data
                }
              } else {
                this.$message.error(data.message)
                 if (val === 'kafka') {
                  this.kafkaServerList = []
                } else if (val === 'sms') {
                  this.smsIdList = []
                } else if (val === 'tel') {
                  this.telIdList = []
                } else if (val === 'ai') {
                  this.aiIdList = []
                } else if (val === 'push') {
                  this.pushIdList = []
                } else if (val === 'card') {
                  this.cardIdList = []
                }
              }
            })
          } else {
            // this.baseForm.transferType = this.baseForm.transferType.filter(item => item !== val)
            if (val === 'kafka') {
              this.baseForm.kafkaServer = ''
              this.baseForm.kafkaParams = ''
              this.kafkaServerList = []
            } else if (val === 'sms') {
              this.baseForm.smsId = ''
              this.baseForm.smsParams = ''
              this.smsIdList = []
            } else if (val === 'tel') {
              this.baseForm.telId = ''
              this.baseForm.telParams = ''
              this.telIdList = []
            } else if (val === 'ai') {
              this.baseForm.aiId = ''
              this.baseForm.aiParams = ''
              this.aiIdList = []
            } else if (val === 'push') {
              this.baseForm.pushId = ''
              this.baseForm.pushParams = ''
              this.pushIdList = []
            } else if (val === 'card') {
              this.baseForm.cardId = ''
              this.baseForm.cardIdParams = ''
              this.cardIdList = []
            }
          }
        } else {
          this.$message.error('请选择分群名称')
          this.baseForm.transferType = this.baseForm.transferType.filter(item => item !== val)
        }
      },
      // kafka选择时
      kafkaSelectChange (value) {
        if (this.baseForm.kafkaServer) {
          let arr = this.kafkaServerList.filter(item => item.id === this.baseForm.kafkaServer)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.kafkaParams = arr1.join(',')
          } else {
            this.baseForm.kafkaParams = ''
          }
        }
        //   getSmsAllMessage(arr[0].resourceId).then(({data}) => {
        //     let out = []
        //     let paramsData = data.data.extraParams + data.data.fixedParams
        //     if (paramsData) {
        //       let outParamsData = paramsData.split(',')
        //       outParamsData.forEach(item => {
        //         out.push(item.split('@')[0] + '-' + item.split('@')[1])
        //       })
        //       let arr1 = this.getOutParamsEditList(out, this.outParamsList, [])
        //       this.baseForm.kafkaParams = arr1.join(',')
        //     } else {
        //       this.baseForm.kafkaParams = ''
        //     }
        //   })
        // }
      },
      smsSelectChange () {
        if (this.baseForm.smsId) {
          let arr = this.smsIdList.filter(item => item.id === this.baseForm.smsId)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.smsParams = arr1.join(',')
          } else {
            this.baseForm.smsParams = ''
          }
          // getSmsAllMessage(arr[0].resourceId).then(({data}) => {
          //   console.log('data: ', data)
          //   let out = []
          //   let paramsData = data.data.extraParams + data.data.fixedParams
          //   if (paramsData) {
          //     let outParamsData = paramsData.split(',')
          //     outParamsData.forEach(item => {
          //       out.push(item.split('@')[0] + '-' + item.split('@')[1])
          //     })
          //     let arr1 = this.getOutParamsEditList(out, this.outParamsList, [])
          //     this.baseForm.smsParams = arr1.join(',')
          //   } else {
          //     this.baseForm.smsParams = ''
          //   }
          // })
        }
      },
      telSelectChange () {
        if (this.baseForm.telId) {
          let arr = this.telIdList.filter(item => item.id === this.baseForm.telId)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.telParams = arr1.join(',')
          } else {
            this.baseForm.telParams = ''
          }
          // getSmsAllMessage(arr[0].resourceId).then(({data}) => {
          //   let out = []
          //   let paramsData = data.data.extraParams + data.data.fixedParams
          //   if (paramsData) {
          //     let outParamsData = paramsData.split(',')
          //     outParamsData.forEach(item => {
          //       out.push(item.split('@')[0] + '-' + item.split('@')[1])
          //     })
          //     let arr1 = this.getOutParamsEditList(out, this.outParamsList, [])
          //     this.baseForm.telParams = arr1.join(',')
          //   } else {
          //     this.baseForm.telParams = ''
          //   }
          // })
        }
      },
      aiSelectChange () {
        if (this.baseForm.aiId) {
          let arr = this.aiIdList.filter(item => item.id === this.baseForm.aiId)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.aiParams = arr1.join(',')
          } else {
            this.baseForm.aiParams = ''
          }
          // getSmsAllMessage(arr[0].resourceId).then(({data}) => {
          //   let out = []
          //   let paramsData = data.data.extraParams + data.data.fixedParams
          //   if (paramsData) {
          //     let outParamsData = paramsData.split(',')
          //     outParamsData.forEach(item => {
          //       out.push(item.split('@')[0] + '-' + item.split('@')[1])
          //     })
          //     let arr1 = this.getOutParamsEditList(out, this.outParamsList, [])
          //     this.baseForm.aiParams = arr1.join(',')
          //   } else {
          //     this.baseForm.aiParams = ''
          //   }
          // })
        }
      },
      pushSelectChange () {
        if (this.baseForm.pushId) {
          let arr = this.pushIdList.filter(item => item.id === this.baseForm.pushId)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.pushParams = arr1.join(',')
          } else {
            this.baseForm.pushParams = ''
          }
        }
      },
      // 红包卡券
      cardSelectChange () {
         if (this.baseForm.cardId) {
          let arr = this.cardIdList.filter(item => item.id === this.baseForm.cardId)
          let paramsData = arr[0].extraParams
          if (arr[0].fixedParams) {
            paramsData = arr[0].extraParams + ',' + arr[0].fixedParams
          }
          if (paramsData) {
            let arr1 = this.getOutParamsEditList(paramsData.split(','), this.outParamsList, [])
            this.baseForm.cardIdParams = arr1.join(',')
          } else {
            this.baseForm.cardIdParams = ''
          }
        }
      },
      //  下发方式配置
      editConfigure (val) {
        if (this.channelCode) {
          if (val === 'kafka') {
            this.kafkaNodeVisible = true
            this.$nextTick(() => {
              this.$refs.kafkaNode.init(this.channelCode, this.baseForm.kafkaServer, this.canUpdate)
            })
          } else if (val === 'sms') {
            this.smsNodeVisible = true
            this.$nextTick(() => {
              this.$refs.smsNode.init(this.channelCode, this.baseForm.smsId, this.canUpdate)
            })
          } else if (val === 'tel') {
            this.telNodeVisible = true
            this.$nextTick(() => {
              this.$refs.telNode.init(this.channelCode, this.baseForm.telId, this.canUpdate)
            })
          } else if (val === 'ai') {
            this.aiNodeVisible = true
            this.$nextTick(() => {
              this.$refs.aiNode.init(this.channelCode, this.baseForm.aiId, this.canUpdate)
            })
          } else if (val === 'push') {
            this.pushNodeVisible = true
            this.$nextTick(() => {
              this.$refs.pushNode.init(this.channelCode, this.baseForm.pushId, this.canUpdate)
            })
          } else if (val === 'card') {
            this.cardVoucherVisible = true
            this.$nextTick(() => {
              this.$refs.cardVoucherNode.init(this.channelCode, this.baseForm.cardId, this.canUpdate)
            })
          }
        } else {
          this.$message.error('请选择分群名称')
        }
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
  .data-transfer-manage-drawer  {
    & .wrap{
      padding: 0 20px 20px;
      margin-top: -12px;
      width: 100%;
      overflow-y: auto;
      position: absolute;
      top: 75px;
      bottom: 55px;

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
      box-shadow: 0 -2px 9px 0 rgba(153,169,191,.17);
      z-index: 500;
    }
    & .data-description-tips {
      color: #999;
      margin-top: 0;
      & span {
        color: red
      }
    }
    & .vue-treeselect {
      min-height: 38px;
      line-height: 24px;
      max-width: 100%;
    }
    & .base-pane {
      border-bottom: 1px dashed #ccc;
      & .label-remove-margin{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .base-pane-item {
      width: 80%;
    }
    & .base-select{
      width: 40%;
    }
    & .base-form{
      & .pane-rules{
        & .el-form-item__content{
          margin-left: 0px !important;
        }
      }
    }
    & .radio-item {
      margin-right: 15px;
    }
    & .radio-passive {
      margin-left: 30px
    }
    & .radio-incremodel {
      margin-right: 15px;
    }
    & .transfer-log {
      margin-left: 20px;
    }
  }
</style>
