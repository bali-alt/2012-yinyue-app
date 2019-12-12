<template>
  <div id="rankingList-2" v-show="!isgg">
    <van-nav-bar :title="mm.name" left-arrow @click-left="fn()" />
    <div id="beijing" style="position:relative">
      <van-image width="100%" cover height="100%" :src="mm.coverImgUrl" />
      <van-cell class="timme" title="上次更新时间：" :value="fd(rrr.updateTime)" v-model="time" />
    </div>
    <div style="text-align:center;color:#aaa;" v-show="error">加载失败,请重新进入~</div>
    <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
    <van-cell
      v-for="item in rr"
      :key="item.id"
      :title="item.name"
      :label="item.ar[0].name"
      @click="getMusic(item.id)"
    >
      <van-icon slot="right-icon" name="music-o" style="line-height: inherit;" size="1.5em" />
    </van-cell>
    <van-cell
      style="height:5.5em;line-height:5.5em;text-align:center"
      title="没有更多了~"
      v-show="isShow"
    ></van-cell>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      error: false,
      isShow: true,
      showLoading: false,
      rrr: [],
      rr: [],
      mm: {},
      time: "",
      isgg: false
    };
  },
  props: ["index"],
  methods: {
    fd(i) {
      var da = new Date(i);
      var year = da.getFullYear() + "年";
      var month = da.getMonth() + 1 + "月";
      var date = da.getDate() + "日";
      this.time = [year, month, date].join("-");
    },
    fn() {
      this.$emit("toParent", false);
      this.isgg = true;
    },
    getMusic(i) {
      this.$emit("to-parent", i, this.rr);
    }
  },
  mounted() {
    axios.get("http://121.41.30.226:3000/toplist/detail").then(res => {
      this.mm = res.data.list[this.index];
    });
    axios
      .get("http://121.41.30.226:3000/top/list?idx=" + this.index)
      .then(res => {
        this.error = false;
        this.isShow = true;
        this.showLoading = false;
        this.rrr = res.data.playlist;
        this.rr = res.data.playlist.tracks;
      })
      .catch(() => {
        this.showLoading = false;
        this.error = true;
        this.isShow = false;
      });
    this.showLoading = true;
    this.isShow = false;
  }
};
</script>
<style scoped>
#rankingList-2 {
  z-index: 99;
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}
#beijing {
  overflow: hidden;
  height: 18em;
}
#beijing img {
  width: 100%;
  height: 50%;
  position: relative;
  margin-top: -4rem;
}
#rankingList-2 .van-nav-bar__title,
#rankingList-2 .van-icon-arrow-left {
  color: #fff;
}
.van-nav-bar {
  width: 100%;
  line-height: 3rem;
  background: -webkit-linear-gradient(
    top,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  padding: 0 2.1429rem;
  position: fixed;
  text-align: center;
  color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.van-hairline--bottom::after {
  border: none;
}
.timme {
  width: 100%;
  height: 2.8rem;
  background: -webkit-linear-gradient(
    bottom,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  ) !important;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
}
.van-cell__value {
  position: absolute;
  left: 7rem;
}
.van-list {
  margin-top: -3.8rem;
  background: #fff;
  opacity: 1 !important;
}
.van-cell {
  border-radius: 0;
}
.van-list > .van-cell,
.van-steps {
  background: rgba(255, 255, 255, 1) !important;
}
</style>
