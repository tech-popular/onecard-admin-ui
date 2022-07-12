<template>
  <el-dialog :title="type === 0 ? 'PC端权限分配' : '移动端权限分配'" :close-on-click-modal="false" :visible.sync="visible">
    <div style="margin-bottom: 16px">
      <el-input size="small" clearable placeholder="请输入菜单名称" v-model="search"></el-input>
    </div>
    <el-tree
      :data="dataTree"
      ref="tree"
      :filter-node-method="filterNode"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      v-model="menuIds"
      :default-checked-keys="defaultExpandedKeys"
      @check="checkPermit"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { findAllRecursionList, saveRoleInfo, getRoleMenuList } from '@/api/BI-Manager/userGroup'
export default {
  data () {
    return {
      visible: false,
      type: 0,
      userGroupId: 0,
      menuIds: [],
      checkedDataKeys: [],
      halfCheckedDataKeys: [],
      defaultExpandedKeys: [],
      dataTree: [],
      search: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    search (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    init (id, type) {
      this.defaultExpandedKeys = []
      this.checkedDataKeys = []
      this.halfCheckedDataKeys = []
      this.userGroupId = id
      this.type = type
      this.getRecursionList()
      this.getRoleMenuListData()
      this.visible = true
    },

    filterNode (value, data, node) {
      console.log('node: ', node)
      console.log('data: ', data)
      console.log('value: ', value)
      if (!value) return true
      let parentNode = node.parent
      let labels = [node.label]
      let level = 1
      console.log('parentNode: ', parentNode)
      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent
        level++
      }
      return labels.some(label => label.indexOf(value) !== -1)
    },

    getRecursionList () {
      let params = {
        type: this.type
      }
      findAllRecursionList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataTree = data.data
        }
      })
    },
    getRoleMenuListData () {
      let params = {
        userGroupId: this.userGroupId,
        type: this.type
      }
      getRoleMenuList(params).then(({ data }) => {
        if (data && data.code === 0 && data.data.length) {
          data.data.forEach(element => {
            if (element.checkeState === 1) {
              this.defaultExpandedKeys.push(element.menuId)
              this.checkedDataKeys.push(element.menuId)
            } else {
              this.halfCheckedDataKeys.push(element.menuId)
            }
            this.$refs.tree.setCheckedKeys(this.defaultExpandedKeys)
          })
        }
      })
    },
    changeType () {
      this.getRecursionList()
      this.getRoleMenuListData()
    },
    checkPermit (checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) {
      this.checkedDataKeys = checkedKeys.checkedKeys
      this.halfCheckedDataKeys = checkedKeys.halfCheckedKeys
    },
    // 表单提交
    dataFormSubmit () {
      let menuIds = []
      menuIds = this.checkedDataKeys.concat(this.halfCheckedDataKeys)
      let checkData = this.$refs.tree.getCheckedNodes()
      let arr = []
      checkData.forEach(item => {
        if (!item.children.length) {
          arr.push(item.id)
        }
      })
      if (menuIds.length) {
        let params = {
          'menuIds': menuIds.join(','),
          'userGroupId': this.userGroupId,
          'checkedDataKeys': arr.join(','),
          'type': this.type
        }
        saveRoleInfo(params).then(({ data }) => {
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
        this.$message.error('请选择菜单')
      }
    }
  }
}
</script>
