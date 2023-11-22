<template>
  <!-- <goban maxWidth="600" maxHeight="600"></goban> -->
  <!-- <div>
    <el-input v-model="registerForm.Mail" placeholder="邮箱"></el-input>
    <el-input v-model="registerForm.password" placeholder="密码"></el-input>
  </div>

  <el-button @click="sendTheCerificationCode">发送验证码</el-button>
  <el-button @click="getuser">getAllUser</el-button>
  <el-button @click="login">登录</el-button> -->

  <!-- 最外层的大盒子 -->
  <div class="bigBox">
    <div class="box" ref="box">
      <!-- 滑动盒子 -->
      <div class="pre-box">
        <h1>欢迎加入</h1>
        <p>围棋社区</p>
      </div>
      <!-- 注册盒子 -->
      <div class="register-form">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>注册</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="rules"
            label-with="5px"
        >
          <el-form-item prop="mail" label=" ">
            <el-input
                type="text"
                placeholder="邮箱"
                :suffix-icon="User"
                v-model="registerForm.mail"
            />
          </el-form-item>
          <div class="btn-box">
            <el-form-item prop="TheCerificationCode" label=" ">
              <el-input
                  type="text"
                  placeholder="验证码"
                  v-model="registerForm.TheCerificationCode"
              />
            </el-form-item>
            <button @click="sendTheCerificationCode">发送验证码</button>
          </div>

          <el-form-item prop="password" label=" ">
            <el-input
                type="password"
                placeholder="密码"
                :suffix-icon="Lock"
                v-model="registerForm.password"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label=" ">
            <el-input
                type="password"
                placeholder="确认密码"
                :suffix-icon="Lock"
                v-model="registerForm.confirmPassword"
            />
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="register">注册</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch" style="color: rgb(66, 134, 245);">已有账号?去登录</p>
        </div>
      </div>
      <!-- 登录盒子 -->
      <div class="login-form">
        <!-- 标题盒子 -->
        <div class="title-box">
          <h1>登录</h1>
        </div>
        <!-- 输入框盒子 -->
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            label-with="5px"
        >
          <el-form-item prop="mail" label=" ">
            <el-input
                type="text"
                placeholder="邮箱"
                :suffix-icon="User"
                v-model="loginForm.mail"
            />
          </el-form-item>
          <el-form-item prop="password" label=" ">
            <el-input
                type="password"
                placeholder="密码"
                :suffix-icon="Lock"
                v-model="loginForm.password"
            />
          </el-form-item>
        </el-form>
        <!-- 按钮盒子 -->
        <div class="btn-box">
          <button @click="login">登录</button>
          <!-- 绑定点击事件 -->
          <p @click="mySwitch" style="color: rgb(66, 134, 245);">没有账号?去注册   </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { reactive,ref } from 'vue'
import { useRouter } from 'vue-router';
import {  ElMessage, ElMessageBox ,  ElInput} from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
//import type { FormInstance, FormRules } from 'element-plus'


// const registerForm = reactive({
//   Mail: '999@123.com',
//   user_ID: "",
//   password: "666666",
//   create_Time: null,
//   user_Permission: null,
// })

const registerForm = reactive({
  mail:'',
  TheCerificationCode: '',
  password: '',
  confirmPassword: ''
})
const loginForm = reactive({
  mail: '',
  password: ''
})

const rules = reactive({
  mail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 1, max: 100, message: '长度应该在1-100个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '长度应该大于6', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 6, message: '长度应该大于6', trigger: 'blur' },
  ],
  TheCerificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6,message: '长度应该等于6', trigger: 'blur' },
  ],
})


let flag = ref(true)
const mySwitch = () => {
    const pre_box = document.querySelector('.pre-box')
    if (flag.value) {
        pre_box.style.transform = "translateX(100%)"
        pre_box.style.backgroundColor = "rgb(239,243,236)"
    }
    else {
        pre_box.style.transform = "translateX(0%)"
        pre_box.style.backgroundColor = "rgb(180, 169, 136)"
    }
    flag.value = !flag.value
}

// const combined={
//   j:registerForm,
//   num:3
// }

const router = useRouter();

//注册
const sendTheCerificationCode = () => {
  let data = JSON.parse(JSON.stringify(registerForm))

  // console.log(registerForm)
  // console.log(JSON.stringify(registerForm))
  // console.log(data)

  var service = axios.create({
  headers: {
    // 设置后端需要的传参类型
    'Content-Type': 'application/json',
  }
  })

  service.post("http://43.139.128.42:9876/api/User/sendEmail", data).then(res => {
    alert('验证码发送成功')
    console.log(res.data)
    //console.log(res.data['isSuccess'])
  })
  .catch((error) => {
      console.log(error)
  })
}

const register = () => {
  let data = JSON.parse(JSON.stringify(registerForm))

  var service = axios.create({
  headers: {
    // 设置后端需要的传参类型
    'Content-Type': 'application/json',
  }
  })

  service.post("http://43.139.128.42:9876/api/User/register?identify="+String(registerForm.TheCerificationCode), data)
  .then(res => {
    if(res.data['isSuccess']){
      alert('注册成功')
    }else{
      alert('注册失败')
    }
    console.log(res.data)
  })
  .catch((error) =>{
      console.log(error)
      alert('格式错误')
  })
  
}

//登录
const login= () => {
  let data=JSON.parse(JSON.stringify(loginForm))

  var service = axios.create({
  headers: {
    // 设置后端需要的传参类型
    'Content-Type': 'application/json',
  }
  })

  service.post("http://43.139.128.42:9876/api/User/logIn", data)
  .then(res => {
    if(res.data.isSuccess){
      
      //后续写到logout时要清除localstorage
      localStorage.setItem('token', res.data.result['token']);
      const userPermissionValue = res.data.result['user_Permission'];
      const role = userPermissionValue === 1 ? 'player' : 'admin';
      localStorage.setItem('user_Permission', role);
      console.log(localStorage.getItem('token'))
      //ElMessageBox.alert('登录成功')
      ElMessage({
        message: '登录成功',
        type: 'success',
      })

      if(role === 'player'){
        //console.log(role)
        router.push('/player/home');
      }
      else
        router.push('/admin/announcement');

    }else{
      //ElMessageBox.alert('登录失败')
      ElMessage.error('登录失败')
    }
  })
  .catch((error) => {
    console.log(error)
    ElMessageBox.alert('格式错误')
  })
}


</script>

<style scoped>
/* 去除input的轮廓 */
input {
  outline: none;
}

.bigBox {
  /* 溢出隐藏 */
  height: 100vh;
  overflow-x: hidden;
  display: flex;
  /* 渐变方向从左到右 */
  /* background: linear-gradient(to right, rgb(81, 77, 67), rgb(222, 239, 248)); */
  background-image: url("../assets/bk.png");
  background-size: 100% 100%;
  background-attachment: fixed;

  width: 100%; /* 宽度占满视口宽度 */
  height: 100vh; /* 高度占满视口高度 */
  position: absolute;
}

/* 最外层的大盒子 */
.box {
  width: 1050px;
  height: 600px;
  display: flex;
  /* 相对定位 */
  position: relative;
  z-index: 2;
  margin: auto;
  /* 设置圆角 */
  border-radius: 8px;
  /* 设置边框 */
  border: 1px solid rgba(255, 255, 255, 0.6);
  /* 设置盒子阴影 */
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
}

/* 滑动的盒子 */
.pre-box {
  /* 宽度为大盒子的一半 */
  width: 50%;
  height: 100%;
  /* 绝对定位 */
  position: absolute;
  /* 距离大盒子左侧为0 */
  left: 0;
  /* 距离大盒子顶部为0 */
  top: 0;
  z-index: 99;
  border-radius: 4px;
  background-color: rgb(180, 169, 136);
  box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
  /* 动画过渡，先加速再减速 */
  transition: 0.5s ease-in-out;
}

/* 滑动盒子的标题 */
.pre-box h1 {
  margin-top: 150px;
  text-align: center;
  /* 文字间距 */
  letter-spacing: 5px;
  color: white;
  /* 禁止选中 */
  user-select: none;
  /* 文字阴影 */
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 滑动盒子的文字 */
.pre-box p {
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0;
  /* 禁止选中 */
  user-select: none;
  font-weight: bold;
  color: white;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片盒子 */
.img-box {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  /* 设置为圆形 */
  border-radius: 50%;
  /* 设置用户禁止选中 */
  user-select: none;
  overflow: hidden;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片 */
.img-box img {
  width: 100%;
  transition: 0.5s;
}

/* 登录和注册盒子 */
.login-form,
.register-form {
  height: 300px;
  line-height: 500px;
  flex: 1;
}

/* 标题盒子 */
.title-box {
  height: 300px;
  line-height: 500px;
}

/* 标题 */
.title-box h1 {
  text-align: center;
  color: black;
  /* 禁止选中 */
  user-select: none;
  letter-spacing: 5px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 输入框盒子 */
.el-form {
  display: flex;
  /* 纵向布局 */
  flex-direction: column;
  /* 水平居中 */
  align-items: center;
}
.el-form-item {
  width: 65%;
}
/* 输入框 */
input {
  /* width: 60%; */
  height: 40px;
  margin-bottom: 20px;
  text-indent: 10px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 120px;
  /* 增加磨砂质感 */
  backdrop-filter: blur(10px);
}

input:focus {
  /* 光标颜色 */
  color: #b0cfe9;
}

/* 聚焦时隐藏文字 */
input:focus::placeholder {
  opacity: 0;
}

/* 按钮盒子 */
.btn-box {
  display: flex;
  justify-content: center;
}

/* 按钮 */
button {
  width: 100px;
  height: 30px;
  margin: 0 7px;
  line-height: 30px;
  border: none;
  border-radius: 4px;
  background-color: #69b3f0;
  color: white;
}

/* 按钮悬停时 */
button:hover {
  /* 鼠标小手 */
  cursor: pointer;
  /* 透明度 */
  opacity: 0.8;
}

/* 按钮文字 */
.btn-box p {
  height: 30px;
  line-height: 30px;
  /* 禁止选中 */
  user-select: none;
  font-size: 14px;
  color: gray;
}

.btn-box p:hover {
  cursor: pointer;
  border-bottom: 1px solid gray;
}
</style>