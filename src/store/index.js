import Vue from 'vue'
import Vuex from 'vuex'
// import io from 'socket.io-client'
// 获取用户基本信息
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI'

Vue.use(Vuex)

// 定义一个初始对象
let initState = {
  // 存储token的信息对象
  tokenInfo: {},
  // 用户基本信息
  userInfo: {},
  // 用户简介信息
  userProfile: {}
}
// 获取本地存储的state字符串
const stateStr = localStorage.getItem('state')
// 判断本地是否有存储state数据
if (stateStr) {
  // 存在则将其赋值给tokenInfo
  initState = JSON.parse(stateStr)
}

export default new Vuex.Store({
  // 为state赋初始值
  state: initState,
  getters: {
    userAvatar(state) {
      let imgSrc = 'https://img01.yzcdn.cn/vant/cat.jpeg'
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }
      return imgSrc
    }
  },
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, payload) {
      // 把提交过来的payload对象，作为tokenInfo的值
      state.tokenInfo = payload
      // 测试
      // console.log(state)
      // 调用saveStateToStorage方法
      this.commit('saveStateToStorage')
    },
    // 将token字符串存储到本地
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    // 更新userInfo的方法
    updateUserInfo(state, payload) {
      // 将用户信息转存到state中
      state.userInfo = payload
      // 将数据存储到本地
      this.commit('saveStateToStorage')
    },
    // 退出登录方法
    cleanState(state) {
      // 清空vueX中的数据
      state.tokenInfo = {}
      state.userInfo = {}
      state.userProfile = {}
      // 再将数据同步到本地
      this.commit('saveStateToStorage')
    },
    // 更新用户简介信息方法
    updateUserProfile(state, payload) {
      // 更新数据
      state.userProfile = payload
      // 再将数据同步到本地
      this.commit('saveStateToStorage')
    }
  },
  actions: {
    async initUserInfo(ctx) {
      try {
        const { data: res } = await getUserInfoAPI()
        ctx.commit('updateUserInfo', res.data)
      } catch {
        console.log('获取用户数据失败')
      }
    },
    async initUserProfile(ctx) {
      try {
        const { data: res } = await getUserProfileAPI()
        ctx.commit('updateUserProfile', res.data)
      } catch {
        console.log('获取用户简介信息失败')
      }
    }
  },
  modules: {
  }
})
