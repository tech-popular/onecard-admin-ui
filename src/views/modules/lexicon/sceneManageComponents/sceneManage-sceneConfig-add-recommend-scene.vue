<template>
  <div>
    <el-dialog title="新增搜索场景" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
        <el-form-item label="场景名称:" prop="sceneName">
          <el-input v-model="dataForm.sceneName" placeholder="分期专区" />
        </el-form-item>
        <el-form-item label="商品池:" prop="goodsPool">
          <el-select
            v-model="dataForm.goodsPool"
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
import { saveorupt, listSceneBoxInfo, listProductPool } from '@/api/lexicon/sceneManage'
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
        sceneName: '',
        goodsPool: '',
        sceneType: 0
      },
      dataRule: {
        sceneName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        goodsPool: [
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
        sceneName: '',
        goodsPool: '',
        sceneType: 0
      }
      listSceneBoxInfo().then(({data}) => {
        this.typeList = data.data
      })
      listProductPool().then(({data}) => {
        // this.productPoolList = data.data
      })
    },
    searchProductNum () { // 查询商品数量
      console.log(3)
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const dataBody = this.dataForm
          const dataUpdateId = this.dataForm.id
          saveorupt(dataBody, dataUpdateId).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('childByValue', this.visible)
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
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
