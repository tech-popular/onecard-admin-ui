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
      :default-expand-all="false"
      :filter-node-method="filterNode"
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
        return data.name.indexOf(value) !== -1
      }
    }
  }
</script>
