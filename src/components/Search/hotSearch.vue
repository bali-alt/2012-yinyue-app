<template>
  <div class="hotSearch">
    <p>热门搜索</p>
    <div
      style="text-align:center;color:#aaa;font-size:0.7em;"
      v-show="error"
      @click="reload"
    >数据加载失败，点击重试~</div>
    <div>
      <van-tag
        plain
        type="warning"
        size="medium"
        v-for="(item,i) in hotWords"
        :key="i"
        @click="getMusic(item.first)"
      >{{item.first}}</van-tag>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: false,
      hotWords: []
    };
  },
  mounted() {
    this.getHotSearch();
  },
  methods: {
    reload() {
      this.error = false;
      setTimeout(() => {
        this.getHotSearch();
      }, 500);
    },
    getHotSearch() {
      this.$axios
        .get("http://121.41.30.226:3000/search/hot")
        .then(response => {
          this.hotWords = response.data.result.hots;
          this.error = false;
        })
        .catch(() => {
          this.error = true;
        });
    },
    getMusic(i) {
      this.$emit("to-parent", i);
    }
  }
};
</script>
<style scoped>
.hotSearch {
  overflow: auto;
  height: 100%;
}
.hotSearch p {
  padding-left: 0.5rem;
  font-size: 0.9rem;
  margin: 0.5rem;
  color: #666;
}
.van-tag {
  margin-left: 0.8rem;
  padding: 0.3em 0.6em;
}
</style>