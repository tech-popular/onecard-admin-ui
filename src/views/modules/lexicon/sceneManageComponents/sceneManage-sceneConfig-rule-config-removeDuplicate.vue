<template>
  <div>
    <el-form label-width="80px" :model="baseForm" ref="baseForm" inline>
      <el-form-item label="品类" prop="categoryType">
        <el-cascader
          style="width: 100%"
          :props="props"
          v-model="baseForm.categoryType"
          clearable
          :options="categoryTypeList">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="seachWeight">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
      <el-table-column label="序号" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="firstCategoryName" header-align="center" align="center" label="一级品类"></el-table-column>
      <el-table-column prop="secondCategoryName" header-align="center" align="center" label="二级品类"></el-table-column>
      <el-table-column prop="clickNumber" header-align="center" align="center" label="点击数量去重"></el-table-column>
      <el-table-column prop="clickTime" header-align="center" align="center" label="点击时间去重"></el-table-column>
      <el-table-column prop="updateUser" header-align="center" align="center" label="最近一次修改人"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="最近一次修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="modifyDataClick(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper" />
    <el-dialog title="修改去重规则" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
      <el-form label-width="140px" :model="duplicateForm" :rules="duplicateFormRules" ref="duplicateForm">
        <el-form-item label="点击数量去重:" prop="clickNumber">
          同一物品推荐点击后<el-input v-model="duplicateForm.clickNumber" placeholder="1000" class="input-item" />条内不重复
        </el-form-item>
        <el-form-item label="点击时间去重:" prop="clickTime">
          同一物品推荐点击后<el-input v-model="duplicateForm.clickTime" placeholder="1000" class="input-item" />天内不重复
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="dataSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { selectFirstCategoryName, getSceneDistinctList, updateSceneDistinctInfo } from '@/api/lexicon/sceneManage'
export default {
  props: [
    'boxId'
  ],
  data () {
    return {
      baseForm: {
        categoryType: ''
      },
      loading: false,
      categoryTypeList: [],
      props: {
        multiple: false,
        checkStrictly: true,
        label: 'categoryName',
        value: 'categoryType'
      },
      dataList: [],
      pageNo: 1, // 当前页
      pageSize: 5, // 默认每页10条
      totalPage: 0,
      visible: false,
      duplicateForm: {
        clickNumber: '',
        clickTime: ''
      }, // 修改去重规则
      duplicateId: '',
      firstCategoryType: '',
      firstCategoryName: '',
      secondCategoryType: '',
      secondCategoryName: '',
      duplicateFormRules: {
        clickNumber: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        clickTime: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      selectFirstCategoryName().then(({data}) => {
        this.categoryTypeList = data.data
      })
    },
    // 查询
    seachWeight () {
      const dataBody = {
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'boxId': this.boxId,
        'categoryType': this.baseForm.categoryType
      }
      getSceneDistinctList(dataBody).then(({data}) => {
        if (data && data.msg === 'success') {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
        }
      })
    },
    modifyDataClick (val) { // 修改去重规则
      this.visible = true
      this.firstCategoryType = val.firstCategoryType
      this.firstCategoryName = val.firstCategoryName
      this.secondCategoryName = val.secondCategoryName
      this.secondCategoryType = val.secondCategoryType
      this.duplicateForm.clickNumber = val.clickNumber
      this.duplicateForm.clickTime = val.clickTime
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNo = 1
      this.seachWeight()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNo = page
      this.seachWeight()
    },
    dataSubmit () {
      this.$refs.duplicateForm.validate((valid) => {
        if (valid) {
          const dataBody = {
            boxId: this.boxId,
            firstCategoryType: this.firstCategoryType,
            firstCategoryName: this.firstCategoryName,
            secondCategoryName: this.secondCategoryName,
            secondCategoryType: this.secondCategoryType,
            clickNumber: this.duplicateForm.clickNumber,
            clickTime: this.duplicateForm.clickTime
          }
          updateSceneDistinctInfo(dataBody).then(({data}) => {
            if (data && data.msg === 'success') {
              this.$message.success('更新成功')
              this.visible = false
              this.seachWeight()
              this.duplicateForm.clickNumber = ''
              this.duplicateForm.clickTime = ''
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    cancel () {
      this.visible = false
      this.duplicateForm.clickNumber = ''
      this.duplicateForm.clickTime = ''
    }
  }
}
</script>
<style scoped>
  .input-item {
    width: 100px;
    margin: 0 10px;
  }
  .el-form-item__error {
    padding-left: 100px;
  }
</style>
