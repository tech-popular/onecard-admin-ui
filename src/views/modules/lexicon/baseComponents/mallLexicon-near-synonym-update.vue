<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>目前词组里的Query</div>
      <el-card shadow="never" class="query-card-content">
        <el-form :model="dataForm" inline ref="dataForm">
          <el-form-item>
            <el-input v-model.trim="dataForm.query" placeholder="手动填入Query名" style="width: 400px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addQuery" size="small">确定</el-button>
          </el-form-item>
        </el-form>
        <query-tag-list :data="dynamicQuery" @tagChange="tagChangeEvent" @multiAdd="multiAddClick"></query-tag-list>
      </el-card>
      <query-table-list :data="tableData" @dataChange="tableDataChangeClick"></query-table-list>
    </div>
  </div>
</template>
<script>
import { findParent } from '../assets/js/utils'
import queryTableList from '../components/queryTableList'
import queryTagList from '../components/queryTagList'
export default {
  data () {
    return {
      dataForm: {
        query: ''
      },
      dynamicQuery: [],
      tableData: []
    }
  },
  components: { queryTableList, queryTagList },
  created () {
    this.data.forEach(item => {
      this.tableData.push({
        name: item
      })
    })
  },
  mounted () {
    this.parent = findParent(this.$parent)
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    searchWords () {
      if (!this.tableData.length) {
        return {
          checkedLen: 0,
          msg: '搜索词不能为空！',
          list: []
        }
      }
      let arr = []
      this.tableData.forEach(item => {
        arr.push(item.name)
      })
      return {
        checkedLen: arr.length,
        list: arr
      }
    }
  },
  methods: {
    tagChangeEvent (data) {
      this.dynamicQuery = data
    },
    addQuery () { // 手动添加query
      let query = this.dataForm.query
      if (query !== '' && !this.dynamicQuery.includes(query)) {
        this.dynamicQuery.push(query)
        this.dataForm.query = ''
      }
    },
    multiAddClick () { // 批量新增至以下词组中
      console.log('批量新增')
      this.dynamicQuery.forEach(item => {
        // 判断上面手动添加的数据是否已经存在于表格中，不存在时再添加至表格，已存在则不添加
        let isInArray = this.tableData.filter(ritem => ritem.name === item).length
        if (isInArray === 0) { // 不存在
          this.tableData.push({
            name: item
          })
        }
      })
      this.dynamicQuery = []
    },
    tableDataChangeClick (data) { // 批量删除
      console.log('批量删除', data)
      this.tableData = data
    }
  }
}
</script>
<style scoped>
  @import "../assets/style/update-base.css";
</style>
