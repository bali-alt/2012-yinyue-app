<template>
  <div id="SongListInfo">
    <div class="ImgTop">
      <div style="height:13rem;overflow:hidden;">
        <van-image cover :src="imgurl" class="ImgBgd" width="100%"/>
      </div>
      <van-sticky class="Info-top">
        <van-nav-bar
          :title="name"
          left-arrow
          @click-left="onClickLeft"
          style="background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0) );"
        />
      </van-sticky>
    </div>
    <div class="ImgBtm">
      <div class="ImgBtmTag" style="padding: 0.6rem;">
        标签:
        <van-tag
          round
          color="#666"
          plain
          size="0.6rem"
          v-for="item in tags"
          :key="item"
          style="margin:0 0.6rem;"
        >{{ item }}</van-tag>
      </div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="简介：" name="1">
          {{
          description
          }}
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="SongLists">
      <h3>歌曲列表</h3>
      <div style="flex:1;overflow:auto;">
        <div
          v-for="(item, num) in list"
          :key="item.id"
          @click="getInfoid(item.id, list)"
          style="display:flex;width:100%;height:3.4rem;position:relative"
        >
          <div class="snum">{{ num + 1 }}</div>
          <div style="float:left;flex:1;" class="bord">
            <div style="float:left;padding:6px 0;max-width:18rem;">
              <p style="font-size:1.06rem;line-height:1.55rem;">{{ item.name }}</p>
              <p
                style="font-size:0.75rem;color:#888;line-height:1.1rem;"
              >{{ item.ar[0].name }}-{{ item.al.name }}</p>
            </div>
            <div style="float:right;margin-right:10px;line-height:3.4rem;font-size:1.375rem;">
              <van-icon name="music-o" />
            </div>
          </div>
        </div>
        <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
        <div style="text-align:center;color:#aaa;" v-show="error">数据加载失败，请返回重新进入~</div>
        <div style="height:5.5em;line-height:5.5em;text-align:center" v-show="showEnd">没有更多了~</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error:false,
      showLoading:false,
      showEnd:true,
      list: [],
      imgurl: "",
      name: "",
      tags: [],
      activeNames: ["0"],
      description: ""
    };
  },
  methods: {
    onClickLeft() {
      this.$emit("getInfo", "false");
    },
    getInfoid(id, list) {
      this.$emit("getInfoid", id, list);
    },
    setInfo: function(setInfoid) {
      this.$axios
        .get("http://121.41.30.226:3000/playlist/detail?id=" + setInfoid)
        .then(response => {
          this.error=false;
          this.showLoading=false;
          this.showEnd=true;
          this.list = response.data.playlist.tracks;
          this.name = response.data.playlist.name;
          this.tags = response.data.playlist.tags;
          this.description = response.data.playlist.description;
          this.imgurl = response.data.playlist.coverImgUrl;
        }).catch(()=>{
          this.error=true;
          this.showLoading=false;
          this.showEnd=false;
        });
        this.showEnd=false;
        this.error=false;
        this.showLoading=true;
    }
  }
};
</script>
<style scoped>
#SongListInfo {
  z-index: 99;
  width: 100%;
  height: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}
[class*=van-hairline]::after{border:0}
.van-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ImgTop {
  position: relative;
  overflow: hidden;
}
.ImgBgd > img {
  height: auto;
}
.ImgBgd .van-image__error{
  display:none!important;
}
.Info-top {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
}
.ImgBtm {
  min-height: 5rem;
  width: 100%;
  background: #fff;
  font-size: 0.75rem;
  color: #666;
}
.SongLists {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
}
.van-nav-bar .van-icon {
  color: #fff;
  font-size: 1.7rem;
}
.van-nav-bar__title {
  color: #fff;
}
.snum {
  width: 2.5rem;
  line-height: 3.4rem;
  color: #999;
  text-align: center;
  font-size: 1.06rem;
  float: left;
}
.bord:after {
  position: absolute;
  z-index: 0;
  content: "";
  top: 0;
  right: 0;
  pointer-events: none;
  box-sizing: border-box;
  width: 90%;
  height: 100%;
  transform-origin: top left;
  border: 0 solid rgba(0, 0, 0, 0.1);
  border-bottom-width: 1px;
}
h3 {
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.4rem;
  background: #eee;
  margin: 0;
  padding: 0 0.6rem;
}
p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
