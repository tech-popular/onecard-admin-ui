<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>目前词组里的Query</div>
      <el-card shadow="never" class="query-card-content">
        <el-form inline>
          <el-form-item class="item-form">
            <el-input
              clearable
              v-model="query"
              placeholder="请输入搜索内容查询数据"
              style="width: 400px"
              :disabled="tag === 'view'"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="item-form">
            <el-button type="primary" @click="getWordNum" size="small">查询</el-button>
            <span class="tip">该Query搜索到的产品数量：<b>{{num}}</b>个</span>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="button-add">
        <el-button type="primary" @click="addQuery" size="small">新增至以下词组中</el-button>
      </div>
      <query-table-list :data="tableData" :is-sort="true" @dataChange="tableDataChangeClick" :tag="tag"></query-table-list>
    </div>
  </div>
</template>
<script>
import queryTableList from '../components/queryTableList'
// import { getBrandNamesAndCategoryNames } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      num: 0,
      query: '' // 搜索词
    }
  },
  components: { queryTableList },
  props: {
    data: {
      type: Array,
      default: []
    },
    tag: {
      type: String
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
    init () {
      this.tableData = []
      this.data.forEach(item => {
        this.tableData.push({
          name: item
        })
      })
    },
    getWordNum () { // 获取query的数量
      console.log(this.query, 123)
    },
    addQuery () { // 新增至以下词组中
      if (!this.query.trim().length) return
        // 判断上面手动添加的数据是否已经存在于表格中，不存在时再添加至表格，已存在则不添加
      let isInArray = this.tableData.filter(ritem => ritem.name.toLowerCase() === this.query.toLowerCase()).length
      if (isInArray === 0) { // 不存在
        this.tableData.push({
          name: this.query
        })
      }
    },
    tableDataChangeClick (data) { // 表格数据改变时
      this.tableData = data
    }
  }
}
</script>
<style scoped>
  @import "../assets/style/update-base.css";
  .item-form {
    margin-bottom: 0
  }
  .item-form .tip {
    float: right
  }
  .item-form b {
    color: red
  }
  .button-add {
    margin-top: 10px
  }
</style>
