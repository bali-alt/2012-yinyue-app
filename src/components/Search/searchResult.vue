<template>
  <div class="searchResult">
    <div style="text-align:center;color:#aaa;" v-show="error" >数据加载失败，请重试~</div>
    <van-list>
      <van-cell
        v-for="item in result"
        :key="item.id"
        :title="item.name"
        :label="item.artists[0].name"
        @click="autoPlay(item.id)"
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
     error:false,
      result: [],
      getId: ""
    };
  },
  methods: {
    getMusicList(i) {
      this.$axios
        .get("http://121.41.30.226:3000/search?limit=100&keywords=" + i)
        .then(response => {
          this.error=false;
          this.result = response.data.result.songs;
        }).catch(()=>{
          this.error=true;
        });
    },
    autoPlay(i) {
      this.getId = i;
      this.$emit("toParent", i,this.result);
    }
  }
};
</script>
<style scoped>
.router-link-active {
  font-size: 0.8rem;
  margin: 0.1rem 1.1rem;
  color: blue;
}
.searchResult {
  overflow: auto;
  height: 100%;
}
.searchResult .van-list {
  overflow: auto;
  height: 100%;
}
</style>