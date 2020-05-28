<template>
  <div>
    <el-dialog title="新增推荐场景" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
        <el-form-item label="场景名称:" prop="sceneName">
          <el-input v-model="dataForm.sceneName" placeholder="分期专区" />
        </el-form-item>
        <el-form-item label="推荐类型:" prop="boxId">
          <el-radio-group v-model="dataForm.boxId">
            <el-radio
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.id"
            >
            {{item.name}}
            <el-tooltip placement="top">
              <div slot="content" v-html="item.tips"></div>
              <i class="el-icon-info"></i>
            </el-tooltip>
            </el-radio>
          </el-radio-group>
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
import { saveorupt, listSceneBoxInfo } from '@/api/lexicon/sceneManage'
export default {
  data () {
    return {
      visible: false,
      typeList: [ // 推荐类型
        {
          id: 1,
          name: '猜你喜欢',
          tips: '根据用户兴趣，推荐给用户感兴趣的物<br/>品，达到“千人千面”的效果。常见于产<br/>品内“Feed流“、”猜你喜欢”模块。'
        },
        {
          id: 2,
          name: '热门推荐',
          tips: '基于全站物品各维度统计值进行全局排<br/>序。常见于产品内首页“热销周榜”等模<br/>块。'
        },
        {
          id: 3,
          name: '相关推荐',
          tips: '推荐与当前物品相似的物品，以提升产品<br/>访问深度。常见于产品内详情页“相关推<br/>荐”模块。'
        }
      ],
      productPoolList: [ // 商品池
        {
          id: '1',
          name: '上架全量商品'
        }
      ],
      dataForm: {
        sceneName: '',
        boxId: '',
        goodsPool: ''
      },
      dataRule: {
        sceneName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        boxId: [
          { required: true, message: '请选择推荐类型', trigger: 'change' }
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
        boxId: '',
        goodsPool: ''
      }
      listSceneBoxInfo().then(({data}) => {
        console.log(data, 'shuju')
      })
    },
    searchProductNum () { // 查询商品数量
      console.log(3)
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const dataBody = this.dataForm
          const dataUpdateId = this.dataForm.id
          saveorupt(dataBody, dataUpdateId).then(({data}) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
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
