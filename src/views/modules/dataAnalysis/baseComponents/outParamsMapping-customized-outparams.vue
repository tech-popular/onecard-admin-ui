<template>
  <div class="customized-wrap">
    <div class="last-modifier">最后修改人：无</div>
		<el-form :model="formData" ref="formData">
			<el-table :data="formData.tableData" border style="width: 100%;">
        <el-table-column prop="index" header-align="center" align="center" label="序号"></el-table-column>
        <el-table-column prop="englishName" header-align="center" align="center" label="字段名称">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.englishName'" :rules='rules.englishName'>
                <el-input v-model="scope.row.englishName" placeholder="字段名称"></el-input>
              </el-form-item>
            </template>
        </el-table-column>
        <el-table-column prop="chineseName" header-align="center" align="center" label="字段标题">
					<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.chineseName'" :rules='rules.chineseName'>
              <el-input v-model="scope.row.chineseName" placeholder="字段名称"></el-input>
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
        <el-table-column prop="indexAlias" header-align="center" align="center" label="字段值">
					<template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.indexAlias'" :rules='rules.indexAlias'>
              <el-input v-model="scope.row.indexAlias" placeholder="字段名称"></el-input>
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
              <i class="el-icon-circle-close icon-remove" @click="removeField(scope.$index)"></i>
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
  import { dataIndexAliasAdd, dataIndexAliasCustomList } from '@/api/dataAnalysis/outParamsMapping'
  export default {
    data () {
      return {
        formData: {
          tableData: []
        },
        rules: {
          englishName: {
            required: true,
            message: '请输入字段名称'
          },
          chineseName: {
            required: true,
            message: '请输入字段标题'
          },
          fieldType: {
            required: true,
            message: '请选择字段类型'
          },
          indexAlias: {
            required: true,
            message: '请输入字段值'
          }
        },
        fieldTypeList: []
      }
    },
    mounted () {
      this.getFieldTypeList()
      this.getDataIndexAliasCustomList()
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
        dataIndexAliasCustomList(this.transferId).then(({data}) => {
          if (!data || data.status !== '1' || (data && !data.data)) {
            this.formData.tableData = []
            return
          }
          this.formData.tableData = data.data
          this.updateDataIndex()
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
          englishName: '',
          chineseName: '',
          fieldType: ''
        })
      },
      // 删除字段
      removeField (index) {
        this.formData.tableData.splice(index, 1)
        this.updateDataIndex()
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
            dataIndexAliasAdd(this.transferId, this.userName, data).then(({data}) => {
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
