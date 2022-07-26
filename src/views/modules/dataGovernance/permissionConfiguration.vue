<template>
  <el-dialog :title="id ? '修改权限' : ' 配置权限'" :close-on-click-modal="false" :visible.sync="visible">
    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入搜索内容" v-model="value" :titles="['全部', '选中']" :data="data"></el-transfer>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      id: '',
      data: [],
      value: []
    }
  },
  methods: {
    init (row) {
      this.visible = true
    },
    filterMethod (query, item) {
      return item.pinyin.indexOf(query) > -1;
    }
  }
};
</script>