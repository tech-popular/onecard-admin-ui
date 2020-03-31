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
    v-if="filterable">
    <i slot="prefix"
        :class="['el-input__icon', 'el-icon-' + inputIcon]"
        @click="clearQuery"
    ></i>
    </el-input>
    <el-checkbox-group
    v-model="checked"
    @change="checkedChange"
    :class="{ 'is-filterable': filterable }"
    class="el-transfer-panel__list">
      <el-checkbox
        class="el-transfer-panel__item"
        :label="item.id"
        :disabled="item.disabled"
        :key="index"
        v-for="(item, index) in filteredData">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
    <p
    class="el-transfer-panel__empty"
    v-show="filteredData.length === 0">暂无数据</p>
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
    filterMethod: Function,
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
    },
    filteredData () {
      const arr = this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.nameWord, item)
        } else {
          return item.label.toLowerCase().indexOf(this.nameWord.toLowerCase()) > -1
        }
      })
      return arr
    }
  },
  methods: {
    clearQuery () {
      if (this.inputIcon === 'circle-close') {
        this.nameWord = ''
      }
    },
    checkedChange (val) {
      this.$emit('checkChange', val)
    }
  }
}
</script>
