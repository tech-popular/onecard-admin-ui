<template>
  <div>
    <el-input
      placeholder="搜索"
      v-model="filterText">
    </el-input>
    <el-tree
      show-checkbox
      :data="menuList"
      :props="menuListTreeProps"
      node-key="menuId"
      ref="menuListTree"
      :default-expand-all="true"
      :filter-node-method="filterNode"
      @check="getCheckedNodes"
    >
    </el-tree>
  </div>
</template>
<script>
  export default {
    props: {
      menuList: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        paneType: 3,
        filterText: '',
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.menuListTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getCheckedNodes (curNode, treeCheckedNodes) { // 获取当前节点对应的对象，树目前选中的所有对象
        console.log(curNode, treeCheckedNodes)
      }
    }
  }
</script>
