<template>
  <div class="dataService-sftp-wrap">
    <el-form v-loading="loading" :model="baseForm" :rules="baseRule" label-position="right" label-width="100px" ref="baseForm" class="base-form">
      <div style="margin-bottom:10px">
        <span>目录</span>
        <el-button size="small" type="success" style="margin-left:20px" @click="refreshTree">刷新目录</el-button>
      </div>
      <div style="display:flex">
        <div style="width:30%">
          <div class="dimension-tree">
            <!-- <el-input class="code-select" placeholder="输入关键字进行过滤" v-model="filterText"></el-input> -->
            <el-tree
              v-if="treeVisible"
              class="filter-tree"
              node-key="id"
              :props="defaultProps"
              :load="loadNode"
              lazy
              :expand-on-click-node="false"
              :current-node-key="currentLivingId"
              :filter-node-method="filterNode"
              highlight-current
              @node-click="treeNodeClick"
              ref="tree"
            ></el-tree>
            <!-- <el-tree class="filter-tree" node-key="id" :props="defaultProps" :load="loadNode" lazy :filter-node-method="filterNode" @node-click="treeNodeClick" ref="tree"></el-tree> -->
          </div>
        </div>
        <div style="width:65%">
          <el-table :data="dataList" :row-key="getRowKeys" ref="ftpDataTable" border v-loading="dataListLoading" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserveSelection="true" width="90"></el-table-column>
            <el-table-column prop="num" header-align="center" align="center" label="序号"></el-table-column>
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
          <div style="margin-left:0px;margin-top:50px;">
<!--            <el-form-item>-->
<!--                <el-tag type="danger">注：暂不支持中文文件名称提取，请修改为英文文件名称后操作</el-tag>-->
<!--            </el-form-item>-->
            <el-form-item label="申请原因" prop="approveReason">
              <el-input v-model="baseForm.approveReason" type="textarea"></el-input>
            </el-form-item>
            <el-form-item prop="receiver" label="数据接收人">
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
    </el-form>
    <div class="ftp-footer">
      <el-button type="primary" @click="severDataFormSubmit" size="small">立即申请</el-button>
    </div>
  </div>
</template>
<script>
import { getSftpMenuLis, getSftpDataList } from '@/api/dataGovernance/datareport'
import { getUsersList, saveTask } from '@/api/dataGovernance/subscribeManage'
export default {
  data () {
    return {
      loading: false,
      visible: true,
      isInnerIP: false,
      treeVisible: true,
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
      multipleSelectionData: [], // 已勾选的数据
      defaultProps: {
        children: 'children',
        label: 'fileName'
      },
      node_had: [], // 触发 tree 的 :load=loadNode 重复触发  动态更新tree
      resolve_had: [], // 触发 tree 的 :load=loadNode 重复触发  动态更新tree
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
  mounted () {
    this.getUsersList()
  },
  methods: {
    getRowKeys (row) {
      return row.num
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.node_had = node // 这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        this.resolve_had = resolve // 同上，把node.level == 0的resolve也存起来
        this.getTreeData('', resolve)
      } else {
        this.getTreeData(node, resolve)
      }
    },
    getTreeData (node, resolve) {
      let params = {
        path: node.data ? node.data.path : ''
      }
      getSftpMenuLis(params).then(({ data }) => {
        console.log('data: ', data)
        if (data && data.code === 0) {
          if (!node.data) {
            this.selecttreeData.path = '/'
            this.getFtpTableList()
          }
          return resolve(data.menuList)
        } else {
          return resolve([])
        }
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
      return data.fileName && data.fileName.indexOf(value) !== -1
    },
    getFtpTableList () {
      this.dataListLoading = true
      let params = {
        'page': this.pageIndex,
        'pageSize': this.pageSize,
        'path': this.selecttreeData.path
      }
      getSftpDataList(params).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.data) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.totalPage = 0
          this.dataListLoading = false
        }
      })
    },
    // 刷新目录
    refreshTree () {
      this.node_had.childNodes = [] // 把存起来的node的子节点清空，不然会界面会出现重复树！
      this.dataListLoading = true
      // this.loadNode(this.node_had, this.resolve_had); //再次执行懒加载的方法
      this.getTreeData(this.node_had, this.resolve_had)
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 取两个对象数组的并集且去重
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.fileName) && res.set(arr.fileName, 1))
    },
    // 从一个对象数组中过滤过另一个对象数组的内容
    filterArr (a, b) {
      return [...b].filter(x => [...a].every(y => y.fileName !== x.fileName))
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
          let sftpFileUrlData = []
          let sftpFileName = []
          this.multipleSelection.forEach(item => {
            sftpFileUrlData.push(item.path)
            sftpFileName.push(item.fileName)
          })
          let params = {
            'fileUrl': sftpFileUrlData.join(','),
            'fileName': sftpFileName.join(','),
            'approveReason': this.baseForm.approveReason,
            'receiver': this.baseForm.receiver.length === 1 ? this.baseForm.receiver[0] : this.baseForm.receiver.join(','),
            'receiveType': Number(this.baseForm.receiveType),
            'type': 2
          }
          saveTask(params).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$refs['baseForm'].resetFields()
                  this.$refs.ftpDataTable.clearSelection()
                  this.refreshTree()
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
.dataService-sftp-wrap {
  padding: 0 20px 20px;
  margin-top: -12px;
  width: 100%;
  overflow-y: auto;
  position: absolute;
  top: 75px;
  bottom: 55px;
}
.ftp-footer {
  width: 10%;
  float: right;
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
  overflow-y: scroll;
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
.el-tree__empty-block {
  width: 290px;
}
.filter-tree {
  width: 100%;
}
</style>
