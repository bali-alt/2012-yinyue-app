<template>
  <div class="verify">
    <br />
    <van-cell-group>
      <van-field v-model="phone" label="手机号" placeholder="请输入手机号" />
    </van-cell-group>
    <br />
    <van-cell-group>
      <van-field v-model="code" center clearable label="短信验证码" placeholder="请输入验证码">
        <van-button slot="button" size="small" type="primary" @click="getCode">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <br />
    <van-popup class="regModelVer" v-model="warn" round :style="{ width: '80%'}">
      <P v-show="pFlag&&!wrong">请输入正确的手机号</P>
      <p v-show="!pFlag&&!wrong">请输入正确的验证码</p>
      <p v-show="wrong">{{msg}}</p>
    </van-popup>
  </div>
</template>
<script>
//wrong用于展示错误信息 warn用于判断是否显示弹出层  pFlag用于切换弹出层上的内容  next用于判断是否进入下一步
export default {
  data() {
    return {
      wrong: false,
      msg: "",
      phone: "",
      code: "",
      warn: false,
      pFlag: true,
      next: false
    };
  },
  methods: {
    getCode() {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.pFlag = true;
        this.warn = true;
        this.wrong = false;
      } else {
        this.$axios
          .get("http://121.41.30.226:3000/captcha/sent?phone=" + this.phone)
          .then(response => {
            if (response.data.code !== 200) {
              this.pFlag = true;
              this.warn = true;
              this.wrong = false;
            }
          })
          .catch(error => {
            this.wrong = true;
            this.msg = error.response.data.message;
            this.warn = true;
          });
      }
    },
    phoneVerify() {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.pFlag = true;
        this.warn = true;
        this.wrong = false;
      } else if (!/^\d{4}$/.test(this.code)) {
        this.pFlag = false;
        this.warn = true;
        this.wrong = false;
      } else {
        this.$axios
          .get(
            "http://121.41.30.226:3000/captcha/verify?phone=" +
              this.phone +
              "&captcha=" +
              this.code
          )
          .then(response => {
            if (response.data.code == 200) {
              this.next = true;
              this.$emit("to-parent", this.next);
            }
          })
          .catch(error => {
            this.wrong = true;
            this.msg = error.response.data.message;
            this.warn = true;
          });
      }
    }
  }
};
</script>
<style scoped>
.van-popup--center {
  text-align: center;
}
</style>