import { getUserInfo } from '@/api/sys/user'
export default {
  namespaced: true,
  state: {
    userId: 0,
    name: '',
    datetime: '',
    id: 0
  },
  mutations: {
    updateUserId (state, userId) {
      state.userId = userId
    },
    updateName (state, name) {
      state.name = name
    },
    createTime (state, datetime) {
      state.datetime = datetime
    },
    updateId (state, id) {
      state.id = id
    }
  },
  actions: {
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(({data}) => {
          if (data && data.code === 0) {
            commit('updateUserId', data.user.userId)
            commit('updateName', data.user.username)
            commit('createTime', data.user.createTime)
            commit('updateId', data.user.id)
            sessionStorage.setItem('id', data.user.id) // 存储用户id
            sessionStorage.setItem('username', data.user.username) // 存储用户id
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
