<template>
  <div id="rankinglist">
    <div style="text-align:center;color:#aaa;" v-show="error" @click="reload">加载失败点击重试~</div>
    <van-loading type="spinner" style="text-align:center;" v-show="showLoading" />
    <van-card
      v-for="(item,i) in list"
      :key="item.id"
      :title="item.name"
      :thumb="item.coverImgUrl"
      @click="ph(i)"
    />
    <RankingList
      v-if="isgg"
      @to-parent="getMusic"
      @toParent="isShow"
      :index="coverImgUrl"
      :key="coverImgUrl"
    ></RankingList>
  </div>
</template>
<script>
import axios from "axios";
import RankingList from "../components/RankingList/index.vue";
//error用于判断数据是否加载失败   showLoading切换loading图的显示 list储存当前播放列表 isgg切换子页面的显示
export default {
  data() {
    return {
      error: false,
      showLoading: false,
      list: [],
      isgg: false,
      coverImgUrl: ""
    };
  },
  mounted() {
    this.getRankingList();
  },
  components: {
    RankingList
  },
  methods: {
    reload() {
      this.error = false;
      setTimeout(() => {
        this.getRankingList();
      },500);
    },
    ph(i) {
      //显示排行榜详情页
      this.isgg = true;
      this.coverImgUrl = i;
    },
    getRankingList() {
      axios.get("http://121.41.30.226:3000/toplist").then(res => {
        this.list = res.data.list;
        this.error=false;
        this.showLoading=false;
      }).catch(()=>{
        this.error=true;
        this.showLoading=false;
      });
      this.error=false;
      this.showLoading=true;
    },
    getMusic(i, list) {
      this.getId = i;
      this.$emit("to-parent", i, list);
    },
    isShow(i) {
      //获取子组件提交的数据，用于切换子组件显示隐藏
      this.isgg = i == false ? false : true;
    }
  }
};
</script>
<style  scoped>
#rankinglist .van-card {
  font-size: 1em;
}
#rankinglist .van-card__title {
  max-height: 90px;
  line-height: 90px;
  text-align: left;
  padding-left: 1em;
}
</style>