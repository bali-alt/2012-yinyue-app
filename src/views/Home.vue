<template>
  <div id="home">
    <div id="header">
      <van-nav-bar title="Music">
        <van-icon name="bars" slot="left" class="user" @click="isShowLeft=true" />
        <van-icon name="search" slot="right" @click="searchHandle" class="search" />
      </van-nav-bar>
    </div>
    <div id="content">
      <div class="navList" ref="container">
        <van-tabs v-model="active" v-show="flag" swipeable replace>
          <van-tab title="新歌">
            <NewMusic @to-parent="getChildData"></NewMusic>
          </van-tab>
          <van-tab title="排行">
            <RankingList @to-parent="getChildData"></RankingList>
          </van-tab>
          <van-tab title="歌单">
            <SongList @to-parent="getChildData"></SongList>
          </van-tab>
          <van-tab title="歌手">
            <Singer @to-parent="getChildData"></Singer>
          </van-tab>
        </van-tabs>
        <van-nav-bar v-show="!flag" title="搜索" left-text left-arrow @click-left="index" />
        <Search v-show="!flag" @to-parent="getChildData"></Search>
        <listening
          @to-parent="getChildData"
          v-if="listenFlag"
          :musicId="getId"
          :key="getId"
          :list="musicList"
        ></listening>
      </div>
    </div>
    <van-popup
      v-model="isShowLeft"
      position="left"
      get-container="body"
      :style="{ width: '80%',height:'100%' }"
      class="leftPart"
    >
      <mv :pause="isShowLeft" :key="isShowLeft"></mv>
      <van-tabbar v-model="active" class="goBack">
        <van-tabbar-item icon="home-o" @click="logOut">退出登录</van-tabbar-item>
      </van-tabbar>
    </van-popup>
  </div>
</template>

<script>
import listening from "../components/playMusic/index.vue";
import NewMusic from "./NewMusic.vue";
import RankingList from "./RankingList.vue";
import SongList from "./SongList.vue";
import Singer from "./Singer.vue";
import Search from "./Search.vue";
import { relative } from "path";
import mv from "../components/MV/mv.vue";
//flag:用于进行导航栏和搜索栏的切换   getId用于记录子组件向父组件提交的音乐ID
//listenFlag用于显示音乐播放器    isShowLeft用于显示侧边栏 musicLis用于储存歌曲列表当点击播放的时候向播放组件传递
export default {
  data() {
    return {
      container: null,
      active: 0,
      flag: true,
      getId: "",
      listenFlag: false,
      isShowLeft: false,
      musicList: ""
    };
  },
  mounted() {
    this.container = this.$refs.container;
  },
  components: {
    NewMusic,
    RankingList,
    SongList,
    Singer,
    Search,
    listening,
    mv
  },
  methods: {
    searchHandle() {
      this.flag = false;
    },
    index() {
      this.flag = true;
      this.active = 0;
    },
    getChildData(id, list) {
      // 获取子组件传递的参数（音乐id，当前播放列表）
      this.getId = id;
      this.musicList = list;
      this.listenFlag = true;
      setTimeout(() => {
        document.getElementById("listening").style.position = "static";
        document.getElementById("listening").style.height = "auto";
        document.getElementById("top").style.height = 0;
      });
    },
    logOut() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "您点击了退出登录按钮，是否退出登录？"
        })
        .then(() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          this.$router.push({ path: "/Login" });
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
#home {
  height: 100%;
  display: flex;
  flex-direction: column;
}
#content {
  flex: 1;
  overflow: auto;
}
.navList {
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.van-nav-bar__arrow{font-size: 1.3em;}
.van-tabs[data-v-fae5bece] {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.leftPart {
  display: flex;
  flex-direction: column;
}
.search,
.user {
  font-size: 1.5em;
}
.goBack {
  position: relative;
}
.van-sticky--fixed {
  background: #fff;
}
</style>
