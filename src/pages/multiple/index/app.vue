<template>
  <div id="app">
    <div class="contatiner">
      
    </div>
  </div>
</template>

<script>
  import logo from 'assets/img/logo.jpg'
  //import modal from 'components/modal.vue'
  import Lib from "assets/js/Lib";
  export default {
    components: {
      //modal
    },
    mounted() {
      Lib.M.baseDomFn();
    },
    data () {
      return {
        logoImg: logo,
      }
    },
    created () {
      Lib.WX.is_weixin();
      Lib.M.baseFn();
      this.welcome();
    },
    methods: {
      welcome(){
        this.$notify({
          title: '欢迎',
          message: '欢迎来到vue多页面演示。',
          duration: 0
        });
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/css/m_base.less";
</style>
