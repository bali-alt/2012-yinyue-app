<template>
  <div class="SongList">
    <div style="text-align:center;color:#aaa;" v-show="error" @click="reload">加载失败点击重试~</div>
    <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
    <van-cell v-for="item in list" :key="item.id" @click="setInfo(item.id)" class="Img-content">
      <div class="Img">
        <img :src="item.coverImgUrl" />
      </div>
      <div class="Img-right">
        <p>{{ item.name }}</p>
        <p>by&nbsp;{{ item.creator.nickname }}</p>
      </div>
    </van-cell>
    <SongListInfo v-show="isInfo" ref="Infoid" v-on:getInfo="IsInfo" v-on:getInfoid="music_id"></SongListInfo>
  </div>
</template>
<script>
import SongListInfo from "../components/Songlist/SongListInfo.vue";
//isInfo控制子组件的显示
export default {
  data() {
    return {
      showLoading:false,
      error: false,
      list: [],
      isInfo: false
    };
  },
  created() {
    this.getSongList();
  },
  components: {
    SongListInfo
  },
  methods: {
    reload() {
      this.error = false;
      setTimeout(() => {
        this.getSongList();
      }, 500);
    },
    getSongList() {
      this.$axios
        .get("http://121.41.30.226:3000/top/playlist/catlist")
        .then(response => {
          this.error = false;
          this.showLoading=false;
          this.list = response.data.playlists;
        })
        .catch(() => {
          this.showLoading=false;
          this.error = true;
        });
        this.showLoading=true;
    },
    setInfo(id) {
      // 点击歌单列表调用子组件方法，获取歌曲列表
      this.isInfo = true;
      if (id) {
        this.$refs.Infoid.setInfo(id);
      }
    },
    IsInfo: function(string) {
      this.isInfo = string == "false" ? false : true;
    },
    music_id: function(id, list) {
      this.$emit("to-parent", id, list);
    }
  }
};
</script>
<style scoped>
.SongList {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.Img-content {
  padding: 0.5rem 1rem;
  position: relative;
  height: 7rem;
  border-bottom: 1px solid #f1f1f1;
  border-top: 1px solid #f1f1f1;
}
.Img {
  float: left;
  width: 5.6rem;
  height: 7rem;
}
.Img img {
  width: 5.6rem;
  height: 5.6rem;
  margin: 0.7rem 0;
}
.Img-right {
  float: left;
  margin: 0.7rem 0;
  min-height: 5.6rem;
  position: relative;
}
.Img-right > p:nth-child(1) {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  margin: 0 0.5rem;
  width: 11rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.Img-right > p:nth-child(2) {
  font-size: 0.8rem;
  color: #9b9b9b;
  position: absolute;
  bottom: 0.5rem;
  margin: 0 0.5rem;
}
</style>
