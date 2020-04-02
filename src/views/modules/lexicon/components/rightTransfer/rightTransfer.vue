<template>
<div>
  <div class="el-transfer-panel__header">
    已选择
    <el-button type="danger" size="mini" @click="multiRemoveClick" style="float:right;margin:5px 10px 0 0;">删除选中Query</el-button>
  </div>
  <div :class="['el-transfer-right-wrap el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
    <el-table :data="data" border @selection-change="handleSelectionChange" @select-all="handleAllCheckedChange" class="el-transfer-panel_table" :class="{'table-has-footer': hasFooter}">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="序号" header-align="center" align="center" width="60">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Query" header-align="center" align="center"></el-table-column>
      <el-table-column label="排序" header-align="center" align="center" v-if="hasTableSort">
        <template slot-scope="scope">
          <i class="el-icon-top icon-move" style="color: #2093f7" @click="moveUp(scope.$index)" v-if="scope.$index !== 0"></i>
          <i class="el-icon-bottom icon-move" style="color: green" @click="moveDown(scope.$index)" v-if="scope.$index !== data.length-1"></i>
          <!-- <i class="el-icon-delete icon-move" style="color: red" @click="remove(scope)"></i> -->
        </template>
      </el-table-column>
    </el-table>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </p>
  </div>
</div>
</template>
<script>
import { deepClone } from '../../assets/js/utils'
export default {
  data () {
    return {
      query: '',
      inputHover: false,
      // checked: [],
      tableDataChecked: []
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    hasFooter: {
      type: Boolean,
      default: false
    },
    hasTableSort: {
      type: Boolean,
      default: false
    }
  },
  // computed: {
  //   filteredData () {
  //     console.log(111, this.data)
  //     return this.data
  //   }
  // },
  mounted () {
    console.log(444, this.data)
  },
  methods: {
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp (index) {
      let data = deepClone(this.data)
      if (index === 0) return
      // 在上一项插入该项
      data.splice(index - 1, 0, (data[index]))
      // 删除后一项
      data.splice(index + 1, 1)
      this.$emit('dataChange', data)
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown (index) {
      let data = deepClone(this.data)
      if (index === (data.length - 1)) return
      // 在下一项插入该项
      data.splice(index + 2, 0, (data[index]))
      // 删除前一项
      data.splice(index, 1)
      this.$emit('dataChange', data)
    },
    // remove (scope) {
    //   this.filteredData.splice(scope.$index, 1)
    // },
    handleSelectionChange (val) {
      this.tableDataChecked = val
    },
    handleAllCheckedChange (val) {
      this.tableDataChecked = val
    },
    multiRemoveClick () {
      console.log(this.tableDataChecked)
      let data = deepClone(this.data)
      if (data.length === this.tableDataChecked.length) {
        data = []
      } else {
        this.tableDataChecked.forEach(item => {
          data.forEach((ditem, dindex) => {
            if (item.name === ditem.name) {
              data.splice(dindex, 1)
            }
          })
        })
      }
      console.log(data)
      this.$emit('dataChange', data)
    }
  }
}
</script>
<style>
.el-transfer-panel_table {
  width: 89%;
  margin:10px 5% 0;
  text-align:center;
}
.el-transfer-panel_table .el-table__body-wrapper {
  max-height: 343px;
  overflow-y: auto;
}
.table-has-footer .el-table__body-wrapper {
  max-height: 284px;
}
</style>
