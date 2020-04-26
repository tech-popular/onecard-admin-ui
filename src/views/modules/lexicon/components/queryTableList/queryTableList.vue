<template>
  <div class="table-content">
    <div class="btn-group">
      <span style="float: left">目前词组中的Query</span>
      <el-button type="danger" size="small" @click="multiRemoveClick">批量删除选中Query</el-button>
    </div>
    <el-table :data="data" border @selection-change="handleSelectionChange" @select-all="handleAllCheckedChange">
      <el-table-column type="selection" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column label="序号" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Query" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" header-align="center" align="center" v-if="isSort">
        <template slot-scope="scope">
          <span @click="moveUp(scope.$index)" v-if="scope.$index !== 0"><icon-svg name="top" style="color: #2093f7"></icon-svg></span>
          <span @click="moveDown(scope.$index)" v-if="scope.$index !== data.length-1"><icon-svg name="down" style="color: green"></icon-svg></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="query-tag-total">目前已选中 <span>{{tableDataChecked.length}}</span> 条 / 共 {{data.length}} 条</div>
  </div>
</template>
<script>
import { deepClone } from '../../assets/js/utils'
export default {
  data () {
    return {
      tableDataChecked: []
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    isSort: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.tableDataChecked = val
    },
    handleAllCheckedChange (val) {
      this.tableDataChecked = val
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp (index) {
      let data = deepClone(this.data)
      if (index === 0) return
      data.splice(index - 1, 0, (data[index])) // 在上一项插入该项
      data.splice(index + 1, 1) // 删除后一项
      this.$emit('dataChange', data)
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown (index) {
      let data = deepClone(this.data)
      if (index === (data.length - 1)) return
      data.splice(index + 2, 0, (data[index])) // 在下一项插入该项
      data.splice(index, 1) // 删除前一项
      this.$emit('dataChange', data)
    },
    multiRemoveClick () { // 批量删除
      if (!this.tableDataChecked.length) return
      this.$confirm('确定批量删除选中Query？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认创建分群时的操作
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
        this.$emit('dataChange', data)
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>
<style scoped>
  @import "../../assets/style/update-base.css";
</style>
