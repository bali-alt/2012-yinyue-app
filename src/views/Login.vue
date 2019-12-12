<template>
  <div id="login">
    <div class="loginHead">
      <img class="headImg" src="../../public/head.png" alt />
      <br />
      <router-link :to="{name:'Reg'}">前去注册</router-link>
    </div>
    <login ref="getFn"></login>
    <van-button
      size="large"
      round
      color="linear-gradient(to right, #4bb0ff, #6149f6)"
      @click="loginHandle"
    >登录</van-button>
  </div>
</template>
<script>
import login from "../components/reg/login.vue";
export default {
  data() {
    return {};
  },
  components: { login },
  methods: {
    loginHandle() {
      //点击登录的时候，调用子组件的登录功能
      this.$refs.getFn.loginHandle();
    }
  }
};
</script>
<style scoped>
#login {
  padding: 4em 2em;
}
.loginHead {
  text-align: center;
  margin-bottom: 2em;
}

.headImg {
  width: 10em;
  margin-bottom: 1em;
}
/* .switch {
  position: relative;
  padding-left: 0.5em;
}
.van-popup--center{text-align: center;}
.switch span {
  position: absolute;
  left: 4em;
} */
</style>