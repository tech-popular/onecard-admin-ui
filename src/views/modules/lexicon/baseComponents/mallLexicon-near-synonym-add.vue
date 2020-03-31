<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>选择及添加词组里的Query</div>
      <div class="el-transfer" style="text-align: center">
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-left">
          <left-transfer
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
          <el-button
            type="primary"
            class="el-transfer__button"
            @click.native="addToRight"
          >
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
        <div class="el-transfer-panel el-transfer-panel-new el-transfer-right">
          <right-transfer
            :has-table-sort="false"
            :has-footer="true"
            :data="rightData"
            @removeItem="rightRemoveItem"
          >
            <div slot="header">
              已选择
            </div>
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
import { findParent } from '../assets/js/utils'
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
  mounted () {
    this.parent = findParent(this.$parent)
    this.getNamesList()
  },
  methods: {
    getNamesList () {
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
        if (data.code !== 0) {
          this.leftData = []
        } else {
          let arr = []
          for (var item in data.data) {
            if (data.data[item] !== null) {
              arr.push({
                type: item,
                list: data.data[item]
              })
            }
          }
          console.log(arr)
          this.leftData = arr
        }
      })
    },
    searchNameChange (name) {
      console.log(12)
      this.nameWord = name
      this.getNamesList()
    },
    queryTypeChange (label) {
      console.log(1)
      if (this.dataForm.query) {
        this.needType[this.dataForm.query] = 1
      } else {
        this.needType = {
          needProductName: 1,
          needBrandName: 1,
          needCategoryName: 1
        }
      }
      this.getNamesList()
    },
    filterMethod (query, item) {
      return item.pinyin.indexOf(query) > -1
    },
    leftCheckChange (val) { // 左侧选中状态改变时
      console.log(val)
      this.leftChecked = val
    },
    rightRemoveItem (id) { // 右侧删除的数据,左侧对应数据解冻
      this.leftData = this.leftData.map(item => {
        if (item.id === id) {
          return { ...item, disabled: false, checked: false }
        } else {
          return item
        }
      })
    },
    addToRight () {
      console.log(999, this.leftData.filter(item => this.leftChecked.includes(item.id)))
      let leftCheckedArr = this.leftData.filter(item => this.leftChecked.includes(item.id))
      leftCheckedArr.forEach(item => {
        if (!item.disabled) {
          this.rightData.push(item)
        }
      })
      this.leftData = this.leftData.map(item => {
        let isOnRight = this.rightData.filter(ritem => ritem.id === item.id).length
        if (isOnRight) {
          return { ...item, disabled: true }
        } else {
          return item
        }
      })
      if (this.dataForm.name) {
        let param = {
          id: 'manual_' + this.dataForm.name,
          pinyin: 'manual',
          label: this.dataForm.name
        }
        if (this.rightData.filter(item => item.id === param.id).length) return
        this.rightData.push(param)
        this.dataForm.name = ''
      }
      console.log('left', this.leftData, this.leftChecked)
    }
  }
}
</script>
<style>
  @import '../assets/style/add-base.css';
</style>
