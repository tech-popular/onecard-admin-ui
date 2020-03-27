<template>
    <div>
      <div class="query-title"><span style="color:red">*</span>选择及添加词组里的Query</div>
      <new-transfer
      :filter-method="filterMethod"
      filter-placeholder="请输入城市拼音"
      v-model="value"
      @clearManual="clearManualInput"
      :titles="[dataForm.query, '已选择']"
      :widths="['350px', '350px']"
      :leftFilter="true"
      :rightFilter="false"
      :leftTitleFlag="false"
      :rightTitleFlag="false"
      :isLeftCheckList="true"
      :isRightCheckList="false"
      :manualInput="manualQuery"
      :data="dataList">
      <div class="transfer-header" slot="left-header">
        <el-form inline :model="dataForm" class="transfer-form">
        <el-form-item label="选择" prop="query">
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
          手动添加：<el-input v-model="dataForm.name" placeholder="请输入" size="mini" style="width:200px;display:inline-block"/>
      </div>
      </new-transfer>
    </div>
</template>
<script>
import NewTransfer from '../components/transfer'
export default {
  data () {
    const generateData = _ => {
      const data = []
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都', '南京', '西安', '成都']
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu', 'nanjing', 'xian', 'chengdu']
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
<style scoped>
.query-title {
  padding: 0 0 15px 15px;
}
.transfer-footer {
  padding: 6px 0 0 10px;
}
</style>