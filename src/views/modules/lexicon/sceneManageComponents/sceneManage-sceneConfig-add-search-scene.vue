<template>
  <div>
    <el-dialog title="新增推荐场景" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="90px">
        <el-form-item label="场景名称:" prop="sceneName">
          <el-input v-model="dataForm.sceneName" placeholder="场景名称" />
        </el-form-item>
        <el-form-item label="推荐类型:" prop="recommendTypeId">
          <el-radio-group v-model="dataForm.recommendTypeId">
            <el-radio
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.id"
              @change="recommendClisk(item.id)"
            >
            {{item.recommendType}}
            <el-tooltip placement="top">
              <div slot="content" v-html="item.recommendDesc"></div>
              <i class="el-icon-info"></i>
            </el-tooltip>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="boxId:" prop="boxId">
          <el-input v-model="dataForm.boxId" placeholder="boxId" />
        </el-form-item>
         <el-form-item label="接口类型:" prop="interfaceType">
          <el-radio-group v-model="dataForm.interfaceType">
            <el-radio
              v-for="(item, index) in interfaceList"
              :key="index"
              :label="item.baseValue"
              @change="interfaceClisk(item.baseValue)"
            >
              {{item.baseName}}
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
        <el-button type="primary" @click="dataSubmit" :loading="loadingVlaue">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveorupt, listSceneBoxInfo, getSceneInterfaceType } from '@/api/lexicon/sceneManage'
export default {
  data () {
    return {
      visible: false,
      loadingVlaue: false,
      typeList: [],
      interfaceList: [],
      productPoolList: [ // 商品池
        {
          id: '1',
          name: '上架全量商品'
        }
      ],
      dataForm: {
        sceneName: '',
        boxId: '',
        recommendTypeId: '',
        goodsPool: '',
        sceneType: 1,
        baseName: '',
        interfaceType: ''
      },
      dataRule: {
        sceneName: [
          { required: true, message: '请输入场景名称', trigger: 'blur' }
        ],
        boxId: [
          { required: true, message: 'boxId不能为空', trigger: 'change' }
        ],
        recommendTypeId: [
          { required: true, message: '请选择推荐类型', trigger: 'change' }
        ],
        interfaceType: [
          { required: true, message: '请选择接口类型', trigger: 'change' }
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
        goodsPool: '',
        recommendTypeId: '',
        sceneType: 1,
        baseName: '',
        interfaceType: ''
      }
      listSceneBoxInfo().then(({data}) => {
        this.typeList = data.data
      })
      getSceneInterfaceType().then(({data}) => {
        this.interfaceList = data.data
      })
    },
    searchProductNum () { // 查询商品数量
      console.log(3)
    },
    recommendClisk (val) {
      this.dataForm.recommendTypeId = val
    },
    interfaceClisk (val) {
      this.dataForm.interfaceType = val
    },
    cancel () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    },
    dataSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loadingVlaue = true
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
                  this.loadingVlaue = false
                  this.$emit('childByValue', this.visible)
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.msg)
              this.loadingVlaue = false
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .el-radio+.el-radio{
    margin-left: 0;
    margin-top: 5px;
  }
  .pool-sel {
    width: 280px;
    margin-right: 10px
  }
</style>
