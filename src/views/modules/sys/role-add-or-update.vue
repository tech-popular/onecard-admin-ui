<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="880px"
    :visible.sync="visible">
    <div v-loading="loadFlag">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="systemPlateId">
          <el-radio-group v-model="dataForm.systemPlateId" @change="paneTypeChange">
            <el-radio :label="item.menuId" v-for="(item, index) in plateList" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
          <div v-loading="loadMenuFlag">
            <user-permission-tree ref="userPermissionTree" :menu-list="menuList"></user-permission-tree>
          </div>
        </el-form-item>
        <el-form-item label="角色状态" prop="flag">
          <el-radio :label="0" v-model="dataForm.flag">正常</el-radio>
          <el-radio :label="1" v-model="dataForm.flag">冻结</el-radio>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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
      <el-button type="primary" @click="dataFormSubmit()" :disabled="enable">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import userPermissionTree from './user-permission-tree'
  import { getPlateList, getMenuList } from '@/api/sys/menu'
  import { getRoleInfo, updateRoleInfo, saveRoleInfo } from '@/api/sys/role'
  export default {
    components: { userPermissionTree },
    data () {
      return {
        visible: false,
        loadMenuFlag: false,
        loadFlag: false,
        enable: false,
        menuList: [],
        plateList: [],
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          systemPlateId: '',
          flag: 0
        },
        dataRule: {
          systemPlateId: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '请选择角色状态', trigger: 'change' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (val) {
        this.loadFlag = true
        if (!val || !val.roleId) {
          this.dataForm.id = ''
          this.dataForm.roleName = ''
          this.dataForm.flag = 0
          this.dataForm.remark = ''
          this.dataForm.systemPlateId = ''
          this.menuList = []
          this.plateList = []
          this.getPlateList()
        } else {
          this.dataForm.id = val.roleId
          this.getRoleInfo()
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys([])
        })
      },
      getPlateList () { // 获取所有版块
        getPlateList().then(({data}) => {
          this.plateList = []
          if (data && data.code === 0) {
            this.plateList = data.menuList
            this.dataForm.systemPlateId = this.plateList[0].menuId
          } else {
            this.plateList = []
            this.dataForm.systemPlateId = ''
            this.$message({
              type: 'error',
              message: data.msg || '获取数据异常'
            })
          }
          this.getMenuList()
        })
      },
      getMenuList () { // 获取版块下的菜单
        getMenuList(this.dataForm.systemPlateId).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
          console.log(this.menuList)
          this.$nextTick(() => {
            this.loadFlag = false
            this.loadMenuFlag = false
          })
        })
      },
      getRoleInfo () {
        getRoleInfo(this.dataForm.id).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.roleName = data.role.roleName
            this.dataForm.remark = data.role.remark
            this.dataForm.flag = data.role.flag
            this.dataForm.systemPlateId = data.role.systemPlateId
            var idx = data.role.menuIdList.indexOf(this.tempKey)
            if (idx !== -1) {
              data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
            }
            this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
          }
          this.getPlateList()
        })
      },
      paneTypeChange (val) { // 切换系统时
        this.loadMenuFlag = true
        this.getMenuList()
      },
      // 表单提交
      dataFormSubmit () {
        this.enable = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let url = saveRoleInfo
            if (this.dataForm.id) {
              url = updateRoleInfo
            }
            let menuIdList = [].concat(this.$refs.userPermissionTree.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.userPermissionTree.$refs.menuListTree.getHalfCheckedKeys())
            if (!menuIdList.length) {
              return this.$message.error('请选择菜单！')
            }
            url({
              'roleId': this.dataForm.id || undefined,
              'roleName': this.dataForm.roleName,
              'systemPlateId': this.dataForm.systemPlateId,
              'remark': this.dataForm.remark,
              'flag': this.dataForm.flag,
              'menuIdList': menuIdList
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.enable = false
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.enable = false
              }
            })
          }
        })
      }
    }
  }
</script>
