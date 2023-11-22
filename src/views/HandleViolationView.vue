<template>
<el-scrollbar height="95vh">
        <div style="margin-left: 40px; margin-right: 40px;">
            <div class="bigBox">
                <el-divider />
                <h1 style="margin-top: 30px; font-size: 35px; margin-bottom: 20px;">处理违规信息</h1>
            </div>
            <el-switch v-model="value1" class="mb-2" active-text="已处理" inactive-text="未处理" @change="getViolation(value1)" />
            <span style="margin-left: 20px">
                <el-button type="primary" @click="handleViolation" :disabled="value1">
                    处理选中的{{ multipleSelection.length }}个违规</el-button>
                <el-button @click="getViolation(value1)">刷新</el-button>
            </span>
            <div style="margin-left: 100px; display: inline-block;">
                <el-statistic title="总数" :value="tbldt.length !== undefined && tbldt.length !== null ? tbldt.length : -1">
                    <template #suffix>
                        <el-icon style="vertical-align: -0.125em">
                            <ChatLineRound />
                        </el-icon>
                    </template>
                </el-statistic>
            </div>
        </div>
        <el-divider />
        <div>
            <el-card style="height: 600px; margin-bottom: 0px; width:auto; margin-left: 50px;margin-right: 50px;">
                <el-table ref="multipleTableRef" :data="tbldt" style="width: 100%" @selection-change="handleSelectionChange"
                    @vue:mounted="getViolation(value1)" stripe max-height="560" table-layout="auto">
                    <el-table-column type="selection" width="55" />
                    <el-table-column property="violation_ID" label="违规编号" width="150" align="center" sortable />
                    <el-table-column property="violator_ID" label="违规玩家编号" width="150" align="center" sortable />
                    <el-table-column property="reporter_ID" label="举报人编号" width="150" align="center" sortable />
                    <el-table-column property="violation_Content" label="违规内容" align="center" sortable />
                    <el-table-column property="violation_Time" label="违规时间" align="center" sortable />
                </el-table>
            </el-card>
        </div>
        <el-divider />
    </el-scrollbar>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElMessage, ElMessageBox, ElButton, ElInput, DEFAULT_FORMATS_DATE } from 'element-plus'
import { ElTable } from 'element-plus'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

//获取违规数据的接口
interface User {
    violation_ID: number,
    violator_ID: number,
    reporter_ID: number,
    violation_Content: string,
    violation_Time: string,
    is_Deal: number,
}

const tableData: User[] = []

const tbldt = ref(tableData)

//获取违规信息
const getViolation = (is_Deal) => {
    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token'),
            'is_deal': is_Deal ? 1 : 0
        }
    })
    service
        .get('http://43.139.128.42:9876/api/Admin/getAllViolation?is_deal=' + (is_Deal ? 1 : 0))
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("成功( •̀ ω •́ )y")
                tbldt.value = []
                response.data.result.forEach((element: {
                    violation_ID: number;
                    violator_ID: number;
                    reporter_ID: number;
                    violation_Content: string;
                    violation_Time: string;
                    is_Deal: number;
                }) => {
                    element.violation_Time = formatDate(element.violation_Time)
                    tbldt.value.unshift(element)
                });
                console.log(tableData)
            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

//复选框方法
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
}

//弹窗方法
const open = () => {
    ElMessageBox.alert(
        '选中的违规已处理，全部成功！',
        '提示信息', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确认'
    })
}

//const isVisible = ref(true)

//处理违规
const handleViolation = () => {
    var vid = 0, len = multipleSelection.value.length
    console.log(len)
    if (len === 0) {
        ElMessageBox.alert(
            '未选中任何违规信息！',
            '提示信息', {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: '确认'
        })
        return;
    }

    while (len) {
        vid = multipleSelection.value[len - 1].violation_ID
        console.log(vid)

        // if (value1.value === true) {
        //     isVisible.value = false
        // }

        var service = axios.create({
            headers: {
                // 设置后端需要的传参类型
                'Authorization': 'bearer ' + localStorage.getItem('token'),
                'violation_id': vid
            }
        })
        service
            .get('http://43.139.128.42:9876/api/Admin/dealViolation?violation_id=' + vid)
            .then((response) => {
                console.log(response.data)
                if (response.data.isSuccess) {
                    console.log("成功(๑•̀ㅂ•́)و✧")
                }
                else {
                    ElMessageBox.alert(response.data.msg)
                }
            })
            .catch((error) => {
                console.log(error)
                ElMessageBox.alert(error)
            })
        len--
    }
    getViolation(!value1)
    getViolation(!value1)
    getViolation(!value1)
    open()
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

//滑块
const value1 = ref(false)
</script>

<style>
/* #building {
    background: url("../assets/bgsun.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    margin-left: -20px;
} */

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/bgsun.jpg");
}
</style>