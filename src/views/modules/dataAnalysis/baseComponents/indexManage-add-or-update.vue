<template>
  <el-dialog :title="tag ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="指标名:" prop="englishName">
        <el-input v-model="dataForm.englishName" placeholder="" v-bind:readonly="readonly" />
      </el-form-item>
      <el-form-item label="指标标题:" prop="chineseName">
        <el-input v-model="dataForm.chineseName" placeholder="" v-bind:readonly="readonly" />
      </el-form-item>
      <el-form-item label="数据类型:" prop="fieldType">
        <el-select filterable v-model="dataForm.fieldType" placeholder="请选择" style="width:60%" v-bind:disabled="readonly" >
          <el-option v-for="(item, index) in fieldTypeList" :value="item.childrenValue" :key="index" :label="item.childrenValue"/>
        </el-select>
      </el-form-item>
       <el-form-item label="枚举类型:" prop="enumTypeNum" :required="enumeration" v-show="enumeration">
        <el-select filterable v-model="dataForm.enumTypeNum" placeholder="请选择" style="width:60%" v-bind:disabled="readonly" >
          <el-option v-for="(item, index) in enumTypeNumList" :value="item.typeNum" :key="index" :label="item.typeValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="数据格式:" prop="dataStandar">
        <el-input v-model="dataForm.dataStandar" placeholder="" v-bind:readonly="readonly" />
      </el-form-item>
      <el-form-item label="指标类别:" prop="categoryId">
        <el-select filterable v-model="dataForm.categoryId" placeholder="请选择" style="width:60%" v-bind:disabled="readonly" >
          <el-option v-for="(item, index) in categoryIdList" :value="item.id" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指标数据源:" prop="sourceDatasource">
        <el-select filterable v-model="dataForm.sourceDatasource" placeholder="请选择" style="width:60%" v-bind:disabled="readonly" >
          <el-option v-for="(item, index) in sourceDatasource" :value="item.typeNum" :key="index" :label="item.typeValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指标状态:" prop="enable">
        <el-radio v-model="dataForm.enable" label="true" v-bind:disabled="readonly" >有效</el-radio>
        <el-radio v-model="dataForm.enable" label="false" v-bind:disabled="readonly" >无效</el-radio>
      </el-form-item>
      <el-form-item label="指标说明:" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" type="textarea" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}"  v-bind:readonly="readonly" />
        <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - dataForm.remark.length"></span>个字符</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-show="!readonly">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { addIndexManage, updateIndexManage, indexManageTypeList, indexManageMinCataList, indexManageTypeNumList } from '@/api/dataAnalysis/indexManage'
  import { deepClone } from '../dataAnalysisUtils/utils'
  export default {
    data () {
      // 验证枚举类型的函数
      let validateName = (rule, value, callback) => {
        // 当枚举类型为空值且为必填时，抛出错误，反之通过校验
        if (this.dataForm.enumTypeNum === '' && this.isHaveTo) {
          callback(new Error('请输入枚举类型'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: '',
          englishName: '',
          chineseName: '', // 指标标题
          fieldType: '', // 数据类型
          categoryId: '', // 指标类别
          enumTypeNum: '', // 枚举类型
          dataStandar: '', // 数据格式
          sourceDatasource: '', // 指标数据源
          enable: 'true', // 指标状态
          remark: '' // 描述
        },
        tag: '', // 说明是否是“查看”
        readonly: false, // 不可编辑
        enumeration: false, // 枚举类型是否显示
        fieldTypeList: [ // 数据类型
        ],
        categoryIdList: [ // 指标类别
        ],
        sourceDatasource: [ // 指标数据源
          {
            typeNum: 'table1',
            typeValue: 'table1'
          }
        ],
        enumTypeNumList: [// 枚举类型
        ],
        dataRule: {
          englishName: [
            { required: true, message: '请输入指标名', trigger: 'blur' }
          ],
          chineseName: [
            { required: true, message: '请输入指标标题', trigger: 'blur' }
          ],
          fieldType: [
            { required: true, message: '请选择指标类型', trigger: 'change' }
          ],
          categoryId: [
            { required: true, message: '请选择指标类别', trigger: 'change' }
          ],
          enumTypeNum: [
            { validator: validateName }
          ],
          sourceDatasource: [
            { required: true, message: '请选择指标数据源', trigger: 'change' }
          ],
          enable: [
            { required: true, message: '请选择指标状态', trigger: 'change' }
          ]
        }
      }
    },
    mounted () {
      this.getCategoryIdList()
      this.getFieldTypeList()
      this.getEnumTypeNumList()
    },
    computed: {
      isHaveTo: function () {
        return this.dataForm.enumTypeNum === `enums`
      }
    },
    watch: {
      'dataForm.fieldType': {
        handler (newVal, oldVal) {
          if (newVal == 'enums') {
            this.enumeration = true
          } else {
            this.enumeration = false
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 获取指标类别
      getCategoryIdList () {
        indexManageMinCataList().then(({data}) => {
          if (data && data.status === 0) {
            this.categoryIdList = data.dataCatalogList
          }
        })
      },

      // 获取数据类型
      getFieldTypeList () {
        let params = 6
        indexManageTypeList(params).then(({data}) => {
          if (data && data.status === 0) {
            this.fieldTypeList = data.enumTypeList
          }
        })
      },

      // 获取枚举类型
      getEnumTypeNumList () {
        indexManageTypeNumList().then(({data}) => {
          if (data && data.status === 0) {
            this.enumTypeNumList = data.enumTypeList
          }
        })
      },
  
      init (row, tag) {
        this.dataForm.id = row ? row.id : ''
        this.tag = tag || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (row) {
            this.dataForm = deepClone(row)
          }
          this.dataForm.enable = this.dataForm.enable.toString()
          if (tag == 'view') {
            this.readonly = true
          } else {
            this.readonly = false
          }
        })
      },

      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm = {
              ...this.dataForm,
              id: this.dataForm.id ? Number(this.dataForm.id) : ''
            }
            if (this.dataForm.enable == 'true') {
              this.dataForm.enable = true
            } else {
              this.dataForm.enable = false
            }
            if (!this.dataForm.id) {
              addIndexManage(this.dataForm).then(({data}) => {
                if (data && data.status === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.readonly = false
                      this.enumeration = false
                      this.$emit('refreshDataList')
                      this.$refs['dataForm'].resetFields()
                    }
                  })
                } else {
                  this.$message.error(data.message)
                }
              })
            } else {
              updateIndexManage(this.dataForm.id, this.dataForm).then(({data}) => {
                if (data && data.status === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.readonly = false
                      this.enumeration = false
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
<style scoped>
  .data-description-tips {
    color: #999;
    margin-top: 0
  }
  .data-description-tips span {
    color: red
  }
</style>
