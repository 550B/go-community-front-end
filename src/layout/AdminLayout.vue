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
      <el-menu-item index="/admin/announcement">
          <el-icon><House /></el-icon>
          <span>公告</span>
        </el-menu-item>
        <el-menu-item index="/admin/manageMatch">
          <el-icon><Rank /></el-icon>
          <span>管理比赛</span>
        </el-menu-item>
        <el-menu-item index="/admin/handleViolation">
          <el-icon><Pointer /></el-icon>
          <span>处理违规信息</span>
        </el-menu-item>
        <el-menu-item style="margin-top: auto; font-size: 18px;" @click="LogoutHandler">
          <el-icon><SwitchButton /></el-icon>
          <span>登出</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const LogoutHandler=()=>{
  localStorage.removeItem('token')
  localStorage.removeItem('user_Permission')
  router.push('/')
}


</script>

<style>
.left-menu{
    height: 100vh;
  }



</style>