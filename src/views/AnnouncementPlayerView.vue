<template>
    <el-scrollbar height="95vh">
        <div style="margin-left: 40px; margin-right: 40px;">
            <div class="bigBox">
                <el-divider />
                <h1 style="margin-top: 30px; font-size: 35px; margin-bottom: 20px;">公告一览</h1>
            </div>
            
            <div style="margin-left: 100px; display: inline-block;">
                <el-statistic title="总数"
                    :value="annAll.value !== undefined && annAll.value != null ? annAll.value.length : -1" >
                    <template #suffix>
                        <el-icon style="vertical-align: -0.125em">
                            <ChatLineRound />
                        </el-icon>
                    </template>
                </el-statistic>
            </div>
        </div>
        <el-divider />
        <!-- 主页的表格 -->
        <div>
            <el-card style="height: 600px; 
                margin-bottom: 0px;
                width:auto; 
                margin-left: 50px;
                margin-right: 50px;">
                <el-table :data="annAll.value" style="width: 100%;" max-height="560px" @vue:mounted="getAnnouncement" stripe
                    table-layout="auto">
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="announcement_Name" label="名称" align="center" sortable />
                    <el-table-column prop="announcement_ID" label="公告ID" align="center" sortable />
                    <el-table-column prop="announcement_Time" label="发布时间" align="center" sortable />
                    <el-table-column prop="administrator_ID" label="管理员ID" align="center" sortable />
                    <el-table-column fixed="right" label="操作" align="center">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click.prevent="seeDetail(scope.row)">
                                查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <el-divider />
    </el-scrollbar>
    <!-- 详情弹出框 -->
    <div class="text-wrapper">
        <el-dialog v-model="dialogDetailVisible" title="详情" draggable>
            <el-descriptions :column="1">
                <el-descriptions-item label="名称">{{ showAnn.value.announcement_Name }}</el-descriptions-item>
                <el-descriptions-item label="公告ID">{{ showAnn.value.announcement_ID }}</el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ showAnn.value.announcement_Time }}</el-descriptions-item>
                <el-descriptions-item label="管理员ID">{{ showAnn.value.administrator_ID }}</el-descriptions-item>
                <el-descriptions-item label="内容">{{ showAnn.value.announcement_Content }}</el-descriptions-item>
            </el-descriptions>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogDetailVisible = false">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessageBox } from 'element-plus';
import { reactive, ref } from 'vue';

const showAnn = reactive({
    "announcement_ID": 0,
    "announcement_Name": '',
    "announcement_Time": '',
    "administrator_ID": 0,
    "announcement_Content": ''
})

const annAll = reactive({
    "announcement_ID": 0,
    "announcement_Name": '',
    "announcement_Time": '',
    "administrator_ID": 0,
    "announcement_Content": ''
})

const announcementData = reactive({
    "announcement_Name": "",
    "announcement_Content": ""
})

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

const getAnnouncement = () => {
    console.log("获取数据")

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            //'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/User/getAllAnnouncement')
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("获取数据成功！")
                annAll.value = response.data.result
                annAll.value.forEach((element: { announcement_Time: string; }) => {
                    element.announcement_Time = formatDate(element.announcement_Time)
                });
                console.log(annAll.value)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

//详情弹出框
const dialogDetailVisible = ref(false)

const seeDetail = (data: any) => {
    console.log("看详情")
    showAnn.value = data
    console.log(data)
    console.log(showAnn.value)
    dialogDetailVisible.value = true
}
</script>

<style scoped>
.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/bgink.jpg");
}
</style>