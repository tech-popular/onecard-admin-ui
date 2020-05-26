<template>
  <div>
    <el-form label-width="80px" :model="baseForm" ref="baseForm" inline>
      <el-form-item label="一级品类" prop="first_category_type">
        <el-input v-model.trim="baseForm.first_category_type" placeholder="一级品类" clearable />
      </el-form-item>
      <el-form-item label="二级品类" prop="second_category_type">
        <el-input v-model.trim="baseForm.second_category_type" placeholder="二级品类" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="loading" style="width: 100%;">
      <el-table-column label="序号" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="first_category_type" header-align="center" align="center" label="一级品类"></el-table-column>
      <el-table-column prop="second_category_type" header-align="center" align="center" label="二级品类"></el-table-column>
      <el-table-column prop="click_num" header-align="center" align="center" label="点击数量去重"></el-table-column>
      <el-table-column prop="click_time" header-align="center" align="center" label="点击时间去重"></el-table-column>
      <el-table-column prop="last_updator" header-align="center" align="center" label="最近一次修改人"></el-table-column>
      <el-table-column prop="lat_update_time" header-align="center" align="center" label="最近一次修改时间"></el-table-column>
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
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper" />
    <el-dialog title="修改去重规则" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
      <el-form label-width="140px" :model="duplicateForm" :rules="duplicateFormRules" ref="duplicateForm">
        <el-form-item label="点击数量去重:" prop="number">
          同一物品推荐点击后<el-input v-model="duplicateForm.number" placeholder="1000" class="input-item" />条内不重复
        </el-form-item>
        <el-form-item label="点击时间去重:" prop="days">
          同一物品推荐点击后<el-input v-model="duplicateForm.days" placeholder="1000" class="input-item" />天内不重复
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
export default {
  data () {
    return {
      baseForm: {
        first_category_type: '',
        second_category_type: ''
      },
      loading: false,
      dataList: [
        {
          last_updator: '遥遥',
          first_category_type: '434',
          second_category_type: 'try',
          click_num: 'lll',
          click_time: '12.98',
          lat_update_time: '2020-12-12 12:12:12'
        },
        {
          last_updator: '遥遥',
          first_category_type: '434',
          second_category_type: 'try',
          click_num: 'lll',
          click_time: '12.98',
          lat_update_time: '2020-12-12 12:12:12'
        }
      ],
      pageNo: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      visible: false,
      duplicateForm: {
        number: '',
        days: ''
      },
      duplicateFormRules: {
        number: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        days: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    modifyDataClick () { // 改变权重
      this.visible = true
    },
    // 每页数
    sizeChangeHandle (page) {
      this.pageSize = page
      this.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (page) {
      this.pageNo = page
      this.getDataList()
    },
    dataSubmit () {
      this.$refs.duplicateForm.validate((valid) => {
        if (valid) {
          console.log(9999)
        }
      })
    },
    cancel () {
      this.visible = false
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
