<template>
    <div class="bigBox">
        <el-divider />
        <h1 style="color: aliceblue; padding-bottom: 50px; padding-top:30px">所有比赛</h1>
    </div>

    <el-divider />
    <!-- 展示所有比赛信息的表格 -->
    <div>
        <el-card style="height: 520px; margin-bottom: 0px">
            <el-table :data="matchAll.value" style="width: 100%" max-height="500px" @vue:mounted="getMatch" stripe
                table-layout="auto">
                
                <!--game_id,game_name,nickname1,nickname2,user1_id,user2_id,user1_score,user2_score,user1_color,user2_color-->
                <el-table-column prop="match_ID" label="比赛ID" width="90" align="center" sortable />
                <el-table-column prop="match_Name" label="比赛名称" width="130" align="center" sortable />
                <el-table-column prop="sign_Start_Time" label="报名开始时间" width="240" align="center" sortable />
                <el-table-column prop="sign_End_Time" label="报名截止时间" width="240" align="center" sortable />
                <el-table-column prop="participants_Num" label="计划人数" width="90" align="center" sortable />
                <el-table-column prop="have_Participants_Num" label="已报名数" width="90" align="center" sortable />
                <el-table-column fixed="right" label="比赛详情" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click.prevent="seeDetail(scope.row.match_ID)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
    <el-divider />
    <el-button @click="refreshMatch">刷新</el-button>

</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElButton, ElInput } from 'element-plus'
import { useRouter } from 'vue-router';


const router = useRouter();


const matchAll = reactive({
    "match_ID": 0,
    "match_Name": '',
    "sign_Start_Time": '',
    "sign_End_Time": '',
    "participants_Num": 0,
    "have_Participants_Num": 0
})

const refreshMatch = () => {
    console.log("refreshed")
    matchAll.value = []
    getMatch()
}

const getMatch = () => {
    console.log("获取所有比赛信息")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getAllMatch')
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取所有比赛信息成功！")
                matchAll.value = response.data.result
                console.log(matchAll)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

const seeDetail = (data) => {
    //console.log(data)
    router.push({name: "matchInfoView", params:{matchId: data}})
}



//详情弹出框
const dialogDetailVisible = ref(false)

//新公告弹出框
const dialogFormVisible = ref(false)

//发布后确认弹出框
const dialogVisible = ref(false)

</script>

<style scoped>
.el-button--text {
    margin-right: 10px;
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

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/zsp2.png");
}
</style>