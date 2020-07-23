<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="dataForm.type" @change="radioTypeChange" :disabled="!!dataForm.id">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index - 1" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type + 1] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type + 1] + '名称'"></el-input>
      </el-form-item>
      <el-form-item :label="'所属' + (dataForm.type === -1 ? '版块' : dataForm.typeList[dataForm.type])" prop="parentId">
        <el-cascader
          style="width: 100%"
          v-model="dataForm.parentId"
          :options="menuList"
          :props="menuListTreeProps"
          @change="parentTreeChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="菜单路径" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路径"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type == 2" label="授权标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <!-- <el-form-item v-if="dataForm.type === 2" label="标记" prop="mark">
        <el-input v-model="dataForm.mark" placeholder="标记"></el-input>
      </el-form-item> -->
      <el-form-item v-if="dataForm.type !== 2" label="位置排序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="位置排序"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2 && dataForm.type !== -1" :label="dataForm.typeList[dataForm.type + 1] +  '图标'" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="开放申请:" prop="isOpenApply" v-if="dataForm.type === 1">
        <el-radio v-model="dataForm.isOpenApply" :label='1'>是</el-radio>
        <el-radio v-model="dataForm.isOpenApply" :label='0'>否</el-radio>
      </el-form-item>
      <el-form-item label="状态:" prop="status" v-if="dataForm.type !== 2">
        <el-radio v-model="dataForm.status" :label='1'>显示</el-radio>
        <el-radio v-model="dataForm.status" :label='0'>隐藏</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="enable">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Icon from '@/icons'
  import { getSelectUp, getMenuInfo } from '@/api/sys/menu'
  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 2 && !/\S/.test(value)) {
          callback(new Error('请输入菜单路径'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        enable: false,
        menuParentList: [], // 保留选中的级联中完整内容
        dataForm: {
          id: 0,
          type: -1,
          typeList: ['导航', '目录', '菜单', '按钮'],
          name: '',
          parentId: [],
          url: '',
          perms: '',
          orderNum: 0,
          mark: '',
          icon: '',
          iconList: [],
          isOpenApply: 1,
          status: 1
        },
        dataRule: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '上级菜单不能为空', trigger: 'change' }
          ],
          url: [
            { required: true, validator: validateUrl, trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '请选择图标', trigger: 'change' }
          ],
          isOpenApply: [
            { required: true, message: '请选择开放申请', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          orderNum: [
            { required: true, message: '请输入位置排序', trigger: 'blur' }
          ],
          perms: [
            { required: true, message: '请输入授权标识', trigger: 'blur' }
          ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          value: 'id',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          // 修改
          this.getMenuInfo()
        } else {
          this.getSelectUp()
        }
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      getSelectUp () {
        getSelectUp(this.dataForm.type).then(({data}) => {
          if (data && data.code === 0) {
            this.menuList = data.menuList
          } else {
            this.menuList = []
          }
        })
      },
      getMenuInfo () { // 详情
        getMenuInfo(this.dataForm.id).then(({data}) => {
          this.menuParentList = data.menu.menuParentList
          this.dataForm.id = data.menu.menuId
          this.dataForm.type = data.menu.type
          this.dataForm.name = data.menu.name
          this.dataForm.parentId = data.menu.menuParentList
          this.dataForm.url = data.menu.url
          this.dataForm.perms = data.menu.perms
          this.dataForm.mark = data.menu.mark
          this.dataForm.orderNum = data.menu.orderNum
          this.dataForm.icon = data.menu.icon
          this.dataForm.status = data.menu.status
          this.getSelectUp()
        })
      },
      radioTypeChange (val) { // 类型改变时
        this.dataForm.type = val
        this.getSelectUp()
        this.dataForm.parentId = []
        this.menuParentList = []
      },
      // 所属父级
      parentTreeChange (val) {
        this.menuParentList = val
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.enable = true
            this.$http({
              url: this.$http.adornUrl(`/sys/menu/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'menuId': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'name': this.dataForm.name,
                'parentId': this.menuParentList[this.menuParentList.length - 1],
                'url': this.dataForm.url,
                'perms': this.dataForm.perms,
                'mark': this.dataForm.mark,
                'orderNum': this.dataForm.orderNum,
                'icon': this.dataForm.icon,
                'status': this.dataForm.status,
                'menuParentList': this.menuParentList
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.enable = false
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.enable = false
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .menuSelect{
    height: 300px;
    overflow: auto
  }
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      overflow: auto;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
