<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="880px"
    :visible.sync="visible">
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
      <el-form-item label="所属租户" prop="tenant">
        <el-select v-model="dataForm.tenant" placeholder="所属租户" multiple filterable style="width: 100%;">
          <el-option
            v-for="item in tenantOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能角色" prop="funcRole">
        <el-select v-model="dataForm.funcRole" placeholder="功能角色" multiple filterable style="width: 100%;">
          <el-option
            v-for="item in funcRoleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人权限">
        <el-tabs v-model="userPermissionActiveName" type="card">
          <el-tab-pane label="功能权限" name="funcPermission"></el-tab-pane>
          <el-tab-pane label="数据权限" name="dataPermission"></el-tab-pane>
        </el-tabs>
        <el-radio-group v-model="dataForm.funcPermission" @change="funcTypeChange" v-if="userPermissionActiveName === 'funcPermission'">
          <el-radio :label="3">数据服务版块</el-radio>
          <el-radio :label="6">系统管理版块</el-radio>
          <el-radio :label="9">数语系统版块</el-radio>
          <el-radio :label="10">BI系统版块</el-radio>
        </el-radio-group>
        <!-- <user-func-permission ref="userFuncPermission" :menu-list="menuList"></user-func-permission> -->
        <el-radio-group v-model="dataForm.dataPermission" @change="dataTypeChange" v-if="userPermissionActiveName === 'dataPermission'">
          <el-radio label="MaxCompute">MaxCompute</el-radio>
          <el-radio label="Hive">Hive</el-radio>
        </el-radio-group>
        <user-permission-tree ref="userPermissionTree" :menu-list="menuList"></user-permission-tree>
      </el-form-item>
      <el-form-item label="账户状态" prop="accountStatus">
        <el-radio label="1" v-model="dataForm.accountStatus">正常</el-radio>
        <el-radio label="2" v-model="dataForm.accountStatus">冻结</el-radio>
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入"
          maxlength="200"
          show-word-limit
          v-model="dataForm.mark">
        </el-input>
      </el-form-item>
    </el-form>
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
  // import userDataPermission from './user-data-permission'
  export default {
    components: { userPermissionTree },
    data () {
      return {
        visible: false,
        roleList: [],
        menuList: [],
        dataForm: {
          id: 0,
          userName: '',
          ismodifyPasswd: '',
          mobile: '',
          mcAccount: '',
          department: '',
          tenant: '',
          funcPermission: '3',
          dataPermission: 'MaxCompute',
          accountStatus: '1',
          mark: ''
        },
        email: [],
        systenantList: [],
        jieshouren: [],
        emailGroup: [],
        tenantOptions: [ // 租户列表
          {
            id: '1',
            label: '租户1'
          },
          {
            id: '2',
            label: '租户2'
          }
        ],
        funcRoleOptions: [ // 功能角色列表
          {
            id: '1',
            label: '角色1'
          },
          {
            id: '2',
            label: '角色2'
          }
        ],
        userPermissionActiveName: 'funcPermission',
        dataRule: {
          tenant: [
            { required: true, message: '请选择租户', trigger: 'change' }
          ],
          funcRole: [
            { required: true, message: '请选择功能角色', trigger: 'change' }
          ],
          accountStatus: [
            { required: true, message: '请选择功能角色', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (val) {
        this.email = val.emailList
        this.dataForm.id = val.id
        this.dataForm.userid = val.userid
        this.getMenuList()
        // // 数据权限列表
        // this.$http({
        //   url: this.$http.adornUrl(`/sys/systenant/nonullselect`),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.systenantList = data.sysTenantEntities
        //   }
        // })
        // this.$http({
        //   url: this.$http.adornUrl('/sys/role/select'),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({data}) => {
        //   this.roleList = data && data.code === 0 ? data.list : []
        // }).then(() => {
        //   this.visible = true
        //   this.$nextTick(() => {
        //     this.$refs['dataForm'].resetFields()
        //     this.$refs['dataForm'].clearValidate()
        //   })
        // }).then(() => {
        //   if (this.dataForm.id) {
        //     this.$http({
        //       url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
        //       method: 'get',
        //       params: this.$http.adornParams()
        //     }).then(({data}) => {
        //       if (data && data.code === 0) {
        //         this.dataForm = data.user.user
        //         this.dataForm.userName = data.user.user.username
        //         this.dataForm.mobile = data.user.user.mobile
        //         this.dataForm.mcAccount = data.user.mcAccount
        //         this.dataForm.department = data.user.department
        //       }
        //     })
        //   }
        // })
      },
      // 获取权限列表
      getMenuList () {
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.user.user
                this.dataForm.userName = data.user.user.username
                this.dataForm.mobile = data.user.user.mobile
                this.dataForm.mcAccount = data.user.mcAccount
                this.dataForm.department = data.user.department
              }
            })
          }
        })
      },
      // 功能权限切换系统
      funcTypeChange (val) {
        console.log(val)
      },
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
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userid || undefined,
                'username': this.dataForm.username,
                'emailList': this.emailGroup,
                'mcAccount': this.dataForm.mcAccount
              })
            }).then(({data}) => {
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
