<template>
  <el-drawer :append-to-body="false" :visible.sync="visible" :show-close="false" :wrapperClosable="false" size="1300px" class="api-manage-drawer">
    <div slot="title" class="drawer-title">
      {{canUpdate ? '编辑' : '查看' }}调度配置
      <i class="el-icon-close drawer-close" @click="drawerClose"></i>
    </div>
    <div class="wrap" v-loading="loading">
      <h3 id="title">基础信息</h3>
      <el-form :model="dataForm" ref="dataForm1" label-width="110px">
        <div class="work-type-pane">
          <!-- <el-form-item label="订阅主题：" prop="theme">
            <el-input v-model="dataForm.theme" placeholder="任务名称" disabled style="width: 400px">
            </el-input>
          </el-form-item> -->
          <el-form-item label="任务ID：" prop="id">
            <el-input v-model="id" placeholder="任务ID" disabled style="width: 300px" />
          </el-form-item>
        </div>
      </el-form>
      <div class="work-content-1">
        <h3 style="overflow:hidden">
          蜂巢调度任务依赖
        </h3>
        <div class="work-type-pane" style="align-items: flex-start;margin-top:10px">
         <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" style="display:flex">
            <span style="width: 150px">所有依赖</span>
            <el-input v-model="honeycombTasksLeftSearchText" size="mini" placeholder="请输入搜索关键字">
              <el-button slot="append" icon="el-icon-search" @click="honeycombTasksSearchTableHandle"></el-button>
            </el-input>
          </div>
          <el-table ref="multipleLeftTable" :data="honeycombTasksLeftTableData" border @selection-change="honeycombTasksHandleLeftSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchJobId" label="任务ID"></el-table-column>
            <el-table-column header-align="center" align="center" prop="jobName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchSystem" label="所属系统">
              <template slot-scope="scope">{{scope.row.dispatchSystem === 1 ? '蜂巢': '老调度'}}
             </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="honeycombTasksSizeChangeHandle"
            @current-change="honeycombTasksCurrentChangeHandle"
            :current-page="honeycombTasksPageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="honeycombTasksPageSize"
            :total="honeycombTasksTotalCount"
            style="margin-top:20px"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </el-card>
      </el-col>
      <el-col :span="2" style="text-align:center">
        <el-button size="mini" type="primary" style="margin-top: 100px" @click="honeycombTasksAddToRight">添加至</el-button>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选依赖</span>
            <el-button style="float: right;" size="mini" type="danger" @click="honeycombTasksMultiDeleteHandle">批量删除</el-button>
          </div>
          <el-table ref="multipleRightTable" :data="honeycombTasksRightTableData" border @selection-change="honeycombTasksHandleRightSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
             <el-table-column header-align="center" align="center" prop="dispatchJobId" label="任务ID"></el-table-column>
            <el-table-column header-align="center" align="center" prop="jobName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchSystem" label="所属系统">
              <template slot-scope="scope">{{scope.row.dispatchSystem === 1 ? '蜂巢': '老调度'}}
             </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <a style="cursor: pointer" @click="honeycombTasksDeleteDependenceHandle(scope.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
        </div>
      </div>
      <div class="work-content-1">
        <h3 style="overflow:hidden">
          老调度任务依赖
        </h3>
        <div class="work-type-pane" style="align-items: flex-start;margin-top:10px">
         <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" style="display:flex">
            <span style="width: 150px">所有依赖</span>
            <el-input v-model="oldDispatchTaskLeftSearchText" size="mini" placeholder="请输入搜索关键字">
              <el-button slot="append" icon="el-icon-search" @click="oldDispatchTaskSearchTableHandle"></el-button>
            </el-input>
          </div>
          <el-table ref="oldmultipleLeftTable" :data="oldDispatchTaskLeftTableData" border @selection-change="oldDispatchTaskHandleLeftSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchJobId" label="任务ID"></el-table-column>
            <el-table-column header-align="center" align="center" prop="jobName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchSystem" label="所属系统">
              <template slot-scope="scope">{{scope.row.dispatchSystem === 1 ? '蜂巢': '老调度'}}
             </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="oldDispatchTaskSizeChangeHandle"
            @current-change="oldDispatchTaskCurrentChangeHandle"
            :current-page="oldDispatchTaskPageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="oldDispatchTaskPageSize"
            :total="oldDispatchTaskTotalCount"
            style="margin-top:20px"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </el-card>
      </el-col>
      <el-col :span="2" style="text-align:center">
        <el-button size="mini" type="primary" style="margin-top: 100px" @click="oldDispatchTaskAddToRight">添加至</el-button>
      </el-col>
      <el-col :span="11">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>已选依赖</span>
            <el-button style="float: right;" size="mini" type="danger" @click="oldDispatchTaskMultiDeleteHandle">批量删除</el-button>
          </div>
          <el-table ref="oldmultipleRightTable" :data="oldDispatchTaskRightTableData" border @selection-change="oldDispatchTaskHandleRightSelectChange">
            <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
             <el-table-column header-align="center" align="center" prop="dispatchJobId" label="任务ID"></el-table-column>
            <el-table-column header-align="center" align="center" prop="jobName" label="任务名称"></el-table-column>
            <el-table-column header-align="center" align="center" prop="dispatchSystem" label="所属系统">
              <template slot-scope="scope">{{scope.row.dispatchSystem === 1 ? '蜂巢': '老调度'}}
             </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <a style="cursor: pointer" @click="oldDispatchTaskDeleteDependenceHandle(scope.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
        </div>
      </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="canUpdate" type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import {honeycombTasks, oldDispatchTasks, configDepend, queryDenpendJob} from '@/api/dataGovernance/subscribeManage'
export default {
  components: {},
  data () {
    return {
      visible: false,
      loading: false,
      id: '',
      selectedDpendeceData: [], // 已选新调度任务
      selectedOldDpendeceData: [], // 已选老调度任务
      dataForm: {
        id: '',
        theme: ''
      },
      // 蜂巢
      honeycombTasksPageNo: 1, // 当前页
      honeycombTasksPageSize: 10, // 默认每页10条
      honeycombTasksTotalCount: 0,
      honeycombTasksLeftSearchText: '',
      honeycombTasksLeftSelectedData: [],
      honeycombTasksRightSelectedData: [],
      honeycombTasksLeftTableData: [],
      honeycombTasksRightTableData: [],
      // 老调度
      oldDispatchTaskPageNo: 1, // 当前页
      oldDispatchTaskPageSize: 10, // 默认每页10条
      oldDispatchTaskTotalCount: 0,
      oldDispatchTaskLeftSearchText: '',
      oldDispatchTaskLeftSelectedData: [],
      oldDispatchTaskRightSelectedData: [],
      oldDispatchTaskLeftTableData: [],
      oldDispatchTaskRightTableData: [],
      //  权限
      userid: sessionStorage.getItem('id'),
      username: sessionStorage.getItem('username'),
      isAdmin: sessionStorage.getItem('username') === 'admin',
      canUpdate: true
    }
  },
  methods: {
    init (row) {
      this.id = row.id
      this.canUpdate = this.isAdmin || row.authOtherList.includes(this.userid || this.username) || row.authOwner === this.userid || row.authOwner === this.username
      this.visible = true
      this.$nextTick(() => {
        document.getElementById('title').scrollIntoView()
        this.loading = true
        this.getTaskBaseInfo()
        // setTimeout(() => {
        //   this.loading = false
        // }, 500)
      })
    },
    // 基础信息
    getTaskBaseInfo () {
        queryDenpendJob(this.id).then(({data}) => {
          this.honeycombTasksRightTableData = []
          this.oldDispatchTaskRightTableData = []
          if (data.code !== 0) {
            return this.$message.error(data.msg || '获取数据异常')
          }
          data.data.forEach(element => {
            if (element.dispatchSystem === 1) {
              this.honeycombTasksRightTableData.push(element)
            } else {
              this.oldDispatchTaskRightTableData.push(element)
            }
          })
          this.getHoneycombTasksDependence()
          this.getOldTaskSelectDependence()
        })
    },
    // 蜂巢任务
    getHoneycombTasksDependence () {
      let parsms = {
        jobName: this.honeycombTasksLeftSearchText,
        currPage: this.honeycombTasksPageNo,
        pageSize: this.honeycombTasksPageSize
      }
      honeycombTasks(parsms).then(({data}) => {
        this.honeycombTasksLeftTableData = []
        this.honeycombTasksTotalCount = 0
        if (data.code !== 0) {
          this.loading = false
          return this.$message.error(data.msg || '获取数据异常')
        }
        if (this.honeycombTasksRightTableData.length) {
          let arr = this.filterArr(this.honeycombTasksRightTableData, data.data.list)
          this.honeycombTasksLeftTableData = arr
        } else {
          this.honeycombTasksLeftTableData = data.data.list
        }
        this.honeycombTasksTotalCount = data.data.totalCount
        this.loading = false
      })
    },
    // 老调度任务依赖列表
    getOldTaskSelectDependence () {
      let parsms = {
        currPage: this.oldDispatchTaskPageNo,
        pageSize: this.oldDispatchTaskPageSize,
        jobName: this.oldDispatchTaskLeftSearchText
      }
      oldDispatchTasks(parsms).then(({data}) => {
        this.oldDispatchTaskLeftTableData = []
        this.oldDispatchTaskTotalCount = 0
        if (data.code !== 0) {
          return this.$message.error(data.msg || '获取数据异常')
        }
        if (this.oldDispatchTaskRightTableData.length) {
         let arr = this.filterArr(this.oldDispatchTaskRightTableData, data.data.list)
          this.oldDispatchTaskLeftTableData = arr
        } else {
          this.oldDispatchTaskLeftTableData = data.data.list
        }
        this.oldDispatchTaskTotalCount = data.data.totalCount
      })
    },
    drawerClose () { // 关闭抽屉弹窗
      this.visible = false
      this.$parent.computAddOrUpdateVisible = false
    },
    refreshListhandle () {
      this.visible = false
      this.$emit('refreshDataList')
    },
    // 提交
    dataFormSubmit (form) {
        let params = {
          id: this.id,
          jobList: [...this.honeycombTasksRightTableData, ...this.oldDispatchTaskRightTableData]
        }
         configDepend(params).then(({data}) => {
        if (data.code !== 0) {
          this.oldDispatchTaskLeftTableData = []
          return this.$message.error(data.msg || '获取数据异常')
        }
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$emit('refreshDataList')
              this.visible = false
            }
          })
      })
    },
    // 蜂巢调度任务
    // 左侧搜索功能
    honeycombTasksSearchTableHandle () {
      this.honeycombTasksPageNo = 1
      this.getHoneycombTasksDependence()
    },
    honeycombTasksHandleLeftSelectChange (val) {
      this.honeycombTasksLeftSelectedData = val
    },
    honeycombTasksHandleRightSelectChange (val) {
      this.honeycombTasksRightSelectedData = val
    },
    // 单独删除
    honeycombTasksDeleteDependenceHandle (index) {
      this.honeycombTasksRightTableData.splice(index, 1)
    },
    // 批量删除
    honeycombTasksMultiDeleteHandle () {
      if (!this.honeycombTasksRightSelectedData.length) return
      let arr = this.filterArr(this.honeycombTasksRightSelectedData, this.honeycombTasksRightTableData)
      this.honeycombTasksRightTableData = arr
    },
    // 添加到右侧
    honeycombTasksAddToRight () {
      if (!this.honeycombTasksLeftSelectedData.length) return
      if (!this.honeycombTasksRightTableData.length) {
        this.honeycombTasksRightTableData = this.honeycombTasksLeftSelectedData
      } else {
        this.honeycombTasksRightTableData = this.unique(this.honeycombTasksRightTableData.concat(this.honeycombTasksLeftSelectedData))
      }
      this.$refs.multipleLeftTable.clearSelection()
    },
    // 取两个对象数组的并集且去重
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.dispatchJobId) && res.set(arr.dispatchJobId, 1))
    },
    // 从一个对象数组中过滤过另一个对象数组的内容
    filterArr (a, b) {
      return [...b].filter(x => [...a].every(y => y.dispatchJobId !== x.dispatchJobId))
    },
    // 每页数
    honeycombTasksSizeChangeHandle (page) {
      this.honeycombTasksPageSize = page
      this.honeycombTasksPageNo = 1
      this.getHoneycombTasksDependence()
    },
    // 当前页
    honeycombTasksCurrentChangeHandle (page) {
      this.honeycombTasksPageNo = page
      this.getHoneycombTasksDependence()
    },

    // 老调度
    // 左侧搜索功能
    oldDispatchTaskSearchTableHandle () {
      this.oldDispatchTaskPageNo = 1
      this.getOldTaskSelectDependence()
    },
    oldDispatchTaskHandleLeftSelectChange (val) {
      this.oldDispatchTaskLeftSelectedData = val
    },
    oldDispatchTaskHandleRightSelectChange (val) {
      this.oldDispatchTaskRightSelectedData = val
    },
    // 单独删除
    oldDispatchTaskDeleteDependenceHandle (index) {
      this.oldDispatchTaskRightTableData.splice(index, 1)
    },
    // 批量删除
    oldDispatchTaskMultiDeleteHandle () {
      if (!this.oldDispatchTaskRightSelectedData.length) return
      let arr = this.filterArr(this.oldDispatchTaskRightSelectedData, this.oldDispatchTaskRightTableData)
      this.oldDispatchTaskRightTableData = arr
    },
    // 添加到右侧
    oldDispatchTaskAddToRight () {
      if (!this.oldDispatchTaskLeftSelectedData.length) return
      if (!this.oldDispatchTaskRightTableData.length) {
        this.oldDispatchTaskRightTableData = this.oldDispatchTaskLeftSelectedData
      } else {
        this.oldDispatchTaskRightTableData = this.unique(this.oldDispatchTaskRightTableData.concat(this.oldDispatchTaskLeftSelectedData))
      }
      this.$refs.oldmultipleLeftTable.clearSelection()
    },
    // 每页数
    oldDispatchTaskSizeChangeHandle (page) {
      this.oldDispatchTaskPageSize = page
      this.oldDispatchTaskPageNo = 1
      this.getOldTaskSelectDependence()
    },
    // 当前页
    oldDispatchTaskCurrentChangeHandle (page) {
      this.oldDispatchTaskPageNo = page
      this.getOldTaskSelectDependence()
    }
  }
}
</script>
<style>
.api-manage-drawer .wrap {
  padding: 0 20px 20px;
  margin-top: -12px;
  width: 100%;
  overflow-y: auto;
  position: absolute;
  top: 75px;
  bottom: 55px;
}
.wrap h3 span {
  float: right;
  font-size: 12px;
  font-weight: normal;
}
.wrap h3 span i {
  font-style: normal;
  padding-right: 10px;
  color: #000;
}
.drawer-title {
  padding: 15px;
  background: #333;
  color: #fff;
  font-size: 15px;
  margin: -20px -20px 0 -20px;
  position: relative;
}
.drawer-close {
  position: absolute;
  right: 20px;
}
.codesql {
  font-size: 11pt;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
.btn-code-continue {
  text-align: right;
}
.work-content-1 {
  border-top: 1px #cccccc dashed;
  padding: 20px 20px 10px 0;
  margin-top: 20px;
}
.footer {
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
.CodeMirror {
  height: 260px;
}
.styled-background {
  color: red;
}
.work-type-pane {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.CodeMirror-hints.xq-light,
.CodeMirror-hints.idea {
  position: absolute;
  z-index: 9999;
  display: block;
}
.inputTag {
  border-radius: 4px;
  width: 600px;
  line-height: 22px;
  border: 1px solid #dcdfe6;
}
</style>
