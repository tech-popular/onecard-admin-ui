export default {
  namespaced: true,
  state: {
    all: {
      ID: ''
    }
  },

  mutations: {
    setFlowId (state, all) {
      state.all = all
    }
  }
}
