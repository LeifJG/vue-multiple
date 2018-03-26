<template>
  <div id="app">
    <div class="container">
      <header></header>
      <router-link to="/login">login</router-link>
      <router-link to="/user">user</router-link>
      <router-view>

      </router-view>
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
    },
    methods: {

    }
  }
</script>

<style lang="less">
  @import "../../../assets/css/m_base.less";
</style>
