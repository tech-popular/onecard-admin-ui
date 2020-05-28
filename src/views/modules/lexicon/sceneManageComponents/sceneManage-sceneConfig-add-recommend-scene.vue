<template>
  <div>
    <el-dialog title="新增搜索场景" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
        <el-form-item label="场景名称:" prop="name">
          <el-input v-model="dataForm.name" placeholder="分期专区" />
        </el-form-item>
        <el-form-item label="商品池:" prop="productPool">
          <el-select
            v-model="dataForm.productPool"
            filterable
            placeholder="请选择"
            class="pool-sel"
          >
            <el-option
              v-for="(item, index) in productPoolList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="searchProductNum">查询</el-button>
          <span>商品量：<b>{{productNum}}</b></span>
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
      visible: false,
      productPoolList: [ // 商品池
        {
          id: '1',
          name: '上架全量商品'
        }
      ],
      dataForm: {
        name: '',
        productPool: ''
      },
      dataRule: {
        name: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        productPool: [
          { required: true, message: '请选择商品池', trigger: 'change' }
        ]
      },
      productNum: '32'
    }
  },
  methods: {
    init () {
      this.visible = true
      this.dataForm = {
        name: '',
        productPool: ''
      }
    },
    searchProductNum () { // 查询商品数量
      console.log(3)
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      console.log(this.dataForm)
    }
  }
}
</script>
<style scoped>
  .pool-sel {
    width: 280px;
    margin-right: 10px
  }
</style>
