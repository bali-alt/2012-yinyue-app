<template>
  <div class="NewMusic">
    <van-swipe>
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.pic" @click="getMusic(image.song.id)" />
      </van-swipe-item>
    </van-swipe>
    <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
    <div style="text-align:center;color:#aaa;" v-show="error" @click="reload">数据加载失败，点击重试~</div>
    <van-list>
      <van-cell
        v-for="item in list"
        :key="item.id"
        :title="item.name"
        :label="item.song.artists[0].name"
        @click="getMusic(item.id)"
      >
        <van-icon slot="right-icon" name="music-o" style="line-height: inherit;" size="1.5em" />
      </van-cell>
    </van-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      images: [],
      list: [],
      getId: "",
      showLoading: false,
      bannerError: false,
      listError: false,
      error: false
    };
  },
  mounted() {
    this.getBannerImgs();
    this.getNewMusic();
  },
  methods: {
    reload() {
      //数据加载失败
      this.error=false;
      setTimeout(() => {
        this.getBannerImgs();
        this.getNewMusic();
      }, 500);
    },
    getBannerImgs() {
      this.$axios
        .get("http://121.41.30.226:3000/banner?type=1")
        .then(response => {
          //过滤掉没有歌曲信息的图片
          this.images = response.data.banners.filter((v, i) =>
            v.song ? true : false
          );
          this.showLoading = false;
          this.bannerError = false;
          this.error=this.bannerError||this.listError;
        })
        .catch(() => {
          this.showLoading = false;
          this.bannerError = true;
          this.error=this.bannerError||this.listError;
        });
      this.showLoading = true;
    },
    getNewMusic() {
      this.$axios
        .get("http://121.41.30.226:3000/personalized/newsong")
        .then(response => {
          this.list = response.data.result;
          this.showLoading = false;
          this.listError = false;
          this.error=this.bannerError||this.listError;
        })
        .catch(() => {
          this.showLoading = false;
          this.listError = true;
          this.error=this.bannerError||this.listError;
        });
      this.showLoading = true;
    },
    getMusic(i) {
      //向父元素提交音乐id和当前歌曲列表
      this.getId = i;
      this.$emit("to-parent", i, this.list);
    }
  }
};
</script>
<style scoped>
.van-swipe img {
  width: 100%;
  display: block;
}
.van-tabs__content {
  flex: 1;
  overflow: auto;
}
</style>