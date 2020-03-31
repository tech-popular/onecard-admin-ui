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
          <h3 v-text="getTitle(item.type)"></h3>
          <el-checkbox-group
            v-model="checked"
            @change="checkedChange"
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
      <p class="el-transfer-panel__empty" v-show="nameWord && data.length === 0">暂无数据</p>
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
      checked: []
    }
  },
  mounted () {
    console.log(this.data)
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
  methods: {
    getTitle (type) {
      if (type === 'bandNames') {
        return '商品品牌'
      } else if (type === 'categoryNames') {
        return '商品分类'
      } else {
        return '商品名称'
      }
    },
    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.nameWord = ''
      }
    },
    checkedChange (val) {
      this.$emit('checkChange', val)
    },
    inputChange () {
      this.$emit('searchName', this.nameWord)
    }
  }
}
</script>
<style scoped>
  .data-list {
    height: 354px;
    padding-bottom: 40px;
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
