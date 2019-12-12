<template>
  <div class="mv">
    <form action="/">
      <van-search placeholder="请输入搜索关键词" v-model="value" @search="onSearch" @input="clear" />
    </form>
    <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
    <div style="text-align:center;color:#aaa;" v-show="showError">数据加载失败，请重试~</div>
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item,i) in mv" :key="i" :title="item.name">
        <video class="vidio" :src="item.url" controls width="100%" :poster="item.imgUrl"></video>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
//value储存输入框中的文字 
export default {
  props: ["isplay"],
  data() {
    return {
      value: "",
      mv: [],
      loading: false,
      finished: false,
      showLoading: false,
      showError: false,
      error: false,
      page: 0,
      limit: 5
    };
  },
  methods: {
    getMvId() {
      this.$axios
        .get(
          "http://121.41.30.226:3000/mv/all?offset=" +
            this.page * this.limit +
            "&limit=" +
            this.limit
        )
        .then(response => {
          for (let i = 0; i < response.data.data.length; i++) {
            this.getMvUrl(
              response.data.data[i].id,
              response.data.data[i].name,
              response.data.data[i].cover
            );
          }
        })
        .catch(() => {
          this.error = true;
        });
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 1; i++) {
          this.page++;
          this.getMvId();
        }
        // 加载状态结束
        this.loading = false;
      }, 500);
    },
    getMvUrl(id, name, imgUrl) {
      this.$axios
        .get("http://121.41.30.226:3000/mv/url?id=" + id)
        .then(response => {
          this.error = false;
          this.mv.push({
            name: name,
            url: response.data.data.url,
            imgUrl: imgUrl
          });
        })
        .catch(() => {
          this.error = true;
        });
    },
    onSearch() {
      this.$axios
        .get(
          "http://121.41.30.226:3000/search?keywords=" +
            this.value +
            "&type=1004"
        )
        .then(response => {
          this.mv = [];
          this.error = false;
          this.showLoading = false;
          this.showError = false;
          for (let i = 0; i < response.data.result.mvs.length; i++) {
            this.getMvUrl(
              response.data.result.mvs[i].id,
              response.data.result.mvs[i].name,
              response.data.result.mvs[i].cover
            );
          }
        })
        .catch(() => {
          this.showError = true;
          this.showLoading = false;
        });
      this.showLoading = true;
      this.showError = false;
    },
    clear() {
      if (this.value == "") {
        this.mv = [];
        this.page = 0;
        this.getMvId();
      }
    }
  }
};
</script>
<style  scoped>
.mv {
  text-align: center;
  border-bottom: 1px #ccc solid;
  flex: 1;
  overflow: auto;
}
.mv .van-list {
  height: 100%;
  overflow: auto;
}
</style>