<template>
  <el-dialog :title="id ? '修改权限' : ' 配置权限'" width="700px" :close-on-click-modal="false" :visible.sync="visible">
    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入搜索内容" v-model="userGroupId" :titles="['全部', '选中']" :data="data"></el-transfer>
  </el-dialog>
</template>

<script>
import { biUserGroupList, authUserGroup } from '@/api/dataGovernance/datasourceManage'
export default {
  data () {
    return {
      visible: false,
      dataSourceId: '',
      data: [],
      userGroupId: []
    }
  },
  methods: {
    init (row) {
      this.dataSourceId = row.id
      biUserGroupList().then(({ data }) => {
        console.log('data: ', data);
      })
      this.visible = true
    },
    filterMethod (query, item) {
      return item.pinyin.indexOf(query) > -1
    }
  }
}
</script>