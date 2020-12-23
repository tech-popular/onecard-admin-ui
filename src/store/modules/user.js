import { getUserInfo } from '@/api/sys/user'
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
  },
  actions: {
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(({data}) => {
          if (data && data.code === 0) {
            // this.userId = data.user.userId
            // this.userName = data.user.username
            // this.createTime = data.user.createTime
            commit('updateId', data.user.userId)
            commit('updateName', data.user.username)
            commit('createTime', data.user.createTime)
            sessionStorage.setItem('id', data.user.id) // 存储用户id
            resolve(data.user.username)
          } else {
            console.log(data.msg)
          }
        }).catch((e) => {
          console.log(`%c${e} 获取用户信息失败！！`, 'color:blue')
        })
      })
    }
  }
}
