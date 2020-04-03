<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>目前词组里的Query</div>
      <el-card shadow="never" class="query-card-content">
        <el-form inline>
          <el-form-item>
            <el-select
              v-model="selectedQuery"
              filterable
              remote
              multiple
              :remote-method="remoteMethod"
              :loading="loading"
              placeholder="请输入搜索内容查询数据"
              style="width: 500px"
              @visible-change="visibleChange"
            >
              <template v-for="group in queryList">
                <el-option-group
                  v-if="group.list.length > 0"
                  :key="group.name"
                  :label="queryTitleList[group.name]">
                  <el-option
                    v-for="(item, index) in group.list"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-option-group>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addQuery" size="small">确定</el-button>
          </el-form-item>
        </el-form>
        <query-tag-list :data="dynamicQuery" @tagChange="tagChangeEvent" @multiAdd="multiAddClick"></query-tag-list>
      </el-card>
      <query-table-list :data="tableData" :is-sort="true" @dataChange="tableDataChangeClick"></query-table-list>
    </div>
  </div>
</template>
<script>
import queryTagList from '../components/queryTagList'
import queryTableList from '../components/queryTableList'
import { getBrandNamesAndCategoryNames } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      loading: false,
      queryList: [],
      dynamicQuery: [],
      tableData: [],
      tableDataChecked: [],
      selectedQuery: [], // 下拉选中的内容
      query: '', // 搜索词
      queryTitleList: {
        bandNames: '商品品牌',
        categoryNames: '商品分类',
        productNames: '商品名称'
      }
    }
  },
  components: { queryTagList, queryTableList },
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
    init () {
      this.tableData = []
      this.data.forEach(item => {
        this.tableData.push({
          name: item
        })
      })
    },
    remoteMethod (query) {
      this.query = query
      if (query !== '') {
        this.loading = true
        this.getNamesList(query)
      }
    },
    getNamesList (nameWord) {
      let params = {
        nameWord: nameWord,
        needProductName: 1,
        needBrandName: 1,
        needCategoryName: 1
      }
      getBrandNamesAndCategoryNames(params).then(({data}) => {
        this.loading = false
        if (data.code !== 0) {
          this.queryList = []
        } else {
          let arr = []
          for (let item in data.data) {
            if (data.data[item] !== null) {
              let list = Array.from(new Set(data.data[item])).map(citem => {
                return citem
              })
              arr.push({
                name: item,
                list: list
              })
            }
          }
          this.queryList = arr
        }
      })
    },
    visibleChange (flag) {
      if (flag && this.query === '') {
        this.queryList = []
      }
    },
    tagChangeEvent (data) { // tag发生改变时，同步数据
      this.dynamicQuery = data
    },
    addQuery () { // 手动添加query
      this.selectedQuery.forEach(item => {
        let isHas = this.dynamicQuery.filter(ditem => ditem.toLowerCase() === item.toLowerCase()).length
        if (isHas === 0) {
          this.dynamicQuery.push(item)
        }
      })
      this.selectedQuery = []
      this.query = ''
    },
    multiAddClick () { // 批量新增至以下词组中
      this.dynamicQuery.forEach(item => {
        // 判断上面手动添加的数据是否已经存在于表格中，不存在时再添加至表格，已存在则不添加
        let isInArray = this.tableData.filter(ritem => ritem.name.toLowerCase() === item.toLowerCase()).length
        if (isInArray === 0) { // 不存在
          this.tableData.push({
            name: item
          })
        }
      })
      this.dynamicQuery = []
    },
    tableDataChangeClick (data) { // 表格数据改变时
      this.tableData = data
    }
  }
}
</script>
<style scoped>
  @import "../assets/style/update-base.css";
</style>
