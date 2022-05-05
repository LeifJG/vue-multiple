import Vue from 'vue'
import App from './app.vue'
import * as yunjiComponents from 'yunji-components'
<% if (yunjiComponents == 1) { %>import * as yunjiComponents from 'yunji-components'<% } %>
<% if (yunjiReport == 1) { %>import { YjErrorReport } from '@yunji/report'<% } %> 

<% if (yunjiComponents == 1) { %>Vue.use(yunjiComponents)<% } %>
<% if (yunjiReport == 1) { %>
// 接入守望系统上报 js 异常
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-unused-vars
  const yjerror = new YjErrorReport(Vue, {
    projectName: '<%= projectName %>',
    environment: globalConfig.env !== 'online' ? 'test' : 'release'
  })
}
<% } %> 

new Vue({
  el: '#app',
  render: h => h(App)
})
