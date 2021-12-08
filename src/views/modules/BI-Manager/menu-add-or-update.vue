<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="菜单类型：" prop="type">
        <el-radio-group v-model="dataForm.type" @change="radioTypeChange" :disabled="!!dataForm.id">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="上级菜单："  prop="parentId" >
				<el-cascader
          style="width: 100%"
          clearable
          ref="cascaderMenu"
          v-model="dataForm.parentId"
          :options="menuList"
          :props="menuListTreeProps"
					@change="parentTreeChange"
        >
        </el-cascader>
			</el-form-item>
			<el-form-item label="菜单名称" prop="name" >
        <el-input v-model="dataForm.name" placeholder="菜单名称"></el-input>
      </el-form-item>
			<el-form-item  label="菜单链接" prop="url" v-if="dataForm.type === 1">
        <el-input v-model="dataForm.url" placeholder="菜单链接"></el-input>
      </el-form-item>
			<el-form-item label="计算任务" prop="taskIds" v-if="dataForm.type === 1">
			  <el-select v-model="dataForm.taskIds" clearable filterable  multiple placeholder="请选择计算任务" style="width: 100%">
					<el-option
						v-for="item in calculateList"
						:key="item.id"
						:label="item.name"
						:value="item.id">
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
  import { savaBiInfo, updateBiInfo, lookDataInfo, findAllRecursionList, taskManageList } from '@/api/BI-Manager/menu'
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
          type: 0,
          typeList: ['目录', '菜单'],
          parentId: [],
          name: '',
          url: '',
          taskIds: []
        },
        menuData: [],
        menuList: [],
        menuParentList: [], // 保留选中的级联中完整内容
        calculateList: [],
        menuListTreeProps: {
          checkStrictly: true,
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
      init (row) {
        this.getRecursionList()
        this.getTaskManageList()
        this.menuParentList = []
        this.dataForm.type = 0
        this.visible = true
        if (row) {
          this.dataForm.id = row.id
          this.getDataInfo(row)
        } else {
          this.$nextTick(() => {
            this.dataForm.id = 0
            this.$refs['dataForm'].resetFields()
          })
        }
      },
      getDataInfo (row) {
        lookDataInfo(row.id).then(({ data }) => {
          if (data && data.code === 0) {
            let parentIdData = []
            if (data.data.parentId == '0') {
              this.dataForm.parentId = []
              this.menuParentList = []
            } else {
              parentIdData = (data.data.menuParentList && data.data.menuParentList.split(',')) || []
              this.dataForm.parentId = parentIdData.map(item => { return +item })
              this.menuParentList = data.data.menuParentList && data.data.menuParentList.split(',')
            }
            this.dataForm.name = data.data.name
            if (data.data.url) {
              this.dataForm.type = 1
              this.menuList = this.filterMenuList(this.menuData)
              let taskIdsData = (data.data.taskIds && data.data.taskIds.split(';')) || []
              this.dataForm.url = data.data.url
              this.dataForm.taskIds = taskIdsData.length ? taskIdsData.map(item => { return +item }) : []
            } else {
              this.dataForm.type = 0
              this.dataForm.url = ''
              this.dataForm.taskIds = []
            }
            // this.getTaskManageList(data.data.taskIds.split(';'))
          }
        })
      },
      //   菜单类型修改
      radioTypeChange (val) {
        this.dataForm.type = val
        if (val === 0) {
          this.menuList = this.filterMenuGradeList(this.menuData)
          this.dataForm.url = ''
          this.dataForm.taskIds = []
        } else {
          this.menuList = this.filterMenuList(this.menuData)
        }
      },
      // 获取上级菜单
      getRecursionList () {
        findAllRecursionList().then(({ data }) => {
          if (data && data.code === 0) {
            this.menuData = data.data
            this.menuList = this.filterMenuGradeList(data.data)
          }
        })
      },
      filterMenuList (tree) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach((item, index) => {
            if (!item.url) {
              let obj = {}
              obj.id = item.id
              obj.name = item.name
              obj.grade = item.grade
              if (item.children.length) {
                let children = []
                children = this.filterMenuList(item.children)
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
      filterMenuGradeList (tree) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach((item, index) => {
            if (item.grade === 1) {
              let obj = {}
              obj.id = item.id
              obj.name = item.name
              obj.grade = item.grade
              if (item.children.length) {
                let children = []
                children = this.filterMenuGradeList(item.children)
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
      getTaskManageList () {
        taskManageList().then(({ data }) => {
          if (data && data.code === 0) {
            this.calculateList = data.data
          } else {
            this.calculateList = []
          }
        })
      },
      // 所属父级
      parentTreeChange (val) {
        this.menuParentList = val
        // let arr = []
        // arr = this.$refs.cascaderMenu.getCheckedNodes()
        // if (this.dataForm.type === 0 && arr[0].level === 2) {
        //   this.$message.error('不能新增三级目录')
        //   // this.$refs.cascaderMenu.clearCheckedNodes
        //   // 清空选中的节点
        //   // this.$refs.cascaderMenu.$refs.panel.clearCheckedNodes()
        //   // 设置为空可以让节点不高亮显示
        //   // this.$refs.cascaderMenu.$refs.panel.activePath = []
        //   this.dataForm.parentId = []
        //   this.menuParentList = []
        // }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {
              'parentId': this.dataForm.parentId.length ? this.menuParentList[this.menuParentList.length - 1].toString() : '0',
              'name': this.dataForm.name,
              'url': this.dataForm.url,
              'taskIds': this.dataForm.taskIds.join(';'),
              'menuParentList': this.menuParentList.join(',')
            }
              console.log('params: ', params)
            if (!this.dataForm.id) {
              savaBiInfo(params).then(({data}) => {
                if (data && data.code === 0) {
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
                  this.$message.error(data.msg || '数据异常')
                }
              })
            } else {
              params.id = this.dataForm.id
              updateBiInfo(params).then(({data}) => {
                if (data && data.code === 0) {
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
                  this.$message.error(data.msg || '数据异常')
                }
              })
            }
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
