<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1300px" class="data-transfer-manage-drawer">
    <div slot="title" class="drawer-title">
      FTP提数
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap">
      <el-form v-loading="loading" :model="baseForm" :rules="baseRule" label-width="80px" ref="baseForm" class="base-form">
        <div class="base-pane">
          <div style="display:flex">
            <div style="width:30%">
              <h3>目录</h3>
              <div class="dimension-tree">
                <el-input class="code-select" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                <el-tree
                  class="filter-tree"
                  node-key="id"
                  :data="dataTree"
                  :props="defaultProps"
                  default-expand-all
                  :current-node-key="currentLivingId"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  highlight-current
                  @node-click="treeNodeClick"
                  ref="tree"
                ></el-tree>
              </div>
            </div>
            <div style="width:70%">
              <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="90"></el-table-column>
                <el-table-column type="index" header-align="center" align="center" label="序号"></el-table-column>
                <el-table-column prop="name" header-align="center" align="center" label="文件名称"></el-table-column>
                <el-table-column prop="suffix" header-align="center" align="center" label="文件格式"></el-table-column>
                <el-table-column prop="lastModifiedTime" header-align="center" align="center" label="修改时间"></el-table-column>
              </el-table>
              <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
              ></el-pagination>
              <span style="color:#2093f7">已勾选：</span>
              <div style="margin-left:50px">
                <span v-for="(item,index) in multipleSelection" :key="index">
                  {{item.fileName}}
                  <br />
                </span>
              </div>
              <div style="margin-left:50px;margin-top:50px;">
                <el-form-item label="申请原因" prop="approveReason">
                  <el-input v-model="baseForm.approveReason" type="textarea"></el-input>
                </el-form-item>
                <el-form-item prop="receiver" label="数据接收人" label-width="100px">
                  <el-select filterable multiple v-model="baseForm.receiver" class="reject-pane-item" placeholder="请选择">
                    <el-option v-for="item in userList" :value="item.userid" :key="item.id" :label="item.name || item.username "></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提数方式" prop="receiveType">
                  <el-radio v-model="baseForm.receiveType" label="0">钉钉</el-radio>
                  <el-radio v-model="baseForm.receiveType" label="1" style="margin-left:5px;">邮件</el-radio>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="severDataFormSubmit" size="small">立即申请</el-button>
      <el-button type="default" @click="cancelHandle" size="small">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getFtpMenuLis, getUsersList, getFtpDataList, saveDataFtp } from '@/api/withdrawal/datareport'
export default {
  data () {
    return {
      loading: false,
      visible: true,
      isInnerIP: false,
      dataTree: [
        {
          id: 0,
          fileName: '所有文件',
          children: []
        }
      ],
      dataListLoading: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      filterText: '',
      currentLivingId: '', // 默认选中的节点
      selecttreeData: {},
      baseForm: {
        id: '',
        approveReason: '', // 申请原因
        receiveType: '0', // 接收类型
        receiver: [] // 接收人
      },
      userList: [],
      multipleSelection: [], // 多选数据
      defaultProps: {
        children: 'children',
        label: 'fileName'
      },
      baseRule: {
        approveReason: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ],
        receiver: [
          { type: 'array', required: true, message: '请选择接收人', trigger: 'change' }
        ],
        period: [
          { required: true, message: '请选择提数周期', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 打开抽屉弹窗
    init () {
      this.getUsersList()
      this.visible = true
      getFtpMenuLis().then(({ data }) => {
        console.log('data: ', data)
        if (data && data.code === 0) {
          this.dataTree[0].children = data.data.dataList
          this.treeNodeClick(data.data.dataList[0])
          this.currentLivingId = data.data.dataList[0].fileName
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.currentLivingId)
          })
        }
      })
      this.$nextTick(() => {
        this.$refs['baseForm'].resetFields()
      })
    },
    // 获取用户同一租户下的列表
    getUsersList () {
      getUsersList().then(({ data }) => {
        if (data && data.code === 0) {
          this.userList = data.data
        } else {
          this.userList = []
        }
      })
    },
    // 选择文件
    treeNodeClick (data, node) {
      this.selecttreeData = data
      this.getFtpTableList()
    },
    filterNode (value, data, node) {
      if (!value) return true
      return data.typeValue && data.typeValue.indexOf(value) !== -1
    },
    getFtpTableList () {
      this.dataListLoading = true
      let params = {
        'page': this.pageIndex,
        'pageSize': this.pageSize,
        'path': this.selecttreeData.path
      }
      getFtpDataList(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data.dataList
          this.totalPage = data.data.totalPage
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.dataListLoading = false
        }
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log('this.multipleSelection: ', this.multipleSelection);
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getFtpTableList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getFtpTableList()
    },
    severDataFormSubmit () {
      this.$refs['baseForm'].validate(valid => {
        if (valid) {
          if (!this.multipleSelection.length) {
            return this.$message({
              message: '请在勾选文件后保存提数申请',
              type: 'error',
              center: true
            })
          }
          let ftpFileUrlData = []
          let ftpFileName = []
          this.multipleSelection.forEach(item => {
            ftpFileUrlData.push(item.path)
            ftpFileName.push(item.fileName)
          })
          let params = {
            'ftpFileUrl': ftpFileUrlData.join(','),
            'ftpFileName': ftpFileName.join(','),
            'approveReason': this.baseForm.approveReason,
            'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
            // 'receiveType': Number(this.baseForm.receiveType)
          }
          saveDataFtp(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('refreshDataList')
                  this.$refs['baseForm'].resetFields()
                  this.visible = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 关闭抽屉弹窗
    drawerClose () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    },
    // 关闭
    cancelHandle () {
      this.visible = false
      this.$parent.addOrUpdateVisible = false
    }
  }
}
</script>
<style lang="scss">
.data-transfer-manage-drawer {
  & .wrap {
    padding: 0 20px 20px;
    margin-top: -12px;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 75px;
    bottom: 55px;
    .step-title {
      height: 30px;
      background: #e8e2e2;
      line-height: 30px;
      padding-left: 20px;
    }
    .steps-horizontal {
      height: 200px;
      display: flex;
      align-items: center;
      padding-left: 100px;
      border-bottom: 2px solid #97999e;
      font-weight: bolder;
      color: #333;
      .horizontal-one {
        height: 120px;
      }
      .one-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        border-color: #67c23a;
        color: #47ca6f;
        line-height: 90px;
        text-align: center;
      }
      .horizontal-line {
        height: 4px;
        width: 350px;
        background-color: #9b9c9e;
        margin-top: -10px;
      }
      .horizontal-icon {
        font-size: 28px;
        color: #9b9c9e;
        margin-left: -10px;
        margin-top: -10px;
      }
      .two-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        color: #303133;
        border-color: #ced3de;
        font-weight: bolder;
        line-height: 90px;
        text-align: center;
      }
      .three-title {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 4px solid;
        color: #47ca6f;
        border-color: #ced3de;
        font-weight: bolder;
        line-height: 90px;
        text-align: center;
      }
    }
  }
  .reject-pane-item {
    width: 50%;
  }
  & .drawer-title {
    padding: 15px;
    background: #333;
    color: #fff;
    font-size: 15px;
    margin: -20px -20px 0 -20px;
    position: relative;
  }
  & .drawer-close {
    position: absolute;
    right: 20px;
  }
  & .footer {
    position: absolute;
    bottom: 0;
    background: #fff;
    padding: 10px 22px 10px 10px;
    width: 100%;
    height: 55px;
    text-align: right;
    box-shadow: 0 -2px 9px 0 rgba(153, 169, 191, 0.17);
    z-index: 500;
  }
  & .vue-treeselect {
    min-height: 38px;
    line-height: 24px;
    max-width: 100%;
  }
  & .base-pane {
    // border-bottom: 1px dashed #ccc;
    & .label-remove-margin {
      & .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  & .base-pane-item {
    width: 80%;
  }
  & .base-select {
    width: 40%;
  }
  // & .base-form{
  //   & .pane-rules{
  //     & .el-form-item__content{
  //       margin-left: 0px !important;
  //     }
  //   }
  // }
  & .radio-item {
    margin-right: 15px;
  }
  & .radio-passive {
    margin-left: 30px;
  }
  & .radio-incremodel {
    margin-right: 15px;
  }
  & .transfer-log {
    margin-left: 20px;
  }
  .aside-main {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    display: flex;
  }
  .dimension-tree {
    width: 300px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 600px;
    border: 1px solid #e6e6e6;
  }
  .code-select {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 6px;
  }
}
</style>
