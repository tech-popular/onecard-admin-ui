export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    datetime: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    createTime (state, datetime) {
      state.datetime = datetime
    }
  }
}
