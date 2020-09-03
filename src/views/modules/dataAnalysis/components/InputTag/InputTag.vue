<template>
  <div
    :class="{'read-only': readOnly,'vue-input-tag-wrapper--active': isInputActive}"
    class="vue-input-tag-wrapper"
  >
    <div
      @click="focusNewTag()"
    >
      <span style="position:absolute;top:5px;left:10px;color:#c1c1c1" v-if="!innerTags.length && !isInputActive">{{placeholder}}</span>
      <span v-for="(tag, index) in innerTags" :key="index" class="input-tag">
        <span>{{ tag }}</span>
        <i class="el-icon-error remove" v-if="!readOnly" @click.prevent.stop="remove(index)"></i>
      </span>
      <input
        v-if                     = "!readOnly && !isLimit"
        ref                      = "inputtag"
        type                     = "text"
        v-model                  = "newTag"
        v-on:keydown.delete.stop = "removeLastTag"
        v-on:keydown             = "addNew"
        v-on:blur                = "handleInputBlur"
        v-on:focus               = "handleInputFocus"
        v-on:input               = "handleInputInput"
        class                    = "new-tag"
      />
    </div>
    <ul class="example-list" v-if="isListShow">
      <li>取值示例：</li>
      <li v-for="(item, index) in tagTips" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'InputTag',
  props: {
    value: {
      // type: Array,
      default: () => []
    },
    placeholder: { // 提示
      type: String,
      default: ''
    },
    readOnly: { // 是否只读
      type: Boolean,
      default: false
    },
    validate: {
      type: String | Function | Object,
      default: ''
    },
    valueType: { // 输入的内容类型number string
      type: String,
      default: 'string'
    },
    addTagOnKeys: { // 按什么键触发添加
      type: Array,
      default: function () {
        return [
          13 // Return
          // 188, // Comma ','
          // 9 // Tab
        ]
      }
    },
    addTagOnBlur: { // 失去焦点触发添加标签
      type: Boolean,
      default: false
    },
    limit: { // 限制输入的个数
      type: Number,
      default: -1
    },
    allowDuplicates: { // 是否可重复
      type: Boolean,
      default: false
    },
    maxlength: { // 限制输入的长度
      type: Number,
      default: 9999
    },
    tagTips: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      newTag: '',
      innerTags: [...this.value],
      isInputActive: false,
      isListShow: false
    }
  },
  mounted () {
    console.log(this.innerTags)
  },
  computed: {
    isLimit: function () {
      return this.limit > 0 && Number(this.limit) === this.innerTags.length
    }
  },

  watch: {
    value () {
      this.innerTags = [...this.value]
    }
  },

  methods: {
    focusNewTag () {
      if (this.readOnly || !this.$el.querySelector('.new-tag')) {
        return
      }
      this.$el.querySelector('.new-tag').focus()
    },

    handleInputFocus () {
      this.isInputActive = true
      if (this.tagTips.length) {
        this.isListShow = true
      }
    },

    handleInputBlur (e) {
      this.isInputActive = false
      this.isListShow = false
      this.addNew(e)
    },

    handleInputInput (e) {
      if (this.valueType === 'number') {
        this.newTag = this.keyupNumberInput(this.newTag)
      }
    },

    keyupNumberInput (val) { // 输入内容 要求 只能输入 整数 小数 最多一位小数点 开头和结尾都不能有小数点
      if (val.length > this.maxlength) {
        val = val.substring(0, this.maxlength)
      }
      if (val === '.') { // 开头不能是小数点
        val = val.replace('.', '')
      }
      if (val && val.split('.').length > 2) { // 不可输入第二个小数点
        val = val.substring(0, val.length - 1)
      }
      if (val.length > 1 && val[val.length - 1] === '-') { // 只能有一个’-‘
        val = val.substring(0, val.length - 1)
      }
      val = val.replace(/[^-.\d]/g, '') // 清除“数字”和“.”以外的字符  [^.\d]
      return val
    },

    blurNumberInput (val) { // 失去焦点时判断输入内容是否符合要求
      val = val + '' // 数据转为字符串
      if (val[val.length - 1] === '.') { // 最后一位为小数点时，则删除小数点
        val = val.substring(0, val.length - 1)
      }
      let reg = /^(-)?\d+(\.\d+)?$/g // 只能输入 -. 及数字 不符合要求则置空
      if (!reg.test(val)) {
        val = ''
      }
      val = val.replace(/^0+\./, '0.') // 000.8999  -> 0.889
      val = val.replace(/^(-0+)\./, '-0.') // -000.899  -> -0.889
      val = val.replace(/^0+([0-9])/, '$1') // 009.9 00099999  -> 9.9  999999
      val = val.replace(/^-0+([0-9])/, '-$1') // -009.9 -00099999 -> -9.9  -999999
      return val
    },

    async addNew (e) {
      const keyShouldAddTag = e ? this.addTagOnKeys.indexOf(e.keyCode) !== -1 : true
      const typeIsNotBlur = e && e.type !== 'blur'
      if (
        (!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) ||
        this.isLimit
      ) {
        return
      }
      if (this.valueType === 'number') {
        this.newTag = this.blurNumberInput(this.newTag)
      }

      const tag = this.newTag.trim()

      if (tag && (this.allowDuplicates || this.innerTags.indexOf(tag) === -1)) {
        this.innerTags.push(tag)
        this.newTag = ''
        this.tagChange()
        e && e.preventDefault()
        this.$emit('change')
      }
    },

    remove (index) {
      this.innerTags.splice(index, 1)
      this.tagChange()
    },

    removeLastTag () {
      if (this.newTag) {
        return
      }
      this.innerTags.pop()
      this.tagChange()
    },

    tagChange () {
      this.$emit('update:tags', this.innerTags)
      this.$emit('input', this.innerTags)
      this.$emit('change')
    }
  }
}
</script>
<style>
.vue-input-tag-wrapper {
  background-color: #fff;
  border: 1px solid #ccc;
  /* overflow: hidden; */
  padding-left: 4px;
  padding-top: 4px;
  cursor: text;
  text-align: left;
  -webkit-appearance: textfield;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.vue-input-tag-wrapper .input-tag {
  border-radius: 2px;
  border: 1px solid #e9e9eb;
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 4px;
  margin-right: 4px;
  padding: 3px;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

.vue-input-tag-wrapper .input-tag .remove {
  cursor: pointer;
}

.vue-input-tag-wrapper .input-tag .remove:hover {
  text-decoration: none;
}

.vue-input-tag-wrapper .new-tag {
  background: transparent;
  border: 0;
  color: #777;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 6px;
  margin-top: 1px;
  outline: none;
  padding: 4px;
  padding-left: 0;
  flex-grow: 1;
}

.vue-input-tag-wrapper.read-only {
  cursor: default;
}
.vue-input-tag-wrapper .new-tag::-webkit-input-placeholder {
  color: #C0C4CC;
}
.vue-input-tag-wrapper .new-tag:-ms-input-placeholder {
  color: #C0C4CC;
}
.vue-input-tag-wrapper .input-tag {
  border-radius: 4px;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
.example-list {
  margin: 10px 0 0 -4px;
  border: 1px solid #e4e7ed;
  line-height: 26px;
  list-style: none;
  color: #999;
  position: absolute;
  /* top: 49px; */
  width: 100%;
  z-index: 999;
  background: #fff;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.example-list::before {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 6px;
  border-top: 0;
  top: -5px;
  margin-left: -6px;
  border-top-width: 0;
  border-bottom-color: #fff;
}
.example-list li {
  list-style: none;
}
.example-list li:first-child {
  margin-left: -25px;
  margin-top: 10px;
}
</style>
