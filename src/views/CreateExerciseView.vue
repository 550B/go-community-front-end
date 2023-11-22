<template>
 <view class="max">
  </view>
  <div>
    <h3>发布习题</h3>
    <el-form ref="postForm" :model="exerciseFormData" label-width="100px">
      <el-form-item label="习题名称">
        <el-input
          v-model="exerciseFormData.exercise_Name"
          placeholder="请输入习题名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="习题描述">
        <el-input
          type="textarea"
          v-model="exerciseFormData.exercise_Description"
          placeholder="请输入习题描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="习题等级">
        <el-input
          type="textarea"
          v-model="exerciseFormData.exercise_Level"
          placeholder="请输入习题等级"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>

  <!-- 棋盘和卡片 -->
  <div class="container">
    <!-- 左侧列放置棋盘 -->
    <div class="left-column">
      <goban
        v-if="!solveState"
        :key="count"
        :showCoordinates="true"
        mode="createExercise"
        :boardSize="19"
        :signMap="map"
        :stepInfo="[]"
        :maxHeight="500"
        :maxWidth="500"
        :currentColor="currentColor"
        :canPlaceStoneTag="canPlaceStoneTag"
        :createBoardTag="true"
        :createStepTag="false"
        :ref="mygoban"
      ></goban>

      <goban
        v-if="solveState"
        @step-changed="stepChanged"
        :key="'a' + count1"
        :showCoordinates="true"
        mode="exercise"
        :boardSize="19"
        :signMap="map"
        :stepInfo="step"
        :maxHeight="500"
        :maxWidth="500"
        :currentColor="currentColor"
        :canPlaceStoneTag="canPlaceStoneTag"
        :createBoardTag="false"
        :createStepTag="createStepTag"
        :ref="mygoban2"
      ></goban>
    </div>
    <!-- 右侧列放置卡片 -->
    <div class="right-column">
      <el-card class="box-card">
        <div>
          <p>
            <el-button v-if="!solveState" type="primary" @click="clear">清空棋盘</el-button>
          </p>
          <p style="margin-top: 10px; margin-bottom: 10px;">放置棋子</p>
          <el-radio-group v-model="currentColor" @change="currentColorChange">
            <el-radio :label="1" size="large" border>黑子</el-radio>
            <el-radio :label="-1" size="large" border>白子</el-radio>
          </el-radio-group>
          <p style="margin-top: 10px; margin-bottom: 10px;">棋手执</p>
          <el-radio-group v-model="firstHandColor" @change="currentColorChange1">
            <el-radio :label="1" size="large" border>黑子</el-radio>
            <el-radio :label="-1" size="large" border>白子</el-radio>
          </el-radio-group>
          <div class="button-wrapper">
            <el-form-item>
              <el-button v-if="!solveState" type="primary" @click="nextstep"
                >下一步</el-button
              >
              <el-button
                v-if="solveState"
                type="primary"
                @click="submitExercise"
                >发布</el-button
              >
            </el-form-item>
          </div>
          <div>
            <h3 v-if="solveState">步骤列表</h3>
            <div>
              <span v-for="(s, index) in step" :key="s.offset">
                {{ index }}:{{ s.color == 1 ? "黑" : "白" }} &nbsp;
              </span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import MyTest from "./MyTest.vue";

const router = useRouter();
const exerciseFormData = ref({
  exercise_Name: "",
  exercise_Description: "",
  exercise_Level: 1,
});

const mygoban = ref(null);
const mygoban2 = ref(null);
const firstHand = ref(1);
const currentColor = ref(1);
const firstHandColor = ref(1);
const step = ref([]);
const canPlaceStoneTag = ref([true]);
const createStepTag = ref(false);
const solveState = ref(false);
let map = reactive([]);
let start_board_info = ref([]);

// 清空棋盘
const clear = () => {
  // 这里创建一个包含 361个元素的数组 然后利用 es6最新的fill方法全部填充为 0
  const temp = new Array(361).fill(0);
  console.log("重置", temp);
  // signMap.value = temp
  // solveState.value = true
  map.length = 0;
  map.push(...temp);
};

const count = ref(0);
const currentColorChange = (val: number) => {
  count.value++;
};
const count1 = ref(0);
const currentColorChange1 = (val: number) => {
  count1.value++;
};

// 页面挂载的初始化棋盘
onMounted(() => {
  clear();
});


const nextstep = () => {
  // 把解决步骤排列出来
    currentColor.value =firstHandColor.value;
  solveState.value = true;
  createStepTag.value = true;
  start_board_info.value = [...map];
};

// 提交习题
const submitExercise = () => {
  const service = axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const requestBody = {
    exercise_name: exerciseFormData.value.exercise_Name,
    exercise_level: exerciseFormData.value.exercise_Level,
    exercise_description: exerciseFormData.value.exercise_Description,
    start_board_info: {
      board: JSON.parse(JSON.stringify(start_board_info.value)),
    },
    solution_step: {
      steps: JSON.parse(JSON.stringify(step.value)),
    },
  };

  if (
    !requestBody.exercise_name ||
    !requestBody.exercise_level ||
    !requestBody.exercise_description
  ) {
    ElMessage({
      message: "请完善练习信息",
      type: "warning",
    });
    return;
  }

  service
    .post("http://43.139.128.42:9876/api/Exercise/createExercise", requestBody)
    .then((response) => {
      if (response.data.isSuccess) {
        ElMessage.success("习题发布成功");
        router.push({ name: "allExerciseView" }); // 返回到帖子列表页面
      } else {
        ElMessage.error("习题发布失败");
      }
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("习题发布失败");
    });
};

//获取步骤
const stepChanged = (stepInfo) => {
  console.log(stepInfo);
};
</script>


<style scoped>
.container {
  display: flex;
}

.left-column {
  margin-right: 20px; /* 添加右边距 */
}

.right-column {
  flex: 1;
}
.right-column ::v-deep .box-card,
.right-column::v-deep .box-card {
  width: 100%;
}
/* 卡片 */
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 350px;
  background: rgba(255, 255, 255, 0.8); /* 设置背景颜色为白色，并将透明度设置为0.5 */
  /* 其他卡片的样式属性可以在这里添加 */
}

.button-wrapper {
  display: flex;
  justify-content: center; /* 居中对齐按钮 */
  margin-top: 20px; /* 调整按钮与卡片内容的间距 */
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




