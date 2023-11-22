<template>
  <!-- <h1>这是主页</h1> -->
  <!-- 轮播图 -->
  <el-scrollbar height="95vh">
  <div class="Bigcontainer">
    
    <div class="block text-center">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in pics" :key="item">
          <img class="carousel-image"  :src="item.url" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 对弈界面 -->
  <div class="Bigbox">
    <img class="Imgbox"  :src="pic_home[0].url" >
    <div class="Text">
      <h3>对弈大厅</h3>
      <p>上百万棋友及多个不同等级的智能陪练。</p>
      <p>无论你是入门还是职业顶尖，总有适合你的对手。</p>
      <p>随时随地的围棋陪练，每个阶梯都见证你的成长。</p>
      <p>围棋社区助力你的提升。</p>
      <button @click="goPlay" class="Button1">马上对弈</button>
    </div>
  </div>
  <!-- 专项特训 -->
  <div class="Bigbox">
    <div class="Text2">
      <h3>专项特训</h3>
      <p>针对多个不同的围棋技术专项，全新的训练方法。</p>
      <p>帮助不同等级的棋手，有针对性的提升专项水平。</p>
      <p>遴选上千个盘面，更贴近实战。</p>
      <button @click="goExercise" class="Button1">开展训练</button>
    </div>
    <img :src="pic_home[1].url" class="Imgbox2">
  </div>
  <!-- 比赛 -->
  <div class="Bigbox">
    <img class="Imgbox" :src="pic_home[2].url">
    <div class="Text">
      <h3>围棋比赛</h3>
      <p>用棋盘上的智慧，创造你的传奇！</p>
      <p>聚焦围棋，展示你的智慧与勇气！</p>
      <p>在围棋比赛中，发现你的决策力！</p>
      <p>发掘你的智慧，来参与围棋比赛吧！</p>
      <button @click="goMatch" class="Button1">参与比赛</button>
    </div>
  </div>
  <!-- 论坛 -->
  <div class="Bigbox">
    <div class="Text2">
      <h3>围棋论坛</h3>
      <p>在围棋论坛，与围棋爱好者互动，探讨策略。</p>
      <p>发现新朋友，交流新思路，成就更高水平。</p>
      <p>加入我们的围棋论坛，共同提升棋艺。</p>
      <button @click="goPost" class="Button1">进入论坛</button>
    </div>
    <img :src="pic_home[3].url" class="Imgbox2">
  </div>

</div>
</el-scrollbar>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElScrollbar } from 'element-plus';
import { reactive,ref } from 'vue'
import { useRouter } from 'vue-router';

const useToken = () => {
  var service = axios.create({
    headers: {
      // 设置后端需要的传参类型
      'Content-Type': 'application/json',
      'Authorization':'bearer '+localStorage.getItem('token')
    }
  })

  service.post("http://43.139.128.42:9876/api/User/check?i=1").then(res => {
    console.log(res.data)
  }).catch((error) => {
          console.log(error)//对于所有需要token的接口，若token过期接口调用失败，应跳转回登录界面，清除localstorage
        })
}


const pics = reactive([
  {
    url: new URL('../assets/HomeImage/pic1.png', import.meta.url).href,
  },
  {
    url: new URL('../assets/HomeImage/pic2.png', import.meta.url).href,
  },
  {
    url: new URL('../assets/HomeImage/pic3.png', import.meta.url).href,
  },
  {
    url: new URL('../assets/HomeImage/pic4.png', import.meta.url).href,
  },
])

const pic_home=reactive([
{
    url: new URL('../assets/HomeImage/pic5.png', import.meta.url).href,
  },

  {
    url: new URL('../assets/HomeImage/pic6.png', import.meta.url).href,
  },

  {
    url: new URL('../assets/HomeImage/pic7.png', import.meta.url).href,
  },

  {
    url: new URL('../assets/HomeImage/pic8.png', import.meta.url).href,
  },
])

const router = useRouter();

const goPlay=()=>{
  router.push('/player/apply')
}

const goExercise=()=>{
  router.push('/player/allExercise')
}

const goMatch=()=>{
  router.push('/player/allMatch')
}

const goPost=()=>{
  router.push('/player/allPost')
}

</script>



<style scoped>


.Bigcontainer{
  display: flex;
  /* height: 100vh;
  overflow-y: hidden; */
  height: auto;
  flex-direction: column; /* 水平排列，可根据需要更改排列方式 */
}

.block{
  flex:1;
  padding-right: 5%;
  padding-left: 5%;
}

.carousel-container {
  flex:1;
  width: 100%; /* 设置容器宽度为100% */
}

.carousel-image {
  flex:1;
  width: 100%; /* 设置图片宽度为100%，以填满父容器 */
  height: 100%; /* 设置图片高度为100%，以填满父容器 */
  object-fit: fill; /* 保持图片比例，并填满整个容器，可能裁剪部分图片 */
}

/* .el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
} */

/* .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
} */

.Bigbox{
  flex:1;
  display: flex;
  flex-direction: row;
  height: 500px;
  margin-top: 50px;
  margin-right: 5%;
  margin-left: 5%;  
  background-color:rgb(52, 52, 52)
}

.Imgbox{
  flex:1;
  /* position: relative; */
  object-fit: fill;
  /* height:70%; */
  width:40% ;
  max-width: 600px;
  margin-left: 3%;
  margin-top: 2%;
  margin-bottom: 2%;
  margin-right: 5%;
  background-color: aqua;
}

.Imgbox2{
flex: 1;
object-fit: fill;
width: 40%;
max-width: 600px;
margin-right: 4%;
margin-left: 5%;
margin-top: 2%;
margin-bottom: 2%;
background-color: aqua;
}

.Text{
 /* float: right; */
 margin-right: 5%;
 margin-top: 5%;
}

.Text h3{
  font-size: 35px;
  color: #fafafa;
  margin-bottom: 20px;
  text-align: left;
}

.Text p{
  font-size: 30px;
  color: #fafafa;
  margin-bottom: 15px;
  text-align: left;
}

.Button1{
  background-color: rgb(230, 145, 44);
  margin-top: 10px;
  font-size:30px ;
  width: 250px;
  height: 60px;
  border-radius:5px ;
  border: none;
  color:#fafafa;
  float: left;
}



.Text2{
  /* float: left; */
  margin-left: 5%;
  margin-top: 5%;
}

.Text2 h3{
  font-size: 35px;
  color: #fafafa;
  margin-bottom: 20px;
  text-align: left;
}

.Text2 p{
  font-size: 30px;
  color: #fafafa;
  margin-bottom: 15px;
  text-align: left;
}

</style>