<template>
  <div class="login">
    <br />
    <van-cell-group>
      <van-field v-model="phone" label="手机号" placeholder="请输入手机号" required />
      <br />
      <van-field v-model="psw" type="password" label="密码" placeholder="请输入密码" required />
    </van-cell-group>
    <br />
    <div class="switch">
      <van-switch v-model="checked" size="20px" />
      <span>记住密码</span>
    </div>
    <br />
    <van-popup v-model="warn" round :style="{ width: '80%'}">
      <P>用户名或密码输入错误</P>
      <p>请重试</p>
    </van-popup>
  </div>
</template>
<script>
//checked用于记录是否自动登录  warn用于判断是否显示错误警告
export default {
  data() {
    return {
      checked: true,
      phone: "",
      psw: "",
      warn: false
    };
  },
  methods: {
    loginHandle() {
      if (this.phone !== "" && this.psw !== "") {
        this.$axios
          .get(
            "http://121.41.30.226:3000/login/cellphone?phone=" +
              this.phone +
              "&password=" +
              this.psw
          )
          .then(response => {
            if (response.data.code == 200) {
              if (this.checked) {
                localStorage.setItem("token", this.phone);
              } else {
                sessionStorage.setItem("token", this.phone);
              }
              this.$router.push({ path: "/" });
            } else {
              this.warn = true;
            }
          });
      } else {
        this.warn = true;
      }
    }
  }
};
</script>
<style scoped>
.van-popup--center {
  text-align: center;
}
.headImg {
  width: 10em;
  margin-bottom: 1em;
}
.switch {
  position: relative;
  padding-left: 0.5em;
}
.switch span {
  position: absolute;
  left: 4em;
}
</style>