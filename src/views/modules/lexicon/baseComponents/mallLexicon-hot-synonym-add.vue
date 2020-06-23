<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>选择及添加词组里的Query</div>
      <div class="el-transfer" style="text-align: center">
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-left">
          <left-transfer-hot
            ref="leftTransfer"
            :placeholder="'请输入内容'"
            clearable
            @searchName="searchNameChange"
          >
          <div slot="header" class="hot-header">
            选择： <span>该Query搜索到的产品数量：<b>{{num}}</b>个</span>
          </div>
          </left-transfer-hot>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" @click.native="addToRight" size="mini">
            添加至>
          </el-button>
        </div>
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-right">
          <right-transfer
            :has-table-sort="true"
            :has-footer="true"
            :data="rightData"
            @dataChange="tableDataChange"
          >
            <p class="right-footer" slot="footer">
              目前已选中<span> {{this.rightData.length}} </span>条
            </p>
          </right-transfer>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import leftTransferHot from '../components/leftTransferHot'
import rightTransfer from '../components/rightTransfer'
import { searchKeyword } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      num: 0,
      leftData: [],
      rightData: [],
      leftChecked: [],
      nameWord: '',
      needType: {
        needProductName: 1,
        needBrandName: 1,
        needCategoryName: 1
      }
    }
  },
  components: { leftTransferHot, rightTransfer },
  computed: {
    searchWords () {
      if (!this.rightData.length) {
        return {
          checkedLen: 0,
          msg: '请至少从左侧选择一个Query，添加至右侧!',
          list: []
        }
      }
      let checkedArr = this.rightData.filter(item => item.id.split('*')[0] !== 'manual')
      let allArr = []
      this.rightData.forEach(item => {
        allArr.push(item.name)
      })
      return {
        checkedLen: checkedArr.length,
        msg: '请至少从左侧选择一个Query，添加至右侧!',
        list: allArr
      }
    }
  },
  methods: {
    searchNameChange (name) { // 搜索词改变时
      this.nameWord = name
      this.getWordNum()
    },
    getWordNum () { // 获取query的数量
      searchKeyword({
        keyword: this.nameWord
      }).then(({data}) => {
        console.log(data)
        this.$refs.leftTransfer.loadDataCompleted()
        if (data.code !== 0) {
          this.num = 0
        } else {
          this.num = data.data
        }
      })
    },
    addToRight () { // 添加到右侧
      if (!this.nameWord.trim().length) return
      let isOnRight = this.rightData.filter(ritem => ritem.name.toLowerCase() === this.nameWord.toLowerCase()).length
      if (!isOnRight) {
        this.rightData.push({
          name: this.nameWord,
          id: this.nameWord
        })
      }
    },
    tableDataChange (data) { // 右侧数据改变时，同步数据
      this.rightData = data
    },
    initData () { // 初始化数据
      this.$refs.leftTransfer.nameWord = ''
      this.leftData = []
      this.rightData = []
    }
  }
}
</script>
<style>
  @import '../assets/style/add-base.css';
  .hot-header {
    color: #606266;
  }
  .hot-header span {
    float: right;
    padding-right:10px;
  }
  .hot-header b {
    color: red;
  }
</style>
