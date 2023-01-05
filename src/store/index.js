import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义一个初始对象
let initState = {
  // 存储token的信息对象
  tokenInfo: {}
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
    }
  },
  actions: {
  },
  modules: {
  }
})
