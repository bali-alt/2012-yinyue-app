<template>
  <div id="listening">
    <div id="top">
      <van-nav-bar :title="details.name" left-arrow @click-left="back" />
      <van-image
        fit="cover"
        round
        width="15rem"
        height="15rem"
        :src="details.al.picUrl"
        id="smallImg"
        @click="timeOut"
      />
      <div class="shade" v-show="showShade" @click="playMusic">
        <van-icon class="stop" name="play-circle-o" size="5em" color="rgba(255,255,255,0.5)" />
      </div>
      <van-swipe
        style="height:5rem;"
        vertical
        :show-indicators="false"
        :initial-swipe="initNum"
        :touchable="false"
      >
        <van-swipe-item v-for="(item,i) in songWords" :key="i">{{item}}</van-swipe-item>
      </van-swipe>
    </div>
    <div class="bottomMusic">
      <van-card
        :desc="details.ar[0].name"
        :title="details.name"
        :thumb="details.al.picUrl"
        :centered="false"
        @click="isPlaying"
      >
        <div slot="tags" class="custom">
          <span class="nowTime">{{nowTime}}</span>
          <van-slider v-model="value" class="slider" @change="onChange" />
          <span class="totalTime">{{totalTime}}</span>
          <van-icon name="play" v-show="showShade" class="playIcon" @click.stop="playMusic" />
          <van-icon name="pause" v-show="!showShade" class="pauseIcon" @click.stop="timeOut" />
          <van-icon name="weapp-nav" class="musicList" @click.stop="listFlag=!listFlag" />
        </div>
      </van-card>
      <div class="tipShade" @click="listFlag=!listFlag" v-show="listFlag">
      <van-list class="tipMusicList" v-show="listFlag">
        <van-cell
          v-for="item in list"
          :key="item.id"
          :title="item.name"
          @click="emitToParent(item.id)"
        >
          <van-icon slot="right-icon" name="music-o" style="line-height: inherit;" size="1.5em" />
        </van-cell>
      </van-list>
      </div>
    </div>
    <audio id="mp3" :src="musicSrc" controls="controls" autoplay></audio>
    <van-popup v-model="show" round closeable :style="{ width: '80%' }">
      <p>不好意思呢~ o(*￣▽￣*)o</p>
      <p>此歌曲我们还未获得播放版权</p>
    </van-popup>
  </div>
</template>
<script>
//initNum设置歌词初始的轮播位置 listFlag用于切换歌词列表的显示  show用于判断是否可以播放歌曲  timer用于设置定时器  showShade用于展示图片上的遮罩层     count用于记录图片旋转的角度 value用于记录滑块位置 nowTimeSecond当前播放时间（秒） totalTimeSecond歌曲总时长（秒）
export default {
  data() {
    return {
      details: { name: "", al: "", ar: [{ name: "" }] },
      songWords: [],
      musicSrc: "",
      wordsTime: [],
      initNum: 0,
      show: false,
      timer: null,
      showShade: false,
      count: 0,
      value: 0,
      nowTimeSecond: 0,
      totalTimeSecond: 0,
      nowTime: "0:00",
      totalTime: "0:00",
      listFlag: false
    };
  },
  props: ["musicId", "list"],
  mounted() {
    clearInterval(this.timer);
    this.showWords();
    this.getSongsDetail(this.musicId);
    this.getSongWords(this.musicId);
    this.getMusicSrc(this.musicId);
    this.getTotalTime();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    intoMinutes(time, result) {
      //分钟
      var minute = time / 60;
      var minutes = parseInt(minute);
      if (minutes < 10) {
        minutes = minutes;
      }
      //秒
      var second = time % 60;
      var seconds = Math.round(second);
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (result == "nowTime") {
        this.nowTime = minutes + ":" + seconds;
      }
      if (result == "totalTime") {
        this.totalTime = minutes + ":" + seconds;
      }
    },
    getSongsDetail(i) {
      this.$axios
        .get("http://121.41.30.226:3000/song/detail?ids=" + i)
        .then(response => {
          this.details = response.data.songs[0];
        });
    },
    getSongWords(i) {
      this.$axios
        .get("http://121.41.30.226:3000/lyric?id=" + i)
        .then(response => {
          // 判断是否存在歌词
          if (
            response.data.lrc &&
            response.data.lrc.lyric !== "" &&
            response.data.lrc.lyric.includes("[") &&
            response.data.lrc.lyric.includes("]")
          ) {
            //过滤数组中的空元素
            let arr = response.data.lrc.lyric.split("\n").filter((v, i) => {
              return v !== "";
            });
            // console.log(arr)
            //获取时间
            let arr0 = arr.map((v, i) => {
              return v.slice(v.lastIndexOf("[") + 1, v.lastIndexOf("]"));
            });
            let arr1 = arr.map((v, i) => {
              return v.split("]")[0].slice(1);
            });

            let getSecond = function(arr) {
              arr = arr.map((v, i) => {
                return v.split(":");
              });
              //转化为秒
              arr = arr.map((v, i) => {
                return v[0] * 60 + parseFloat(v[1]);
              });
              return arr;
            };
            arr0 = getSecond(arr0);
            arr1 = getSecond(arr1);
            //获取歌词
            let musicWords = arr.map((v, i) => {
              return v.slice(v.lastIndexOf("]") + 1);
            });
            let obj0 = {};
            let obj1 = {};
            for (let i = 0; i < arr0.length; i++) {
              obj0[arr0[i]] = musicWords[i];
              obj1[arr1[i]] = musicWords[i];
            }
            Object.assign(obj0, obj1);
            // console.log(obj0)
            this.wordsTime = Object.keys(obj0);
            this.songWords = Object.values(obj0);
          } else {
            this.wordsTime = [1000];
            this.songWords = ["没有获取到歌曲信息~"];
          }
          // console.log(this.wordsTime);
          // console.log(this.songWords);
        });
    },
    showWords() {
      //设置定时器通过歌曲的播放时间判断应该显示哪句歌词
      this.timer = setInterval(() => {
        //旋转图片
        if (!document.getElementById("mp3").paused) {
          document.getElementById("smallImg").style.transform =
            "rotate(" + this.count + "deg)";
          this.count++;
        }
        //获取当前的播放时间
        this.nowTimeSecond = document.getElementById("mp3").currentTime;
        this.intoMinutes(this.nowTimeSecond, "nowTime");
        //判断应该显示哪句歌词
        for (let i = 0; i < this.songWords.length; i++) {
          if (this.songWords[i + 1]) {
            if (
              this.nowTimeSecond >= this.wordsTime[i] &&
              this.nowTimeSecond <= this.wordsTime[i + 1]
            ) {
              this.initNum = i;
            }
          }
        }
        //设置滑块的进度
        this.value = (this.nowTimeSecond / this.totalTimeSecond) * 100;
        //当歌曲播放完随机播放列表中的歌曲
        if (this.nowTimeSecond !== 0) {
          if (this.nowTimeSecond == this.totalTimeSecond) {
            this.$emit(
              "to-parent",
              this.list[parseInt(Math.random() * this.list.length)].id,
              this.list
            );
          }
        }
      }, 100);
    },
    getMusicSrc(i) {
      this.$axios
        .get("http://121.41.30.226:3000/song/url?id=" + i)
        .then(response => {
          this.musicSrc = response.data.data[0].url;
          if (!this.musicSrc) {
            this.show = true;
          }
        });
    },
    getTotalTime() {
      let audio = document.getElementById("mp3");
      audio.oncanplay = () => {
        this.totalTimeSecond = audio.duration;
        this.intoMinutes(this.totalTimeSecond, "totalTime");
      };
    },
    back() {
      setTimeout(() => {
        document.getElementById("listening").style.position = "static";
        document.getElementById("listening").style.height = "auto";
        document.getElementById("top").style.flex = "0 0 0";
      });
    },
    isPlaying() {
      // 展示播放详情页
      setTimeout(() => {
        document.getElementById("listening").style.position = "fixed";
        document.getElementById("listening").style.top = 0;
        document.getElementById("listening").style.height = "100%";
        document.getElementById("top").style.flex = "1";
      });
    },
    timeOut() {
      this.showShade = true;
      document.getElementById("mp3").pause();
      clearInterval(this.timer);
    },
    playMusic() {
      this.showShade = false;
      document.getElementById("mp3").play();
      clearInterval(this.timer);
      this.showWords();
    },
    onChange() {
      this.playMusic();
      this.nowTimeSecond = (this.value / 100) * this.totalTimeSecond;
      document.getElementById("mp3").currentTime = this.nowTimeSecond;
      this.intoMinutes(this.nowTimeSecond, "nowTime");
    },
    emitToParent(i, list) {
      this.$emit("to-parent", i, this.list);
      this.listFlag = false;
    }
  }
};
</script>
<style scoped>
#listening {
  position: static;
  text-align: center;
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.tipMusicList {
  position: fixed;
  max-height: 40%;
  overflow: auto;
  bottom: 5em;
  text-align: left;
  background: rgba(230, 230, 230, 0.8);
  width: 100%;
  border: 1px #ccc solid;
}
#top {
  position: relative;
  width: 100%;
}
#mp3 {
  display: none;
}
.tipShade{    position: fixed;
    height: calc(100% - 5em);
    top: 0;
    z-index: 1;
    width: 100%;
    background: rgba(0,0,0,0.5);}
#smallImg {
  margin: 3rem 0 3rem;
}
.shade {
  position: absolute;
  top: 5.9em;
  left: 50%;
  margin-left: -7.5rem;
  height: 15rem;
  width: 15rem;
  text-align: center;
  line-height: 15rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
}
.stop {
  line-height: 15rem;
}
.custom {
  display: flex;
}

.slider {
  flex: 1;
  margin: 0 1em;
  align-self: center;
}
.playIcon,
.musicList,
.pauseIcon {
  font-size: 1.5em;
}
.playIcon,
.musicList,
.pauseIcon {
  margin-left: 0.5em;
}
.van-card__thumb {
  width: 5em;
  height: 5em;
}
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 0.7em 1.2em;
  color: #323233;
  font-size: 0.8em;
  background-color: #f7f8f8;
  margin: 0;
}
.van-card__content {
  min-height: 0;
}
</style>