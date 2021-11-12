<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
			<el-form-item label="上级菜单："  prop="parentId" >
				<el-cascader
          style="width: 100%"
          v-model="dataForm.parentId"
          :options="menuList"
          :props="menuListTreeProps"
					@change="parentTreeChange"
        >
        </el-cascader>
			</el-form-item>
			<el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称"></el-input>
      </el-form-item>
			<el-form-item  label="菜单链接" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单链接"></el-input>
      </el-form-item>
			<el-form-item label="计算任务" prop="taskIds" >
			  <el-select v-model="dataForm.taskIds" filterable  multiple placeholder="请选择计算任务" style="width: 100%">
					<el-option
						v-for="item in calculateList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { savaBiInfo, updateBiInfo, findAllRecursionList } from '@/api/BI-Manager/menu'
  export default {
    data () {
      // var validateUrl = (rule, value, callback) => {
      //   if (this.dataForm.type === 2 && !/\S/.test(value)) {
      //     callback(new Error('请输入菜单路径'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          name: '',
          url: '',
          taskIds: []
        },
        menuList: [],
        menuParentList: [], // 保留选中的级联中完整内容
        calculateList: [],
        menuListTreeProps: {
          label: 'name',
          value: 'id',
          children: 'children'
        },
        dataRule: {
          // parentId: [
          //   { required: true, message: '上级菜单不能为空', trigger: 'change' }
          // ],
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '菜单链接不能为空', trigger: 'blur' }
          ],
          taskIds: [
            { required: true, message: '计算任务不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 所属父级
      parentTreeChange (val) {
        this.menuParentList = val
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .menuSelect{
    height: 300px;
    overflow: auto
  }
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      overflow: auto;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
