<template>
  <div class="index-wrap">
    <div class="last-modifier">最后修改人：{{updator}}</div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="指标ID">
        <el-input v-model="dataForm.id" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="指标名称">
        <el-input v-model="dataForm.englishName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="指标标题">
        <el-input v-model="dataForm.chineseName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="用户所属渠道">
        <el-select v-model="dataForm.channelId">
            <el-option v-for="(item, index) in channelIdList" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="指标状态">
        <el-select v-model="dataForm.enable" placeholder="指标状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="true"></el-option>
          <el-option label="无效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
		<el-row :gutter="20" v-loading="dataListLoading">
			<el-col :span="16">
				<el-table :data="dataList" border style="width: 100%;">
					<el-table-column prop="id" header-align="center" align="center" label="指标ID"></el-table-column>
					<el-table-column prop="englishName" header-align="center" align="center" label="指标名称"></el-table-column>
					<el-table-column prop="chineseName" header-align="center" align="center" label="指标标题"></el-table-column>
					<el-table-column header-align="center" align="center" width="100" label="操作">
						<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="2">
				<el-table :data="dataList" :show-header="false" style="width: 100%;" class="line-arrow">
					<el-table-column header-align="center" align="center">
						<template>
							<el-button type="text" style="color: #666" icon="el-icon-right"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="6">
				<el-table :data="dataList" border style="width: 100%;">
					<el-table-column header-align="center" align="center" label="修改后指标名称">
						<template slot-scope="scope">
							<el-input v-model="scope.row.indexAlias" @blur="blurEnglishNameEvent(scope.row)" placeholder="请输入内容"></el-input>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getdDataIndexAliasList"/>
    <div class="btn-group">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button type="default" @click="submitCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { indexManageTypeList } from '@/api/dataAnalysis/indexManage'
  import { channelsList } from '@/api/dataAnalysis/dataInsightManage'
  import { dataIndexAliasList, dataIndexAliasUpdate } from '@/api/dataAnalysis/outParamsMapping'
  import AddOrUpdate from './indexManage-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          englishName: '',
          chineseName: '',
          channelId: '',
          enable: ''
        },
        dataList: [],
        modifyDataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        fieldTypeList: [], // 数据类型
        channelIdList: [],
        isSearch: false,
        updator: '无'
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.getFieldTypeList()
      this.getChannelIdList()
      this.getdDataIndexAliasList()
    },
    props: {
      transferId: Number
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    methods: {
  
      // 数据类型
      fieldTypeFormat (row, column) {
        for (var i = 0; i < this.fieldTypeList.length; i++) {
          if (row.fieldType === this.fieldTypeList[i].childrenValue) {
            return this.fieldTypeList[i].childrenValue
          }
        }
      },
  
      // 获取数据类型
      getFieldTypeList () {
        let params = 6
        indexManageTypeList(params).then(({data}) => {
          if (data && data.status === '1') {
            this.fieldTypeList = data.data
          }
        })
      },

      getChannelIdList () {
        channelsList().then(res => {
          console.log(res)
          if (res.data.status * 1 !== 1) {
            this.channelIdList = []
            return
          }
          this.channelIdList = res.data.data
        })
      },
      getdDataIndexAliasList () { // 点击出参编辑时
        this.dataListLoading = true
        let params = {
          ...this.dataForm,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        dataIndexAliasList(this.transferId, params).then(({data}) => {
          if (data && data.status === '1') {
            this.dataList = data.data.list.map(item => {
              return { ...item, indexAlias: item.indexAlias || item.englishName }
            })
            this.totalCount = data.data.total
            this.updator = this.dataList[this.dataList.length - 1].updater || '无'
            if (this.modifyDataList.length) {
              this.dataList.forEach((item, index) => {
                this.modifyDataList.forEach((mitem, mindex) => {
                  if (item.id === mitem.id) {
                    this.dataList.splice(index, 1, this.modifyDataList[mindex])
                  }
                })
              })
            }
          } else {
            this.dataList = []
            this.totalCount = 0
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, tag)
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        // this.isSearch = true
        this.getdDataIndexAliasList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = {
          englishName: '',
          chineseName: '',
          enable: ''
        }
      },
      blurEnglishNameEvent (row) { // 输入框失去焦点时，保存数据
        if (row.englishName !== row.newEnglishName && !this.judgeIsInArray(this.modifyDataList, row.id)) {
          this.modifyDataList.push(row)
        }
        console.log(this.modifyDataList)
      },
      judgeIsInArray (arr, id) { // 判断某个参数是否在数据中
        let flag = false
        arr.forEach(item => {
          if (item.id === id) {
            flag = true
          }
        })
        return flag
      },
      // 每页数
      sizeChangeHandle (page) {
        this.pageSize = page
        this.pageNum = 1
        this.getdDataIndexAliasList()
      },
      // 当前页
      currentChangeHandle (page) {
        this.pageNum = page
        this.getdDataIndexAliasList()
      },
      submitData () {
        console.log('submit')
        console.log(this.modifyDataList)
        dataIndexAliasUpdate(this.transferId, this.userName, this.modifyDataList).then(({data}) => {
          if (data && data.status !== '1') {
            return this.$message({
              message: data.message || '提交出错',
              type: 'error'
            })
          }
          this.$message({
            message: data.message || '提交成功',
            type: 'success'
          })
          this.modifyDataList = []
          this.$emit('cancel')
        })
      },
      submitCancel () {
        this.modifyDataList = []
        this.$emit('cancel')
      }
    }
  }
</script>
<style lang="scss">
  .index-wrap{
    & .last-modifier {
      padding: 0 30px 15px 0;
      text-align: right;
      font-weight: bold;
    }
    & .line-arrow {
      padding-top: 44px;
    }
    & .line-arrow::before {
      height: 0;
    }
    & .line-arrow td, & .line-arrow th.is-leaf {
      border: 0;
      padding-bottom: 11px;
    }
    & .line-arrow .el-table__body tr:hover>td{
      background-color: #fff!important;
      cursor: none;
    }
    & .btn-group {
      text-align: center;
      padding-top: 20px;
    }
  }
</style>
