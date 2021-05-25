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
    editData: {}
  },

  mutations: {
    setFlowId (state, id) {
      state.id = id
    },
    setRowData (state, params) {
      state.rowData = params
    },
    setSaveDate (state, params) {
      state.saveDate = params
      console.log('state.saveDate: ', state.saveDate)
    },
    setEditData (state, params) {
      state.editData = params
    }
  }
}
