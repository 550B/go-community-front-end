<template>
    <div class="bigBox">
        <el-divider />
        <h1 style="padding-top: 30px;">所有对局页面</h1>
        
    </div>

    <el-divider />
    <!-- 主页的表格 -->
    <div>
        <el-card style="height: 520px; margin-bottom: 0px">
            <el-table :data="gameAll.value" style="width: 100%" max-height="500px" @vue:mounted="getGame" stripe
                table-layout="auto">
                
                <!--game_id,game_name,nickname1,nickname2,user1_id,user2_id,user1_score,user2_score,user1_color,user2_color-->
                <el-table-column prop="game_ID" label="对局ID" width="70" align="center" sortable />
                <el-table-column prop="game_Name" label="对局名称" width="70" align="center" sortable />

                <el-table-column prop="nickname1" label="棋手A" align="center" sortable />
                <el-table-column prop="user1_ID" label="棋手A的ID" align="center" sortable />
                <el-table-column prop="user1_Color" label="棋手A颜色" align="center" sortable >
                    <template #default="scope">
                        <span v-if="scope.row.user1_Color == -1">
                            <el-button circle >
                                白
                            </el-button>
                            
                        </span>
                        <span v-if="scope.row.user1_Color == 1">
                            <el-button type="info" circle>
                                黑
                            </el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="user1_Score" label="棋手A分数" align="center" sortable />

                <el-table-column label="观看对局" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click.prevent="seeDetail(scope.row.game_ID)">
                            进入
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" prop="nickname2" label="棋手B" align="center" sortable />
                <el-table-column fixed="right" prop="user2_ID" label="棋手B的ID" align="center" sortable />
                <el-table-column fixed="right" prop="user2_Color" label="棋手B颜色" align="center" sortable >
                    <template #default="scope">
                        <span v-if="scope.row.user2_Color == -1">
                            <el-button circle >
                                白
                            </el-button>
                            
                        </span>
                        <span v-if="scope.row.user2_Color == 1">
                            <el-button type="info" circle>
                                黑
                            </el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" prop="user2_Score" label="棋手B分数" align="center" sortable />
                
                

            </el-table>
        </el-card>
    </div>
    <el-divider />
    <div>
        <el-button @click="refreshGame">刷新</el-button>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElButton, ElInput } from 'element-plus'
import { useRouter } from 'vue-router';


const router = useRouter();


const gameAll = reactive({
    "game_ID": 0,
    "game_Name": '',
    "nickname1": '',
    "nickname2": '',
    "user1_ID": 0,
    "user2_ID": 0,
    "user1_Score": 0,
    "user2_Score": 0,
    "user1_Color": 0,
    "user2_Color": 0
})



const refreshGame = () => {
    console.log("refreshed")
    gameAll.value = []
    getGame()
}

const getGame = () => {
    console.log("获取所有对局信息")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Game/getAllGame')
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取所有对局信息成功！")
                gameAll.value = response.data.result
                console.log(gameAll)
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
    //data是scope.row.game_ID
    router.push({name: "watchGameView", params:{gameId: data}})
}

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

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/zsp1.png");
}
</style>