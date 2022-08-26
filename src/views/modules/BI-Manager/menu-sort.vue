<template>
  <el-dialog title="排序" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <h3 id="title">基本信息</h3>
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="目录ID:" prop="id">
        <el-input v-model="dataForm.id" placeholder disabled />
      </el-form-item>
      <el-form-item label="目录名称:" prop="name">
        <el-input v-model="dataForm.name" placeholder disabled />
      </el-form-item>
      <el-form-item label="目录层级:" prop="menuRelevance">
        <el-input v-model="dataForm.menuRelevance" placeholder disabled />
      </el-form-item>
    </el-form>
    <h3 id="title" style="border-top:1px dashed #c0c0c0;padding-top:20px">下级位置顺序配置</h3>
    <div>
      <el-table :data="tableData" border :cell-style="cellStyle" style="width: 100%">
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
        <el-table-column prop="menuRelevance" header-align="center" align="center" width="150" label="层级">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div v-html="toBreak(scope.row.menuRelevance )" slot="content" style="max-width:400px;line-height: 1.5;word-break: break-all;"></div>
              <div class="text-to-long-cut">{{scope.row.menuRelevance }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" header-align="center" align="center" width="150" :formatter="formatMenuType" label="属性"></el-table-column>
        <el-table-column prop="grade" header-align="center" align="center" width="120" label="等级">
          <template slot-scope="scope">{{scope.row.grade}}级菜单</template>
        </el-table-column>
        <el-table-column header-align="center" align="center" width="100" label="操作">
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
// import { jdyAdd, jdyEdit, jdyDetail, jdyGetPro, jdyuploadWords, jdydownloadTemplate } from '@/api/jindouyun/recommendLocConfig'
import { deepClone } from './js/utils'
export default {
  data () {
    return {
      id: '',
      visible: false,
      dataForm: {
        id: '',
        name: '',
        menuRelevance: 0
      },
      loading: false,
      tableData: []
    }
  },
  methods: {
    init (id) {
      this.id = ''
      this.tableData = []
      this.getInfo()
      this.visible = true
    },
    getInfo () {
      // jdyDetail(this.id).then(({data}) => { // 查看详情信息
      //   if (data.status * 1 !== 1) {
      //     return this.$message.error(data.message)
      //   }
      //   this.dataForm = {
      //     id: data.data.id,
      //     name: data.data.name
      //   }
      //   this.tableData = data.data.locationList || []
      //   this.tableDataLength = data.data.locationList.length
      //   this.visible = true
      //   this.$nextTick(() => {
      //     this.$refs.dataForm.clearValidate()
      //   })
      // })
    },
    // 格式化菜单属性显示
    formatMenuType (row, column, cellValue, index) {
      cellValue = row.menuType === 100 ? 3 : cellValue
      const menuLists = ['superset列表', 'BI报表', 'tableau图表', '目录']
      return menuLists[cellValue]
    },
    // 设置背景色
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      const style = {}
      if (this.id) {
        if (row.styleState) {
          style.background = '#97CBFF'
        }
        return style
      }
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
      this.$refs.dataForm.validate((valid) => {
        this.tableData.forEach((item, index) => {
          item.productLocation = index + 1
          if (item.styleState) {
            delete item.styleState
          }
        })
        // let params = {
        //   name: this.dataForm.name,
        //   locationList: this.tableData
        // }
        // url(params).then(({data}) => {
        //   if (data && data.status * 1 === 1) {
        //     this.$message.success(data.message)
        //     this.visible = false
        //     this.$emit('refreshDataList')
        //   } else {
        //     this.$message.error(data.message)
        //   }
        // })
      })
    }
  }
}
</script>