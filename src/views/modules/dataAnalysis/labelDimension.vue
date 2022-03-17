<template>
<div class="aside-main">
	<div class="dimension-tree">
		<el-input
		  class="code-select"
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
		<el-tree
			class="filter-tree"
      node-key="id"
			:data="treeData"
			:props="defaultProps"
			default-expand-all
      :current-node-key="currentLivingId"
      :expand-on-click-node="false"
			:filter-node-method="filterNode"
      highlight-current
      @check="handleCheck"
      @node-click="treeNodeClick"
			ref="tree">
	    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.typeValue }}</span>
        <span>
					 <el-button
            v-if="node.level === 1"
            type="text"
            size="mini"
            @click="() => append()">
            添加维度
          </el-button>
          <el-button
            v-if="node.level !== 1"
            type="text"
            size="mini"
            @click="() => append(data)">
            修改
          </el-button>
          <el-button
            v-if="node.level !== 1"
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
		</el-tree>
	</div>
	<div class="main-center">
    <div class="main-content-top">
			<div class="main-content-title">
        <h4>{{selecttreeData.typeValue}}</h4>
				<span class="title-code">编码：{{selecttreeData.typeNum}}</span>
		</div>
     <el-button  @click="changeHandle()">添加值</el-button>
		</div>
		<el-table :data="dataList" border style="width: 100%;" height="600">
				<el-table-column prop="childrenNum" header-align="center" align="center" label="维度code"></el-table-column>
				<el-table-column prop="childrenValue" header-align="center" align="center" label="修饰值"></el-table-column>
				<el-table-column header-align="center" align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small"  @click="changeHandle(scope.row)">修改名称</el-button>
						<el-button type="text" size="small"  @click="deleteHandle(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
	</div>
	    <!-- 维度Code -->
    <el-dialog :visible.sync="modifyaddorupdate" width="600px">
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px"  >
        <el-form-item label="维度code" prop="childrenNum">
          <el-input v-model="dataForm.childrenNum" placeholder="请输入编码" type="text"></el-input>
        </el-form-item>
        <el-form-item prop="childrenValue" label="修饰值">
          <el-input v-model="dataForm.childrenValue" placeholder="请输入" type="text"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="foot">
        <el-button type="primary" @click="modifySubmit()">确认</el-button>
        <el-button type="primary" @click="modifyCancel()">取消</el-button>
    </div>
    </el-dialog>
			    <!-- 维度 -->
    <el-dialog :visible.sync="addorupdate" width="600px">
      <el-form :model="baseForm" ref="baseForm" :rules="baseRule" label-width="100px">
        <el-form-item label="维度名称" prop="name">
          <el-input v-model="baseForm.name" placeholder="请输入维度名称" type="text"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="code" label="维度编码">
          <el-input v-model="baseForm.code" placeholder="请输入维度编码" type="text"></el-input>
        </el-form-item> -->
      </el-form>
			<div slot="footer" class="foot">
        <el-button type="primary" @click="addEnumHandle()">确认</el-button>
        <el-button type="primary" @click="cancel()">取消</el-button>
    </div>
    </el-dialog>
</div>
</template>
<script>
import { selectAllGroupTypeNum, addEnum, updateEnum, deleteEnum, getchildrenList, addChildren, updateChildren, dellteChildren } from '@/api/dataAnalysis/labelDimension'
export default {
  data () {
    return {
      filterText: '',
      addorupdate: false,
      modifyaddorupdate: false,
      treeData: [{
        id: 0,
        typeValue: '标签维度',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'typeValue'
      },
      selecttreeData: {},
      dataList: [],
      currentLivingId: '', // 默认选中的节点
      dataForm: {
        childrenNum: '',
        childrenValue: '',
        id: 0,
        typeNum: '',
        typeValue: ''
      },
      baseForm: {
        // code: '',
        name: '',
        typeNum: ''
      },
      dataRule: {
        childrenNum: [
          { required: true, message: '维度code不能为空', trigger: 'blur' }
        ],
        childrenValue: [
          { required: true, message: '修饰值不能为空', trigger: 'blur' }
        ]
      },
      baseRule: {
        // code: [
        //   { required: true, message: '维度编码不能为空', trigger: 'blur' }
        // ],
        name: [
          { required: true, message: '维度名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.getSelectAllGroupTypeNum()
  },
  methods: {
    getSelectAllGroupTypeNum (val) {
      selectAllGroupTypeNum().then(({ data }) => {
        if (data && data.status === '1') {
          this.treeData[0].children = data.data
          if (val === 'add') {
            this.treeNodeClick(this.selecttreeData)
            this.currentLivingId = this.selecttreeData.id
          } else {
            this.treeNodeClick(data.data[0])
             this.currentLivingId = data.data[0].id
          }
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.currentLivingId)
          })
        }
      })
    },
    filterNode(value, data, node) {
      if (!value) return true
      return data.typeValue && data.typeValue.indexOf(value) !== -1
    },
    append(data) {
      this.addorupdate = true
      this.baseForm.typeNum = data ? data.typeNum : ''
      this.baseForm.name = data ? data.typeValue : ''
    },

    remove(node, data) {
      deleteEnum(data.typeNum).then(({ data }) => {
        if (data && data.status === '1') {
          this.$message({
            message: '删除维度成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getSelectAllGroupTypeNum()
            }
          })
        } else {
          this.$message.error(data.message || '数据异常')
        }
      })
    },
    changeHandle (row) {
      this.modifyaddorupdate = true
      this.dataForm.childrenNum = row ? row.childrenNum : ''
      this.dataForm.childrenValue = row ? row.childrenValue : ''
      this.dataForm.id = row ? row.id : 0
      this.dataForm.typeValue = row ? row.typeValue : this.selecttreeData.typeValue
      this.dataForm.typeNum = row ? row.typeNum : this.selecttreeData.typeNum
    },
    deleteHandle(row) {
      dellteChildren(row.id).then(({ data }) => {
        if (data && data.status === '1') {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getSelectAllGroupTypeNum()
            }
          })
        } else {
          this.$message.error(data.message || '数据异常')
        }
      })
    },
    modifySubmit () {
      this.$refs['dataForm'].validate(valid => {
        let params = {
          childrenNum: this.dataForm.childrenNum,
          childrenValue: this.dataForm.childrenValue,
          id: this.dataForm.id,
          typeValue: this.dataForm.typeValue,
          typeNum: this.dataForm.typeNum
        }
        if (!this.dataForm.id) {
          addChildren(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '添加维度成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.modifyaddorupdate = false
                  this.getSelectAllGroupTypeNum('add')
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message || '数据异常')
            }
          })
        } else {
          params.typeNum = this.dataForm.typeNum
          updateChildren(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '添加维度成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.modifyaddorupdate = false
                  this.getSelectAllGroupTypeNum('add')
                  this.$refs['dataForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message || '数据异常')
            }
          })
        }
      })
    },
    modifyCancel () {
      this.modifyaddorupdate = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    addEnumHandle () {
      this.$refs['baseForm'].validate(valid => {
        let params = {
          name: this.baseForm.name
        }
        if (!this.baseForm.typeNum) {
          addEnum(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '添加维度成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.addorupdate = false
                  this.getSelectAllGroupTypeNum()
                  this.$refs['baseForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message || '数据异常')
            }
          })
        } else {
          params.typeNum = this.baseForm.typeNum
          updateEnum(params).then(({ data }) => {
            if (data && data.status === '1') {
              this.$message({
                message: '添加维度成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.addorupdate = false
                  this.getSelectAllGroupTypeNum()
                  this.$refs['baseForm'].resetFields()
                }
              })
            } else {
              this.$message.error(data.message || '数据异常')
            }
          })
        }
      })
    },
    cancel () {
      this.addorupdate = false
      this.$nextTick(() => {
        this.$refs['baseForm'].resetFields()
      })
    },
    // 单击树节点
    handleCheck () {},
    treeNodeClick (data, node) {
      this.selecttreeData = data
      let params = {
        typeNum: data.typeNum
      }
      getchildrenList(params).then(({ data }) => {
        if (data && data.status === '1' && data.data.length) {
          this.dataList = data.data
        } else {
          this.dataList = []
        }
      })
    }
  }
}
</script>
<style scoped>
  .aside-main {
	  box-sizing: border-box;
    height: 100%;
    overflow: hidden;
		display: flex;
  }
  .dimension-tree {
	  width: 620px;
	  position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
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
	.main-center {
		width: 100%;
    overflow: hidden;
		padding-left: 20px;
		/* border: 1px solid #e6e6e6; */
	}
	.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
		padding-left: 10px;
  }
	.main-content-top {
		display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    padding-right: 10px;
		 align-items: center;
    background-color: transparent;
	}
	.main-content-title {
		display: flex;
    align-items: flex-start;
    align-items: center;
		padding-left: 20px;
	}
	.title-code {
		padding-left: 20px;
	}
	.el-tree {
    flex: 1 1 100%;
    width: 100%;
    overflow-y: auto;
  }
	.custom-tree-node {
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
	}
	.el-tree-node__content {
		height: 40px !important;
	}
	.el-tree-node.is-current  .el-tree-node__content{
			background-color: #409eff;
	}
</style>