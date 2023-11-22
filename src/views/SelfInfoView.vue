<template>
  <!-- <h1>这是个人信息页面</h1> -->
  <div class="common-layout">
    <el-scrollbar height="95vh">
      <el-container>
        <el-header class="header-container">
          <el-icon size="45px" color="rgb(255,255,255)">
            <User />
          </el-icon>
          <span style="font-size: 30px; margin-left: 20px; color:white">个人信息</span>
        </el-header>
        <el-main class="mainbox">

          <div class="BigContainer">
            <!-- 个人信息 -->
            <div class="SelfInfo">
              <el-avatar shape="square" :size="130" :src="pics[0].url" />
              <span style="font-size: large; margin-left: 10px; display: inline-block; vertical-align: top; ">昵称：{{selfInfo.nickname }}</span>
              <p style="font-size: larger; margin-top: 50px;">当前段位：{{ selfInfo.current_Score }}</p>
              <p style="font-size: larger; margin-top: 20px;">地址：{{ selfInfo.place }}</p>
              <p style="font-size: larger; margin-top: 20px;">个人简介：{{ selfInfo.introduction }}</p>
              <el-button type="primary" :icon="Edit" class="editButton" @click="setInfoForm">修改资料</el-button>
              <!-- 修改信息弹出表单 -->
              <el-dialog v-model="dialogVisible2" title="修改个人信息" width="40%" draggable>
                <span>
                  <el-form :model="infoForm" :rules="rules" ref="infoFormRef">
                    <el-form-item prop="nickname" label="昵称">
                      <el-input type="text" placeholder="昵称" style="width: 50%;" v-model="infoForm.nickname" />
                    </el-form-item>
                    <el-form-item prop="place" label="地址">
                      <el-input type="text" placeholder="地址" style="width: 50%;" v-model="infoForm.place" />
                    </el-form-item>
                    <el-form-item prop="introduction" label="简介">
                      <el-input type="textarea" rows="5" maxlength="100" placeholder="简介"
                        v-model="infoForm.introduction" />
                    </el-form-item>
                  </el-form>
                </span>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="resetForm(infoFormRef)">重置</el-button>
                    <el-button type="primary" @click="postChange(infoFormRef)">确认</el-button>
                  </span>
                </template>
              </el-dialog>

              <hr class="divider">
            </div>
            <!-- 其他 -->
            <div class="HistoryGame">
              <el-tabs v-model="activeName" type="card" class="demo-tabs">
                <el-tab-pane label="分数情况">
                  <div class="common-layout">

                    <el-container>
                      <el-container>
                        <el-col>
                          <div id="main" style="width: 400px; height: 250px;"></div>
                          <div id="pie" style="width: 400px; height: 300px;  margin-top: 20px;"></div>
                        </el-col>
                      </el-container>
                      <el-aside width="auto"><el-col :span="16" class="goban-container">
                          <goban :showCoordinates="true" :boardSize="BOARDSIZE" mode="show" :maxHeight="510"
                            :maxWidth="510" :canPlaceStoneTag="[false]" :signMap="BOARDINFO" v-if="state === 1"></goban>
                        </el-col></el-aside>
                    </el-container>
                  </div>

                  <!--分数-->

                </el-tab-pane>
                <el-tab-pane label="帖子">
                  <!--帖子-->
                  <div class="table-a">
                    <el-table :data="PostAll.value" height="300"
                      style="text-align: left ;width: 100% ;font-size: 16px;font-weight: 600;" @vue:mounted="getSelfPost">
                      <el-table-column fixed prop="post_Time" label="帖子时间" align="center" sortable width="120" />
                      <el-table-column prop="post_Name" label="帖子名称" align="center" sortable />
                      <el-table-column fixed="right" label="" width="200">
                        <template #default="scope">
                          <el-row style="margin-left: 30%;">
                            <el-button type="primary" :icon="Edit" @click="getPost(scope.row.post_ID)" align="center" />
                            <el-button type="primary" :icon="Delete" @click="deletePost(scope.row.post_ID)"
                              align="center" />
                          </el-row>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="评论">
                  <!--评论-->
                  <div class="table-a">
                    <el-table :data="comment.value" style="width: 100% ;font-size: 16px;font-weight: 700;"
                      @vue:mounted="getSelfComment" height="300">
                      <el-table-column fixed prop="comment_Time" label="评论时间" align="center" width="120" />
                      <el-table-column prop="comment_Content" label="评论内容" align="center" />
                      <el-table-column fixed="right" label="" align="center" width="120">
                        <template #default="scope">
                          <el-button type="primary" :icon="Delete" @click="deletecomment(scope.row.comment_ID)" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="对局历史">
                  <!--对局记录-->
                  <div class="table-a">
                    <el-table :data="HistoryGame.value"
                      style=" height:300px ;width: 100% ;font-size: 16px;font-weight: 700;"
                      @vue:mounted="getAllHistoryGame">
                      <el-table-column fixed prop="game_Time" label="对局开始时间" align="center" sortable width="120" />
                      <el-table-column prop="game_Name" label="对局名称" align="center" sortable />
                      <el-table-column prop="own_Name" label="己方" align="center" sortable />
                      <el-table-column prop="own_Color" label="我方执棋" align="center" sortable />
                      <el-table-column prop="opposite_Name" label="对手" align="center" sortable />
                      <el-table-column prop="oppsite_Color" label="对手执棋" align="center" sortable />
                      <el-table-column prop="result_Info" label="结果情况" align="center" sortable />
                      <el-table-column fixed="right" label="选项" align="center" sortable width="120">
                        <template #default="scope">
                          <el-button type="primary" round @click="handleClick(scope.row.game_ID)">详情</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="center">
                <div class="hexagon"></div>
                <div class="hexagon2"></div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-scrollbar>
  </div>
  <!--帖子编辑对话框-->
  <el-dialog v-model="dialogVisible" title="编辑" width="70%" height="70%" :before-close="handleClose">
    <span>
      <el-form-item label="原内容">
        <el-input v-model="PostChange.post_Content" type="textarea" style="height :300px" />
      </el-form-item>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editPost">
          确认修改
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--确认删除对话框-->
  <el-dialog v-model="dialogVisible3" title="确定要删除吗" style="height: 150px;width: 200px;">
    <el-button type="danger" plain @click="check_Delete_comment(1)"> 确定</el-button>
    <el-button @click="check_Delete_comment(0)"> 取消</el-button>
  </el-dialog>
  <el-dialog v-model="dialogVisible" title="确定要删除吗" style="height: 150px;width: 200px;">
    <el-button type="danger" plain @click="check_Delete_Post(1)"> 确定</el-button>
    <el-button @click="check_Delete_Post(0)"> 取消</el-button>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { getRank } from '../components/helper.js'
import axios from 'axios'
import { onMounted, reactive, ref, withDirectives } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { useRouter } from "vue-router";
const activeName = ref('first')

import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
//星
// import { onMounted } from "vue";
// let starsRef = ref<HTMLElement | null>(null);
// const starsCount = 800; // 星星数量
// const distance = 900; // 间距

// onMounted(() => {
//   let starNodes = Array.from(starsRef.value!.children) as HTMLElement[];
//   starNodes.forEach((item) => {
//     let speed = 0.2 + Math.random() * 1;
//     let thisDistance = distance + Math.random() * 300;
//     item.style.transformOrigin = `0 0 ${thisDistance}px`;
//     item.style.transform = `
//         translate3d(0,0,-${thisDistance}px)
//         rotateY(${Math.random() * 360}deg)
//         rotateX(${Math.random() * -50}deg)
//         scale(${speed},${speed})`;
//   });
// });
//图表
interface HistoricalScore {
  game_Time: string;
  historical_Score: number;
}

interface HistoryGame {
  game_ID: number;
  game_Name: string;
  own_ID: number;
  opposite_ID: number;
  own_Name: string;
  opposite_Name: string;
  own_Color: number;
  oppsite_Color: number;
  result_Type: number;
  result_Info: {
    [key: string]: string[];
  };
  result_Info_string: string;
  game_Time: string;
}

const lineCharts = ref<echarts.ECharts | null>(null);
const pieCharts = ref<echarts.ECharts | null>(null);
const historicalScores = ref<HistoricalScore[]>([]);
const historyGames = ref<HistoryGame[]>([]);
const temp = ref();

const getData = async () => {
  try {
    const service = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      }
    });
    const response = await service.get("http://43.139.128.42:9876/api/User/getScoreInfo");

    if (response.data.isSuccess) {
      historicalScores.value = response.data.result.slice(-20);
      for (let i = 0; i < historicalScores.value.length; i++) {
        for (let j = 0; j < historicalScores.value.length - i - 1; j++) {
          if (historicalScores.value[j].game_Time > historicalScores.value[j + 1].game_Time) {
            temp.value = historicalScores.value[j]
            historicalScores.value[j] = historicalScores.value[j + 1]
            historicalScores.value[j + 1] = temp.value
          }
        }
      }
      console.log(historicalScores);
      showGame.value = historicalScores.value[0];
      if (showGame.value.board_Size === '\u0000') {
        BOARDSIZE.value = 19
      }
      else if (showGame.value.board_Size === '\u0001') {
        BOARDSIZE.value = 13
      }
      else {
        BOARDSIZE.value = 9
      }
      for (let i = 0; i < BOARDSIZE.value * BOARDSIZE.value; i++) {
        BOARDINFO.value[i] = showGame.value.board_Info['board'][i]
      }
      drawLine('main');
    } else {
      console.error('Response indicates failure:', response.data.msg);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const BOARDSIZE = ref()
const BOARDINFO = ref([
  0, 0, 0, -1, -1, -1, 1, 0, 1, 1, -1, -1, 0, -1, 0, -1, -1, 1, 0,
  0, 0, -1, 0, -1, 1, 1, 1, 0, 1, -1, 0, -1, -1, -1, -1, 1, 1, 0,
  0, 0, -1, -1, -1, 1, 1, 0, 0, 1, 1, -1, -1, 1, -1, 1, 0, 1, 0,
  0, 0, 0, 0, -1, -1, 1, 0, 1, -1, 1, 1, 1, 1, 1, 0, 1, 0, 0,
  0, 0, 0, 0, -1, 0, -1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
  0, 0, -1, 0, 0, -1, -1, 1, 0, -1, -1, 1, -1, -1, 0, 1, 0, 0, 1,
  0, 0, 0, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1,
  0, 0, -1, 1, 1, 0, 1, -1, -1, 1, 0, 1, -1, 0, 1, -1, -1, -1, 1,
  0, 0, -1, -1, 1, 1, 1, 0, -1, 1, -1, -1, 0, -1, -1, 1, 1, 1, 1,
  0, 0, -1, 1, 1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1,
  -1, -1, -1, -1, 1, 1, 1, -1, 0, -1, 1, -1, -1, 0, -1, 1, 1, -1, 0,
  -1, 1, -1, 0, -1, -1, -1, -1, -1, -1, 1, -1, 0, -1, -1, 1, -1, 0, -1,
  1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 0, 1, -1, 0, -1, 1, -1, -1, 0,
  0, 1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1,
  0, 0, -1, 1, 0, 0, 1, 1, -1, -1, 0, 1, -1, 1, -1, 1, -1, 0, -1,
  0, 0, 1, 0, 1, 0, 1, 1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 0,
  0, 0, 0, 0, 1, 1, 0, 1, -1, 0, -1, -1, 1, 1, 1, 1, -1, -1, -1,
  0, 0, 1, 1, -1, 1, 1, -1, 0, -1, -1, 1, 1, 1, 1, 0, 1, -1, 1,
  0, 0, 0, 1, -1, -1, -1, -1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0])
const state=ref(0);
const drawLine = (id: string) => {
  if (lineCharts.value) {
    lineCharts.value.dispose();
  }
  lineCharts.value = echarts.init(document.getElementById(id)!);
  const rainbowColors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
  ];
  const maxScore = Math.max(...historicalScores.value.map(item => item.historical_Score));
  const minScore = Math.min(...historicalScores.value.map(item => item.historical_Score));
  const scoreRange = maxScore - minScore;
  const padding  = 0.5; // 折线图上下保留空余
  const yAxisMin = minScore - scoreRange * padding;
  const yAxisMax = maxScore + scoreRange * padding;
  lineCharts.value.setOption({
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: historicalScores.value.map(item => {
        const date = new Date(item.game_Time);
        return `${date.getMonth() + 1}-${date.getDate()}`;
      }),
      axisLabel: {
        show: true,
        color: '#000000',
        fontSize: 16
      },
      max: 'dataMax',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true,
        color: '#000000',
        fontSize: 16
      },
      min: yAxisMin, // 设置纵轴最小值
      max: yAxisMax, // 设置纵轴最大值
    },
    series: [{
      name: '历史分数',
      type: 'line',
      stack: '总量',
      smooth: true,
      areaStyle: {
        color: '#bebebe'
      },
      data: historicalScores.value.map(item => item.historical_Score),
      lineStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: rainbowColors[0] },
          { offset: 1, color: rainbowColors[1] },

        ]),
      },
    }],
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const dataItem = historicalScores.value[params.dataIndex];
        const date = new Date(dataItem.game_Time);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        const dateString = `${year}-${month}-${day} ${hours}:${minutes}`;
        return `时间：${dateString}<br>积分：${params.value}分`;
      },
    },
  });
  // lineCharts.value.on('click', function (param) {
  //   showGame.value = historicalScores.value[param.dataIndex]

  //   if (showGame.value.board_Size === '\u0000') {
  //     BOARDSIZE.value = 19
  //   }
  //   else if (showGame.value.board_Size === '\u0001') {
  //     BOARDSIZE.value = 13
  //   }
  //   else {
  //     BOARDSIZE.value = 9
  //   }
  //   for (let i = 0; i < BOARDSIZE.value * BOARDSIZE.value; i++) {
  //     BOARDINFO.value[i] = showGame.value.board_Info['board'][i]
  //   }
  //   state.value=1;
  // })
  lineCharts.value.on('mousemove', function (param) {
    showGame.value = historicalScores.value[param.dataIndex];

    if (showGame.value.board_Size === '\u0000') {
      BOARDSIZE.value = 19;
    } else if (showGame.value.board_Size === '\u0001') {
      BOARDSIZE.value = 13;
    } else {
      BOARDSIZE.value = 9;
    }

    for (let i = 0; i < BOARDSIZE.value * BOARDSIZE.value; i++) {
      BOARDINFO.value[i] = showGame.value.board_Info['board'][i];
    }

    state.value = 1;
  });

  lineCharts.value.on('mouseout', function () {
    state.value = 0;
  });
};
const showGame = ref()
const getPieData = async () => {
  try {
    const service = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      }
    });
    const response = await service.get("http://43.139.128.42:9876/api/User/getAllHistoryGame");

    if (response.data.isSuccess) {
      const historyGamesData: HistoryGame[] = response.data.result;
      console.log(historyGamesData)
      const resultTypes = [0, 0, 0, 0];
      console.log("xxi")
      historyGamesData.forEach(game => {
        resultTypes[game.result_Type - 1]++;
      });
      drawPie('pie', resultTypes, historyGamesData.length);
      console.log(historyGamesData.length)
    } else {
      console.error('Response indicates failure:', response.data.msg);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const drawPie = (id: string, resultTypes: number[], totalGames: number) => {
  if (pieCharts.value) {
    pieCharts.value.dispose();
  }
  pieCharts.value = echarts.init(document.getElementById(id)!);
  pieCharts.value.setOption({
    title: {
      text: `总计：${totalGames}盘积分对局`,
      left: 'center',
      textStyle: {
        color: '#000000',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['赢强', '赢弱', '输强', '输弱'],
      textStyle: {
        color: '#000000',
        fontSize: 16
      }
    },
    series: [
      {
        name: '对局结果',
        type: 'pie',
        radius: '50%',
        data: [
          { value: resultTypes[0], name: '赢强' },
          { value: resultTypes[1], name: '赢弱' },
          { value: resultTypes[2], name: '输强' },
          { value: resultTypes[3], name: '输弱' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
};

onMounted(async () => {
  await getData();
  await getPieData();
});




//获取用户分数
interface Score {
  score_ID: number,
  user_ID: number,
  historical_Score: number,
  game_Time: string,
  result_ID: number,
  strength_Condition: number
}

//获取历史对局
const HistoryGame = reactive({
  "game_ID": '',
  "game_Name": '',
  "own_ID": '',
  "opposite_ID": '',
  "own_Name": '',
  "opposite_Name": '',
  "own_Color": '',
  "oppsite_Color": '',
  "result_Type": '',
  "result_Info": {
    "additionalProp1": "[string]",
    "additionalProp2": "[string]",
    "additionalProp3": "[string]",
  },
  "result_Info_string": "string",
  "game_Time": "string"
})

const PostAll = reactive({
  "Post_ID": '',
  "User_Name": '',
  "post_Name": '',
  "post_Time": '',
  "view_Num": ''
})

const PostChange = reactive({
  "Post_ID": '',
  "User_ID": '',
  "post_Content": '',
  "post_Name": '',
  "post_Time": '',
  "view_Num": ''
})


const comment = reactive({
  "comment_ID": '',
  "post_ID": '',
  "user_ID": '',
  "comment_Content": '',
  "comment_Time": ''
})
const dialogVisible = ref(false)
const dialogVisible3 = ref(false)
const router = useRouter();
const handleClick = (target: number) => {
  console.log(target)
  router.push('/player/selfInfo/watchHistory/' + target)
}

//个人信息
const pics = reactive([
  {
    url: new URL('../assets/avatar.png', import.meta.url).href,
  },
])

const selfInfo = reactive({
  current_Score: 0,
  nickname: '',
  place: '',
  introduction: ''
})

onMounted(() => {
  getSelfInfo();
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

const dialogVisible2 = ref(false)

const infoFormRef = ref<FormInstance>()

const infoForm = reactive({
  nickname: '',
  place: '',
  introduction: '',
})


const rules = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度应该在1-20个字符之间', trigger: 'blur' },
  ],
  place: [
    { required: true, message: '请输入地址', trigger: 'blur' },
    { min: 1, max: 30, message: '长度应该在1-30个字符之间', trigger: 'blur' },
  ],
  introduction: [
    { required: true, message: '请输入个人简介', trigger: 'blur' },
    { min: 1, max: 100, message: '长度应该在1-100个字符之间', trigger: 'blur' },
  ],
})

const setInfoForm = () => {
  dialogVisible2.value = true

  infoForm.introduction = selfInfo.introduction
  infoForm.nickname = selfInfo.nickname
  infoForm.place = selfInfo.place
}

//新的个人信息传递的参数
const newInfo = reactive({
  nickname: '',
  place: '',
  introduction: '',
})

const postChange = async (formEl: FormInstance | undefined) => {
  console.log('提交')

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')

      newInfo.nickname = infoForm.nickname
      newInfo.place = infoForm.place
      newInfo.introduction = infoForm.introduction

      console.log(newInfo)
      let data = JSON.parse(JSON.stringify(newInfo))

      var service = axios.create({
        headers: {
          // 设置后端需要的传参类型
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + localStorage.getItem('token')
        }
      })

      service.post("http://43.139.128.42:9876/api/User/updateSelfInfo", data).then(res => {
        console.log(res.data)
        if (res.data.isSuccess) {
          console.log("修改成功")
          selfInfo.nickname = newInfo.nickname
          selfInfo.place = newInfo.place
          selfInfo.introduction = newInfo.introduction
        }
        else {
          ElMessageBox.alert(res.data.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
      dialogVisible2.value = true
      ElMessage('修改成功')
    }


  })

}

const resetForm = (formEl: FormInstance | undefined) => {
  console.log(formEl)
  if (!formEl) return
  formEl.resetFields()
}
//历史对局

const getAllHistoryGame = () => {
  var service = axios.create({
    headers: {
      // 
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })
  service.get("http://43.139.128.42:9876/api/User/getAllHistoryGame").then(res => {
    console.log(res.data)
    if (res.data.isSuccess) {
      console.log("获取数据成功！")
      HistoryGame.value = res.data.result
      for (let i = 0; i < res.data.result.length; i++) {
        if (HistoryGame.value[i].own_Color === 1) {
          HistoryGame.value[i].own_Color = "黑子"
          HistoryGame.value[i].oppsite_Color = "白子"
        }
        else {
          HistoryGame.value[i].own_Color = "白子"
          HistoryGame.value[i].oppsite_Color = "黑子"
        }
      }
      console.log(HistoryGame.value)
    }
    else
      ElMessageBox.alert(res.data.msg)
  })
    .catch((error) => {
      console.log(error)
    })
}

const getSelfPost = () => {
  console.log("获取数据")

  var service = axios.create({
    headers: {
      // 设置后端需要的传参类型
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })

  service
    .get('http://43.139.128.42:9876/api/Post/getSelfPost')
    .then((res) => {
      console.log(res.data)
      if (res.data.isSuccess) {
        console.log("获取数据成功！")
        PostAll.value = res.data.result
        console.log(PostAll.value)
      }
      else
        ElMessageBox.alert(res.data.msg)
    })
    .catch((error) => {
      console.log(error)
    })
}

const getSelfComment = () => {
  console.log("获取数据")

  var service = axios.create({
    headers: {
      // 设置后端需要的传参类型
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })

  service
    .get('http://43.139.128.42:9876/api/Post/getSelfcomment')
    .then((res) => {
      console.log(res.data)
      if (res.data.isSuccess) {
        console.log("获取数据成功！")
        comment.value = res.data.result
        console.log(comment.value)
      }
      else
        ElMessageBox.alert(res.data.msg)
    })
    .catch((error) => {
      console.log(error)
    })
}

const refreshCom = () => {
  console.log("刷新")
  comment.value = []
  getSelfComment()
  comment.value = false
}

const refreshPost = () => {
  console.log("刷新")
  PostAll.value = []
  getSelfPost()
  PostAll.value = false
}


const modifiedMatchIndex = ref(0)

const getPost = (index: number) => {
  console.log(index)
  modifiedMatchIndex.value = index
  var service = axios.create({
    headers: {
      // 设置后端需要的传参类型
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })

  service
    .get("http://43.139.128.42:9876/api/Post/getPost?post_id=" + index)
    .then((response) => {
      console.log(response.data)
      if (response.data.isSuccess) {
        console.log("详情成功ヽ(✿ﾟ▽ﾟ)ノ")
        PostChange.post_Content = response.data.result.post_Content
        PostChange.post_Name = response.data.result.post_Name
        PostChange.User_ID = response.data.result.user_ID
        PostChange.Post_ID = response.data.result.post_ID
        PostChange.post_Time = response.data.result.post_Time
        PostChange.view_Num = response.data.result.vue_Num

        console.log(response.data.result)
        console.log(PostChange.post_Content)
      }
      else
        ElMessageBox.alert(response.data.msg)
    })
    .catch((error) => {
      console.log(error)
    })
  dialogVisible.value = true
}

const editPost = () => {
  let data = JSON.parse(JSON.stringify(PostChange))
  console.log(PostChange)
  var service = axios.create({
    headers: {
      // 
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })
  service.post("http://43.139.128.42:9876/api/Post/editPost", data).then(res => {
    console.log(res.data)
    if (res.data.isSuccess) {
      console.log("修改成功!")
      refreshPost()
    }
    else
      ElMessageBox.alert(res.data.msg)
  })
    .catch((error) => {
      console.log(error)
    })

  dialogVisible.value = false
}
const check_delete = ref()
const delete_id = ref()

const deletecomment = (index: number) => {
  dialogVisible3.value = true;
  delete_id.value = index
}

const check_Delete_comment = (index: number) => {
  if (index === 1) {
    console.log(delete_id)
    console.log("开始删除")
    var service = axios.create({
      headers: {
        // 
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      }
    })
    service.get("http://43.139.128.42:9876/api/Post/deleteComment?comment_id=" + delete_id.value).then(res => {
      console.log(res.data)
      if (res.data.isSuccess) {
        console.log("删除成功!")
        refreshCom()
        check_delete.value = 0
        dialogVisible3.value = false;
      }
      else
        ElMessageBox.alert(res.data.msg)
    })
      .catch((error) => {
        console.log(error)
      })
  }
  else {
    dialogVisible3.value = false;
  }
}

const deletePost = (index: number) => {
  dialogVisible3.value = true;
  delete_id.value = index
}

const check_Delete_Post = (index: number) => {
  if (index === 1) {
    var service = axios.create({
      headers: {
        // 
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      }
    })
    service.get("http://43.139.128.42:9876/api/Post/deletePost?post_id=" + delete_id.value).then(res => {
      console.log(res.data)
      if (res.data.isSuccess) {
        console.log("删除成功!")
        refreshPost()
        dialogVisible3.value = false;
      }
      else
        ElMessageBox.alert(res.data.msg)
    })
      .catch((error) => {
        console.log(error)
      })
  }
  else {
    dialogVisible3.value = false;
  }
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style scoped>
/* 滑块 */
.center {
  position: relative;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  margin-top: 10%;
  height: 10%;
  background: transparent;
  border-bottom: 5px solid #6c6c6c;
  animation: animateLine 5s linear infinite;

}

.hexagon {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 40px;
  height: 25px;
  background: #929191;
  animation: animate 10s linear infinite;
}

.hexagon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #929191;
  transform: rotate(-60deg);
}

.hexagon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #929191;
  transform: rotate(60deg);
}

.hexagon2 {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 40px;
  height: 25px;
  background: #929191;
  animation: animate2 10s linear infinite;
}

.hexagon2::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #929191;
  transform: rotate(60deg);
}

.hexagon2::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #929191;
  transform: rotate(-60deg);
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
    left: 50px;
  }

  50% {
    transform: rotate(720deg);
    left: calc(48%);
  }

  100% {
    transform: rotate(0deg);
    left: 50px;
  }
}

@keyframes animate2 {
  0% {
    transform: rotate(0deg);
    left: calc(100% - 50px);
  }

  50% {
    transform: rotate(-720deg);
    left: calc(52%);
  }

  100% {
    transform: rotate(0deg);
    left: calc(100% - 50px);
  }
}

/* 表格 */
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

.body {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: radial-gradient(200% 100% at bottom center,
      #cae9f4,
      #6fc2e9,
      #1b2947);
  background: radial-gradient(200% 105% at top center,
      #1b2947 10%,
      #51587d 40%,
      #6fb8e9 65%,
      #b6ecf7);
  background-attachment: fixed;
  overflow: hidden;
}

@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }

  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.table-a {
  position: relative;
  left: 5%;
  width: 90%;
  margin-top: 5px;
}

/**表格背景透明 */
/*透明化整体*/
.table-a :deep() .el-table,
.el-table__expanded-cell {
  background-color: transparent !important;
}

/*透明化行、单元格,删除表头下横线*/
.table-a :deep() tr,
.table-a :deep() th,
.table-a :deep() td {
  background: #1439391c !important;
  color: #fff;
  border-bottom: 0px;
  /*删除表头下横线*/
}

/* 删除表格下横线 */
/*去除最底下的横线 */
.table-a ::v-deep .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
  margin-top: 5px;
}

/*hover时样式*/
.table-a :deep() .el-table tbody tr:hover>td {
  background-color: #29c2c278 !important
}

/* 表格内容(有用)*/
.table-a :deep() .el-table__row {
  background: #1439391c !important;
  color: #46d4ff;
}

.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #fd0000;
  font-size: 32px;
  font-weight: 600;
}

.tab-label-white {
  color: rgb(255, 255, 255);
}

.header-container {
  display: flex;
  justify-content: left;
  /* 水平居中对齐 */
  align-items: center;
  /* 垂直居中对齐 */
  height: 100px;
  /* 根据需要设置容器高度 */
  background: linear-gradient(to right, rgb(123, 132, 140), rgb(136, 143, 152));
}

.BigContainer {
  display: flex;
  height: auto;
  overflow-y: hidden;
  flex-direction: column;
  /* 水平排列，可根据需要更改排列方式 */

}

.SelfInfo {
  flex: 1;
  /* height: 30%; */
  width: auto;
  text-align: left;
  margin-left: 85px;
  margin-top: 50px;
}

.editButton {
  margin-top: 20px;
  margin-left: 70%;
  background-color: rgb(204, 204, 204);
  font-size: 20px;
  width: 150px;
  height: 50px;
  border-radius: 5px;
  border: none;
  color: rgb(51, 51, 51);
}

.divider {
  height: 1px;
  background-color: #3d3c3c;
  /* 分割线的颜色 */
  margin-top: 30px;
  margin-right: 100px;
  border: none;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.HistoryGame {
  flex: 1;
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 30px;
  text-align: left;
}

.mainbox {
  background-image: url("../assets/bk4.png");
  background-size: 100% 100%;
  background-attachment: fixed;
}
</style>

