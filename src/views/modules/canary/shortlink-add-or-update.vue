<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="缩短网址" name="first">
      <el-form :model="dataForm" :inline="true" ref="dataForm"  label-width="80px">
        <el-form-item  prop="url">
          <el-input v-model="dataForm.key" placeholder="原始链接" style="width: 550px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveShortLink()" >缩短网址</el-button>
        </el-form-item>
      </el-form>
      <div>
         <el-button  type="text" ref="copyurl"> 短网址: {{dataForm.shortLinkCode}} </el-button>
         <el-button v-if="dataForm.shortLinkCode" v-clipboard="dataForm.shortLinkCode">复制</el-button>
        <br>
        <el-button  type="text"> 原网址: {{dataForm.url}}</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="网址还原" name="second">
      <el-form :model="secondForm" :inline="true" ref="secondForm"  label-width="80px">
        <el-form-item  >
          <el-input v-model="secondForm.key" placeholder="短链接" style="width: 550px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getShortLink()" >还原网址</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button  type="text" ref="copyurl"> 短网址: {{secondForm.shortLinkCode}} </el-button>
        <br>
        <el-button  type="text"> 原网址: {{secondForm.url}}</el-button>
        <el-button v-if="secondForm.url" v-clipboard="secondForm.url">复制</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
  </el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        activeName: 'first',
        visible: false,
        dataForm: {
          key: '',
          url: '',
          shortLinkCode: ''
        },
        secondForm: {
          key: '',
          url: '',
          shortLinkCode: ''
        }
      }
    },
    methods: {
      init () {
        this.visible = true
        this.dataForm.key = ''
        this.dataForm.url = ''
        this.dataForm.shortLinkCode = ''
        this.secondForm.key = ''
        this.secondForm.url = ''
        this.secondForm.shortLinkCode = ''
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      saveShortLink () {
        console.log(this.dataForm.key)
        if (this.dataForm.key) {
          this.$http({
            url: this.$http.adornUrl(`/canary/middlewareshortlink/shortLink/save`),
            method: 'post',
            data: this.$http.adornData({
              'url': this.dataForm.key
            })
            // params: this.$http.adornParams({
            //   'url': this.dataForm.key
            // })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.shortLinkCode = data.savemiddleware.data.shortLinkUrl
              this.dataForm.url = data.savemiddleware.data.url
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      getShortLink () {
        if (this.secondForm.key) {
          this.$http({
            url: this.$http.adornUrl(`/canary/middlewareshortlink/search`),
            method: 'post',
            params: this.$http.adornParams({
              'url': this.secondForm.key
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.secondForm.shortLinkCode = data.searchmiddleware.shortLinkUrl
              this.secondForm.url = data.searchmiddleware.url
              console.log(this.secondForm.shortLinkCode)
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>
