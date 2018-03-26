<template>
  <div id="app">
    <div class="container">
      <img :src="logoImg" alt="" class="logo">
      <h1 class="title">multiple and single </h1>
      <p class="desc">Vue2、ElementUI单多页应用混合脚手架</p>
      <a href="/multiple/index.html" class="link">多页面演示</a>
      <a href="/single/index.html" class="link">单页面演示</a>
    </div>
    
  </div>
</template>

<script>
  import logo from 'assets/img/logo.jpg'
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
  @import "../../assets/css/m_base.less";
  .container{
    .title{
      margin: 0.5rem 0;
    }
    .desc{
      font-size: 18px;
    }
    .logo{
      display: block;
      margin: 0 auto;
    }
    .link{
      margin: 0 0.3rem;
      font-size: 18px;
    }
  }
  
  body{
    text-align: center;
  }
</style>
