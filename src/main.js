import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './utils/back.js'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Dialog } from 'vant';
import { Switch } from 'vant';

Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Vant);
Vue.use(Vuex);

Vue.prototype.$axios = axios
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')