<template>
   <el-dialog :title="id ? tag === 'view' ? '查看' : '编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
    <h3 id="title">基本信息</h3>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="任务ID:" prop="id">
        <el-input v-model="dataForm.id" placeholder="" :disabled="!!id" />
      </el-form-item>
      <el-form-item label="任务名称:" prop="name">
        <el-input v-model="dataForm.name" placeholder="" :disabled="!!id" />
      </el-form-item>
    </el-form>
    <h3 id="title" style="border-top:1px dashed #c0c0c0;padding-top:20px">位置顺序配置</h3>
    <div style="display:flex;margin-bottom:20px">
      <el-input v-model="productId" placeholder="产品编号" />
      <el-button type="primary" style="margin-left:20px">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="产品编号" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="产品名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="index" label="位置编号" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.index" :min="0" placeholder="位置编号" style="width:150px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-close" circle  size="mini" @click="deleteHandle(scope.$index, scope.row)" style="padding:5px"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit" v-if="tag !== 'view'">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { showWordsInfo } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      tag: '',
      isTreeRoot: true,
      id: '',
      visible: false,
      dataForm: {
        id: '',
        name: '近义词'
      },
      productId: '',
      locIndex: '',
      tableData: [
        {
          id: 1,
          name: '2',
          index: 2
        },
        {
          id: 12,
          name: '3',
          index: 4
        }
      ],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.dataForm = { // 初始化
        id: '',
        name: ''
      }
      if (row && row.id) {
        this.id = row.id
        this.tag = tag
        this.getInfo(this.id)
      } else {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      }
    },
    getInfo (id) {
      showWordsInfo(id).then(({data}) => { // 查看详情信息
        if (data.code !== 0) {
          return this.$message({
            type: 'error',
            message: data.msg
          })
        }
        this.dataForm = {
          wordName: data.data.wordsName,
          wordType: data.data.wordsType,
          hotWordType: data.data.hotWordType
        }
        this.searchWords = data.data.searchWords
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
          this.$refs.updateSynonym.init()
        })
      })
    },
    deleteHandle (index, row) {
      this.$confirm(`确定提删除【${row.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认创建分群时的操作
        this.tableData.splice(index, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let len = this.tableData.filter(item => !item.index).length
          if (len > 0) {
            return this.$message.error('位置编号不可为空！')
          }
          console.log('submit', this.tableData)
        }
      })
    }
  }
}
</script>
