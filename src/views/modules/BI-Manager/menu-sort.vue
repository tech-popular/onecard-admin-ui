<template>
  <el-dialog title="排序" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <h3 id="title">基本信息</h3>
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <div style="display: flex">
        <el-form-item label="目录ID:" prop="id">
          <el-input v-model="dataForm.id" placeholder disabled />
        </el-form-item>
        <el-form-item label="目录名称:" prop="name">
          <el-input v-model="dataForm.name" placeholder disabled />
        </el-form-item>
      </div>
      <el-form-item label="目录层级:" prop="menuRelevance">
        <el-input v-model="dataForm.menuRelevance" placeholder disabled />
      </el-form-item>
    </el-form>
    <h3 id="title" style="border-top:1px dashed #c0c0c0;padding-top:20px">下级位置顺序配置</h3>
    <div>
      <el-table :data="tableData" class="options_table" ref="dragTable" border row-key="id" style="width: 100%">
        <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
        <el-table-column label="序号" header-align="center" align="center" width="100">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="name" header-align="center" align="center" width="150" label="名称">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div v-html="toBreak(scope.row.name)" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
              <div class="text-to-long-cut">{{scope.row.name}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" header-align="center" align="center" :formatter="formatMenuType" label="属性"></el-table-column>
        <el-table-column prop="grade" header-align="center" align="center" label="等级">
          <template slot-scope="scope">{{scope.row.grade}}级菜单</template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <span @click="moveUp(scope.$index)" v-if="scope.$index !== 0">
              <icon-svg name="top" style="color: #2093f7"></icon-svg>
            </span>
            <span @click="moveDown(scope.$index)" v-if="scope.$index !== tableData.length-1">
              <icon-svg name="down" style="color: green"></icon-svg>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getListByParentId, updateOrder } from '@/api/BI-Manager/menu'
import { deepClone } from './js/utils'
import Sortable from 'sortablejs'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: '',
        name: '',
        menuRelevance: 0
      },
      loading: false,
      tableData: [],
      backupsTableData: []
    }
  },
  methods: {
    init (row) {
      this.dataForm.id = row.id
      this.dataForm.name = row.name
      this.dataForm.menuRelevance = row.menuRelevance
      this.tableData = []
      this.getInfo(row.id)
      document.body.ondrop = function (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.$nextTick(() => {
        this.rowDrop()
      })
      this.visible = true
    },
    getInfo (id) {
      let params = {
        'parentId': id
      }
      getListByParentId(params).then(({ data }) => { // 查看详情信息
        console.log('data: ', data)
        if (data.code !== 0) {
          return this.$message.error(data.msg)
        }
        this.tableData = data.data || []
        this.backupsTableData = data.data || []
      })
    },
    // 格式化菜单属性显示
    formatMenuType (row, column, cellValue, index) {
      if (row.menuType === 10 && row.url) {
        return '报表'
      } else if (row.menuType === 10 && !row.url) {
        return '目录'
      }
      cellValue = row.menuType === 100 ? 3 : cellValue
      const menuLists = ['superset报表', 'BI报表', 'tableau图表', '目录']
      return menuLists[cellValue]
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp (index) {
      let data = deepClone(this.tableData)
      if (index === 0) return
      data.splice(index - 1, 0, (data[index])) // 在上一项插入该项
      data.splice(index + 1, 1) // 删除后一项
      this.tableData = data
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown (index) {
      let data = deepClone(this.tableData)
      if (index === (data.length - 1)) return
      data.splice(index + 2, 0, (data[index])) // 在下一项插入该项
      data.splice(index, 1) // 删除前一项
      this.tableData = data
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      let orderStr = []
      this.tableData.forEach((item, index) => {
        this.backupsTableData.forEach((citem, cindex) => {
          if (item.id === citem.id && index !== cindex) {
            let orderStrData = [item.id, index + 1].join(',')
            orderStr.push(orderStrData)
          }
        })
      })
      console.log('orderStr: ', orderStr)
      let params = {
        'orderStr': orderStr.join(';')
      }
      updateOrder(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('保存成功')
          this.visible = false
          this.$emit('refreshDataList')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 具体方法
    // 行拖拽
    rowDrop () {
      let tbody = document.querySelector('.options_table .el-table__body-wrapper tbody')
      let _this = this
      Sortable.create(tbody, {
        draggable: '.el-table__row', // 设置可拖拽行的类名(el-table自带的类名)
        animation: 150,
        delay: 0,
        onEnd ({ newIndex, oldIndex }) {
          let data = deepClone(_this.tableData)
          const currRow = data.splice(oldIndex, 1)[0]
          data.splice(newIndex, 0, currRow)
          _this.tableData = deepClone(data)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input__inner {
  color: #000;
}
</style>