<template>
    <el-scrollbar height="95vh">
    <div class="bigBox">
        <el-divider />
        <h1 style="margin-top: 30px;">比赛信息页面</h1>
        <!-- <h1>params参数 ： {{$route.params.matchId}}</h1> -->
    </div>

    <el-divider/>
        <el-card>
            <el-descriptions
                class="margin-top"
                title="详细信息"
                :column="1"
                :size="size"
                :data="matchDetail" @vue:mounted="getMatchInfo($route.params.matchId)"
                border
            >
                <template #extra>
                    <el-button type="primary" @click="joinMatch($route.params.matchId)">参赛</el-button>
                </template>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <tickets />
                            </el-icon>
                            比赛名称
                        </div>
                    </template>
                        {{matchDetail.match_Name}}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            报名开始时间
                        </div>
                    </template>
                    {{ matchDetail.sign_Start_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            报名结束时间
                        </div>
                    </template>
                    {{ matchDetail.sign_End_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            比赛计划人数
                        </div>
                    </template>
                    {{ matchDetail.participants_Num }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            报名人数
                        </div>
                    </template>
                    {{ matchDetail.have_Participants_Num }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <tickets />
                            </el-icon>
                            比赛介绍
                        </div>
                    </template>
                    {{ matchDetail.match_Introduction }}
                </el-descriptions-item>


                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            比赛开始时间
                        </div>
                    </template>
                    {{ matchDetail.match_Start_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            比赛结束时间
                        </div>
                    </template>
                    {{ matchDetail.match_End_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <tickets />
                            </el-icon>
                            棋盘大小
                        </div>
                    </template>
                    {{ matchDetail.board_Size }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            主时间
                        </div>
                    </template>
                    {{ matchDetail.main_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            第二次计算时间
                        </div>
                    </template>
                    {{ matchDetail.second_Counting_Time }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <location />
                            </el-icon>
                            第二次计算数
                        </div>
                    </template>
                    {{ matchDetail.second_Counting_Num }}
                </el-descriptions-item>

                <el-descriptions-item label="状态：         ">
                    <span v-if="matchDetail.is_Over == 0">
                        <el-button type="success">进行中</el-button>
                    </span>
                    <span v-if="matchDetail.is_Over == 1">
                        <el-button type="danger">已结束</el-button>
                    </span>
                </el-descriptions-item>

            </el-descriptions>

        </el-card>
    <el-divider/>
    <el-card :data="matchDetail" @vue:mounted="getMatchInfo($route.params.matchId)">
        <span v-if="matchDetail.is_Over == 0">
            <h2>参赛人员名单</h2>
            <el-table :data="Participants.value" border style="width: 100%" @vue:mounted="getParticipants($route.params.matchId)">
                <el-table-column prop="user_ID" label="玩家ID" width="180" />
                <el-table-column prop="nickname" label="昵称" width="180" />
                <el-table-column prop="current_Score" label="当前分数" />
            </el-table>
            <el-divider/>
            <el-button type="info" @click="joinMatch($route.params.matchId)">报名参赛</el-button>
        </span>


        <span v-if="matchDetail.is_Over == 1">
            <h2>比赛结果</h2>
            <el-table :data="rank.value" border style="width: 100%" @vue:mounted="getRank($route.params.matchId)">
                <el-table-column prop="user_ID" label="玩家ID" width="180" />
                <el-table-column prop="nickname" label="昵称" width="180" />
                <el-table-column prop="current_Score" label="当前分数" />
                <el-table-column prop="ranking" label="段位" />
            </el-table>         
        </span>
    </el-card>

    <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
        <span>
            比赛报名成功
        </span>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">确认</el-button>

            </span>
        </template>
    </el-dialog>
</el-scrollbar>


</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElButton, ElInput } from 'element-plus'
import { useRouter } from 'vue-router';


const router = useRouter();


var matchDetail = reactive({
    "match_ID": 0,
    "match_Name": '',
    "sign_Start_Time": '',
    "sign_End_Time": '',
    "participants_Num": 0,
    "have_Participants_Num": 0,
    "match_Introduction": '',
    "match_Start_Time": '',
    "match_End_Time": '',
    "board_Size": '',
    "main_Time": 0,
    "second_Counting_Time": 0,
    "second_Counting_Num": 0,
    "is_Over": 0
})

var Participants = reactive({
    "user_ID": 0,
    "nickname": '',
    "current_Score": 0,
})

var rank = reactive({
    "user_ID": 0,
    "nickname": '',
    "current_Score": 0,
    "ranking": 0
})



const getMatchInfo = (match_ID) => {
    console.log("获取比赛详细信息")
    console.log(match_ID)
    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getMatchDetail?match_id='+match_ID)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取比赛信息成功！")
                matchDetail.board_Size = response.data.result.board_Size
                if(matchDetail.board_Size==='\u0000')
                {
                    matchDetail.board_Size = '19x19'
                }
                if(matchDetail.board_Size==='\u0001')
                {
                    matchDetail.board_Size = '13x13'
                }
                if(matchDetail.board_Size==='\u0002')
                {
                    matchDetail.board_Size = '9x9'
                }

                matchDetail.match_ID = response.data.result.match_ID


                matchDetail.have_Participants_Num = response.data.result.have_Participants_Num
                matchDetail.main_Time = response.data.result.main_Time
                matchDetail.match_End_Time = response.data.result.match_End_Time
                
                matchDetail.match_Introduction = response.data.result.match_Introduction 
                matchDetail.match_Name = response.data.result.match_Name
                matchDetail.match_Start_Time = response.data.result.match_Start_Time
                matchDetail.participants_Num = response.data.result.participants_Num
                matchDetail.second_Counting_Num = response.data.result.second_Counting_Num
                matchDetail.second_Counting_Time = response.data.result.second_Counting_Time
                matchDetail.sign_End_Time = response.data.result.sign_End_Time
                matchDetail.sign_Start_Time = response.data.result.sign_Start_Time
                matchDetail.is_Over = response.data.result.is_Over
                console.log(matchDetail)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

const getParticipants = (match_ID) => {
    console.log("获取所有参赛人员信息")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getParticipants?match_id='+match_ID)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取所有参赛人员信息成功！")
                Participants.value = response.data.result
                console.log(Participants.value)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

const joinMatch = (match_ID) => {
    console.log("尝试报名")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/joinMatch?match_id='+match_ID)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("成功报名参赛！")
                centerDialogVisible = ref(true)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })

        var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getParticipants?match_id='+match_ID)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取所有参赛人员信息成功！")
                Participants.value = response.data.result
                console.log(Participants.value)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

const getRank = (match_ID) => {
    console.log("获取比赛结果信息")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getRank?match_id='+match_ID)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取比赛结果信息成功！")
                rank.value = response.data.result
                console.log(rank.value)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

//详情弹出框
const dialogDetailVisible = ref(true)

//新公告弹出框
const dialogFormVisible = ref(false)

//发布后确认弹出框
const dialogVisible = ref(false)

var centerDialogVisible = ref(false)

</script>




<style scoped>
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.el-descriptions {
    margin-top: 20px;
}

.box-card {
    height: 800px;
}

.text-wrapper {
    word-break: break-all;
    word-wrap: break-word
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/zsp3.png");
}
</style>