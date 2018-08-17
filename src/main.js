// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase/app'
import config from './conf'
import BootstrapVue from 'bootstrap-vue'
import VueFormGenerator from 'vue-form-generator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-form-generator/dist/vfg.css'
import ModuleLibrary from 'vfg-field-array'
import VuexFlash from 'vuex-flash'
import store from './store'

Vue.config.productionTip = false
firebase.initializeApp(config)

Vue.use(BootstrapVue)
Vue.use(VueFormGenerator)
Vue.use(ModuleLibrary)
Vue.use(VuexFlash, { mixin: true })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
