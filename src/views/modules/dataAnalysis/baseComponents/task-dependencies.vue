<template>
  <el-dialog title="流转依赖任务" :modal-append-to-body="false" :append-to-body="true" :visible.sync="visible" width="50%" :close-on-click-modal="false">
    <el-table :data="dataList" height="600px;" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="任务ID"></el-table-column>
      <el-table-column prop="transferName" header-align="center" align="center" label="任务名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.transferName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.transferName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"></el-table-column>
      <el-table-column prop="comUpdate" header-align="center" align="center" label="任务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.comUpdate === true" size="small">已完成</el-tag>
          <el-tag v-else size="small" type="danger">未完成</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="saveHandle" size="small">更新</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
      <dataInsightManageAddOrUpdate ref="dataInsightManageAddOrUpdate"></dataInsightManageAddOrUpdate>
      <resourceBindAddOrUpdate ref="resourceBindAddOrUpdate"></resourceBindAddOrUpdate>
  </el-dialog>
</template>
<script>
import dataInsightManageAddOrUpdate from './dataInsightManage-add-or-update'
import resourceBindAddOrUpdate from './resourceBind-add-or-update'
import { updateDataTransferManage, infoDataTransferManage, addCanvasInfo } from '@/api/dataAnalysis/dataTransferManage'
export default {
  props: {
    // 父组件传来的值需定义一下
    dataList: {
      default: [],
      type: Array // 类型
    }
  },
  data () {
    return {
      visible: false,
      dataListLoading: false
    }
  },
  components: {
    dataInsightManageAddOrUpdate,
    resourceBindAddOrUpdate
  },
  methods: {
    init () {
      this.dataList.forEach((item, index) => {
        item.comUpdate = false
      })
      this.visible = true
    },
    // 提交数据格式化
    formatPostData (data) {
      let postData = {}
      postData.id = data.id ? data.id : ''
      postData.beeFlowId = data.beeFlowId ? data.beeFlowId : ''
      postData.decisionType = data.decisionType
      postData.triggerMode = data.triggerMode
      postData.transferCategory = data.transferCategory
      postData.taskUniqueFlag = data.taskUniqueFlag
      postData.dolphinProcessId = data.dolphinProcessId
      postData.transferName = data.transferName
      postData.templateId = data.templateId
      postData.transferType = data.transferType
      postData.taskDescribtion = data.taskDescribtion
      postData.authOwner = data.authOwner
      postData.authOtherList = data.authOtherList
      postData.authOthers = data.authOthers
      postData.sourceBindingIds = data.sourceBindingIds
      postData.increModel = data.increModel
      postData.taskScheduleConfig = data.taskScheduleConfig
      postData.compensationType = data.compensationType
      postData.compensationCodes = data.compensationCodes
      postData.configJson = data.configJson
      return postData
    },
      // saveHandle() {
      //     this.$emit('saveData', 'save', async (val) => { // val是父组件请求接口返回的数据
      //         if (val.status === '1') {
      //             for (let i = 0; i < this.dataList.length; i++) {
      //                 await new Promise(resolve => setTimeout(resolve, 5000 * i))
      //                 const item = this.dataList[i]
      //                 const data = await infoDataTransferManage(item.id)
      //                 if (data.status === '1' && data.data) {
      //                     const params = this.formatPostData(data.data)
      //                     const resData = await updateDataTransferManage(params)
      //                     console.log('res3333: ', resData)
      //                     if (resData.status === '1') {
      //                         item.comUpdate = true
      //                         this.$set(this.dataList, i, item)
      //                         if (i === this.dataList.length - 1) {
      //                             this.$message({
      //                                 message: '更新成功',
      //                                 type: 'success',
      //                                 duration: 1500,
      //                                 onClose: () => {
      //                                     this.visible = false
      //                                     this.$emit('updateClosed')
      //                                 }
      //                             })
      //                         }
      //                     } else {
      //                         this.$message.error(resData.message || '数据异常')
      //                         this.visible = false
      //                     }
      //                 }
      //             }
      //         }
      //     })
      // },
      saveHandle() {
          this.$emit('saveData', 'update', val => { // val是父组件请求接口返回的数据
            console.log('val' + val)
              if (val.status === '1') {
                console.log('1')
                  let index = 0
                  const processItem = () => {
                      if (index < this.dataList.length) {
                        console.log('2')
                          const item = this.dataList[index]
                          infoDataTransferManage(item.id)
                              .then(({data}) => {
                                  if (data.status === '1' && data.data) {
                                      const params = this.formatPostData(data.data)
                                      if (data.data.decisionType === '1') {
                                        return addCanvasInfo(params)
                                      } else {
                                        return updateDataTransferManage(params)
                                      }
                                  } else {
                                      throw new Error('Invalid data status or no data')
                                  }
                              })
                              .then(response => {
                                  console.log('res3333: ', response.data)
                                  if (response.data.status === '1') {
                                      this.$set(this.dataList, index, {...item, comUpdate: true})

                                      this.$nextTick(() => {
                                          if (index === this.dataList.length - 1) {
                                              this.$message({
                                                  message: '更新成功',
                                                  type: 'success',
                                                  duration: 1500,
                                                  onClose: () => {
                                                      this.visible = false
                                                      this.$emit('updateClosed')
                                                  }
                                              })
                                          }
                                      })
                                  } else {
                                      this.$message.error(response.data.message || '数据异常')
                                      this.visible = false
                                  }
                              })
                              .catch(error => {
                                  console.error('An error occurred:', error)
                              })
                              .finally(() => {
                                  index++
                                  setTimeout(processItem, 5000)
                              })
                      }
                  }
                  processItem()
              }
              })
      },
    //
    //   async saveHandle() {
    //     for (let index = 0; index < this.dataList.length; index++) {
    //         const item = this.dataList[index]
    //         try {
    //             const { data } = await infoDataTransferManage(item.id)
    //             if (data.status === '1' && data.data) {
    //                 const params = this.formatPostData(data.data)
    //                 const response = await updateDataTransferManage(params)
    //                 console.log('res3333: ', response.data)
    //                 if (response.data.status === '1') {
    //                     this.$set(this.dataList, index, { ...item, comUpdate: true })
    //                     // 使用 this.$nextTick 确保在下一个 DOM 更新周期中执行
    //                     this.$nextTick(() => {
    //                         if (index === this.dataList.length - 1) {
    //                             this.$message({
    //                                 message: '更新成功',
    //                                 type: 'success',
    //                                 duration: 1500,
    //                                 onClose: () => {
    //                                     this.visible = false
    //                                     this.$emit('updateClosed')
    //                                     // this.$refs.dataInsightManageAddOrUpdate.saveData()
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 } else {
    //                     this.$message.error(response.data.message || '数据异常')
    //                     this.visible = false
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('An error occurred:', error)
    //         }
    //         // 等待5秒钟
    //         await new Promise(resolve => setTimeout(resolve, 5000))
    //     }
    // },
    // saveHandle () {
    //   this.$emit('saveData', 'save', val => { // val是父组件请求接口返回的数据
    //     if (val.status === '1') {
    //       this.dataList.forEach((item, index) => {
    //         // let tableData = this.dataList
    //         infoDataTransferManage(item.id).then(({ data }) => {
    //           if (data.status === '1' && data.data) {
    //             let params = this.formatPostData(data.data)
    //             updateDataTransferManage(params).then(({ data }) => {
    //               console.log('res3333: ', data)
    //               if (data.status === '1') {
    //                 item.comUpdate = true
    //                 this.$set(this.dataList, index, item)
    //                 if (index === this.dataList.length - 1) {
    //                   this.$message({
    //                     message: '更新成功',
    //                     type: 'success',
    //                     duration: 1500,
    //                     onClose: () => {
    //                       this.visible = false
    //                       this.$emit('updateClosed')
    //                     }
    //                   })
    //                 }
    //               } else {
    //                 this.$message.error(data.message || '数据异常')
    //                 this.visible = false
    //               }
    //             })
    //           }
    //         })
    //       })
    //     }
    //   })
    // },
    cancelHandle () {
      this.visible = false
    }
  }
}
</script>