export default {
  namespaced: true,
  state: {
    id: '',
    rowData: { // 数据决策引擎时需要的权限信息
      authOwner: '',
      authOtherList: [],
      authOthers: ''
    },
    saveDate: {},
    groupNodeName: '',
    channelCode: '',
    editData: {
      beeFlowName: '',
      beeFlowCode: '',
      beeFlowId: '',
      taskUniqueFlag: '',
      configJson: {},
      enable: ''
    },
    outParams: []
  },

  mutations: {
    setFlowId (state, id) {
      state.id = id
    },
    setRowData (state, params) {
      state.rowData = params
    },
    setGroupNodeName (state, params) {
      state.groupNodeName = params
    },
    setSaveDate (state, params) {
      state.saveDate = params
    },
    setEditData (state, params) {
      state.editData.beeFlowName = params.beeFlowName
      state.editData.beeFlowCode = params.beeFlowCode
      state.editData.beeFlowId = params.beeFlowId
      state.editData.taskUniqueFlag = params.taskUniqueFlag
      state.editData.configJson = params.configJson
    },
    setChannelCode (state, params) {
      state.channelCode = params
    },
    setOutParams (state, params) {
      state.outParams = params
    }
  }
}
