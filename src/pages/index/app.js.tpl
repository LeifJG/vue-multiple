import Vue from 'vue'
import App from './app.vue'
<% if (yunjiReport == 1) { %>
  import yunjiReport from 'yunji-report'
  new yunjiReport('我就是测试一下', <% yunjiReport %>)
<% } %> 

new Vue({
  el: '#app',
  render: h => h(App)
})
