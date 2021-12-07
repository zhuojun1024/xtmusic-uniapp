import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app.js'
import playControl from './modules/playControl.js'
import getters from './getters.js'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  modules: {
    app,
    playControl
  },
  getters
})
export default store
