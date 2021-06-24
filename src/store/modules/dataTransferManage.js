export default {
  namespaced: true,
  state: {
    outParams: []
  },

  mutations: {
    setOutParams (state, params) {
      state.outParams = params
    }
  }
}
