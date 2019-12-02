<template>
  <div id="sample">
    <el-form ref="dataForm" :model="dataForm" :inline="true" style="margin: 10px;">
      <!-- <el-form-item label="营销决策名称" prop="decisionName">
        <el-input v-model="dataForm.decisionName" placeholder="营销决策名称"/>
      </el-form-item>
      <el-form-item>
        <el-button id="SaveButton" @click="cancel()">取消</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button id="SaveButton" type="primary" @click="save()">保存</el-button>
      </el-form-item>
    </el-form>
    <div id="parentDiv" ref="flowChat" style="width: 100%; display: flex; justify-content: space-between">
      <div id="myPaletteDiv"/>
      <div id="myDiagramDiv"/>
    </div>
    <textarea id="mySavedModel" v-model="flowValue" style="width:100%;height:300px;display:none"/>
    <!-- 触达动作 -->
    <el-dialog
      :visible.sync="touchActionVisible"
      :modal-append-to-body='false' :append-to-body="true"
      :show-close="false"
      title="选择触达动作"
      width="30%">
      <el-form :model="touchActionForm" label-width="15%">
        <el-form-item label="触达动作">
          <el-select v-model="touchActionName" placeholder="请选择触达动作" style="width:100%">
            <el-option
              v-for="item in touchActionlist"
              :key="item.value"
              :label="item.value"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="touchActionDialgClose">取消</el-button>
        <el-button type="primary" @click="touchActionDataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- end 触达动作 -->
    <!-- 方案ID/方案名 -->
    <el-dialog
      :visible.sync="idearVisible"
      :modal-append-to-body='false' :append-to-body="true"
      :show-close="false"
      title="选择方案ID/方案名"
      width="30%">
      <el-form :model="idearForm" label-width="25%">
        <el-form-item label="方案ID/方案名">
          <el-select v-model="idearForm.name" placeholder="请选择方案ID/方案名" style="width:100%">
            <el-option
              v-for="item in idearlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="idearDialgClose">取消</el-button>
        <el-button type="primary" @click="idearDataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- end 方案ID/方案名 -->
    <!-- 判断节点 -->
    <el-dialog
      :visible.sync="judgeVisible"
      :modal-append-to-body='false' :append-to-body="true"
      :show-close="false"
      title="选择判断节点"
      width="30%">
      <el-form :model="judgeForm" label-width="15%">
        <el-form-item label="判断节点">
          <el-select v-model="judgeForm.name" placeholder="请选择判断节点" style="width:100%">
            <el-option
              v-for="item in judgelist"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="judgeDialgClose">取消</el-button>
        <el-button type="primary" @click="judgeDataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- end 判断节点 -->
  </div>
</template>

<script>
import FlowDesigner from './flowDesign'
export default {
  data () {
    // var checkDecisionName = (rule, value, callback) => {
    //   const valuelength = /^.{50}$/
    //   const reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_u4e00-u9fa5]+$/
    //   if (!value) {
    //     callback(new Error('请输入名称'))
    //   }
    //   if (valuelength.test(value)) {
    //     callback(new Error('名称最多50个字符'))
    //   }
    //   if (reg.test(value)) {
    //     callback(new Error('请输入以汉字、字母、数字、下划线组成的格式'))
    //   }
    //   callback()
    // }
    return {
      flowValue: `{ "class": "GraphLinksModel",
          "modelData": {"position":"-76.46065716410794 -5"},
          "nodeDataArray": [ 
        {"key":"0d029f17-80be-498e-be14-4ee265ddfeb0", "text":"工作流", "figure":"Circle", "fill":"#4fba4f", "stepType":1, "loc":"600 130"},
        {"key":"652e76ba-d1fb-4771-acfe-5de1f969efd4", "text":"父级id", "figure":"Ellipse", "fill":"#bbb", "loc":"600 269.0635106286337"},
        {"key":"3d26a7fb-2333-4474-b4de-cf10a18016d2", "text":"各种", "figure":"Diamond", "fill":"#a55d43", "stepType":4, "loc":"600 375.10425619081013"},
        {"key":"8d74aab4-0f66-4e42-ab51-80e938af7362", "text":"结束", "figure":"Circle", "fill":"#ea5147", "loc":"421.97537249188093 490.9157344551974"},
        {"key":"652e76ba-d1fb-4771-acfe-5de1f969efd42", "text":"方案ID/方案名", "figure":"Ellipse", "fill":"#bbb", "loc":"554.4237159019293 481.14500175298656"},
        {"key":"652e76ba-d1fb-4771-acfe-5de1f969efd43", "text":"方案ID/方案名", "figure":"Ellipse", "fill":"#bbb", "loc":"732.4483434100484 481.14500175298656"},
        {"key":"3d26a7fb-2333-4474-b4de-cf10a18016d23", "text":"判断节点", "figure":"Diamond", "fill":"#a55d43", "stepType":4, "loc":"732.4483434100484 587.1857473151629"},
        {"key":"8d74aab4-0f66-4e42-ab51-80e938af73623", "text":"结束", "figure":"Circle", "fill":"#ea5147", "loc":"732.4483434100484 702.9972255795501"},
        {"key":"baf5d03e-a52b-4751-9dd0-4661dc44c2e8", "text":"触达动作", "figure":"RoundedRectangle", "fill":"lightgreen", "loc":"554.4237159019292 574.0094467601176"},
        {"key":"da095b9c-e849-4892-b434-4218399da768", "text":"结束", "figure":"Circle", "fill":"#ea5147", "loc":"554.4237159019293 676.6446244694597"}
        ],
          "linkDataArray": [ 
        {"from":"0d029f17-80be-498e-be14-4ee265ddfeb0", "to":"652e76ba-d1fb-4771-acfe-5de1f969efd4"},
        {"from":"652e76ba-d1fb-4771-acfe-5de1f969efd4", "to":"3d26a7fb-2333-4474-b4de-cf10a18016d2"},
        {"from":"3d26a7fb-2333-4474-b4de-cf10a18016d2", "to":"8d74aab4-0f66-4e42-ab51-80e938af7362"},
        {"from":"3d26a7fb-2333-4474-b4de-cf10a18016d2", "to":"652e76ba-d1fb-4771-acfe-5de1f969efd42"},
        {"from":"3d26a7fb-2333-4474-b4de-cf10a18016d2", "to":"652e76ba-d1fb-4771-acfe-5de1f969efd43"},
        {"from":"652e76ba-d1fb-4771-acfe-5de1f969efd43", "to":"3d26a7fb-2333-4474-b4de-cf10a18016d23"},
        {"from":"3d26a7fb-2333-4474-b4de-cf10a18016d23", "to":"8d74aab4-0f66-4e42-ab51-80e938af73623"},
        {"from":"652e76ba-d1fb-4771-acfe-5de1f969efd42", "to":"baf5d03e-a52b-4751-9dd0-4661dc44c2e8"},
        {"from":"baf5d03e-a52b-4751-9dd0-4661dc44c2e8", "to":"da095b9c-e849-4892-b434-4218399da768"}
        ]}`,
      params: {
        circle: {
          text: '开始',
          color: '#4fba4f'
        },
        sql: {
          text: '方案ID/方案名',
          color: '#bbb'
        },
        box: {
          text: '触达动作',
          color: 'lightgreen'
        },
        diamond: {
          text: '判断节点',
          color: '#a55d43'
        },
        rectangle: {
          text: '备注',
          color: '#e39f24'
        },
        end: {
          text: '结束',
          color: '#ea5147'
        }
      },
      // dataForm: {
      //   decisionName: ''
      // },
      // dataRule: {
      //   decisionName: [
      //     { required: true, validator: checkDecisionName, trigger: 'blur' }
      //   ]
      // },
      type: ['circle', 'sql', 'box', 'diamond', 'rectangle', 'end'],
      flowDesign: {},
      flowType: 'circle',
      touchActionVisible: false,
      touchActionForm: {
        name: ''
      },
      touchActionName: '',
      touchActionlist: [
        {
          value: '人工电销',
          label: '人工电销'
        }, {
          value: 'AI电销',
          label: 'AI电销'
        }, {
          value: '短信',
          label: '短信'
        }, {
          value: 'push',
          label: 'push'
        }, {
          value: '个人消息',
          label: '个人消息'
        }, {
          value: '模板消息',
          label: '模板消息'
        }, {
          value: 'iMessage',
          label: 'iMessage'
        }, {
          value: '借款红包',
          label: '借款红包'
        }, {
          value: '还款红包',
          label: '还款红包'
        }, {
          value: '提额券',
          label: '提额券'
        }, {
          value: '减息券',
          label: '减息券'
        }, {
          value: '精准公告',
          label: '精准公告'
        }, {
          value: '广告图',
          label: '广告图'
        }
      ],
      idearVisible: false,
      idearForm: {
        name: ''
      },
      idearlist: [],
      judgeVisible: false,
      judgeForm: {
        name: ''
      },
      judgelist: []
    }
  },
  mounted () {
    // parms 当做入参变量
    this.init()
    this.dataForm.decisionName = this.$route.query.testName
    console.log(this.$route.query.testName)
  },
  methods: {
    init () {
      this.flowDesign = new FlowDesigner(
        'myDiagramDiv',
        this.params,
        this.clickTouchAction,
        this.touchActionDataFormSubmit,
        this.touchActionName,
        this.clickIdear,
        this.clickJudge
      )
      this.flowDesign.initToolbar('myPaletteDiv')// 初始化控件面板
      this.flowDesign.displayFlow(this.flowValue)// 在设计面板中显示流程图
    },
    confirm () {
      const parentDiv = document.getElementById('parentDiv')
      const myPaletteDiv = document.getElementById('myPaletteDiv')
      const myDiagramDiv = document.getElementById('myDiagramDiv')
      parentDiv.removeChild(myPaletteDiv)
      var pdiv = document.createElement('div')
      pdiv.setAttribute('id', 'myPaletteDiv')
      parentDiv.insertBefore(pdiv, myDiagramDiv)
      this.flowDesign.initToolbar('myPaletteDiv')// 初始化控件面板
    },
    // 保存获取texter的内容,请求api
    save () {
      document.getElementById('mySavedModel').value = this.flowDesign.getFlowData()
      this.saveValue = document.getElementById('mySavedModel').value
      console.log(this.saveValue, 'pppp')
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     document.getElementById('mySavedModel').value = this.flowDesign.getFlowData()
      //     this.saveValue = document.getElementById('mySavedModel').value
      //     const dataBody = {
      //       'flowchart': this.saveValue,
      //       'decisionName': this.dataForm.decisionName
      //     }
      //     console.log(dataBody, 'pppp')
      //   }
      // })
      // mySelf.myDiagram.isModified = false
    },
    // 取消流程更改事件
    cancel () {
      this.$router.push({ path: '/decision/makweDecision/marketingDecision' })
    },
    // 点击触达动作
    clickTouchAction () {
      this.touchActionName = this.params.box.text
      this.touchActionVisible = true
    },
    touchActionDialgClose () {
      this.touchActionVisible = false
    },
    touchActionDataFormSubmit () {
      this.touchActionVisible = false
      this.flowDesign.updateNodeData(this.flowDesign.newNode, this.touchActionName)
    },
    // 点击方案ID/方案名
    clickIdear () {
      this.idearForm.name = this.params.sql.text
      this.idearVisible = true
    },
    idearDialgClose () {
      this.idearVisible = false
    },
    idearDataFormSubmit () {
      this.idearVisible = false
    },
    // 点击判断节点
    clickJudge () {
      this.judgeForm.name = this.params.diamond.text
      this.judgeVisible = true
    },
    judgeDialgClose () {
      this.judgeVisible = false
    },
    judgeDataFormSubmit () {
      this.judgeVisible = false
    }
  }
}
</script>
<style>
#myDiagramDiv {
  flex-grow: 1;
   height: 750px;
   border: solid 1px black;
}
#myPaletteDiv {
  width: 200px;
  margin-right: 2px;
  background-color: whitesmoke;
  border: solid 1px black
}
</style>
