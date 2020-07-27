<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="880px"
    :visible.sync="visible">
    <div v-loading="loadFlag">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder="姓名" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="用户名" readonly disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-tag v-for="(item, index) in email" :key="index" type="primary" style="margin:2px">{{item}}</el-tag>
          <!-- <el-input v-model="dataForm.email" placeholder="邮箱" style="width:100%;margin-right: 2%;" disabled></el-input> -->
          <el-input v-model="dataForm.emailList" placeholder="输入多个邮箱','隔开" style="margin-top: 2%;" @change='inputblur'/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dataForm.mobile" placeholder="手机号" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工工号" prop="jobnumber">
          <el-input v-model="dataForm.jobnumber" placeholder="员工工号" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="dataForm.department" placeholder="部门" disabled></el-input>
        </el-form-item>
        <el-form-item label="阿里云账号" prop="mcAccount">
          <el-input v-model="dataForm.mcAccount" @input="change($event)" placeholder="阿里云账号"/>
        </el-form-item>
        <el-form-item label="所属租户" prop="tenantIds">
          <el-select v-model="dataForm.tenantIds" placeholder="所属租户" multiple filterable style="width: 100%;">
            <el-option
              v-for="item in tenantList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" placeholder="功能角色" multiple filterable style="width: 100%;">
            <el-option
              v-for="item in funcRoleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人权限">
          <el-tabs v-model="userPermissionActiveName" type="card">
            <el-tab-pane label="功能权限" name="systemPlateId"></el-tab-pane>
            <!-- <el-tab-pane label="数据权限" name="dataPermission"></el-tab-pane> -->
          </el-tabs>
          <!-- <el-radio-group v-model="dataForm.systemPlateId" @change="funcTypeChange" v-if="userPermissionActiveName === 'systemPlateId'">
            <el-radio :label="item.menuId" v-for="(item, index) in plateList" :key="index">{{item.name}}</el-radio>
          </el-radio-group> -->
          <!-- <user-func-permission ref="userFuncPermission" :menu-list="menuList"></user-func-permission> -->
          <!-- <el-radio-group v-model="dataForm.dataPermission" @change="dataTypeChange" v-if="userPermissionActiveName === 'dataPermission'">
            <el-radio label="MaxCompute">MaxCompute</el-radio>
            <el-radio label="Hive">Hive</el-radio>
          </el-radio-group> -->
          <div v-loading="loadMenuFlag">
            <user-permission-tree ref="userPermissionTree" :menu-list="menuList"></user-permission-tree>
          </div>
        </el-form-item>
        <el-form-item label="账户状态" prop="flag">
          <el-radio :label="0" v-model="dataForm.flag">正常</el-radio>
          <el-radio :label="1" v-model="dataForm.flag">冻结</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入"
            maxlength="200"
            show-word-limit
            v-model="dataForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import { checkUserName, checkMobile, ifExistUser } from '@/api/account'
  import userPermissionTree from './user-permission-tree'
  import { selectAllTenantDown } from '@/api/sys/tenant'
  import { getAllRoleList } from '@/api/sys/role'
  import { getUserInfoById, saveUserInfo, updateUserInfo } from '@/api/sys/user'
  import { getMenuAll } from '@/api/sys/menu'
  // import userDataPermission from './user-data-permission'
  export default {
    components: { userPermissionTree },
    data () {
      return {
        visible: false,
        loadFlag: false,
        loadMenuFlag: false,
        roleList: [],
        menuList: [],
        plateList: [],
        dataForm: {
          id: 0,
          name: '',
          userName: '',
          ismodifyPasswd: '',
          mobile: '',
          mcAccount: '',
          department: '',
          tenantIds: [],
          roleIds: [],
          // systemPlateId: '',
          remark: '',
          // dataPermission: 'MaxCompute',
          flag: 0
        },
        email: [],
        systenantList: [],
        jieshouren: [],
        emailGroup: [],
        tenantList: [],
        funcRoleOptions: [],
        userPermissionActiveName: 'systemPlateId',
        dataRule: {
          tenantIds: [
            { required: true, message: '请选择租户', trigger: 'change' }
          ],
          roleIds: [
            { required: true, message: '请选择功能角色', trigger: 'change' }
          ],
          flag: [
            { required: true, message: '请选择账户状态', trigger: 'change' }
          ]
          // systemPlateId: [
          //   { required: true, message: '请选择个人权限', trigger: 'change' }
          // ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (val) {
        this.loadFlag = true
        this.email = val.emailList
        this.dataForm.id = val.id
        this.dataForm.userid = val.userid
        this.getTenantList()
        this.getRoleSelectList()
        // this.getPlateList()
        this.getMenuList()
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs['dataForm'].clearValidate()
        })
      },
      getUserInfo () {
        getUserInfoById(this.dataForm.id).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.name = data.user.user.name
            this.dataForm.userName = data.user.user.username
            this.dataForm.mobile = data.user.user.mobile
            this.dataForm.mcAccount = data.user.mcAccount
            this.dataForm.department = data.user.department
            this.dataForm.tenantIds = data.user.tenantIds || []
            this.dataForm.roleIds = data.user.roleIds || []
            this.dataForm.flag = data.user.user.flag
            this.dataForm.remark = data.user.user.remark
            // if (data.user.oaUserMenus && data.user.oaUserMenus.systemPlateId) {
            //   this.dataForm.systemPlateId = data.user.oaUserMenus.systemPlateId
            // }
            this.$nextTick(() => {
              if (data.user.oaUserMenus && data.user.oaUserMenus.menuIdList) {
                var idx = data.user.oaUserMenus.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.user.oaUserMenus.menuIdList.splice(idx, data.user.oaUserMenus.menuIdList.length - idx)
                }
                this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys(data.user.oaUserMenus.menuIdList)
              } else {
                this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys([])
              }
            })
          } else {
            this.$message.error(data.msg || '获取数据异常')
          }
          this.loadFlag = false
        })
      },
      getTenantList () { // 租户下拉列表
        selectAllTenantDown().then(({data}) => {
          if (data && data.code === 0) {
            this.tenantList = data.data
          } else {
            this.tenantList = []
          }
        })
      },
      getRoleSelectList () { // 功能角色下拉选
        getAllRoleList().then(({data}) => {
          if (data && data.code === 0) {
            this.funcRoleOptions = data.list
          } else {
            this.funcRoleOptions = []
          }
        })
      },
      // getPlateList () { // 获取所有版块
      //   getPlateList().then(({data}) => {
      //     this.plateList = []
      //     if (data && data.code === 0) {
      //       this.plateList = data.menuList
      //       this.dataForm.systemPlateId = this.plateList[0].menuId
      //     } else {
      //       this.plateList = []
      //       this.dataForm.systemPlateId = ''
      //       this.$message({
      //         type: 'error',
      //         message: data.msg || '获取数据异常'
      //       })
      //     }
      //     console.log(this.dataForm.systemPlateId)
      //     this.getMenuList()
      //   })
      // },
      getMenuList () { // 获取版块下的菜单
        this.loadMenuFlag = true
        getMenuAll().then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
          this.getUserInfo()
          this.$nextTick(() => {
            this.loadMenuFlag = false
          })
        })
      },
      // 功能权限切换系统
      // funcTypeChange (val) {
      //   console.log(val)
      //   this.getMenuList()
      // },
      // 数据权限切换系统
      dataTypeChange (val) {
        console.log(val)
      },
      change (e) {
        this.$forceUpdate()
      },
      inputblur (value) {
        var activityList = [value]
        this.emailGroup = activityList
      },
      midifyflag () {
        this.dataForm.ismodifyPasswd = 'modify'
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let url = saveUserInfo
            if (this.dataForm.id) {
              url = updateUserInfo
            }
            let menuIdList = [].concat(this.$refs.userPermissionTree.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.userPermissionTree.$refs.menuListTree.getHalfCheckedKeys())
            // if (!menuIdList.length) {
            //   return this.$message.error('请选择菜单！')
            // }
            let params = {
              'userId': this.dataForm.userid || undefined,
              'username': this.dataForm.username,
              'emailList': this.emailGroup,
              'mcAccount': this.dataForm.mcAccount,
              'tenantIds': this.dataForm.tenantIds,
              'roleIds': this.dataForm.roleIds,
              'remark': this.dataForm.remark,
              'oaUserMenus': {
                // 'systemPlateId': this.dataForm.systemPlateId,
                'menuIdList': menuIdList
              },
              'flag': this.dataForm.flag
            }
            url(params).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            this.dataForm.ismodifyPasswd = ''
          }
        })
      },
      async checkIfUsername () {
        const data = {
          username: this.dataForm.userName
        }
        let res = await new Promise(resolve => {
          checkUserName(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      },
      async checkIfMobile () {
        let res = await new Promise(resolve => {
          const data = {
            mobile: this.dataForm.mobile
          }
          checkMobile(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      },
      async checkIfInIdap () {
        const data = {
          username: this.dataForm.userName
        }
        let res = await new Promise(resolve => {
          ifExistUser(data).then(({data}) => {
            if (data && data.code == 0) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        return res
      }
    }
  }
</script>
