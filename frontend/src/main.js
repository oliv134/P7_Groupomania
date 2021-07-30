import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'

Vue.config.productionTip = false

const moment = require('moment') // gestion de l'affichage des dates avec vue-moment

require('moment/locale/fr')
Vue.use(require('vue-moment'), {
  moment
});

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

