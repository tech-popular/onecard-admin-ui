<template>
  <el-dialog :title="datasourceId ? '修改权限' : ' 配置权限'" width="700px" :close-on-click-modal="false" :visible.sync="visible">
    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入搜索内容" v-model="userGroupId" :titles="['全部', '选中']" :data="transferData ">
      <span slot-scope="{ option }">{{ option.label }}</span>
    </el-transfer>
    <span slot="footer">
      <el-button @click="datano()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { biUserGroupList, authUserGroup } from '@/api/dataGovernance/datasourceManage'
export default {
  data () {
    return {
      visible: false,
      datasourceId: '',
      transferData: [],
      userGroupId: []
    }
  },
  methods: {
    init (row) {
      this.datasourceId = row.id
      let userGroupIdData = row.userGroupIds ? row.userGroupIds.split(',') : []
      this.userGroupId = userGroupIdData.map(item => { return +item })
      this.transferData = []
      biUserGroupList().then(({ data }) => {
        if (data.code === 0) {
          const allData = data.data
          allData.forEach(element => {
            // if ()
            this.transferData.push({
              key: element.id,
              label: element.name
            })
          })
        } else {
          this.transferData = []
          this.$message.error(data.msg || '表字段查询失败')
        }
      })
      this.visible = true
    },
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    // 表单提交
    dataFormSubmit () {
      let params = {
        'userGroupId': this.userGroupId.length ? this.userGroupId.join(',') : '',
        'datasourceId': this.datasourceId.toString()
      }
      authUserGroup(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 300,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message({
            message: data.msg || '数据异常',
            type: 'error'
          })
        }
      })
    },
    datano () {
      this.visible = false
    }
  }
}
</script>