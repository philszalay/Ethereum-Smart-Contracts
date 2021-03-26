import Vue from 'vue'
import App from './App.vue'
import { MdContent, MdField, MdTable, MdCard } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// Vue Material components 
Vue.use(MdContent)
Vue.use(MdField)
Vue.use(MdTable)
Vue.use(MdCard)

Vue.directive('loading', {
  // Binding has type of boolean
  componentUpdated: function (el, binding) {
    if (binding.value) {  
      el.childNodes.forEach((node) => {
        node.style.display = 'none';
      });
    } else {
      el.childNodes.forEach((node) => {
        node.style.display = '';
      });
    }
  }
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
