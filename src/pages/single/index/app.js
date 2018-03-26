import Vue from 'vue'
import App from './app.vue'
import VueRouter  from 'vue-router'
import ElementUI from 'element-ui'
import Index from 'components/index/index'
import Login from 'components/login/login'
import User from 'components/user/user'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/user/:name', component: User },
]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
