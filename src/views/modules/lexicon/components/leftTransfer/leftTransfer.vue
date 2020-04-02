<template>
<div>
  <div class="el-transfer-panel__header">
    <slot name="header"></slot>
  </div>
  <div :class="['el-transfer-left el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
    <el-input
    class="el-transfer-panel__filter"
    v-model="nameWord"
    size="small"
    :placeholder="placeholder"
    @mouseenter.native="inputHover = true"
    @mouseleave.native="inputHover = false"
    @keyup.native="inputChange"
    v-if="filterable">
    <i slot="prefix"
        :class="['el-input__icon', 'el-icon-' + inputIcon]"
        @click="clearQuery"
    ></i>
    </el-input>
    <div class="data-list">
      <div class="data-list-item" v-for="(item, index) in data" :key="index">
        <div v-if="item.list.length > 0">
          <!-- <h3 v-text="queryTitleList[item.type]"></h3> -->
          <el-checkbox v-model="checkedAll[index]" @change="data => handleCheckAllChange(data, index, item)">{{queryTitleList[item.type]}}</el-checkbox>
          <el-checkbox-group
            v-model="checked"
            @change="data => checkedChange(data, index, item)"
          >
            <el-checkbox
              class="el-transfer-panel__item"
              :label="citem.id"
              :key="cindex"
              v-for="(citem, cindex) in item.list"
            >
              {{citem.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <p class="el-transfer-panel__empty" v-if="isNoData()">暂无数据</p>
      <p class="el-transfer-panel__empty" v-if="!nameWord && data.length === 0">请输入搜索内容查询数据</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </p>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      nameWord: '',
      inputHover: false,
      checked: [],
      queryTitleList: {
        bandNames: '商品品牌',
        categoryNames: '商品分类',
        productNames: '商品名称'
      },
      checkedAll: []
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    placeholder: String,
    filterable: {
      type: Boolean,
      default: false
    },
    hasFooter: {
      type: Boolean,
      default: false
    },
    selectedType: { // needProductName商品名称 needBrandName商品品牌 needCategoryName商品分类
      type: String,
      default: ''
    }
  },
  computed: {
    inputIcon () {
      return this.nameWord.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search'
    }
  },
  watch: {
    data () {
      console.log(this.data)
      this.checkedAll = []
      this.data.forEach(item => {
        this.checkedAll.push(false)
      })
    }
  },
  methods: {
    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.nameWord = ''
        this.$emit('searchName', this.nameWord)
      }
    },
    checkedChange (val, index, item) {
      // 将选中的数据按分类保存一下
      let obj = {}
      val.forEach(citem => {
        let name = citem.split('*')[0]
        if (!obj[name]) {
          obj[name] = []
          obj[name].push(citem)
        } else if (obj[name]) {
          obj[name].push(citem)
        }
      })
      // 根据选中的数据和原始数据做对比，进行全选的操作
      if (obj[item.type] && obj[item.type].length === item.list.length) { // 全选
        this.checkedAll.splice(index, 1, true)
      } else if (!obj[item.type] || (obj[item.type] && obj[item.type].length < item.list.length)) { // 不全选时，取消全选状态
        this.checkedAll.splice(index, 1, false)
      }
      this.$emit('checkChange', val)
    },
    inputChange () {
      this.$emit('searchName', this.nameWord)
    },
    handleCheckAllChange (val, index, item) { // 点击全选框按钮时
      if (val) { // 全选的话，将子数据全部放到被选中中
        item.list.map(citem => {
          if (!this.checked.includes(citem.id)) {
            this.checked.push(citem.id)
          }
        })
      } else { // 全不选时，将其子数据全部从选中数组中剔除
        item.list.map(citem => {
          if (this.checked.includes(citem.id)) {
            this.checked.splice(this.checked.indexOf(citem.id), 1)
          }
        })
      }
      this.$emit('checkChange', this.checked)
    },
    isNoData () {
      let flag = true
      this.data.forEach(item => {
        if (item.list.length > 0) {
          flag = false
        }
      })
      if (this.nameWord && flag) return true
      return false
    }
  }
}
</script>
<style scoped>
  .data-list {
    height: 354px;
    padding-bottom: 40px;
    padding-left: 20px;
    overflow: auto;
  }
  .data-list h3 {
    margin: 0;
    padding-left: 10px;
    font-size: 12px;
  }
  .el-checkbox-group {
    padding-left: 20px;
  }
</style>
