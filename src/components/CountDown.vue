<template>
    <div>
      <el-col class="countdown-display">{{ formatTime }}</el-col>
      <!-- <el-button @click="toggleCountdown">{{ isCounting ? '暂停' : '开始' }}</el-button> -->
    </div>
  </template>
  
  <script>
  import { ref, watch, onBeforeUnmount, computed } from 'vue';
  
  export default {
    props: {
      mainTime: Number, // 从父组件传递的初始分钟数
      start:Boolean,    //是否直接开始倒计时
    },
    setup(props) {
      const currentTime = ref(props.mainTime);
      const isCounting = ref(false);
      let interval;
  
      // 将 currentTime 格式化为 '分钟数:秒数' 的形式
      const formatTime = computed(() => {
        const minutes = String(Math.floor(currentTime.value / 60)).padStart(2, '0');
        const seconds = String(currentTime.value % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
      });
  
      // 开始倒计时
      const startCountdown = () => {
        if (!isCounting.value) {
          isCounting.value = true;
          interval = setInterval(() => {
            if (currentTime.value > 0) {
              currentTime.value -= 1;
            } else {
              // clearInterval(interval);
              // isCounting.value = false;
              // // 倒计时归零时
              // handleCountdownZero();
            }
          }, 1000);
        }
      };
  
      const handleCountdownZero = () => {
        console.log('倒计时归零');
      };
  
      // 暂停或继续倒计时
      const toggleCountdown = () => {
        if (isCounting.value) {
          clearInterval(interval);
          isCounting.value = false;
        } else {
          startCountdown();
        }
      };
  
      // 在组件销毁前清除定时器
      onBeforeUnmount(() => {
        clearInterval(interval);
      });
  
      const setTime = (newValue)=>{//设置新的倒计时时间，注意参数是秒数
        currentTime.value=newValue;
      };

      const getTime = ()=>{//获取当前倒计时值
        return currentTime.value;
      };

      return {
        formatTime,
        isCounting,
        toggleCountdown,
        setTime,
        getTime
      };
    },

    created(){
        if(this.start)
            this.toggleCountdown();
    },
  };
  </script>

<style scoped>
.countdown-display {
  font-size: 24px; /* 调整字体大小 */
  padding: 5px; /* 添加内边距 */
  border-radius: 3px; /* 圆角边框 */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3); /* 添加透明悬浮效果的投影 */
  width: 100%;
}
</style>
