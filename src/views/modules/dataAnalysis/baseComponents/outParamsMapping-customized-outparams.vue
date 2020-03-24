<template>
  <div class="customized-wrap">
    <div class="last-modifier">最后修改人：无</div>
		<el-form :model="formData" ref="formData">
			<el-table :data="formData.tableData" border style="width: 100%;">
        <el-table-column prop="id" header-align="center" align="center" label="字段ID"></el-table-column>
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
								<el-option label="男" value="1">男</el-option>
								<el-option label="女" value="2">女</el-option>
							</el-select>
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
  export default {
    data () {
      return {
        formData: {
          tableData: []
        },
        rules: {
          englishName: {
            required: true,
            message: '请输入名字'
          },
          chineseName: {
            required: true,
            message: '请选择性别'
          },
          fieldType: {
            required: true,
            message: '请选择性别'
          }
        }
      }
    },
    mounted () {
    },
    methods: {
      // 添加字段
      addField () {
        let initId = 1
        if (this.formData.tableData.length) {
          initId = this.formData.tableData[this.formData.tableData.length - 1].id + 1
        }
        this.formData.tableData.push({
          id: initId,
          englishName: '',
          chineseName: '',
          fieldType: ''
        })
      },
      // 删除字段
      removeField (index) {
        this.formData.tableData.splice(index, 1)
        this.updateDataId()
      },
      // 自动更新id
      updateDataId () {
        this.formData.tableData.forEach((item, index) => {
          item.id = index + 1
        })
      },
      submitData () {
        console.log('submit', this.formData.tableData)
        this.$refs.formData.validate((valid) => {
          if (valid) {
            let data = this.formData.tableData
            alert(JSON.stringify(data))
          }
        })
      },
      submitCancel () {
        this.modifyDataList = []
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
