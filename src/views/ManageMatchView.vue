<template>
    <el-scrollbar height="95vh">
        <div style="margin-left: 40px; margin-right: 40px;">
            <div class="bigBox">
                <el-divider />
                <h1 style=" padding-bottom: 50px; padding-top:30px; font-size: 35px;">管理比赛</h1>
            </div>
            <el-button @click="dialogVisible = true" type="primary">发布新比赛</el-button>
            <el-button @click="refreshMatch">刷新</el-button>
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
        <!-- 主页表格 -->
        <el-divider />
        <span>
            <el-card style="height: 600px; margin-bottom: 0px;width:auto; margin-left: 50px; margin-right: 50px;">
                <el-table ref="multipleTableRef" :data="tbldt" style="width: 100%" @vue:mounted="getUnfinishedMatch" stripe
                    max-height="560px" table-layout="auto">
                    <el-table-column type="index" width="50" />
                    <el-table-column property="participants_Num" label="限额" width="100" align="center" sortable />
                    <el-table-column property="have_Participants_Num" label="报名人数" width="120" align="center" sortable />
                    <el-table-column property="match_Name" label="名称" align="center" sortable />
                    <el-table-column property="match_ID" label="ID" width="100" align="center" sortable />
                    <el-table-column property="sign_Start_Time" label="开始时间" align="center" sortable />
                    <el-table-column property="sign_End_Time" label="结束时间" align="center" sortable />
                    <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <el-button link size="small"
                                @click.prevent="queryMatchDetail(scope.row.match_ID)">详情</el-button>
                            <el-button link type="primary" size="small"
                                @click.prevent="getMatchResult(scope.row.match_ID)">发布比赛结果</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </span>
        <el-divider />
    </el-scrollbar>
        <!-- 创建比赛弹出表单 -->
        <el-dialog v-model="dialogVisible" title="创建比赛" width="50%" :before-close="handleClose" draggable>
            <span>
                <el-form :model="ruleForm" label-width="120px" status-icon ref="ruleFormRef" :rules="rules">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="ruleForm.name" clearable type="text" :rows="1" maxlength="10" show-word-limit />
                    </el-form-item>
                    <el-form-item label="报名时间" prop="sign">
                        <div>
                            <!-- <span class="demonstration">请选择开始和结束的日期和时间</span> -->
                            <el-date-picker v-model="ruleForm.sign" type="datetimerange" :shortcuts="shortcuts"
                                range-separator="到" start-placeholder="开始日期时间" end-placeholder="结束日期时间"
                                @change="setSignTime" value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]" />
                            <!-- 2023-08-30T18:04:17.315Z -->
                        </div>
                        <!-- <el-col :span="11">
                        <el-date-picker v-model="form.sign_Start_Time1" type="date" placeholder="请选择日期"
                            style="width: 100%" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-picker v-model="form.sign_Start_Time2" placeholder="请选择时间" style="width: 100%" />
                    </el-col>
                </el-form-item>
                <el-form-item label="报名结束时间">
                    <el-col :span="11">
                        <el-date-picker v-model="form.sign_End_Time1" type="date" placeholder="请选择日期" style="width: 100%" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-picker v-model="form.sign_End_Time2" placeholder="请选择时间" style="width: 100%" />
                    </el-col> -->
                    </el-form-item>
                    <el-form-item label="比赛时间" prop="match">
                        <div>
                            <!-- <span class="demonstration">请选择开始和结束的日期和时间</span> -->
                            <el-date-picker v-model="ruleForm.match" type="datetimerange" :shortcuts="shortcuts"
                                range-separator="到" start-placeholder="开始日期时间" end-placeholder="结束日期时间"
                                @change="setSignTime" value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]" />
                        </div>
                        <!-- <el-col :span="11">
                        <el-date-picker v-model="form.match_Start_Time1" type="date" placeholder="请选择日期"
                            style="width: 100%" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-picker v-model="form.match_Start_Time2" placeholder="请选择时间" style="width: 100%" />
                    </el-col>
                </el-form-item>
                <el-form-item label="比赛结束时间">
                    <el-col :span="11">
                        <el-date-picker v-model="form.match_End_Time1" type="date" placeholder="请选择日期"
                            style="width: 100%" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-time-picker v-model="form.match_End_Time2" placeholder="请选择时间" style="width: 100%" />
                    </el-col> -->
                    </el-form-item>
                    <el-form-item label="主时间" prop="time">
                        <!-- <el-input v-model.number="newMatch.main_Time" /> -->
                        <el-input-number v-model="ruleForm.time" :step="5" :min="1" :max="999999" />
                        <div style="margin-left: 30px;">分钟</div>
                    </el-form-item>
                    <el-form-item label="最大人数" prop="participant">
                        <!-- <el-input v-model.number="newMatch.participants_Num" /> -->
                        <el-input-number v-model="ruleForm.participant" :step="1" :min="1" :max="999" />
                    </el-form-item>
                    <el-form-item label="每次读秒时间" prop="sec">
                        <!-- <el-input v-model.number="newMatch.second_Counting_Time" /> -->
                        <el-input-number v-model="ruleForm.sec" :step="5" :min="1" :max="99999" />
                        <div style="margin-left: 30px;">秒</div>
                    </el-form-item>
                    <el-form-item label="读秒次数" prop="cnt">
                        <!-- <el-input v-model.number="newMatch.second_Counting_Num" /> -->
                        <el-input-number v-model="ruleForm.cnt" :step="1" :min="1" :max="999" />
                        <div style="margin-left: 30px;">次</div>
                    </el-form-item>
                    <el-form-item label="棋盘尺寸" prop="size">
                        <!-- <el-input v-model="newMatch.board_Size" /> -->
                        <el-radio-group v-model="ruleForm.size">
                            <el-radio :label="0">19x19</el-radio>
                            <el-radio :label="1">13x13</el-radio>
                            <el-radio :label="2">9x9</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="简介" prop="intro">
                        <el-input v-model="ruleForm.intro" clearable type="textarea" :rows="5" maxlength="100"
                            placeholder="请输入公告内容" show-word-limit />
                    </el-form-item>
                </el-form>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="resetForm(ruleFormRef)">重置</el-button>
                    <el-button type="primary" @click="postNewMatch(ruleFormRef)">创建</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 比赛详情弹出框 -->
        <div class="text-wrapper">
            <el-dialog v-model="dialogTableVisible" title="详情" draggable>
                <el-descriptions :column='2'>
                    <el-descriptions-item label="比赛名称">{{ detailedMatch.match_Name }}</el-descriptions-item>
                    <el-descriptions-item label="比赛ID">{{ detailedMatch.match_ID }}</el-descriptions-item>
                    <el-descriptions-item label="报名开始时间" min-width="300px">{{ detailedMatch.sign_Start_Time
                    }}</el-descriptions-item>
                    <el-descriptions-item label="报名结束时间">{{ detailedMatch.sign_End_Time }}</el-descriptions-item>
                    <el-descriptions-item label="比赛开始时间">{{ detailedMatch.match_Start_Time }}</el-descriptions-item>
                    <el-descriptions-item label="比赛结束时间">{{ detailedMatch.match_End_Time }}</el-descriptions-item>
                    <el-descriptions-item label="限额">{{ detailedMatch.participants_Num }}</el-descriptions-item>
                    <el-descriptions-item label="报名人数">{{ detailedMatch.have_Participants_Num }}</el-descriptions-item>
                    <el-descriptions-item label="棋盘大小">{{ detailedMatch.board_Size }}</el-descriptions-item>
                    <el-descriptions-item label="主时间">{{ detailedMatch.main_Time }}</el-descriptions-item>
                    <el-descriptions-item label="每次读秒时间">{{ detailedMatch.second_Counting_Time }}</el-descriptions-item>
                    <el-descriptions-item label="读秒次数">{{ detailedMatch.second_Counting_Num }}</el-descriptions-item>
                    <el-descriptions-item label="是否结束">
                        <el-tag size="small" :type="handleTagColor(detailedMatch.is_Over)">{{ detailedMatch.is_Over ? '是' :
                            '否'
                        }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="简介">{{ detailedMatch.match_Introduction }}</el-descriptions-item>
                </el-descriptions>
            </el-dialog>
        </div>
        <!-- 发布结果弹出框 -->
        <el-dialog v-model="dialogTblVisible" title="发布比赛结果" draggable>
            <el-table :data="matchRank.value" @current-change="refreshRank" stripe height="515px" table-layout="auto">
                <el-table-column property="ranking" label="排名" align="center">
                    <template #default="scope">
                        <div class="flex flex-wrap gap-2 my-2">
                            <el-tag :type="handleTagColor(scope.row.ranking)" class="mx-1" effect="dark" round>
                                {{ scope.row.ranking }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="user_ID" label="ID" align="center" />
                <el-table-column property="nickname" label="昵称" align="center" />
                <el-table-column property="current_Score" label="当前积分" align="center" />
                <el-table-column fixed="right" label="操作" align="center">
                    <template #default="scope">
                        <el-button link type="primary" size="small"
                            @click.prevent="saveWannaModifiedRank(scope.row, scope.$index)">
                            修改信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogTblVisible = false">取消</el-button>
                    <el-button type="primary" @click="publishMatchRank">
                        发布
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改结果弹出框 -->
        <el-dialog v-model="dialogFormVisible" title="修改数值" draggable>
            <el-form :model="wannaModify">
                <el-form-item label="用户名" label-width="140px">
                    {{ wannaModify.nickname }}
                </el-form-item>
                <el-form-item label="用户ID" label-width="140px">
                    {{ wannaModify.user_ID }}
                </el-form-item>
                <el-form-item label="当前积分" label-width="140px">
                    <!-- 原来可以修改积分 -->
                    <!-- <el-input-number v-model="wannaModify.current_Score" :min="0" :max="99999" :step="5" /> -->
                    <!-- 修改后无法更改积分 -->
                    {{ wannaModify.current_Score }}
                </el-form-item>
                <el-form-item label="排名" label-width="140px">
                    <el-input-number v-model="wannaModify.ranking" :min="1" :max="999" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="modifyRank">
                        确认修改
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 刷新弹出框 -->
        <el-dialog v-model="dialogReVisible" title="创建成功" width="30%" draggable>
            <span>创建比赛成功！请刷新！</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogReVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleRefresh">
                        刷新
                    </el-button>
                </span>
            </template>
        </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElMessage, ElMessageBox, ElButton, ElInput } from 'element-plus'
import { ElTable } from 'element-plus'
import { reactive, ref, resolveDirective } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

//获取比赛数据的接口
interface User {
    have_Participants_Num: number,
    match_ID: number,
    match_Name: string,
    participants_Num: number,
    sign_End_Time: string,
    sign_Start_Time: string
}

const tableData: User[] = []

const tbldt = ref(tableData)

//初始化比赛表
const getUnfinishedMatch = () => {
    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Admin/getUnfinishedMatch')
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                response.data.result.forEach((element: {
                    have_Participants_Num: number;
                    match_ID: number;
                    match_Name: string;
                    participants_Num: number;
                    sign_End_Time: string;
                    sign_Start_Time: string;
                }) => {
                    element.sign_Start_Time = formatDate(element.sign_Start_Time)
                    element.sign_End_Time = formatDate(element.sign_End_Time)
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

//刷新按钮
const refreshMatch = () => {
    console.log("刷新")
    tbldt.value = []
    getUnfinishedMatch()
}

// do not use same name with ref
// const form = reactive({
//     "sign_Start_Time1": "",
//     "sign_Start_Time2": "",
//     "sign_End_Time1": "",
//     "sign_End_Time2": "",
//     "match_Start_Time1": "",
//     "match_Start_Time2": "",
//     "match_End_Time1": "",
//     "match_End_Time2": "",
// })

//新比赛传递参数
const newMatch = reactive({
    "match_Name": "",
    "match_Introduction": "",
    "sign_Start_Time": "",
    "sign_End_Time": "",
    "match_Start_Time": "",
    "match_End_Time": "",
    "main_Time": 100,
    "participants_Num": 50,
    "second_Counting_Time": 100,
    "second_Counting_Num": 50,
    "board_Size": ""
})

//时间戳转化
// function timestampToTime(timestamp1: string, timestamp2: string) {
//     let date1, date2
//     //判断是否为空，空值的话 会报错
//     if (timestamp1 == null) return "2023-08-28T17:42:52.605Z"
//     //时间戳为10位需*1000，时间戳为13位的话不需乘1000
//     timestamp1.length === 10 ? date1 = new Date(parseInt(timestamp1) * 1000) : date1 = new Date(parseInt(timestamp1));
//     //判断是否为空，空值的话 会报错
//     if (timestamp2 == null) return "2023-08-28T17:42:52.605Z"
//     //时间戳为10位需*1000，时间戳为13位的话不需乘1000
//     timestamp2.length === 10 ? date2 = new Date(parseInt(timestamp2) * 1000) : date2 = new Date(parseInt(timestamp2));
//     let Y = date1.getFullYear() + '-';
//     let M = (date1.getMonth() + 1 < 10 ? `0${(date1.getMonth() + 1)}` : date1.getMonth() + 1) + '-';
//     let D = (date1.getDate() < 10 ? `0${date1.getDate()}` : date1.getDate()) + 'T';
//     let h = (date2.getHours() < 10 ? `0${date2.getHours()}` : date2.getHours()) + ':';
//     let m = (date2.getMinutes() < 10 ? `0${date2.getMinutes()}` : date2.getMinutes()) + ':';
//     let s = (date2.getSeconds() < 10 ? `0${date2.getSeconds()}` : date2.getSeconds()) + '.';
//     let ss = (date2.getMilliseconds() < 10 ? `00${date2.getMilliseconds()}` :
//         date2.getMilliseconds() < 100 ? `0${date2.getMilliseconds()}` : date2.getMilliseconds()) + 'Z'
//     return Y + M + D + h + m + s + ss;
// }

//控制弹窗出现消失
const dialogVisible = ref(false)

//按叉号提醒
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确认退出？')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

//棋盘参考
// const radio = ref(0)

// //时间参考
// const value2 = ref('')
// const value3 = ref('')

//选择日期时间的捷径
const shortcuts = [
    {
        text: '下周',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '下月',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '下季度',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]

const setSignTime = () => {
    console.log("设置报名时间")
    // if (value2.value) {
    //     form.sign_Start_Time1 = value2.value[0]
    //     form.sign_Start_Time2 = value2.value[0]
    //     form.sign_End_Time1 = value2.value[1]
    //     form.sign_End_Time2 = value2.value[1]
    // }
    // if (value3.value) {
    //     form.match_Start_Time1 = value3.value[0]
    //     form.match_Start_Time2 = value3.value[0]
    //     form.match_End_Time1 = value3.value[1]
    //     form.match_End_Time2 = value3.value[1]
    // }
    //console.log(form)
    console.log(ruleForm)
}

///////////
//校验模块//
///////////
//比较时间大小
const comparedate = (date) => {
    let oDate1 = new Date(date);
    let oDate2 = new Date();
    if (oDate1.getTime() == oDate2.getTime()) {
        return true;
    } else if (oDate1.getTime() > oDate2.getTime()) {
        return true;
    }
    else {
        return false;
    }
}

const compareDate = (date1, date2) => {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() == oDate2.getTime()) {
        return true;
    } else if (oDate1.getTime() > oDate2.getTime()) {
        return true;
    }
    else {
        return false;
    }
}

//检查报名时间
const checkSign = (rule: any, value: any, callback: any) => {
    if (value === '' || value === null) {
        callback(new Error('报名日期时间为必填项！'))
    } else {
        console.log(ruleForm.sign[0])
        console.log(comparedate(ruleForm.sign[0]))
        if (!comparedate(ruleForm.sign[0])) {
            callback(new Error('报名开始日期应该晚于当前时刻！'))
        }
        if (ruleForm.sign)
            if (ruleForm.match !== '') {
                if (!ruleFormRef.value) return
                ruleFormRef.value.validateField('match', () => null)
            }
        callback()
    }
}

//检查比赛时间
const checkMatch = (rule: any, value: any, callback: any) => {
    if (value === '' || value === null) {
        callback(new Error('比赛日期时间为必填项！'))
    }
    else {
        if (ruleForm.sign === '') {
            callback(new Error('请先填写报名日期时间！'))
        }
        if (compareDate(ruleForm.sign[1], ruleForm.match[0])) {
            console.log(ruleForm.sign)
            console.log(ruleForm.match)
            callback(new Error('报名结束日期应该早于比赛开始日期！'))
        }
        callback()
    }
}

const ruleFormRef = ref<FormInstance>()

interface RuleForm {
    name: string
    sign: string
    match: string
    time: number
    participant: number
    sec: number
    cnt: number
    size: string
    intro: string
}

const ruleForm = reactive<RuleForm>({
    name: '',
    sign: '',
    match: '',
    time: 100,
    participant: 50,
    sec: 100,
    cnt: 50,
    size: '',
    intro: '',
})

const rules = reactive<FormRules<RuleForm>>({
    name: [{ required: true, message: '比赛名称为必填项！', trigger: 'blur' },],
    sign: [{ required: true, message: '报名日期时间为必填项！', trigger: 'blur' }, { validator: checkSign, trigger: 'blur' },],
    match: [{ required: true, message: '比赛日期时间为必填项！', trigger: 'blur' }, { validator: checkMatch, trigger: 'blur' },],
    time: [{ required: true, message: '主时间为必填项！', trigger: 'blur' },],
    participant: [{ required: true, message: '限额人数为必填项！', trigger: 'blur' },],
    sec: [{ required: true, message: '每次读秒时间为必填项！', trigger: 'blur' },],
    cnt: [{ required: true, message: '读秒次数为必填项！', trigger: 'blur' },],
    size: [{ required: true, message: '棋盘尺寸类型为必填项！', trigger: 'blur' },],
})

//重置新比赛表单内容
const resetForm = (formEl: FormInstance | undefined) => {
    console.log(formEl)
    if (!formEl) return
    formEl.resetFields()

    // formEl.validate((valid) => {
    //     if (valid) {
    //         console.log('submit!')
    //     } else {
    //         console.log('error submit!')
    //         return false
    //     }
    // })
    // newMatch.main_Time = 100
    // newMatch.participants_Num = 50
    // newMatch.second_Counting_Time = 100
    // newMatch.second_Counting_Num = 50
    // //value2.value = null
    // //value3.value = null
    // newMatch.match_Name = "测试"
    // newMatch.match_Introduction = "测测试试"
    // newMatch.sign_Start_Time = form.sign_Start_Time1
    // newMatch.sign_End_Time = form.sign_End_Time1
    // newMatch.match_Start_Time = form.match_Start_Time1
    // newMatch.match_End_Time = form.match_End_Time1
}

//提交新比赛
const postNewMatch = async (formEl: FormInstance | undefined) => {
    console.log('提交')
    // newMatch.sign_Start_Time = timestampToTime(
    //     Date.parse(form.sign_Start_Time1).toString(),
    //     Date.parse(form.sign_Start_Time2).toString()
    // )
    // newMatch.sign_End_Time = timestampToTime(
    //     Date.parse(form.sign_End_Time1).toString(),
    //     Date.parse(form.sign_End_Time2).toString()
    // )
    // newMatch.match_Start_Time = timestampToTime(
    //     Date.parse(form.match_Start_Time1).toString(),
    //     Date.parse(form.match_Start_Time2).toString()
    // )
    // newMatch.match_End_Time = timestampToTime(
    //     Date.parse(form.match_End_Time1).toString(),
    //     Date.parse(form.match_End_Time2).toString()
    // )
    //newMatch.board_Size = radio.value.toString()

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
            newMatch.match_Name = ruleForm.name
            newMatch.match_Introduction = ruleForm.intro
            newMatch.sign_Start_Time = ruleForm.sign[0]
            newMatch.sign_End_Time = ruleForm.sign[1]
            newMatch.match_Start_Time = ruleForm.match[0]
            newMatch.match_End_Time = ruleForm.match[1]
            newMatch.main_Time = ruleForm.time
            newMatch.participants_Num = ruleForm.participant
            newMatch.second_Counting_Time = ruleForm.sec
            newMatch.second_Counting_Num = ruleForm.cnt
            newMatch.board_Size = ruleForm.size.toString()

            console.log(newMatch)
            let data = JSON.parse(JSON.stringify(newMatch))
            console.log(JSON.stringify(newMatch))
            console.log(data)

            var service = axios.create({
                headers: {
                    // 设置后端需要的传参类型
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + localStorage.getItem('token')
                }
            })

            service.post("http://43.139.128.42:9876/api/Admin/createMatch", newMatch).then(res => {
                console.log(res.data)
                if (res.data.isSuccess) {
                    console.log("成功o(*￣▽￣*)ブ")
                }
                else
                    ElMessageBox.alert(res.data.msg)
            })
                .catch((error) => {
                    console.log(error)
                })
            dialogReVisible.value = true
            ElMessage('成功，请刷新！')
            dialogVisible.value = false
        } else {
            console.log('error submit!', fields)
        }
    })
}

//提示刷新
const handleRefresh = () => {
    console.log("提示你刷新")
    refreshMatch()
    dialogReVisible.value = false
}

//详细比赛数据
const detailedMatch = reactive({
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

//查询比赛详情
const queryMatchDetail = (index: number) => {
    console.log(index)
    console.log('querymatch')
    dialogTableVisible.value = true

    var service = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    service
        .get('http://43.139.128.42:9876/api/Match/getMatchDetail?match_id=' + index)
        .then((response) => {
            console.log(response.data)
            if (response.data.isSuccess) {
                console.log("详情成功ヽ(✿ﾟ▽ﾟ)ノ")
                detailedMatch.match_ID = response.data.result.match_ID
                detailedMatch.match_Name = response.data.result.match_Name
                detailedMatch.sign_Start_Time = formatDate(response.data.result.sign_Start_Time)
                detailedMatch.sign_End_Time = formatDate(response.data.result.sign_End_Time)
                detailedMatch.participants_Num = response.data.result.participants_Num
                detailedMatch.have_Participants_Num = response.data.result.have_Participants_Num
                detailedMatch.match_Introduction = response.data.result.match_Introduction
                detailedMatch.match_Start_Time = formatDate(response.data.result.match_Start_Time)
                detailedMatch.match_End_Time = formatDate(response.data.result.match_End_Time)
                if (response.data.result.board_Size === '\u0000')
                    detailedMatch.board_Size = "19x19"
                else if (response.data.result.board_Size === '\u0001')
                    detailedMatch.board_Size = "13x13"
                else if (response.data.result.board_Size === '\u0002')
                    detailedMatch.board_Size = "9x9"
                else
                    detailedMatch.board_Size = "非法尺寸"
                detailedMatch.main_Time = response.data.result.main_Time
                detailedMatch.second_Counting_Time = response.data.result.second_Counting_Time
                detailedMatch.second_Counting_Num = response.data.result.second_Counting_Num
                detailedMatch.is_Over = response.data.result.is_Over
                console.log(detailedMatch)
                console.log(response.data.result)

            }
            else
                ElMessageBox.alert(response.data.msg)
        })
        .catch((error) => {
            console.log(error)
        })
}

//查询比赛详情标签颜色
const handleTagColor = (para: number) => {
    if (para === 1) return 'danger'
    else if (para === 0) return 'success'
    else if (para === 2) return ''
    else if (para === 3) return 'warning'
    else return 'info'
}

//要修改的
const wannaModify = reactive({
    "user_ID": 0,
    "nickname": "string",
    "current_Score": 0,
    "ranking": 0
})

const modifyIndex = ref(0)

//暂存想要修改的信息
const saveWannaModifiedRank = (param: object, index: number) => {
    console.log("暂存修改排序")
    console.log(param, index)
    modifyIndex.value = index
    console.log(modifyIndex)
    wannaModify.user_ID = param.user_ID
    wannaModify.nickname = param.nickname
    wannaModify.current_Score = param.current_Score
    wannaModify.ranking = param.ranking
    dialogFormVisible.value = true
}

//修改
const modifyRank = () => {
    console.log("修改！！！")
    console.log(modifyIndex.value)
    console.log(matchRank.value[modifyIndex.value])
    if (matchRank.value[modifyIndex.value].user_ID === wannaModify.user_ID &&
        matchRank.value[modifyIndex.value].nickname === wannaModify.nickname) {
        matchRank.value[modifyIndex.value].ranking = wannaModify.ranking
        matchRank.value[modifyIndex.value].current_Score = wannaModify.current_Score
        matchRank.value.sort(function (a, b) {
            return a.ranking - b.ranking
        })
    }
    else {
        ElMessageBox.alert("修改失败了！/(ㄒoㄒ)/~~")
    }
    dialogFormVisible.value = false
    refreshRank()
}

//刷新弹出框表单
const refreshRank = () => {
    console.log("改变了需要刷新！")
    dialogTblVisible.value = false
    dialogTblVisible.value = true
}

//排名
const matchRank = reactive({
    "user_ID": 0,
    "nickname": "string",
    "current_Score": 0,
    "ranking": 0
})

const modifiedMatchIndex = ref(0)

//获取当前比赛结果
const getMatchResult = (index: number) => {
    console.log('publishresult')
    modifiedMatchIndex.value = index

    var svc = axios.create({
        headers: {
            // 设置后端需要的传参类型
            'Authorization': 'bearer ' + localStorage.getItem('token')
        }
    })

    svc.get("http://43.139.128.42:9876/api/Match/getRank?match_id=" + index).then(res => {
        console.log(res.data)
        if (res.data.isSuccess) {
            console.log("成功获取rank")
            matchRank.value = res.data.result
            console.log(matchRank.value)
            dialogTblVisible.value = true
        }
        else
            ElMessageBox.alert(res.data.msg)
    })
        .catch((error) => {
            console.log(error)
        })
}

//发布修改后的结果
const publishMatchRank = () => {
    console.log("发布修改后的结果")
    console.log(matchRank)
    console.log(matchRank.value)
    console.log(modifiedMatchIndex)

    let len = matchRank.value.length

    while (len) {
        let data = JSON.parse(JSON.stringify([matchRank.value[len - 1]]))
        console.log(data)

        var service = axios.create({
            headers: {
                // 设置后端需要的传参类型
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token')
            }
        })

        service.post("http://43.139.128.42:9876/api/Admin/publishResult?match_id=" + modifiedMatchIndex.value, data)
            .then(res => {
                console.log(res.data)
                if (res.data.isSuccess) {
                    console.log(matchRank.value[len - 1] + "发布成功！")
                }
                else
                    ElMessageBox.alert(res.data.msg)
            })
            .catch((error) => {
                console.log(error)
            })
        len--
    }
    console.log("发布全部成功啊啊啊啊！")
    dialogTblVisible.value = false
    refreshMatch()
    ElMessage('成功，请刷新！')
}

//格式化时间
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

//详情弹出框可见性
const dialogTableVisible = ref(false)

//发布弹出框可见性
const dialogTblVisible = ref(false)

//修改结果弹出框可见性
const dialogFormVisible = ref(false)

//刷新弹出框可见性
const dialogReVisible = ref(false)

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

.slider-demo-block {
    display: flex;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}

.text-gray-500 {
    margin-left: 20px;
    margin-right: 20px;
}

.text-wrapper {
    word-break: break-all;
    word-wrap: break-word
}

.block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.block:last-child {
    border-right: none;
}

.block .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}

/* #building {
    background: url("../assets/bgblue.jpg");
    width: 100%;
    height: 100%;
    position: fixed;
    background-size: 100% 100%;
    margin-left: -20px;
} */

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/bgblue.jpg");
}
</style>