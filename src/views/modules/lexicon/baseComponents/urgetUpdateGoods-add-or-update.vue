<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="1000px" class="pro-dialog">
    <el-table :data="dataList" border style="width: 100%;">
      <el-table-column prop="REDIS" header-align="center" align="left" label="REDIS">
        <template slot-scope="scope">
          <pre v-html="paramsParse(scope.row.REDIS)" style="white-space: pre-wrap"></pre>
        </template>
      </el-table-column>
      <el-table-column prop="ES" header-align="center" align="left" label="ES">
        <template slot-scope="scope">
          <pre v-html="paramsParse(scope.row.ES)" style="white-space: pre-wrap"></pre>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="dataSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getProductsFromBoth } from '@/api/lexicon/urgentUpdateGoods'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      visible: false
    }
  },
  methods: {
    init (row) {
      this.visible = true
      getProductsFromBoth({
        skuStr: row.sku
      }).then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.message || '数据异常')
        } else {
          this.dataList = [{
            REDIS: data.data.mallProducts,
            ES: data.data.esProducts
          }]
        }
      })
    },
    paramsParse (obj) {
      let str = ''
      if (obj) {
        str = JSON.stringify(obj, null, 4).replace(/\\r\\n/g, '<br/><span style="padding-right:150px"></span>').replace(/\\/g, '')
      }
      return str
    },
    dataSubmit () {
      this.visible = false
    }
  }
}
</script>
<style>
  .pro-dialog .el-table td {
    vertical-align: top;
  }
</style>
