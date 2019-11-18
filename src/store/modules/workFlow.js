export default {
  namespaced: true,
  state: {
    id: ''
  },

  mutations: {
    setFlowId (state, id) {
      state.id = id
    }
  }
}
