<template>

 <view class="max">
 </view>
  <el-scrollbar height="95vh">
  <div class="forum-container">
    <!-- 习题标题 -->
    <!-- <h2 class="forum-title">习题</h2> -->

    <!-- 走马灯习题展示 -->
    <div class="block text-center">
      <span class="demonstration"></span>
      <el-carousel height="280px">
        <el-carousel-item>
      <img class="carousel-image" src="@/assets/习题/习题1.jpg" alt="习题1" />
    </el-carousel-item>
    <el-carousel-item>
      <img class="carousel-image" src="@/assets/习题/习题2.jpg" alt="习题2" />
    </el-carousel-item>
    <el-carousel-item>
      <img class="carousel-image" src="@/assets/习题/习题3.jpg" alt="习题3" />
    </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 两个按钮在同一排 -->
    <div class="button-row">
      <el-button class="post-button" type="success" @click="goToCreateExerciseView()">发布习题</el-button>
      <div class="right-buttons">
        <el-button @click="showSelfExercisesDialog">我的习题</el-button>
      </div>
    </div>

    <!-- 习题列表 -->

    <el-row :gutter="20"> <!-- 添加 gutter 属性来控制卡片之间的间距 -->
      <el-col
        v-for="exercise in exercises"
        :key="exercise.exercise_id"
        :span="8"
        class="custom-col" 
      >
        <el-card class="my-card">
             <div style="padding: 14px">
        <!-- 在习题名前插入图片 -->
         <div style="text-align: center;">
        <img src="@/assets/习题/棋盘区(1).png" alt="棋盘区" style="width: 56px; height: 56px; margin-right: 10px;" />
         </div>
            <h3 class="exercise-name-card">{{ exercise.exercise_name }}</h3>
            <p class="exercise-name-card">等级: {{ exercise.exercise_level }}</p>
            <div class="bottom">
              <time class="time">{{ formatDate(exercise.create_time) }}</time>
              <el-button text class="button" @click="goToExerciseView(exercise.exercise_id)">进入习题</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <!-- 弹窗用于显示我的习题 -->
    <el-dialog title="我的习题" v-model="selfExercisesDialogVisible" width="50%">
      <div class="df fw jcsb">
      <div v-for="exercise in selfExercises" :key="exercise.exercise_id" class="exercise-item">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
                <h3 class="exercise-name-card">{{ exercise.exercise_name }}</h3>
            </div>
          </template>
          <div class="card-body">
            <p class="exercise-info">等级: {{ exercise.exercise_level }}</p>
            <p class="exercise-info">得分: {{ exercise.current_score }}</p>
            <p class="exercise-info">发布时间: {{ formatDate(exercise.create_time) }}</p>
              <div class="button-group df jcfe">
                <el-button type="success" @click="goToExerciseView(exercise.exercise_id)">进入习题</el-button>
                <el-button @click="deleteExercise(exercise.exercise_id)" type="danger">删除</el-button>
              </div>
          </div>
        </el-card>
      </div>
      </div>
  </el-dialog>
  </div>
</el-scrollbar>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElDialog, ElMessage } from 'element-plus'

const router = useRouter();
const exercises = ref([]);
const dialogVisible = ref(false);
const selfExercisesDialogVisible = ref(false);
const selfExercises = ref([]);

const sortByTimeAscending = ref(true);

// 获取习题列表
const getExercises = () => {
  var service = axios.create({
    headers: {
      'Authorization': `bearer ${localStorage.getItem('token')}`
    }
  });

  service.get('http://43.139.128.42:9876/api/Exercise/getAllExercise').then(response => {
    // console.log('response',response)
    exercises.value = response.data.result;
    // console.log('exercises',exercises)

  }).catch((error) => {
    console.log(error);
  });
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

// 跳转到习题详情页面
const goToExerciseView = (exerciseID:number) => {
  router.push({ name: 'exerciseView', params: { exerciseId: exerciseID } });
};

// 跳转到新建习题页面
const goToCreateExerciseView = () => {
  router.push({ name: 'createExerciseView' });
};

// 显示自己的习题弹窗
const showSelfExercisesDialog = () => {
  selfExercisesDialogVisible.value = true;
  getUserExercises();
};

// 获取用户的习题
const getUserExercises = () => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  service.get('http://43.139.128.42:9876/api/Exercise/getSelfExercise').then(response => {
    if (response.data.isSuccess) {
      selfExercises.value = response.data.result;
    }
  }).catch(error => {
    console.error(error);
    ElMessage.error('获取习题失败');
  });
};

// 删除习题
const deleteExercise = (exerciseID:number) => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  service.get(`http://43.139.128.42:9876/api/Exercise/deleteExercise?exercise_id=${exerciseID}`)
    .then(response => {
      if (response.data.isSuccess) {
        getUserExercises();
        ElMessage.success('删除成功');
      } else {
        ElMessage.error(response.data.msg);
      }
    })
    .catch(error => {
      console.log(error);
      ElMessage.error('删除失败');
    });
};


// 页面加载时自动获取习题列表
getExercises();

</script>

//部分样式
<style scoped>
.df{
  display: flex;
  /* justify-content: space-between; */
}
.fw{
  flex-wrap: wrap;
}
.jcfe{
  justify-content: flex-end;
}
.jcsb{
  justify-content: space-between;
}
.exercise-item{
  width: 49%;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.dialog-content {
  max-height: 400px; /* 设置最大高度 */
}

.forum-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
}

.forum-title {
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px; /* 调高论坛标题位置 */
}

.button-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 10px; /* 调整这个数值来控制向下移动的距离 */
}

.exercises-button {
  font-size: 16px;
  background-color: #67c23a;
}

.right-buttons {
  display: flex;
  gap: 10px;
}


/* 使用 Flex 布局来实现每行三个帖子 */
.exercise-list {
  display: flex;
  flex-wrap: wrap;
}

/* 每行的样式 */
.exercise-row {
  display: flex;
  flex: 1;
  justify-content: space-between;
  width: 100%;
}

.custom-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px; /* 保持行间距为 20px */
}

/* 每个帖子项的样式 */
.exercises-item {
  flex: 0 0 calc(33.33% - 10px);
  background-color: #a0cfff;
  padding: 15px;
  box-sizing: border-box;
  margin-bottom: 20px;
  margin-right: 10px; /* 添加右侧外边距，实现帖子之间的间距 */
}

/* 调整按钮的样式 */
.detail-button {
  display: block;
  margin-top: 10px;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.my-card {
  background: rgba(255, 255, 255, 0.8); /* 设置背景颜色为白色，并将透明度设置为0.5 */
  /* 其他卡片的样式属性可以在这里添加 */
}



.exercise-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-button {
  background-color: #58a5f2;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.exercise-time {
  color: #888;
  font-size: 10px;
}

.self-exercisess {
  max-height: calc(100vh - 200px); /* 调整弹窗高度 */
  overflow: auto; /* 添加滚动条 */
}

.self-exercise{
  margin: 10px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.exercise-details1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exercise-info1 {
  margin: 5px 0;
}

.button-group1 {
  display: flex;
  gap: 10px;
}
.exercise-time1{
  display: flex;
}


</style>

<style scoped>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;

}

.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px; /* 可调整按钮与上方文本的间距 */
}

.exercise-name-card {
  font-size: 14px; /* 调整字体大小为你希望的大小 */
   display: flex;
  justify-content: center;
}

.carousel-image {
  max-width: 100%; /* 图片的最大宽度为父容器的宽度 */
  object-fit: contain; /* 保持图片的纵横比并在父容器内居中显示 */
}
</style>

<style scoped>
    .max {
        background-image: url('@/assets/习题/bg2.jpg'); /* 图片路径以@/assets开头 */
        background-size: cover;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: -1;
        /* 其他样式属性可以在这里添加 */
    }
</style>



