import Vue from 'vue'
import App from './App.vue'
import { MdButton, MdContent, MdField, MdTable, MdCard, MdBadge, MdProgress } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false

// Vue Material components 
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdField)
Vue.use(MdTable)
Vue.use(MdCard)
Vue.use(MdBadge)
Vue.use(MdProgress)

Vue.directive('loadingSpinner', {
  // Binding has type of boolean
  componentUpdated: function (el, binding) {
    if (binding.value) {
      el = null;
      // let loadingSpinner = document.createElement('<span></span>');

      el.childNodes.forEach((node) => {
        node.style.display = 'none';
      })

      //el.appendChild(loadingSpinner);
    } else {
      // TODO
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
