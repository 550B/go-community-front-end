<template>
    <el-container>
    <el-aside width="255px"> <!-- 侧边栏宽255px -->
        <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo left-menu"
        :default-active="$route.path"
        text-color="#fff"
        :router="true"
      >
        <el-menu-item index="/player/home">
          <el-icon><House /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/player/apply">
          <el-icon><Search /></el-icon>
          <span>对局申请</span>
        </el-menu-item>
        <el-menu-item index="/player/game">
          <el-icon><Pointer /></el-icon>
          <span>当前对局</span>
        </el-menu-item>
        <el-menu-item index="/player/allGame">
          <el-icon><View /></el-icon>
          <span>所有对局</span>
        </el-menu-item>
        <el-menu-item index="/player/allMatch">
          <el-icon><Medal /></el-icon>
          <span>所有比赛</span>
        </el-menu-item>
        <el-menu-item index="/player/allPost">
          <el-icon><ChatLineSquare /></el-icon>
          <span>论坛</span>
        </el-menu-item>
        <el-menu-item index="/player/allExercise">
          <el-icon><Notebook /></el-icon>
          <span>习题</span>
        </el-menu-item>
        <el-menu-item index="/player/selfInfo">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="/player/announcement">
          <el-icon><DataBoard /></el-icon>
          <span>公告</span>
        </el-menu-item>
        <el-menu-item style="margin-top: auto; font-size: 18px;" @click="LogoutHandler">
          <el-icon><SwitchButton /></el-icon>
          <span>登出</span>
        </el-menu-item>
        <el-menu-item>
          <el-avatar shape="square" :size="50" :src="pics[0].url"  style="margin-bottom: auto; text-align: left; "/>
          <span style="margin-left: 5px; margin-bottom: 20%; ">昵称：{{selfInfo.nickname }}</span>
          <span style="margin-left: -72px;">段位：{{ selfInfo.current_Score }}</span>
        </el-menu-item>
        
      </el-menu>
    </el-aside>
    

    
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>

</template>

<script lang="ts" setup>
import { getRank } from '@/components/helper';
import axios from 'axios';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const LogoutHandler=()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user_Permission')
  router.push('/')
}

const pics = reactive([
  {
    url: new URL('../assets/avatar.png', import.meta.url).href,
  },
])

const selfInfo = reactive({
  current_Score: '',
  nickname: '',
  place: '',
  introduction: ''
})

const getSelfInfo = () => {
  var service = axios.create({
    headers: {
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })

  service.get('http://43.139.128.42:9876/api/User/getSelfInfo')
    .then((res) => {
      if (res.data.isSuccess) {
        console.log(res.data)
        selfInfo.current_Score = getRank(res.data.result['current_Score'])
        selfInfo.introduction = res.data.result['introduction']
        selfInfo.nickname = res.data.result['nickname']
        selfInfo.place = res.data.result['place']
      }
    })
}

onMounted(() => {
  getSelfInfo();
})

</script>

<style>
.left-menu{
    height: 100vh;
    display: flex;
  flex-direction: column;
  overflow-y: auto; /* 如果内容溢出侧边栏，添加垂直滚动条 */
  }





</style>