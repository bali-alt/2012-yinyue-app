<template>
  <div class="search iptSearch">
    <form action="/">
      <van-search placeholder="请输入搜索关键词" v-model="value" @search="onSearch()" @input="getTip" />
    </form>
    <div class="searchAbout">
      <hotSearch v-show="hotFlag" @to-parent="getKeyWords"></hotSearch>
      <tipSearch :m="value" v-show="tipFlag" ref="getFn" @to-parent="getKeyWords"></tipSearch>
      <searchResult v-show="searchFlag" ref="getResult" @toParent="getMusicId"></searchResult>
    </div>
  </div>
</template>
<script>
import hotSearch from "../components/Search/hotSearch.vue";
import tipSearch from "../components/Search/tipSearch.vue";
import searchResult from "../components/Search/searchResult.vue";
//hotFlag，tipFlag，searchFlag用于切换组件显示 value用于储存输入框中的文字
export default {
  data() {
    return {
      value: "",
      hotFlag: true,
      tipFlag: false,
      searchFlag: false,
      musicId: "",
      list:''
    };
  },
  components: {
    hotSearch,
    tipSearch,
    searchResult
  },
  methods: {
    onSearch() {
      this.hotFlag = false;
      this.tipFlag = false;
      this.searchFlag = true;
      //调用子组件的方法，获取搜索到的歌曲列表
      this.$refs.getResult.getMusicList(this.value);
    },
    getKeyWords(i) {
      //通过子组件向父组件提交的关键字进行搜索
      this.value = i;
      this.onSearch();
    },
    getTip() {
      if (this.value == "") {
        this.hotFlag = true;
        this.tipFlag = false;
        this.searchFlag = false;
      } else {
        this.hotFlag = false;
        this.tipFlag = true;
        this.searchFlag = false;
        //调用子组件的方法
        this.$refs.getFn.getTip(this.value);
      }
    },
    getMusicId(i,list) {
      this.musicId = i;
      this.list=list;
      //向父组件提交音乐ID和当前音乐列表
      this.$emit("to-parent", i,list);
    }
  }
};
</script>
<style scoped>
.iptSearch {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
