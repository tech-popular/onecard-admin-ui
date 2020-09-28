<template>
  <el-dialog title="数据查询"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false">
    <el-form :model="dataForm" label-width="120px" ref="dataForm" :rules="dataRules">
      <el-form-item prop="channelCode" label="用户所属渠道">
        <el-select v-model="dataForm.channelCode" placeholder="请选择用户所属渠道" style="width: 400px" @change="channelCodeChange">
          <el-option v-for="(item, index) in channelList" :key="index" :value="item.value" :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="groupId" label="分群名称">
        <el-select v-model="dataForm.groupId" multiple clearable filterable placeholder="请选择分群" style="width: 400px" @change="groupIdChange">
          <el-option v-for="(item, index) in custerList" :key="index" :value="item.value" :label="item.text" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">确定</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { custerList, channelsList } from '@/api/dataAnalysis/dataDecisionManage'
export default {
  props: {
    data: Object
  },
  data () {
    return {
      id: '',
      key: '',
      visible: false,
      channelList: [],
      custerList: [],
      curCusterType: '',
      custerArr: [],
      dataForm: {
        channelCode: '',
        groupId: []
      },
      dataRules: {
        channelCode: [
          { required: true, message: '请选择用户所属渠道', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择分群', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init (data) {
      this.visible = true
      this.key = data.key
      this.curCusterType = ''
      this.getChannelsList()
      if (data.data) {
        this.dataForm.channelCode = data.data.configItems.channelCode
        this.getCusterList(this.dataForm.channelCode)
        this.dataForm.groupId = data.data.configItems.groupId
        this.curCusterType = data.data.type
      }
    },
    getChannelsList () {
      channelsList().then(({data}) => {
        if (data.status * 1 !== 1) {
          this.channelList = []
          return
        }
        this.channelList = data.data.filter(item => item.value !== '0000')
      })
    },
    channelCodeChange (val) {
      this.getCusterList(val)
    },
    getCusterList (code) {
      custerList(code).then(({data}) => {
        if (data.status * 1 !== 1) {
          this.custerList = []
          return
        }
        this.custerList = data.data
        // if (this.dataForm.groupId.length) {
        //   this.curCusterType = this.custerList.filter(citem => citem.value === this.dataForm.groupId[0])[0].type
        //   this.custerList.map(item => {
        //     if (item.type !== this.curCusterType) {
        //       item.disabled = true
        //     }
        //   })
        // }
      })
    },
    groupIdChange () {
      // let arr = []
      // if (!this.dataForm.groupId.length) {
      //   this.custerList.map(item => {
      //     item.disabled = false
      //   })
      // } else {
      //   if (this.dataForm.groupId.length === 1) {
      //     this.curCusterType = this.custerList.filter(citem => citem.value === this.dataForm.groupId[0])[0].type
      //     this.custerList.map(item => {
      //       if (item.type !== this.curCusterType) {
      //         item.disabled = true
      //       }
      //     })
      //   }
      // }
      // this.dataForm.groupId.forEach(item => {
      //   let obj = this.custerList.filter(citem => citem.value === item)[0]
      //   arr.push(obj)
      // })
      // this.custerArr = arr
      let arr = []
      this.dataForm.groupId.forEach(item => {
        let obj = this.custerList.filter(citem => citem.value === item)[0]
        arr.push(obj)
      })
      this.custerArr = arr
    },
    saveHandle () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let isStatic = this.custerArr.filter(item => item.type === 'static')
          let isDynamic = this.custerArr.filter(item => item.type === 'dynamic')
          if (isStatic.length && isDynamic.length) {
            this.curCusterType = 'MIXED'
          }
          if (isStatic.length && !isDynamic.length) {
            this.curCusterType = 'STATIC'
          }
          if (!isStatic.length && isDynamic.length) {
            this.curCusterType = 'DYNAMIC'
          }
          let config = {
            configItems: this.dataForm,
            custerArr: this.custerArr
          }
          this.$emit('close', { tag: 'save', data: { config: config, key: this.key }, type: this.curCusterType })
          this.$parent.dataQueryNodeVisible = false
        }
      })
    },
    cancelHandle () {
      this.visible = false
      this.$parent.dataQueryNodeVisible = false
    }
  }
}
</script>
