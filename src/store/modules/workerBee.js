export default {
  namespaced: true,
  state: {
    id: 0
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    }
  }
}
