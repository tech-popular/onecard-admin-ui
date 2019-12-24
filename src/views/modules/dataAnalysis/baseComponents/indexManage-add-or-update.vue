<template>
  <el-dialog :title="tag ? '查看' : dataForm.id ? '修改' : '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="指标名" prop="enName">
        <el-input v-model="dataForm.enName" placeholder="请输入指标名"/>
      </el-form-item>
      <el-form-item label="指标标题" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入指标标题"/>
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select filterable v-model="dataForm.type" placeholder="请选择" style="width:60%">
          <el-option v-for="item in dataTypeList" :value="item" :key="item" :label="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指标类别" prop="classic">
        <el-select filterable v-model="dataForm.classic" placeholder="请选择" style="width:60%">
          <el-option v-for="(item, index) in indexClassicList" :value="item.value" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指标数据源" prop="origin">
        <el-select filterable v-model="dataForm.origin" placeholder="请选择" style="width:60%">
          <el-option v-for="(item, index) in indexOriginList" :value="item.value" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="业务线" prop="business">
        <el-select filterable v-model="dataForm.business" placeholder="请选择" style="width:60%">
          <el-option v-for="(item, index) in businessList" :value="item.value" :key="index" :label="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="指标状态" prop="status">
        <el-radio border v-model="dataForm.status" label="1">有效</el-radio>
        <el-radio border v-model="dataForm.status" label="0">无效</el-radio>
      </el-form-item>
      <el-form-item label="指标说明" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="备注" type="textarea" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" />
        <p class="data-description-tips">最多输入100个字符，您还可以输入<span v-text="100 - dataForm.desc.length"></span>个字符</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  // import { getBeeTaskTypeList, infoBeeTask, beeTask } from '@/api/workerBee/metadata'
  import { deepClone } from '../dataAnalysisUtils/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          enName: '',
          name: '', // 指标标题
          type: '', // 数据类型
          classic: '', // 指标类别
          origin: '', // 指标数据源
          business: '', // 业务线
          status: '', // 指标状态
          desc: '' // 描述
        },
        tag: '', // 说明是否是“查看”
        dataTypeList: ['string', 'int', 'boolean'], // 数据类型
        indexClassicList: [ // 指标类别
          {
            value: '1',
            name: '类别一'
          },
          {
            value: '2',
            name: '类别2'
          }
        ],
        indexOriginList: [ // 指标数据源
          {
            value: '1',
            name: 'table1'
          },
          {
            value: '2',
            name: 'table2'
          }
        ],
        businessList: [ // 业务线
          {
            value: 'wk',
            name: '万卡'
          },
          {
            value: 'lc',
            name: '悟空理财'
          }
        ],
        dataRule: {
          enName: [
            { required: true, message: '请输入指标名', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入指标标题', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择指标类型', trigger: 'change' }
          ],
          classic: [
            { required: true, message: '请选择指标类别', trigger: 'change' }
          ],
          origin: [
            { required: true, message: '请选择指标数据源', trigger: 'change' }
          ],
          business: [
            { required: true, message: '请选择业务线', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择指标状态', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (row, tag) {
        this.dataForm.id = row.id || ''
        this.tag = tag
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // getBeeTaskTypeList().then(({data}) => {
          //   if (data && data.status === 0) {
          //     this.ruleTypeList = data.data
          //   }
          // })
          if (row.id) {
            this.dataForm = deepClone(row)
          }
        })
      },
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm = {
              ...this.dataForm,
              id: Number(this.dataForm.id)
            }
            console.log(this.dataForm)
            // beeTask(newData, `/beeTask/${!this.dataForm.id ? 'saveBeeTask' : 'updateBeeTask'}`).then(({data}) => {
            //   if (data && data.status === 0) {
            //     this.$message({
            //       message: '操作成功',
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
