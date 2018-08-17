import Vue from 'vue'
import Vuex from 'vuex'
import { createFlashStore } from 'vuex-flash'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createFlashStore()
  ]
})

export default store
