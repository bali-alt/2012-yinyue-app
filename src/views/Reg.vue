<template>
  <div id="reg">
    <div class="loginHead">
      <img class="headImg" src="../../public/head.png" alt />
      <br />
      <router-link :to="{name:'Login'}">点击直接登录</router-link>
    </div>
    <van-steps :active="active">
      <van-step>验证手机号</van-step>
      <van-step>设置账户信息</van-step>
      <van-step>注册成功</van-step>
    </van-steps>
    <verify v-show="verifyFlag" ref="getVerify" @to-parent="isNext"></verify>
    <bsgMsg v-show="bsgMsgFlag" ref="getBsg" @to-parent="isNext"></bsgMsg>
    <login v-show="loginFlag" ref="getFn"></login>
    <van-button
      class="next"
      size="large"
      round
      color="linear-gradient(to right, #4bb0ff, #6149f6)"
      @click="nextType"
    >下一步</van-button>
  </div>
</template>
<script>
import verify from "../components/reg/verify.vue";
import bsgMsg from "../components/reg/bsgMsg.vue";
import login from "../components/reg/login.vue";
//verifyFlag，bsgMsgFlag，loginFlag用于判断当前处于哪个步骤  next用于判断是否进入下一步 code储存验证码
export default {
  data() {
    return {
      active: 0,
      verifyFlag: true,
      bsgMsgFlag: false,
      loginFlag: false,
      phone: "",
      code: "",
      username: "",
      psw: "",
      next: false
    };
  },
  components: {
    verify,
    bsgMsg,
    login
  },
  methods: {
    isNext(i) {
      //获取子组件中传递的参数（true判断是否进行下一步）
      this.next = i ;
      if (this.active == 0) {
        if (this.next) {
          this.verifyFlag = false;
          this.bsgMsgFlag = true;
          this.loginFlag = false;
          this.phone = this.$refs.getVerify.phone;
          this.code = this.$refs.getVerify.code;
          this.active=1;
          document.querySelector(".next .van-button__text").innerText = "注册";
        } else {
          this.verifyFlag = true;
          this.bsgMsgFlag = false;
          this.loginFlag = false;
          this.active = 0;
        }
      }else if (this.active == 1) {
        if (this.next) {
          this.verifyFlag = false;
          this.bsgMsgFlag = false;
          this.loginFlag = true;
          this.active=2;
          document.querySelector(".next .van-button__text").innerText = "登录";
        } else {
          this.verifyFlag = false;
          this.bsgMsgFlag = true;
          this.loginFlag = false;
          this.active = 1;
        }
      }
    },
    nextType() {
      //当点击下一步时，根据当前位置调用对应的子组件方法
      if (this.active == 0) {
        //调用验证短信验证码的方法
        this.next = false;
        this.$refs.getVerify.phoneVerify();
      }
      if (this.active == 1) {
        //调用注册方法
        this.next = false;
        this.$refs.getBsg.register();
      }
      if (this.active == 2) {
        this.next = false;
        //调用登录的方法
        this.$refs.getFn.loginHandle();
        this.active = 2;
      }
    }
  }
};
</script>
<style scoped>
#reg {
  padding: 3em 2em 0;
}
.loginHead {
  text-align: center;
  margin-bottom: 2em;
}
.headImg {
  width: 10em;
  margin-bottom: 1em;
}
</style>