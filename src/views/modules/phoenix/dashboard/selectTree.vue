<template>
	<el-select 
		class="ld-select"
		clearable
		:value="valueTitle"
		filterable
		:filter-method="remoteMethod"
		@clear="clearHandle"
		placeholder="请输入"
		popper-class="ld-select_tree-drop"
		@focus="changeDefaultCheck"
	>
    <el-option style="padding: 0 23px" v-if="ifTrue" :value="valueTitle">
      <el-checkbox v-model="checked" @change="allSelect">全选</el-checkbox>
    </el-option>
		<el-option :value="valueTitle">
			<el-tree 
				show-checkbox
				accordion
				node-key="name"
				ref="selectTree"
				:data="options"
				:props="defaultProps"
        @check="checkNode"
				:default-checked-keys="defaultCheckNodes"
				:filter-node-method="filterNode">
			</el-tree>
		</el-option>
	</el-select>
</template>
<script>
export default {
  name: 'el-tree-select',
  props: {
    optionIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Array, // 必须是树形结构的对象数组
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          value: 'name', // ID字段名
          label: 'name', // 显示名称
          children: 'children' // 子级字段名
        }
      }
    },
    value: {
      type: Number,
      default: () => {
        return null
      }
    },
    defaultCheckNodes: {
      type: Array, // 已经分配的资源
      default: () => {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      valueTitle: this.defaultCheckNodes.join(','),
      chooseNodes: [],
      checkedKeys: [],
      checked: false,
      ifTrue: true
    }
  },
  watch: {
    defaultCheckNodes (newVal) {
      this.ifTrue = true
      this.valueTitle = newVal.join(',')
    }
  },
  created () {
    this.initHandle()
  },
  methods: {
    changeDefaultCheck () { // 改变默认选中的时候 子级未全选父级全选状态的问题(改为半选)
      const defaultNodes = this.$refs.selectTree.getCheckedNodes()
      defaultNodes.map((item) => {
        if (item.childList && item.childList.length > 0) {
          const currentNodes = this.$refs.selectTree.getNode(item)
          this.changeParentStatus(currentNodes)
        }
      })
    },
    initHandle () {
      this.chooseNodes = []
    },
    uniteChildSame (treeList, isSelected) {
      this.$refs.selectTree.setChecked(treeList.id, isSelected)
      if (treeList.childList !== null) {
        for (let i = 0; i < treeList.childList.length; i++) {
          this.uniteChildSame(treeList.childList[i], isSelected)
        }
      }
    },
    selectedParent (currentObj) {
      const currentNode = this.$refs.selectTree.getNode(currentObj)
      if (currentNode.parent.key) {
        const childCheckedStatus = currentNode.parent.childNodes.every((item, index) => {
          return item.checked === true
        })
        if (childCheckedStatus) {
          this.$refs.selectTree.setChecked(currentNode.parent, true)
        } else {
          currentNode.parent.indeterminate = true
        }
        this.selectedParent(currentNode.parent)
      }
    },
    changeParentAndChild (currentObj) {
      const currentNode = this.$refs.selectTree.getNode(currentObj)
      if (currentNode.childNodes.length > 0) { // 被取消的如果有子  则走uniteChildSame方法去取消所有的子的选中状态
        this.uniteChildSame(currentObj, false)
      }
      if (currentNode.parent.key) {
        this.changeParentStatus(currentNode.parent)
      }
    },
    changeParentStatus (parentNodes) { // 取消子以后改变父  然后继续看父的父应该的状态
      const childNodes = parentNodes.childNodes
      const childCheckedStatus = childNodes.every((item, index) => { // 子全部未选中
        return item.checked === false && item.indeterminate === false
      })
      const childCheckedAllChecked = childNodes.every((item, index) => { // 字全部完全选中
        return item.checked === true
      })
      if (childCheckedStatus) {
        parentNodes.checked = false
        parentNodes.indeterminate = false
      }
      if (childCheckedAllChecked) {
        parentNodes.checked = true
        parentNodes.indeterminate = false
      }
      if (!childCheckedStatus && !childCheckedAllChecked) {
        parentNodes.checked = false
        parentNodes.indeterminate = true
      }
      if (parentNodes.parent.key) {
        const parentNode = parentNodes.parent
        this.changeParentStatus(parentNode)
      }
    },
    clearHandle () {
      this.valueTitle = ''
      this.ifTrue = true
      this.remoteMethod(this.valueTitle)
      this.$emit('checkNode', [], this.index)
    },
    remoteMethod (val) {
      this.ifTrue = true
      this.valueTitle = val
      this.$refs.selectTree.filter(val)
    },
    filterNode (value, data) { // 2019/04/10 删除自定义的过滤
      if (!value) return true
      this.ifTrue = false
      return data.name.indexOf(value) !== -1
    },
    // 是否全选
    allSelect (type) {
      if (type) {
        this.valueTitle = this.optionIds.join(',')
        this.$refs.selectTree.setCheckedKeys(this.optionIds)
        this.$emit('checkNode', this.optionIds, this.index)
      } else {
        this.valueTitle = ''
        this.$refs.selectTree.setCheckedKeys([])
        this.$emit('checkNode', [], this.index)
      }
    },
    checkNode (node, checked) {
      const hadCheckedKeys = checked.checkedNodes
      this.checkedKeys = []
      for (let i = 0; i < hadCheckedKeys.length; i++) {
        if (!hadCheckedKeys[i].children) {
          this.checkedKeys.push(hadCheckedKeys[i].name)
        }
      }
      if (this.checkedKeys.length == this.optionIds.length) {
        this.checked = true
      } else if (this.checkedKeys.length !== this.optionIds.length) {
        this.checked = false
      }
      this.valueTitle = this.checkedKeys.join(',')
      this.$emit('checkNode', this.checkedKeys, this.index)
    }
  }
}
</script>

<style scoped>
	.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
		height: auto;
		padding: 0;
	}
	.el-select-dropdown__item.selected {
		font-weight: normal;
	}
	ul li>>>.el-tree .el-tree-node__content {
		height: auto;
	}
	.el-tree-node__label {
		font-weight: normal;
	}
	.el-tree>>>.is-current .el-tree-node__label {
		color: #409EFF;
		font-weight: 700;
	}
	.el-tree>>>.is-current .el-tree-node__children .el-tree-node__label {
		color: #606266;
		font-weight: normal;
	}
	.ld-select_tree {
		text-align: right;
		padding-right: 20px;
		position: absolute;
		bottom: 10px;
		right: -4px;
	}
</style>
<style lang="scss">
	.ld-select {
		.el-input__icon {
			line-height: 32px!important;
		}
	}
</style>
