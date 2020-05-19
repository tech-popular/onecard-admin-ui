<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <el-table :data="dataList" border style="width: 100%;" :cell-style="{'vertical-align': top}">
      <el-table-column prop="REDIS" header-align="center" align="left" label="REDIS">
        <template slot-scope="scope">
          <pre v-html="paramsParse(scope.row.REDIS)"></pre>
        </template>
      </el-table-column>
      <el-table-column prop="ES" header-align="center" align="left" label="ES">
        <template slot-scope="scope">
          <pre v-html="paramsParse(scope.row.ES)"></pre>
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
        skus: [ row.sku ]
      }).then(({data}) => {
        if (data.code !== 0) {
          return this.$message.error(data.message || '数据异常')
        } else {
          console.log(data.data.mallProducts[0])
          this.dataList = [{
            REDIS: data.data.mallProducts[0],
            ES: data.data.esProducts[0]
          }]
          console.log(this.dataList)
        }
      })
    },
    paramsParse (obj) {
      return JSON.stringify(obj, null, 4)
    },
    dataSubmit () {
      this.visible = false
    }
  }
}
</script>
