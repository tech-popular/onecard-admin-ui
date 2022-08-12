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
      :default-expand-all="isExpandAll"
      :default-checked-keys="defaultExpandedKeys"
      @check="checkPermit"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closed()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { findAllRecursionList, saveRoleInfo } from '@/api/BI-Manager/userGroup'
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
      isExpandAll: false,
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
      this.search = ''
      this.isExpandAll = false
      this.defaultExpandedKeys = []
      this.checkedDataKeys = []
      this.halfCheckedDataKeys = []
      this.userGroupId = id
      this.type = type
      this.getRecursionList()
      this.visible = true
    },

    filterNode (value, data, node) {
      if (!value) {
        this.toggleExpandAll(false)
        return true
      }
      let parentNode = node.parent
      let labels = [node.label]
      let level = 1
      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent
        level++
      }
      return labels.some(label => label.indexOf(value) !== -1)
    },
    /** 展开/折叠操作 */
    toggleExpandAll (isExpandAll) {
      this.isExpandAll = isExpandAll
      const nodes = this.$refs.tree.store._getAllNodes()
      for (let i in nodes) {
        nodes[i].expanded = isExpandAll
      }
    },
    getRecursionList () {
      let params = {
        type: this.type,
        userGroupId: this.userGroupId
      }
      findAllRecursionList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataTree = data.data
          this.selectAllRecursionList(data.data)
        }
      })
    },
    selectAllRecursionList (recursionList) {
      recursionList && recursionList.forEach((item, index) => {
        if (!item.children.length && item.checkeState === 1) {
          this.defaultExpandedKeys.push(item.id)
          this.checkedDataKeys.push(item.id)
        } else {
          this.selectAllRecursionList(item.children)
        }
        this.$refs.tree.setCheckedKeys(this.defaultExpandedKeys)
      })
    },
    changeType () {
      this.getRecursionList()
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
    },
    closed () {
      this.visible = false
      this.search = ''
      this.toggleExpandAll(false)
    }
  }
}
</script>
