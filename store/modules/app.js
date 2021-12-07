import api from '@/api/login.js'
import { SET_USER_INFO, GET_USER_INFO, LOGIN_OUT } from '../mutations-types.js'
const app = {
  state: {
    userInfo: {}
  },
  mutations: {
    [SET_USER_INFO]: (state, userInfo) => {
      state.userInfo = userInfo
    },
    [LOGIN_OUT]: (state) => {
      state.userInfo = {}
    }
  },
  actions: {
    [GET_USER_INFO] ({ commit, state }) {
      return api.getAccountInfo().then(res => {
        const data = res.profile || {}
        commit(SET_USER_INFO, data)
      }).catch(e => {
        uni.showToast({
          icon: 'error',
          title: '获取用户信息失败：' + e
        })
        console.error('获取用户信息失败：', e)
        return Promise.reject(e)
      })
    }
  }
}

export default app
