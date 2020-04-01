<template>
  <div class="customized-wrap">
    <div class="last-modifier">最后修改人：{{updator}}</div>
		<el-form :model="formData" ref="formData">
			<el-table :data="formData.tableData" border style="width: 100%;">
        <el-table-column prop="index" header-align="center" align="center" label="序号"></el-table-column>
        <el-table-column prop="fieldName" header-align="center" align="center" label="字段名称">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.fieldName'" :rules='rules.fieldName'>
                <el-input v-model="scope.row.fieldName" placeholder="字段名称"></el-input>
              </el-form-item>
            </template>
        </el-table-column>
        <el-table-column prop="fieldTitle" header-align="center" align="center" label="字段标题">
					<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.fieldTitle'" :rules='rules.fieldTitle'>
              <el-input v-model="scope.row.fieldTitle" placeholder="字段名称"></el-input>
            </el-form-item>
          </template>
				</el-table-column>
        <el-table-column prop="fieldType" header-align="center" align="center" label="字段类型">
					<template slot-scope="scope">
						<el-form-item :prop="'tableData.' + scope.$index + '.fieldType'" :rules='rules.fieldType'>
							<el-select v-model="scope.row.fieldType" placeholder="请选择">
								<el-option v-for="(item, index) in fieldTypeList" :value="item.childrenValue" :key="index" :label="item.childrenValue"></el-option>
							</el-select>
						</el-form-item>
					</template>
				</el-table-column>
        <el-table-column prop="fieldValue" header-align="center" align="center" label="字段值">
					<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.fieldValue'" :rules='rules.fieldValue'>
              <el-input v-model="scope.row.fieldValue" placeholder="字段名称"></el-input>
            </el-form-item>
          </template>
				</el-table-column>
        <el-table-column header-align="center" align="center">
          <template slot="header">
            <i class="el-icon-circle-plus-outline icon-add" @click="addField">添加字段</i>
          </template>
          <template slot-scope="scope">
            <el-form-item>
              <i class="el-icon-circle-plus-outline icon-add-row" @click="addField"></i>
              <i class="el-icon-circle-close icon-remove" @click="removeField(scope)"></i>
            </el-form-item>
          </template>
        </el-table-column>
    	</el-table>
		</el-form>
    <div class="btn-group">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button type="default" @click="submitCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { indexManageTypeList } from '@/api/dataAnalysis/indexManage'
  import { dataCustomisedAdd, dataCustomisedList, dataCustomisedDel, dataCustomisedLastModifier } from '@/api/dataAnalysis/outParamsMapping'
  export default {
    data () {
      return {
        formData: {
          tableData: []
        },
        rules: {
          fieldName: {
            required: true,
            message: '请输入字段名称'
          },
          fieldTitle: {
            required: true,
            message: '请输入字段标题'
          },
          fieldType: {
            required: true,
            message: '请选择字段类型'
          },
          fieldValue: {
            required: true,
            message: '请输入字段值'
          }
        },
        fieldTypeList: [],
        updator: '无'
      }
    },
    mounted () {
      this.getFieldTypeList()
      this.getDataIndexAliasCustomList()
      this.getUpdator()
    },
    props: {
      transferId: Number
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    methods: {
      // 获取列表数据
      getDataIndexAliasCustomList () {
        dataCustomisedList(this.transferId).then(({data}) => {
          if (!data || data.status !== '1' || (data && !data.data)) {
            this.formData.tableData = []
            return
          }
          this.formData.tableData = data.data
          this.updateDataIndex()
        })
      },
      getUpdator () {
        console.log(this.transferId)
        dataCustomisedLastModifier(this.transferId).then(({data}) => {
          if (data.status !== '1') {
            this.updator = '无'
          } else {
            this.updator = data.data || '无'
          }
        })
      },
      // 获取数据类型
      getFieldTypeList () {
        let params = 6
        indexManageTypeList(params).then(({data}) => {
          if (data && data.status === '1') {
            this.fieldTypeList = data.data
          } else {
            this.fieldTypeList = []
          }
        })
      },
      // 添加字段
      addField () {
        let initIndex = 1
        if (this.formData.tableData.length) {
          initIndex = this.formData.tableData[this.formData.tableData.length - 1].index + 1
        }
        this.formData.tableData.push({
          index: initIndex,
          fieldName: '',
          fieldTitle: '',
          fieldType: '',
          fieldValue: '',
          transferConfigDsId: this.transferId
        })
      },
      // 删除字段
      removeField (scope) {
        let row = scope.row
        if (!row.id) {
          this.formData.tableData.splice(scope.$index, 1)
          this.updateDataIndex()
        } else {
          dataCustomisedDel(row.id).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                type: 'error',
                message: data.message || '删除失败'
              })
            }
            this.formData.tableData.splice(scope.$index, 1)
            this.updateDataIndex()
          })
        }
      },
      // 自动更新id
      updateDataIndex () {
        this.formData.tableData.forEach((item, index) => {
          item.index = index + 1
        })
      },
      submitData () {
        this.$refs.formData.validate((valid) => {
          if (valid) {
            let data = this.formData.tableData
            dataCustomisedAdd(this.userName, data).then(({data}) => {
              if (data && data.status !== '1') {
                return this.$message({
                  message: data.message || '提交出错',
                  type: 'error'
                })
              }
              this.$message({
                message: data.message || '提交成功',
                type: 'success'
              })
              this.formData.tableData = []
              this.$emit('cancel')
            })
          }
        })
      },
      submitCancel () {
        this.formData.tableData = []
        this.$emit('cancel')
      }
    }
  }
</script>
<style lang="scss">
  .customized-wrap{
    & .last-modifier {
      padding: 0 30px 15px 0;
      text-align: right;
      font-weight: bold;
    }
    & .icon-add {
      color: #67c23a;
      cursor: pointer;
    }
    & .icon-add-row {
      color: #67c23a;
      cursor: pointer;
      font-size: 24px;
    }
    & .icon-remove {
      color: #f56c6c;
      cursor: pointer;
      font-size: 24px;
      margin-left: 10px;
    }
    & .el-form-item {
      margin: 0;
    }
    & .btn-group {
      text-align: center;
      padding-top: 20px;
    }
  }
</style>
