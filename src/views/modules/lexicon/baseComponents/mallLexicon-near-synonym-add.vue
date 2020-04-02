<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>选择及添加词组里的Query</div>
      <div class="el-transfer" style="text-align: center">
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-left">
          <left-transfer
            ref="leftTransfer"
            :placeholder="'请输入内容'"
            :filterable='true'
            :has-footer="true"
            :data="leftData"
            :selected-type="dataForm.query"
            @checkChange="leftCheckChange"
            @searchName="searchNameChange"
          >
            <div slot="header">
              <el-form inline :model="dataForm" :rules="dataRules" class="transfer-form">
              <el-form-item label="选择:" prop="query">
                <el-radio-group v-model="dataForm.query" size="mini" @change="queryTypeChange">
                  <!-- <el-radio-button label="needProductName">商品名称</el-radio-button> -->
                  <el-radio-button label="needCategoryName">商品分类</el-radio-button>
                  <el-radio-button label="needBrandName">商品品牌</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
            </div>
            <div class="left-footer" slot="footer">
              手动添加：<el-input v-model="dataForm.name" placeholder="请输入Query名" size="mini" style="width:200px;display:inline-block"/>
            </div>
          </left-transfer>
        </div>
        <div class="el-transfer__buttons">
          <el-button type="primary" @click.native="addToRight" size="mini">
            添加至>
          </el-button>
        </div>
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-right">
          <right-transfer
            :has-table-sort="false"
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
import leftTransfer from '../components/leftTransfer'
import rightTransfer from '../components/rightTransfer'
import { getBrandNamesAndCategoryNames } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      leftData: [],
      rightData: [],
      dataForm: {
        query: '',
        name: ''
      },
      dataRules: {
        query: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      leftChecked: [],
      nameWord: '',
      needType: {
        needProductName: 1,
        needBrandName: 1,
        needCategoryName: 1
      }
    }
  },
  components: { leftTransfer, rightTransfer },
  computed: {
    searchWords () {
      if (!this.rightData.length) {
        return {
          checkedLen: 0,
          msg: '请至少从左侧选择一个Query!',
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
        msg: '请至少从左侧选择一个Query!',
        list: allArr
      }
    }
  },
  methods: {
    getNamesList () { // 获取下拉列表
      if (this.dataForm.query) {
        this.needType[this.dataForm.query] = 1
      } else {
        this.needType = {
          needProductName: 1,
          needBrandName: 1,
          needCategoryName: 1
        }
      }
      let params = {
        nameWord: this.nameWord,
        ...this.needType
      }
      getBrandNamesAndCategoryNames(params).then(({data}) => {
        this.leftData = []
        if (data.code !== 0) {
          this.leftData = []
        } else {
          let arr = []
          for (let item in data.data) {
            if (data.data[item] !== null) {
              let list = Array.from(new Set(data.data[item])).map(citem => {
                return {
                  name: citem,
                  id: item + '*' + citem
                }
              })
              arr.push({
                type: item,
                list: list
              })
            }
          }
          console.log(arr)
          this.leftData = arr
        }
      })
    },
    searchNameChange (name) { // 搜索词改变时
      this.nameWord = name
      this.getNamesList()
    },
    queryTypeChange (label) { // 商品选择改变时
      this.needType = {
        needProductName: 0,
        needBrandName: 0,
        needCategoryName: 0
      }
      console.log(label)
      if (this.dataForm.query) {
        this.needType[this.dataForm.query] = 1
      }
      this.getNamesList()
    },
    leftCheckChange (val) { // 左侧选中状态改变时
      this.leftChecked = val
    },
    addToRight () { // 添加到右侧
      let leftCheckedArr = this.leftChecked.map(item => {
        return {
          name: item.split('*')[1],
          id: item
        }
      })
      leftCheckedArr.forEach(item => {
        let isOnRight = this.rightData.filter(ritem => ritem.name === item.name).length
        if (!isOnRight) {
          this.rightData.push(item)
        }
      })
      if (this.dataForm.name) {
        let param = {
          id: 'manual*' + this.dataForm.name,
          name: this.dataForm.name
        }
        if (this.rightData.filter(item => item.name === param.name).length) {
          return this.$message({
            type: 'error',
            message: '右侧已存在该搜索词，请重新输入添加'
          })
        }
        this.rightData.push(param)
        this.dataForm.name = ''
      }
      this.$refs.leftTransfer.checked = [] // 取消左侧的选中状态
      this.$refs.leftTransfer.checkedAll.forEach((item, index) => {
        if (item) {
          this.$refs.leftTransfer.checkedAll.splice(index, 1, false)
        }
      })
    },
    tableDataChange (data) { // 右侧数据改变时，同步数据
      this.rightData = data
    },
    initData () { // 初始化数据
      this.$refs.leftTransfer.nameWord = ''
      this.leftData = []
      this.rightData = []
      this.$refs.leftTransfer.checked = [] // 取消左侧的选中状态
      this.$refs.leftTransfer.checkedAll.forEach((item, index) => {
        if (item) {
          this.$refs.leftTransfer.checkedAll.splice(index, 1, false)
        }
      })
    }
  }
}
</script>
<style>
  @import '../assets/style/add-base.css';
</style>
