<template>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>选择及添加词组里的Query</div>
      <new-transfer
      :filter-method="filterMethod"
      filter-placeholder="请输入搜索Query"
      v-model="value"
      @clearManual="clearManualInput"
      :widths="['350px', '350px']"
      :left-filter="true"
      :right-filter="false"
      :left-title-flag="false"
      :right-title-flag="false"
      :is-left-check-list="true"
      :is-right-check-list="false"
      :has-right-total="true"
      :target-order="'push'"
      :manual-input="manualQuery"
      :data="dataList">
      <div class="transfer-header" slot="left-header">
        <el-form inline :model="dataForm" :rules="dataRules" class="transfer-form">
          <el-form-item label="选择:" prop="query">
            <el-radio-group v-model="dataForm.query" size="mini">
              <el-radio-button label="商品名称" ></el-radio-button>
              <el-radio-button label="商品分类"></el-radio-button>
              <el-radio-button label="商品品牌"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="transfer-header" slot="right-header">
        已选择
      </div>
      <div class="transfer-footer" slot="left-footer">
          手动添加：<el-input v-model="dataForm.name" placeholder="请输入Query名" size="mini" style="width:200px;display:inline-block"/>
      </div>
      </new-transfer>
    </div>
</template>
<script>
import NewTransfer from '../components/transfer'
// left-filter/right-filter 左/右边框的搜索框是否显示
// left-title-flag/right-title-flag 左/右边框的title原有标题是否显示，可以用slot：left-header/right-header自定义
// is-left-check-list/is-right-check-list 左/右边框中原有的复选框列表是否显示，true为显示复选框列表，false为显示表格列表展示
// manual-input 为手动输入的内容
export default {
  data () {
    const generateData = _ => {
      const data = []
      const cities = ['上海', '北京', '广州', '上海1', '北京1', '广州1', '上海2', '北京2', '广州2']
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shanghai1', 'beijing1', 'guangzhou1', 'shanghai2', 'beijing2', 'guangzhou2']
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data
    }
    return {
      dataList: generateData(),
      value: [],
      dataForm: {
        query: '',
        name: ''
      },
      dataRules: {
        query: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  components: { NewTransfer },
  computed: {
    manualQuery: {
      get () {
        return this.dataForm.name
      },
      set (newVal) {
        this.dataForm.name = newVal
      }
    }
  },
  methods: {
    filterMethod (query, item) {
      return item.pinyin.indexOf(query) > -1
    },
    clearManualInput () {
      this.dataForm.name = ''
      this.manualQuery = ''
    }
  }
}
</script>
<style>
.add-wrap .query-title {
  padding: 0 0 15px 15px;
}
.add-wrap .transfer-footer {
  padding: 6px 0 0 10px;
}
.add-wrap .el-radio-button {
  margin-right: 10px;
}
.add-wrap .el-radio-button .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: none!important;
}
</style>