<template>
  <div class="singer">
    <van-sidebar v-model="activeKey">
      <van-sidebar-item v-for="p in items" :key="p.pst" :title="p.text" @click="getSinger(p.pst)" />
    </van-sidebar>
    <div class="singerName">
      <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
      <div style="text-align:center;color:#aaa;" v-show="error" @click="reload">加载失败点击重试~</div>
      <van-card
        v-for="(item,i) in singerList"
        :key="i"
        :title="item.name"
        :thumb="item.picUrl"
        @click="getSingerMusic(item.id)"
      />
    </div>
    <div class="songs" v-show="show">
      <van-nav-bar style="border-bottom:0;background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) );width:100%;position:fixed;" :title="singerDetails.name" left-arrow @click-left="back" />
      <van-image width="100%" height="15em" fit="cover" :src="singerDetails.picUrl" />
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1" title="基本介绍">{{singerDetails.briefDesc}}</van-collapse-item>
      </van-collapse>
      <div style="background:rgba(0,0,0,0.1); padding:0.1em 1em;">歌曲列表:</div>
      <van-cell-group style="flex:1;overflow:auto;">
        <van-cell
          v-for="(item,i) in songList"
          :key="i"
          :title="item.name"
          @click="playMusic(item.id)"
        >
          <van-icon slot="right-icon" name="music-o" style="line-height: inherit;" size="1.5em" />
        </van-cell>
        <van-cell
          style="height:5.5em;line-height:5.5em;text-align:center"
          title="没有更多了~"
          v-show="isShow"
        ></van-cell>
        <van-loading type="spinner" style="text-align:center;" v-show="showSongsLoading" />
      </van-cell-group>
      <div
        style="text-align:center;color:#aaa;"
        v-show="getSongError"
        @click="reloadSongs"
      >加载失败点击重试~</div>
    </div>
  </div>
</template>
<script>
//isShow歌曲列表数据加载完后显示 songs用于判断是否显示歌曲列表页
export default {
  data() {
    return {
      showLoading: false,
      showSongsLoading:false,
      isShow: true,
      error: false,
      getSongError: false,
      activeNames: ["0"],
      activeKey: 0,
      singerList: [],
      songList: [],
      singerDetails: {},
      show: false,
      items: [
        { text: "入驻歌手", pst: "5001" },
        { text: "华语男歌手", pst: "1001" },
        { text: "华语女歌手", pst: "1002" },
        { text: "华语组合/乐队", pst: "1003" },
        { text: "欧美男歌手", pst: "2001" },
        { text: "欧美女歌手", pst: "2002" },
        { text: "欧美组合/乐队", pst: "2003" },
        { text: "日本男歌手", pst: "6001" },
        { text: "日本女歌手", pst: "6002" },
        { text: "日本组合/乐队", pst: "6003" },
        { text: "韩国男歌手", pst: "7001" },
        { text: "韩国女歌手", pst: "7002" },
        { text: "韩国组合/乐队", pst: "7003" },
        { text: "其他男歌手", pst: "4001" },
        { text: "其他女歌手", pst: "4002" },
        { text: "其他组合/乐队", pst: "4003" }
      ],
      nowPst: 5001,
      singerId: ""
    };
  },
  mounted() {
    this.getSinger(this.nowPst);
  },
  methods: {
    reload() {
      this.error = false;
      setTimeout(() => {
        this.getSinger(this.nowPst);
      }, 500);
    },
    reloadSongs() {
      this.getSongError = false;
      setTimeout(() => {
        this.getSingerMusic(this.singerId);
      }, 500);
    },
    getSinger(pst) {
      this.nowPst = pst;
      this.$axios
        .get("http://121.41.30.226:3000/artist/list?cat=" + pst)
        .then(response => {
          this.error = false;
          this.showLoading = false;
          this.singerList = response.data.artists;
        })
        .catch(() => {
          this.showLoading = false;
          this.error = true;
        });
        this.showLoading = true;
        this.singerList=[];
    },
    getSingerMusic(id) {
      this.singerId = id;
      setTimeout(() => {
        this.$axios
          .get("http://121.41.30.226:3000/artists?id=" + id)
          .then(response => {
            this.songList = response.data.hotSongs;
            this.singerDetails = response.data.artist;
            this.showSongsLoading = false;
            this.getSongError = false;
            this.isShow = true;
          })
          .catch(() => {
            this.isShow = false;
            this.showSongsLoading = false;
            this.getSongError = true;
          });
        this.showSongsLoading = true;
        this.isShow = false;
        this.songList = [];
        this.singerDetails = [];
        this.show = true;
      });
    },
    back() {
      this.show = false;
    },
    playMusic(id) {
      this.$emit("to-parent", id, this.songList);
    }
  }
};
</script>
<style scoped>
.singer {
  overflow: auto;
  height: 100%;
  display: flex;
}
.singer .van-sidebar {
  width: 7.3em;
  overflow: auto;
  height: 100%;
}
[class*=van-hairline]::after{border:0}
.songs .van-nav-bar__title,.songs .van-icon-arrow-left{color:#fff}
.singerName {
  flex: 1;
  text-align: center;
  height: 100%;
  overflow: auto;
}
.singerName .van-card {
  background: #fff;
  border-bottom: 1px #eee solid;
  padding: 0 2em;
  height: 5em;
}
.singerName .van-card__header,
.singerName .van-card__content {
  max-height: 5em;
  min-height: 5em;
}
.singerName .van-card__thumb,
.singerName .van-image__img,
.singerName .van-image {
  width: 5em;
  max-height: 5em;
}
.singerName .van-card__title {
  line-height: 5em;
  max-height: 5em;
  font-size: 1.1em;
}
.songs {
  width: 100%;
  height: 100%;
  top: 0;
  background: #fff;
  z-index: 10;
  position: fixed;
  overflow: auto
}
</style>
