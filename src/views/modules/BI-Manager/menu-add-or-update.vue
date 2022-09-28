<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="菜单类型：" prop="type">
        <el-radio-group v-model="dataForm.type" @change="radioTypeChange" :disabled="!!dataForm.id">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级菜单：" prop="parentId">
        <el-cascader style="width: 100%" clearable ref="cascaderMenu" v-model="dataForm.parentId" :options="menuList" :props="menuListTreeProps" @change="parentTreeChange"></el-cascader>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单属性" prop="menuType" v-if="dataForm.type === 1">
        <el-select v-model="dataForm.menuType" placeholder="请选择菜单属性" style="width: 100%">
          <el-option v-for="item in menuLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单链接" prop="url" v-if="dataForm.type === 1">
        <el-input v-model="dataForm.url" placeholder="菜单链接"></el-input>
      </el-form-item>
      <el-form-item label="蜂巢计算任务" prop="honeycombJobTaskIds" v-if="dataForm.type === 1">
        <el-select v-model="dataForm.honeycombJobTaskIds" clearable filterable multiple placeholder="请选择计算任务" style="width: 100%">
          <el-option v-for="item in honeycombJobList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调度计算任务" prop="oldJobTaskIds" v-if="dataForm.type === 1">
        <el-select v-model="dataForm.oldJobTaskIds" clearable filterable multiple placeholder="请选择计算任务" style="width: 100%">
          <el-option v-for="item in oldJobList" :key="item.id" :label="item.etlJobName" :value="item.etlJobId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报表负责人" prop="principalId" v-if="dataForm.type === 1">
        <el-select v-model="dataForm.principalId" @change="changeprincipal" multiple placeholder="请输入关键字" style="width:100%" remote :remote-method="getUserSelectList" :loading="loading" filterable>
          <el-option v-for="item in userIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置排序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="位置排序"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { savaBiInfo, updateBiInfo, lookDataInfo, findAllRecursionList, queryAllTypeTasks } from '@/api/BI-Manager/menu'
import { getUsersList } from '@/api/BI-Manager/userGroup'
export default {
  data () {
    return {
      visible: false,
      loading: false,
      dataForm: {
        id: 0,
        type: 0,
        typeList: ['目录', '菜单'],
        parentId: [],
        name: '',
        url: '',
        taskIds: [],
        principalId: [],
        orderNum: 0,
        oldJobTaskIds: [],
        honeycombJobTaskIds: []
      },
      menuData: [],
      menuList: [],
      menuParentList: [], // 保留选中的级联中完整内容
      calculateList: [],
      userIdList: [],
      principal: [],
      honeycombJobList: [],
      oldJobList: [],
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
        ],
        menuType: [
          { required: true, message: '菜单属性不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '位置排序不能为空', trigger: 'blur' }
        ],
        principalId: [
          { required: true, message: '请选择报表负责人', trigger: 'blur' }
        ]
      },
      menuLists: [{
        id: '0',
        name: 'superset列表'
      }, {
        id: '1',
        name: 'table简单报表'
      }, {
        id: '2',
        name: 'tableau图表'
      }]
    }
  },
  methods: {
    init (row) {
      this.getRecursionList()
      this.getTaskManageList()
      this.menuParentList = []
      this.principal = []
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
          let responsibleData = (data.data.principalId && data.data.principalId.split(',')) || []
          if (data.data.parentId == '0') {
            this.dataForm.parentId = []
            this.menuParentList = []
          } else {
            parentIdData = (data.data.menuParentList && data.data.menuParentList.split(',')) || []
            this.dataForm.parentId = parentIdData.map(item => { return +item })
            this.menuParentList = data.data.menuParentList && data.data.menuParentList.split(',')
          }
          this.dataForm.name = data.data.name
          this.dataForm.menuType = data.data.menuType + ''
          this.dataForm.orderNum = data.data.orderNum
          this.getUserSelectList()
          this.dataForm.principalId = responsibleData.map(item => { return +item })
          this.userIdList = data.data.principalList
          this.principal = data.data.principalList
          if (data.data.url) {
            this.dataForm.type = 1
            this.menuList = this.filterMenuList(this.menuData)
            let taskIdsData = (data.data.taskIds && data.data.taskIds.split(';')) || []
            console.log('taskIdsData: ', taskIdsData);
            this.dataForm.url = data.data.url
            if (taskIdsData.length === 0) {
              this.dataForm.honeycombJobTaskIds = []
              this.dataForm.oldJobTaskIds = []
            } else if (taskIdsData.length === 1) {
              taskIdsData[0].split(':')[0] == 0 ? this.dataForm.honeycombJobTaskIds = taskIdsData[0].split(':')[1].split(',') : this.dataForm.oldJobTaskIds = taskIdsData[0].split(':')[1].split(',')
            } else if (taskIdsData.length === 2) {
              console.log('taskIdsD', taskIdsData[0].split(':'));
              if (taskIdsData[0].split(':')[0] == 0) {
                this.dataForm.honeycombJobTaskIds = taskIdsData[0].split(':')[1].split(',')
                this.dataForm.oldJobTaskIds = taskIdsData[1].split(':')[1].split(',')
              } else {
                this.dataForm.oldJobTaskIds = taskIdsData[0].split(':')[1].split(',')
                this.dataForm.honeycombJobTaskIds = taskIdsData[1].split(':')[1].split(',')
              }
            }
            // this.dataForm.oldJobTaskIds = this.dataForm.oldJobTaskIds.length ? this.dataForm.oldJobTaskIds.map(item => { return +item }) : []
            this.dataForm.honeycombJobTaskIds = this.dataForm.honeycombJobTaskIds.length ? this.dataForm.honeycombJobTaskIds.map(item => { return +item }) : []
          } else {
            this.dataForm.type = 0
            this.dataForm.url = ''
            this.dataForm.taskIds = []
          }
          // this.getTaskManageList(data.data.taskIds.split(';'))
        }
      })
    },
    getUserSelectList (query) {
      if (query !== '') {
        this.loading = true
        let params = {
          name: query
        }
        getUsersList(params).then(({ data }) => {
          if (data && data.code === 0) {
            this.userIdList = data.dataList
          } else {
            this.userIdList = []
          }
          this.loading = false
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.userIdList = []
      }
    },
    //   菜单类型修改
    radioTypeChange (val) {
      // this.dataForm.type = val
      // if (val === 0) {
      //   this.menuList = this.filterMenuGradeList(this.menuData)
      //   this.dataForm.url = ''
      //   this.dataForm.taskIds = []
      // } else {
      this.menuList = this.filterMenuList(this.menuData)
      this.dataForm.url = ''
      this.dataForm.honeycombJobTaskIds = []
      this.dataForm.oldJobTaskIds = []
      // }
    },
    // 获取上级菜单
    getRecursionList () {
      let params = {
        type: 0
      }
      findAllRecursionList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.menuData = data.data
          // this.menuList = this.filterMenuGradeList(data.data)
          this.menuList = this.filterMenuList(data.data)
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
      queryAllTypeTasks().then(({ data }) => {
        if (data && data.code === 0) {
          this.honeycombJobList = data.data.honeycombJob
          this.oldJobList = data.data.oldJob
        } else {
          this.honeycombJobList = []
          this.oldJobList = []
          return this.$message.error(data.msg)
        }
      })
    },
    // 所属父级
    parentTreeChange (val) {
      this.menuParentList = val
    },
    // 负责人选中值修改
    changeprincipal (val) {
      this.userIdList.forEach(item => {
        if (this.dataForm.principalId.includes(item.id)) {
          this.principal.push(item)
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let hash = {}
          this.principal = this.principal.reduce((preVal, curVal) => {
            if (!hash[curVal.id]) {
              hash[curVal.id] = preVal.push(curVal)
            }
            // hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal)
            return preVal
          }, [])
          let principalData = []
          this.principal.forEach(item => {
            if (this.dataForm.principalId.includes(item.id)) {
              principalData.push(item.name)
            }
          })
          let taskIdsData = []
          if (this.dataForm.honeycombJobTaskIds.length) {
            taskIdsData.push(`0:${this.dataForm.honeycombJobTaskIds.join(',')}`)
          }
          if (this.dataForm.oldJobTaskIds.length) {
            taskIdsData.push(`1:${this.dataForm.oldJobTaskIds.join(',')}`)
          }
          let params = {
            'parentId': this.dataForm.parentId.length ? this.menuParentList[this.menuParentList.length - 1].toString() : '0',
            'name': this.dataForm.name,
            'url': this.dataForm.type === 0 ? '' : this.dataForm.url,
            'taskIds': this.dataForm.type === 0 ? '' : taskIdsData.join(';'),
            'menuParentList': this.menuParentList.join(','),
            'type': 0,
            'menuType': this.dataForm.menuType,
            'principalId': this.dataForm.type === 0 ? '' : this.dataForm.principalId.join(','),
            'principal': this.dataForm.type === 0 ? '' : principalData.join(','),
            'orderNum': this.dataForm.orderNum
          }
          console.log('params: ', params)
          if (!this.dataForm.id) {
            savaBiInfo(params).then(({ data }) => {
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
            updateBiInfo(params).then(({ data }) => {
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
.menuSelect {
  height: 300px;
  overflow: auto;
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
