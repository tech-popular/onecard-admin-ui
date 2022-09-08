<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1350px" class="index-manage-drawer">
    <div slot="title" class="drawer-title">
      {{drawerTitle}}
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap" v-loading="loading">
      <div class="base-pane">
        <el-form label-width="180px" :model="baseForm" ref="baseForm" :rules="baseRule" class="base-form">
          <el-form-item label="英文名称" prop="englishName" key="englishName">
            <el-input v-model.trim="baseForm.englishName" placeholder="英文名称" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item label="标签名称" prop="chineseName" key="chineseName">
            <el-input v-model.trim="baseForm.chineseName" placeholder="标签名称" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item label="所属业务线" prop="channelCode" key="channelCode" :rules="{ required: true, message: '请选择用户所属业务线', trigger: 'blur' }">
            <el-select v-model="baseForm.channelCode" @change="channelIdChange" filterable style="width: 400px">
              <template v-for="(item, index) in channelList">
                <el-option :key="index" :label="item.text" :value="item.value" :disabled="item.disabled"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="标签口径" prop="processCaliber" key="processCaliber">
            <el-input v-model.trim="baseForm.processCaliber" placeholder="标签口径" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item prop="indexType" label="类型" key="indexType">
            <el-radio v-model="baseForm.indexType" label="1">用户标签</el-radio>
            <el-radio v-model="baseForm.indexType" label="4">衍生标签</el-radio>
          </el-form-item>
          <el-form-item label="计算公式" prop="formula" key="formula" v-if="baseForm.indexType === '4'">
            <el-input v-model.trim="baseForm.formula" placeholder="计算公式" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item label="选择所属分类" key="categoryId" prop="categoryId">
            <!-- <el-cascader clearable ref="cascaderMenu" v-model="baseForm.categoryId" :options="indexList" :props="indexListTreeProps" @change="indexTreeChange" class="base-pane-item"></el-cascader> -->
            <el-cascader style="width: 100%" clearable ref="cascaderMenu" v-model="baseForm.categoryId" :options="alldataCataLogList" :props="dataCataLogTreeProps" @change="indexTreeChange"></el-cascader>
          </el-form-item>
          <el-form-item prop="processType" label="加工类型：" key="processType" v-if="baseForm.indexType === '1'">
            <el-radio v-model="baseForm.processType" label="1">实时更新</el-radio>
            <el-radio v-model="baseForm.processType" label="2">T+1</el-radio>
          </el-form-item>
          <el-form-item prop="fieldType" label="数据类型：" key="fieldType">
            <el-radio v-model="baseForm.fieldType" label="number" :disabled="!!id">数值</el-radio>
            <el-radio v-model="baseForm.fieldType" label="date" :disabled="!!id">日期</el-radio>
            <el-radio v-model="baseForm.fieldType" label="enums" :disabled="!!id">枚举</el-radio>
            <el-radio v-model="baseForm.fieldType" label="string" :disabled="!!id">字符串</el-radio>
          </el-form-item>
          <el-form-item prop="enumFieldType" label="枚举类型：" key="enumFieldType" v-if="baseForm.fieldType === 'enums'">
            <el-radio v-model="baseForm.enumFieldType" label="number">数值</el-radio>
            <el-radio v-model="baseForm.enumFieldType" label="string">字符串</el-radio>
          </el-form-item>
          <el-form-item label-width="100px" v-if="baseForm.fieldType === 'enums'">
            <el-button @click="changeHandle()">添加值</el-button>
          </el-form-item>
          <el-table :data="enumList" border v-if="baseForm.fieldType === 'enums'" style="width: 50%; margin-left:100px; margin-bottom:20px;">
            <el-table-column prop="childrenNum" header-align="center" align="center" label="维度code"></el-table-column>
            <el-table-column prop="childrenValue" header-align="center" align="center" label="修饰值"></el-table-column>
            <el-table-column header-align="center" align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="changeHandle(scope)">修改名称</el-button>
                <el-button type="text" size="small" @click="deleteHandle(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item prop="isSensitive" label="是否包含敏感信息：" key="isSensitive">
            <el-radio v-model="baseForm.isSensitive" label="1">是</el-radio>
            <el-radio v-model="baseForm.isSensitive" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="敏感信息显示规则：" prop="showRules" key="showRules" v-if="baseForm.isSensitive === '1'">
            <el-input v-model.trim="baseForm.showRules" clearable class="base-pane-item" />
          </el-form-item>
          <el-form-item prop="enable" label="是否启用：" key="enable">
            <el-radio v-model="baseForm.enable" :label="true">是</el-radio>
            <el-radio v-model="baseForm.enable" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="saveHandle" size="small" :disabled="loading">保存</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
    <el-dialog :visible.sync="modifyaddorupdate" width="600px" append-to-body>
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item label="维度code" prop="childrenNum">
          <el-input v-model="dataForm.childrenNum" placeholder="请输入编码" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="childrenValue" label="修饰值">
          <el-input v-model="dataForm.childrenValue" placeholder="请输入" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="foot">
        <el-button type="primary" @click="modifySubmit()">确认</el-button>
        <el-button type="primary" @click="modifyCancel()">取消</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>
<script>
import { selectAllCata, channelsList, addIndexManage, updateIndexManage, infoIndexManage, getDataCataLog } from '@/api/dataAnalysis/indexManage'
import InputTag from '../components/InputTag'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
export default {
  data () {
    return {
      loading: false,
      id: 0,
      drawerTitle: '',
      visible: false,
      baseForm: {
        englishName: '',
        chineseName: '',
        channelCode: '',
        processCaliber: '',
        indexType: '1',
        formula: '',
        categoryId: [],
        processType: '',
        fieldType: '',
        isSensitive: '',
        showRules: '',
        enable: '',
        enumFieldType: '' // 枚举值类型
      },
      indexListTreeProps: {
        checkStrictly: true,
        label: 'label',
        value: 'id',
        children: 'children'
      },
      dataCataLogTreeProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        children: 'dataCata'
      },
      alldataCataLogList: [],
      indexParentList: [],
      modifyaddorupdate: false,
      enumList: [],
      dataFormId: 0,
      dataForm: {
        childrenNum: '',
        childrenValue: '',
        id: 0
      },
      dataRule: {
        childrenNum: [
          { required: true, message: '维度code不能为空', trigger: 'blur' }
        ],
        childrenValue: [
          { required: true, message: '修饰值不能为空', trigger: 'blur' }
        ]
      },
      baseRule: { // 基本信息校验规则
        englishName: [
          { required: true, message: '请输入分群名称', trigger: 'blur' }
        ],
        chineseName: [
          { required: true, message: '请输入分群名称', trigger: 'blur' }
        ],
        indexType: [
          { required: true, message: '请选择分群类型', trigger: 'change' }
        ],
        channelCode: [
          { required: true, message: '请选择用户所属业务线', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ],
        processType: [
          { required: true, message: '请选择加工类型', trigger: 'blur' }
        ],
        fieldType: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        enumFieldType: [
          { required: true, message: '请选择枚举类型', trigger: 'change' }
        ],
        isSensitive: [
          { required: true, message: '请选择是否包含敏感信息', trigger: 'change' }
        ],
        showRules: [
          { required: true, message: '请输入敏感信息显示规则', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '请选择是否启动', trigger: 'change' }
        ],
        formula: [
          { required: true, message: '请输入计算公式', trigger: 'blur' }
        ]
      },
      channelList: [],
      indexList: []
    }
  },
  components: {
    Treeselect,
    InputTag
  },
  methods: {
    init (row) {
      this.id = row ? row.id : 0
      this.dataFormId = 0
      this.enumList = []
      // this.loading = true
      this.getChannelsList()
      this.visible = true
      this.$nextTick(() => { // 默认将基本信息的错误提示消除
        this.$refs.baseForm.clearValidate()
      })
      if (!this.id) {
        this.loading = false
        this.drawerTitle = '新建标签'
      } else {
        this.id = row.id
        this.drawerTitle = '编辑标签'
        this.getDataInfo(row.id)
      }
    },
    async loadOptions ({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        callback()
      }
    },
    getDataInfo (id) {
      // 查看及编辑时请求数据
      infoIndexManage(id).then(({ data }) => {
        if (data && data.status === '1') {
          this.id = data.data.id
          if (data.data.enumTypeNum && data.data.enumTypeNum !== '') {
            this.baseForm.fieldType = 'enums'
            data.data.enumList.forEach((item, index) => {
              this.enumList.push({
                id: index,
                childrenNum: item.childrenNum,
                childrenValue: item.childrenValue
              })
            })
            this.dataFormId = data.data.enumList.length
            this.baseForm.enumFieldType = data.data.fieldType
          } else {
            this.baseForm.fieldType = data.data.fieldType
            this.baseForm.enumFieldType = ''
          }
          this.baseForm.formula = data.data.formula
          this.baseForm.englishName = data.data.englishName
          this.baseForm.chineseName = data.data.chineseName
          this.baseForm.channelCode = data.data.channelCode
          this.baseForm.processCaliber = data.data.processCaliber
          this.baseForm.indexType = data.data.indexType
          this.baseForm.categoryId = data.data.catagoryIdSelect
          this.baseForm.processType = data.data.processType
          this.baseForm.isSensitive = data.data.isSensitive
          this.baseForm.showRules = data.data.showRules
          this.baseForm.enable = data.data.enable

          this.indexParentList = data.data.catagoryIdSelect
          // this.getSelectAllCata()
          getDataCataLog().then(({ data }) => {
            if (data.status === '1') {
              this.alldataCataLogList = data.data.length ? data.data.filter(item => item.name === '玖富新万卡') : []
            } else {
              this.alldataCataLogList = []
            }
          })
        }
      })
    },
    getSelectAllCata (fn) { // 获取所有指标
      selectAllCata({
        channelCode: this.baseForm.channelCode,
        flag: this.id ? '-1' : '1'
      }).then(({ data }) => {
        if (data.status !== '1') {
          this.indexList = []
        } else {
          let indexList = this.filterAllCata(data.data)
          this.indexList = this.filterIndexList(indexList)
          console.log(' this.indexList: ', this.indexList)
        }
        if (fn) {
          fn(this.indexList)
        }
      })
    },
    filterAllCata (tree) { // 清洗数据，按selectVue的格式重新组织指标数据
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
            obj.enable = item.enable
          } else {
            obj.id = item.id
            obj.label = item.name
          }
          if (this.filterAllCata(item.dataCata).length) { // 指标层 ，无children
            obj.children = this.filterAllCata(item.dataCata) // 指标集合
            arr.push(obj)
          } else if (this.filterAllCata(item.dataIndex).length) {
            obj.children = this.filterAllCata(item.dataIndex) // 指标集合
            arr.push(obj)
          } else { // 指标父级层
            if (!item.fieldType) {
              obj.children = null
            } else {
              arr.push(obj) // 每个指标都放在集合中
            }
          }
        })
      }
      return arr
    },
    filterIndexList (data) {
      let arr = []
      if (!!data && data.length !== 0) {
        data.forEach((item, index) => {
          if (!item.fieldType) {
            let obj = {}
            obj.id = item.id
            obj.label = item.label
            if (item.children.length) {
              let children = []
              children = this.filterIndexList(item.children)
              if (children.length) {
                obj.children = children
              }
              arr.push(obj)
            } else {
              arr.push(obj)
            }
          }
        })
      }
      return arr
    },
    getChannelsList () {
      channelsList().then(res => {
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
    channelIdChange () {
      // 用户渠道改变时，重新过滤指标数据
      if (this.baseForm.channelCode.length === 0) {
        this.channelList.forEach(item => {
          if (item.value === '0000') {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
      // this.getSelectAllCata()
      getDataCataLog().then(({ data }) => {
        if (data.status === '1') {
          this.alldataCataLogList = data.data.length ? data.data.filter(item => item.name === '玖富新万卡') : []
        } else {
          this.alldataCataLogList = []
        }
      })
    },
    indexTreeChange (val) {
      this.indexParentList = val
    },
    saveHandle () {
      this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          let enumDataList = []
          if (this.baseForm.fieldType === 'enums') {
            this.enumList.forEach(item => {
              enumDataList.push({
                'childrenNum': item.childrenNum,
                'childrenValue': item.childrenValue
              })
            })
          }
          let params = {
            'englishName': this.baseForm.englishName,
            'chineseName': this.baseForm.chineseName,
            'channelCode': this.baseForm.channelCode,
            'processCaliber': this.baseForm.processCaliber,
            'indexType': this.baseForm.indexType,
            'formula': this.baseForm.formula,
            'categoryId': this.baseForm.categoryId.length ? this.indexParentList[this.indexParentList.length - 1].toString() : '',
            'processType': this.baseForm.processType,
            'fieldType': this.baseForm.fieldType,
            'isSensitive': this.baseForm.isSensitive,
            'showRules': this.baseForm.showRules,
            'enable': this.baseForm.enable,
            'catagoryIdSelect': this.indexParentList,
            'enumList': enumDataList,
            'enumFieldType': this.baseForm.enumFieldType
          }
          if (!this.id) {
            addIndexManage(params).then(({ data }) => {
              console.log('data: ', data)
              if (data && data.status === '1') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$refs['baseForm'].resetFields()
                  }
                })
              } else {
                this.$message.error(data.message || '数据异常')
              }
            })
          } else {
            params.id = this.id
            updateIndexManage(params).then(({ data }) => {
              console.log('data: ', data)
              if (data && data.status === '1') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.$refs['baseForm'].resetFields()
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
    // 添加维度
    changeHandle (scope) {
      this.modifyaddorupdate = true
      this.dataForm.id = scope ? this.enumList[scope.$index].id : ''
      this.dataForm.childrenNum = scope ? this.enumList[scope.$index].childrenNum : ''
      this.dataForm.childrenValue = scope ? this.enumList[scope.$index].childrenValue : ''
    },
    deleteHandle (scope) {
      let index = scope.$index
      this.enumList.splice(index, 1)
    },
    modifySubmit () {
      this.$refs['dataForm'].validate(valid => {
        let params = {
          id: this.dataForm.id,
          childrenNum: this.dataForm.childrenNum,
          childrenValue: this.dataForm.childrenValue
        }
        if (this.dataForm.id !== '') {
          this.enumList = this.enumList.map(t => {
            return t.id === params.id ? params : t
          })
        } else {
          this.dataFormId = this.dataFormId + 1
          params.id = this.dataFormId
          this.enumList.push(params)
        }
        this.modifyaddorupdate = false
      })
    },
    modifyCancel () {
      this.modifyaddorupdate = false
      this.$nextTick(() => {
        this.enumList = this.enumList
        this.$refs['dataForm'].resetFields()
      })
    },
    drawerClose () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    cancelHandle () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>
<style>
.index-manage-drawer .wrap {
  padding: 0 20px 20px;
  margin-top: -12px;
  width: 100%;
  overflow-y: auto;
  position: absolute;
  top: 75px;
  bottom: 55px;
}
.index-manage-drawer .drawer-title {
  padding: 15px;
  background: #333;
  color: #fff;
  font-size: 15px;
  margin: -20px -20px 0 -20px;
  position: relative;
}
.index-manage-drawer .drawer-close {
  position: absolute;
  right: 20px;
}
.index-manage-drawer .item-inline {
  display: inline-block;
}
.index-manage-drawer .item-code {
  margin-left: -70px;
}
.index-manage-drawer .item-code-name {
  width: 300px;
}
.index-manage-drawer .item-button {
  margin-left: -60px;
}
.index-manage-drawer .copy-code {
  margin-left: 15px;
}
.index-manage-drawer .footer {
  position: absolute;
  bottom: 0;
  background: #fff;
  padding: 10px 22px 10px 10px;
  width: 100%;
  height: 55px;
  text-align: right;
  box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, 0.17);
  z-index: 500;
}
.index-manage-drawer .cursor-pointer {
  cursor: pointer;
}
.index-manage-drawer .base-pane-item {
  width: 60%;
}
.index-manage-drawer .vue-treeselect {
  line-height: 24px;
}
.index-manage-drawer .data-description-tips {
  color: #999;
  margin-top: 0;
}
.index-manage-drawer .data-description-tips span {
  color: red;
}
.index-manage-drawer .type-radio-group {
  margin-top: 12px;
}
.index-manage-drawer .type-radio-two {
  margin-top: 10px;
}
.index-manage-drawer .type-radio-three {
  margin-top: 10px;
}
.index-manage-drawer .upload-excel {
  display: inline-block;
  margin-left: 20px;
}
.index-manage-drawer .btn-upload {
  display: inline-block;
  font-size: 14px;
  padding-left: 15px;
}
.index-manage-drawer .upload-name {
  font-size: 14px;
  padding-left: 15px;
}
.index-manage-drawer .btn-upload button {
  margin-left: 10px;
}
.index-manage-drawer .btn-download {
  margin-left: 10px;
}
.index-manage-drawer .btn-download a {
  color: #fff;
}
.index-manage-drawer .el-list-enter-active,
.index-manage-drawer .el-list-leave-active {
  transition: none;
}
.index-manage-drawer .el-list-enter,
.index-manage-drawer .el-list-leave-active {
  opacity: 0;
}
.index-manage-drawer .pane-rules {
  position: relative;
  display: flex;
}
/* .pane-rules-data {

} */
.pane-rules-relation {
  left: 0;
  top: -8px;
  bottom: 0;
  position: relative;
  margin-right: 8px;
  margin-bottom: 20px;
}
.pane-rules-relation:before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  overflow: hidden;
  background: #d0e2f5;
}
.pane-rules-relation span {
  position: relative;
  display: block;
  top: 50%;
  left: 0;
  right: 0;
  width: 25px;
  height: 25px;
  transform: translateY(-50%);
  border-radius: 3px;
  background: #d0e2f5;
  color: #409eff;
  font-size: 14px;
  font-weight: 700;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.index-manage-drawer .pane-rules-title,
.index-manage-drawer .pane-reject {
  border-top: 1px dashed #ccc;
}
.index-manage-drawer .user-channel {
  margin-left: 110px;
}
.index-manage-drawer .indicator-channel {
  display: inline-block;
  margin-left: 20px;
}
.index-manage-drawer .pane-reject {
  margin-top: 20px;
}
.index-manage-drawer .reject-pane-item {
  width: 50%;
}
.index-manage-drawer .reject-pane-item1 {
  width: 80%;
}
.inputTag {
  display: inline-block;
  border-radius: 4px;
  width: 340px;
  line-height: 22px;
  border: 1px solid #dcdfe6;
}
.work-type-pane-source {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin-left: 70px;
}
.type-radio-item-indexType {
  margin-bottom: 0 !important;
}
.type-radio-item-indexType-active {
  margin-bottom: 22px !important;
}
.index-manage-drawer .content-range {
  width: 80px;
  height: 28px;
  border: solid 1px #dcdfe6;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
  margin-right: 10px;
  margin-left: 50px;
}
.index-manage-drawer .pane-rules-inline {
  margin-left: 20px;
  display: flex;
  line-height: 36px;
}
.index-manage-drawer .parentheses {
  font-size: 28px;
}
.itemIput-small {
  width: 100px;
}
.index-manage-drawer .btn-group i {
  margin-left: 20px;
}
</style>
