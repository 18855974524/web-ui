import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import dict from './modules/dict'
import getters from './getters'

Vue.use(Vuex)
export default new Vuex.Store({
  modules:{
    user,
    dict
  },
  getters
})

