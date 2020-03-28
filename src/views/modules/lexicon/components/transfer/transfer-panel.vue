<template>
  <div class="el-transfer-panel el-transfer-new">
    <div class="el-transfer-panel__header">
      <el-checkbox
        v-if="titleFlag"
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
      <p v-else style="margin: 0">
        <slot name="left-header"></slot>
        <slot name="right-header"></slot>
      </p>      
    </div>
    
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
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
        v-show="isCheckList && !hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list">
        <div>
          <el-checkbox
            class="el-transfer-panel__item"
            :label="item[keyProp]"
            :disabled="item[disabledProp]"
            :key="item[keyProp]"
            :style="{display: isLeft && (item[keyProp] + '').indexOf('manual_') > -1 ? 'none !important' : 'block'}"
            v-for="item in filteredData">
            <option-content :option="item"></option-content>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <el-table :data="filteredData" @selection-change="handleSelectionChange" @select-all="handleAllCheckedChange" border class="el-transfer-panel_table" v-if="!isCheckList">
        <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
        <el-table-column label="序号" header-align="center" align="center" width="80">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="label" label="Query" header-align="center" align="center"></el-table-column>
        <el-table-column prop="label" label="排序(上移/下移)" header-align="center" align="center" v-if="hasTableSort">
          <template slot-scope="scope">
            <i class="el-icon-top icon-move" style="color: green" @click="moveUp(scope.$index)"></i>
            <i class="el-icon-bottom icon-move" style="color: red" @click="moveDown(scope.$index)"></i>
            <!-- <el-tooltip class="item" effect="dark" content="上移" placement="top">
              <i class="el-icon-top icon-move" style="color: green" @click="moveUp(scope.$index)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下移" placement="top">
              <i class="el-icon-bottom icon-move" style="color: red" @click="moveDown(scope.$index)"></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <p
        class="el-transfer-panel__empty"
        v-show="isCheckList && hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="el-transfer-panel__empty"
        v-show="isCheckList && data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
  import Locale from 'element-ui/src/mixins/locale'

  export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      OptionContent: {
        props: {
          option: Object
        },
        render (h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferPanel') {
              return vm
            } else if (vm.$parent) {
              return getParent(vm.$parent)
            } else {
              return vm
            }
          }
          const panel = getParent(this)
          const transfer = panel.$parent || panel
          return panel.renderContent
            ? panel.renderContent(h, this.option)
            : transfer.$scopedSlots.default
              ? transfer.$scopedSlots.default({ option: this.option })
              : h('span', this.option[panel.labelProp] || this.option[panel.keyProp])
        }
      }
    },

    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      format: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object,
      titleFlag: Boolean,
      isCheckList: Boolean,
      isLeft: Boolean,
      hasTableSort: Boolean
    },

    data () {
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        checkChangeByUser: true
      }
    },

    watch: {
      checked (val, oldVal) {
        this.updateAllChecked()
        if (this.checkChangeByUser) {
          const movedKeys = val.concat(oldVal)
            .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
          console.log(val, movedKeys)
          this.$emit('checked-change', val, movedKeys)
        } else {
          console.log(val)
          this.$emit('checked-change', val)
          this.checkChangeByUser = true
        }
      },

      data () {
        console.log(8989)
        const checked = []
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item)
          }
        })
        this.checkChangeByUser = false
        this.checked = checked
      },

      checkableData () {
        this.updateAllChecked()
      },

      defaultChecked: {
        immediate: true,
        handler (val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return
          const checked = []
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item)
            }
          })
          this.checkChangeByUser = false
          this.checked = checked
        }
      }
    },

    computed: {
      filteredData () {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.query, item)
          } else {
            const label = item[this.labelProp] || item[this.keyProp].toString()
            return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
          }
        })
      },

      checkableData () {
        return this.filteredData.filter(item => !item[this.disabledProp])
      },

      checkedSummary () {
        const checkedLength = this.checked.length
        const dataLength = this.data.length
        const { noChecked, hasChecked } = this.format
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength)
        } else {
          return `${checkedLength} / ${dataLength}`
        }
      },

      isIndeterminate () {
        const checkedLength = this.checked.length
        return checkedLength > 0 && checkedLength < this.checkableData.length
      },

      hasNoMatch () {
        return this.query.length > 0 && this.filteredData.length === 0
      },

      inputIcon () {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search'
      },

      labelProp () {
        return this.props.label || 'label'
      },

      keyProp () {
        return this.props.key || 'key'
      },

      disabledProp () {
        return this.props.disabled || 'disabled'
      },

      hasFooter () {
        return !!this.$slots.default
      },

      hasHeader () {
        return !!this.$slots.default
      }
    },

    methods: {
      updateAllChecked () {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
      },

      handleAllCheckedChange (value) {
        this.checked = value.length
          ? this.checkableData.map(item => item[this.keyProp])
          : []
      },
      handleSelectionChange (value) {
        this.checked = value.length ? value.map(item => item[this.keyProp])
          : []
      },
      clearQuery () {
        if (this.inputIcon === 'circle-close') {
          this.query = ''
        }
      },
      // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
      moveUp (index) {
        console.log(1, index)
        let data = this.filteredData
        if (index === 0) return
        // 在上一项插入该项
        data.splice(index - 1, 0, (data[index]))
        // 删除后一项
        data.splice(index + 1, 1)
        console.log(this.filteredData)
      },
      // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
      moveDown (index) {
        console.log(2, index)
        let data = this.filteredData
        if (index === (data.length - 1)) return
        // 在下一项插入该项
        data.splice(index + 2, 0, (data[index]))
        // 删除前一项
        data.splice(index, 1)
      }
    }
  }
</script>
<style>
.el-transfer-new {
  text-align: left;
}
.el-transfer-new .el-transfer-panel__list.is-filterable {
  padding-bottom: 40px;
  height: 354px;
}
.el-transfer-panel_table {
  width: 90%;
  margin:10px 5% 0;
  text-align:center;
}
.el-transfer-panel_table .el-table__body-wrapper {
  height: 343px;
  overflow: auto;
}
.el-transfer-new  .el-transfer-panel__body {
  height: 400px;
}
.icon-move {
  cursor: pointer;
}
</style>
