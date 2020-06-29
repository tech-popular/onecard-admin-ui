<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="880px"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-radio-group v-model="dataForm.menuPermission" @change="paneTypeChange">
          <el-radio label="3">数据服务版块</el-radio>
          <el-radio label="6">系统管理版块</el-radio>
          <el-radio label="9">数语系统版块</el-radio>
          <el-radio label="10">BI系统版块</el-radio>
        </el-radio-group>
        <user-permission-tree ref="userPermissionTree" :menu-list="menuList"></user-permission-tree>
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-radio label="1" v-model="dataForm.status">正常</el-radio>
        <el-radio label="2" v-model="dataForm.status">冻结</el-radio>
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
  import userPermissionTree from './user-permission-tree'
  export default {
    components: { userPermissionTree },
    data () {
      return {
        visible: false,
        roleList: [],
        menuList: [],
        dataForm: {
          id: 0,
          roleName: '',
          menuPermission: '3',
          status: '1',
          mark: ''
        },
        dataRule: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择角色状态', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (val) {
        console.log(val)
        if (!val || !val.id) {
          this.dataForm.id = ''
          this.dataForm.roleName = ''
          this.dataForm.status = '1'
          this.dataForm.mark = ''
        } else {
          this.dataForm.id = val.id
        }
        this.getMenuList()
      },
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
              url: this.$http.adornUrl(`/sys/role/info/1`), // ${this.dataForm.id}
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName
                this.dataForm.remark = data.role.remark
                var idx = data.role.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                }
                this.$refs.userPermissionTree.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          }
        })
      },
      paneTypeChange (val) { // 切换系统时
        console.log(val)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(89)
          }
        })
      }
    }
  }
</script>
