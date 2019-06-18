import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import axios from './http';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router'
import store from './store'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
