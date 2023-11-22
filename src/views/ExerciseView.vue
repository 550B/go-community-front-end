<template>
 <view class="max">
    </view>
  <template v-if="isLoading"> 加载中... </template>
  <template v-else>
    <div class="exercise-content">
      <h3 class="exercise-name">{{ exerciseInfo.exercise_Name }}</h3>
      <p class="info-text">
        创建时间: {{ formatDate(exerciseInfo.create_Time) }}
      </p>
      <p class="content-text">
        习题描述：{{ exerciseInfo.exercise_Description }}
      </p>
    </div>

    <el-tag class="custom-tag">用户ID：{{ exerciseInfo.user_ID }}</el-tag>
    <el-tag class="custom-tag" type="success"
      >习题等级：{{ exerciseInfo.exercise_Level }}</el-tag
    >
    <el-tag class="custom-tag" type="info"
      >浏览量：{{ exerciseInfo.view_Num }}</el-tag
    >
    <el-tag class="custom-tag" type="warning"
      >解决数：{{ exerciseInfo.solve_Num }}</el-tag
    >
    <div class="mt20 mr20 df">
      <div class="mr20">
        <goban
          @step-changed="stepChanged"
          :key="count"
          :showCoordinates="true"
          :mode="mode"
          :boardSize="19"
          :signMap="map"
          :stepInfo="step"
          :maxHeight="500"
          :maxWidth="500"
          :currentColor="currentColor"
          :canPlaceStoneTag="canPlaceStoneTag"
          :createBoardTag="false"
          :createStepTag="true"
          :ref="mygoban"
        ></goban>
      </div>
      <div>
        <div>
          <p></p>
          <div>先手: {{ firstHand }}</div>
          <p></p>
          <el-button type="primary" @click="rollback">悔棋</el-button>
          <el-button type="primary" @click="resetExercise">复位</el-button>
        </div>
        <div>
          <p></p>
          结果：
          <p></p>
          <div class="curr-info" v-if="stepState == 'default'">待定</div>
          <div class="curr-info ok" v-if="stepState == 'ok'">本步正确</div>
          <div class="curr-info allok" v-if="stepState == 'allok'">练习完成</div>
          <div class="curr-info error" v-if="stepState == 'error'">错误</div>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox, ElButton, ElMessage } from "element-plus";

const mygoban = ref(null);
const mygoban2 = ref(null);
const firstHand = ref("");
const currentColor = ref(1);
const firstHandColor = ref(1);
const step = ref([]);
const mode = ref("exercise");
const canPlaceStoneTag = ref([true]);
const createStepTag = ref(false);
const solveState = ref(false);
let map = reactive([]);
let start_board_info = ref([]);
const stepState = ref("default");

const count = ref(0); //棋盘的key方便更新

let stepOrgin = ref([]); //记录原始答案

//获取步骤 进行比对 提示是否正确
const stepChanged = (stepInfo) => {
  const stepOrginStr = JSON.stringify(stepOrgin.value);
  const stepInfoStr = JSON.stringify(stepInfo);
  console.log(stepOrginStr);
  console.log(stepInfoStr);

  currentColor.value = stepInfo[stepInfo.length - 1].color;

  if (stepOrginStr.startsWith(stepInfoStr.slice(0,-1))) {
    console.log("本步正确");
    stepState.value = "ok";
  } else {
    stepState.value = "error";
    console.log("错误");
  }
  if (stepOrginStr == stepInfoStr) {
    stepState.value = "allok";
    const exerciseId = Number(route.params.exerciseId);
    solveExercise(exerciseId);
    ElMessage.success("恭喜您完成本次练习");
    mode.value = "show";
    canPlaceStoneTag.value[0] = true;
    count.value++;
    return;
  }
};

let isBack = false; // 是否悔棋

const history = reactive([]); // 存储所有下棋历史记录
// 观察map的变化 把每次的变化推出history
watch(
  map,
  (newValue) => {
    console.log("当前棋子颜色===", currentColor.value);
    // currentColor.value = currentColor.value == 1 ? -1 : 1;

    console.log("===", newValue);
    if (isBack) {
      isBack = false;
      return;
    }
    history.push(JSON.parse(JSON.stringify(newValue)));

    console.log("history", history);
    // count.value++;
  },
  {
    // deep:true
  }
);

// 重置
const resetExercise = () => {
  isBack = true;
  const temp = history.slice(0, 1);
  history.length = 0;
  step.value.splice(0, step.value.length);
  history.push(...temp);
  const newMap = JSON.parse(JSON.stringify(history[history.length - 1]));
  console.log("newMap", newMap);
  stepState.value = "default";
  map.length = 0;
  map.push(...newMap);
  currentColor.value = firstHandColor.value;
  count.value++;
};
// 悔棋
const rollback = () => {
  console.log("history", history);
  isBack = true;
  if (history.length == 1) {
    ElMessage.warning("无法再悔棋");
    return;
  }
 
  stepState.value = "default";
  const temp = history.slice(0, -1);
  history.length = 0;
  history.push(...temp); // 弹出最后一次的棋子
  const newMap = JSON.parse(JSON.stringify(history[history.length - 1]));
  console.log("newMap", newMap);
  map.length = 0;
  map.push(...newMap);
  step.value = step.value.slice(0,-1);
  count.value++;
};

const route = useRoute();
const isLoading = ref(true);
const exerciseInfo = ref({
  exercise_ID: 0,
  user_ID: 0,
  exercise_Name: "",
  exercise_Level: 0,
  exercise_Description: "",
});

// 获取习题详情
const getExercise = (exerciseId: number) => {
  var service = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const getExerciseInfo = service.get(
    `http://43.139.128.42:9876/api/Exercise/getExerciseDetail?exercise_id=${exerciseId}`
  );

  Promise.all([getExerciseInfo])
    .then(([exerciseResponse]) => {
      console.log("====", exerciseResponse.data);
      exerciseInfo.value = exerciseResponse.data.result;
      isLoading.value = false;
      // 初始化棋盘
      const board = exerciseResponse.data.result.start_Board_Info.board;
      map.length = 0;
      map.push(...board);
      // history.push(board) // 初始化棋盘出入历史
      console.log(history);

      // 获取答案里面的第一个作为先手
      const firstHandObj = exerciseResponse.data.result.solution_Step.steps[0];
      stepOrgin.value = [...exerciseResponse.data.result.solution_Step.steps];
      firstHand.value = firstHandObj.color == 1 ? "黑子" : "白子"; //展示先手
      currentColor.value = firstHandObj.color;
      count.value++;
    })
    .catch((error) => {
      console.log(error);
      isLoading.value = false;
    });
};

// 增加解决数
const solveExercise = (exerciseID:number) => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  service.get(`http://43.139.128.42:9876/api/Exercise/solveExercise?exercise_id=${exerciseID}`)
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

// 页面加载时自动获取习题详情
onMounted(() => {
  const exerciseId = Number(route.params.exerciseId);
  getExercise(exerciseId);
});
</script>

<style scoped>
.df {
  display: flex;
}
.mt20 {
  margin-top: 20px;
}
.mr20 {
  margin-right: 20px;
}
.curr-info {
  width: 230px;
  height: 50px;
  background: #b5b5b5;
  text-align: center;
  line-height: 50px;
  color: #fff;
}
.curr-info.ok {
  background: rgb(80, 235, 116);
}
.curr-info.allok {
  background: rgb(5, 171, 5);
}
.curr-info.error {
  background: rgb(232, 9, 9);
}

.content-text {
  text-align: left;
  color: #333;
}
.info-text,
.info-text2 {
  color: #333;
}

.exercise-name {
  /* 设置标题字体大小 */
  font-size: 24px; /* 调整您想要的字体大小 */
}

.exercise-content {
  font-size: 15px;
  margin-bottom: 20px;
  background-color: #b5ccda;
  padding: 20px;
  border-radius: 5px;
  max-height: 300px; /* 固定高度，超过高度自动出现滚动条 */
}

.even {
  background-color: #d5d5d5; /* Even row background color */
}

.odd {
  background-color: #c0c0c0; /* Odd row background color */
}

.custom-tag {
  /* 设置标签宽度 */
  width: 160px;

  /* 设置标签间距 */
  margin-right: 15px;

  /* 添加其他样式 */
}
</style>

<style scoped>
    .max {
        background-image: url('@/assets/习题/bg3.jpg'); /* 图片路径以@/assets开头 */
        background-size: cover;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: -1;
        /* 其他样式属性可以在这里添加 */
    }
</style>

