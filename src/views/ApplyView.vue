<template>
  <el-scrollbar height="95vh">
  <div class="BkBox">
    <h1 style="padding-top: 50px;">对局申请</h1>
  </div>
 
  <span>
    <el-button @click="dialogVisible = true" type="primary">
      创建新的对局
    </el-button>
    <el-button @click="refreshInfo">刷新</el-button>
    <div style="margin-left: 100px; display: inline-block; margin-top: 2% ">
      <el-statistic  title="总数" :value="length !== undefined && length !== null ? length : -1">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em ">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </div>
  </span>
  <!--已有对局-->
  <el-divider />
  <span>
    <el-card style="width: 90%; height: 50%; margin-left: 5% ; margin-right: 5%">
      <el-table v-if="Array.isArray(Info)" ref="multipleTableRef" :data="Info" style="width: 100%"  @vue:mounted="getAllApply"  height="600">
        <el-table-column fixed prop="game_Name" label="对局名称" width="150" align="center" sortable />
        <el-table-column prop="nickname" label="发起人" align="center" sortable />
        <el-table-column prop="main_Time" label="主时间" align="center" sortable />
        <el-table-column prop="board_Size" label="棋盘大小" align="center" sortable />
        <el-table-column prop="second_Counting_Time" label="读秒时间" align="center" sortable />
        <el-table-column prop="second_Counting_Num" label="读秒次数" align="center" sortable />
        <el-table-column fixed="right" label="" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" @click="acceptGame(scope.row.application_ID)">enter</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="center">
        <div class="hexagon">
        </div>
        <div class="box">
        </div>
        <div class="stars" ref="starsRef">
          <div class="star" v-for="(item, index) in starsCount" :key="index"></div>
        </div>
      </div> -->
    </el-card>
  </span>
  <!--创建对局-->
  <el-dialog v-model="dialogVisible" title="创建对局" width="30%" :before-close="handleClose">
    <span>
      <el-form :model="ruleForm" label-width=30% status-icon ref="ruleFormRef" :rules="rules">
        <el-form-item label="对局名称" prop="name">
          <el-input v-model="ruleForm.name" clearable type="text" :rows="1" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="棋盘大小" prop="size">
          <el-select v-model="ruleForm.size" placeholder="请选择您需要的大小">
            <el-option label="9x9" value=2 />
            <el-option label="13x13" value=1 />
            <el-option label="19x19" value=0 />
          </el-select>
        </el-form-item>
        <el-form-item label="您执">
          <el-select v-model="ruleForm.color" placeholder="请选择您需要的大小">
            <el-option label="黑子" :value=1 />
            <el-option label="白子" :value=-1 />
          </el-select>
        </el-form-item>
        <el-form-item label="私密">
          <el-switch v-model="ruleForm.is_private" />
        </el-form-item>

        <el-form-item label="主时间" prop="time">
          <el-input-number v-model="ruleForm.time" :step="5" :min="1" :max="999999" />
          <div style="margin-left: 30px;">分钟</div>
        </el-form-item>
        <el-form-item label="分数上限" prop="highest_score">
          <el-input-number v-model="ruleForm.highest_score" :step="1" :min="1" :max="99999" />
          <div style="margin-left: 30px;">分</div>
        </el-form-item>
        <el-form-item label="分数下限" prop="lowest_score">
          <el-input-number v-model="ruleForm.lowest_score" :step="5" :min="1" :max="99999" />
          <div style="margin-left: 30px;">分</div>
        </el-form-item>
        <el-form-item label="读秒次数" prop="counting_num">
          <el-input-number v-model="ruleForm.counting_num" :step="1" :min="1" :max="999" />
          <div style="margin-left: 30px;">次</div>
        </el-form-item>
        <el-form-item label="读秒时间" prop="counting_time">
          <el-input-number v-model="ruleForm.counting_time" :step="5" :min="1" :max="99999" />
          <div style="margin-left: 30px;">秒</div>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              创建对局
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </span>
  </el-dialog>
</el-scrollbar>
</template>
  
<script lang="ts" setup>

import axios from 'axios'
import { ElMessageBox } from 'element-plus';
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from "vue-router";

import dayjs from 'dayjs'
import { number } from 'echarts';

import { onMounted } from "vue";

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
//获取对局数据
// const Info = reactive({
//   "application_ID": '',
//   "nickname": '',
//   "game_Name": '',
//   "board_Size": "1",
//   "main_Time": '',
//   "second_Counting_Time": '',
//   "second_Counting_Num": ''
// })

const router = useRouter();


const Info = ref([])

const length = ref()

const form = reactive({
  "game_name": "",
  "board_size": "",
  "main_time": 0,
  "second_counting_time": 0,
  "second_counting_num": 0,
  "highest_score": 0,
  "lowest_score": 0,
  "color": 0,
  "is_private": 1,
})

interface Form {
  name: string
  size: string
  time: number
  counting_time: number
  counting_num: number
  highest_score: number
  lowest_score: number
  color: number
  is_private: boolean
}

const ruleForm = reactive<Form>({
  name: '',
  size: '',
  time: 0,
  counting_time: 0,
  counting_num: 0,
  highest_score: 1000,
  lowest_score: 0,
  color: 1,
  is_private: false,
})

//检查分数
const checktime1 = (rule: any, value: any, callback: any) => {
  if (value === '' || value === null) {
    callback(new Error('主时间为必填项！'))
  } else {
    if (ruleForm.time <= 0 || ruleForm.time > 1000000) {
      callback(new Error('主时间应该大于0且小于1000000！'))
    }
    callback()
  }
}

const checktime2 = (rule: any, value: any, callback: any) => {
  if (value === '' || value === null) {
    callback(new Error('读秒次数为必填项！'))
  } else {
    if (ruleForm.counting_num <= 0 || ruleForm.counting_num > 1000) {
      callback(new Error('读秒次数应该大于0且小于1000！'))
    }
    callback()
  }
}

const checktime3 = (rule: any, value: any, callback: any) => {
  if (value === '' || value === null) {
    callback(new Error('读秒时间为必填项！'))
  } else {
    if (ruleForm.counting_time <= 0 || ruleForm.counting_time > 100000) {
      callback(new Error('读秒时间应该大于0且小于100000！'))
    }
    callback()
  }
}
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<Form>>({
  name: [{ required: true, message: '对局名称为必填项！', trigger: 'blur' },],
  size: [{ required: true, message: '棋盘大小为必选项！', trigger: 'blur' },],
  time: [{ required: true, message: '主时间为必填项！', trigger: 'blur' }, { validator: checktime1, trigger: 'blur' },],
  counting_num: [{ required: true, message: '读秒次数为必填项！', trigger: 'blur' }, { validator: checktime2, trigger: 'blur' },],
  counting_time: [{ required: true, message: '读秒时间为必填项！', trigger: 'blur' }, { validator: checktime3, trigger: 'blur' },],
  color: [{ required: true, message: '执子颜色为必填项！', trigger: 'blur' },],
})


const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const getAllApply = () => {
  var service = axios.create({
    headers: {
      // 
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })
  service.get("http://43.139.128.42:9876/api/Game/getAllApply").then(res => {
    //console.log(res.data)
    if (res.data.isSuccess) {
      //console.log("获取数据成功！")
      Info.value = res.data.result
      for (let i = 0; i < res.data.result.length; i++) {
        if (Info.value[i].board_Size === '\u0000') {
          Info.value[i].board_Size = '19x19'
        }
        if (Info.value[i].board_Size === '\u0001') {
          Info.value[i].board_Size = '13x13'
        }
        if (Info.value[i].board_Size === '\u0002') {
          Info.value[i].board_Size = '9x9'
        }
      }
      length.value = res.data.result.length
      //console.log(Info.value)

    }
    else
      ElMessageBox.alert(res.data.msg)
  })
    .catch((error) => {
      console.log(error)
    })
}

const refreshInfo = () => {
  //console.log("刷新")
  Info.value = []
  getAllApply()
  Info.value = false
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      form.board_size = ruleForm.size
      form.color = ruleForm.color
      form.game_name = ruleForm.name
      form.highest_score = ruleForm.highest_score
      if (ruleForm.is_private === true) {
        form.is_private = 1
      }
      else {
        form.is_private = 0
      }
      form.lowest_score = ruleForm.lowest_score
      form.main_time = ruleForm.time
      form.second_counting_num = ruleForm.counting_num
      form.second_counting_time = ruleForm.counting_time
      let data = JSON.parse(JSON.stringify(form))
      //console.log(data)
      var service = axios.create({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + localStorage.getItem('token')
        }
      })
      service.post("http://43.139.128.42:9876/api/Game/applyGame", form).then(res => {
        //console.log(res.data)
        if (res.data.isSuccess) {
          //console.log("创建成功!")

          router.push('/player/game')
        }
        else
          ElMessageBox.alert(res.data.msg)
      })
        .catch((error) => {
          console.log(error)
        })
    }
  })
  dialogVisible.value = false
  refreshInfo()
}
const ID = ref()
const acceptGame = (index: number) => {
  //console.log(index)
  var service = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + localStorage.getItem('token')
    }
  })
  service.post("http://43.139.128.42:9876/api/Game/acceptGame?apply_id=" + index).then(res => {
    //console.log(res.data)
    if (res.data.isSuccess) {
      //console.log("接受成功!")

      router.push('/player/game')
    }
    else
      ElMessageBox.alert(res.data.msg)
  })
    .catch((error) => {
      console.log(error)
    })
}

const centerDialogVisible = ref(false)

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你要关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style scoped>
/* @import '../styles/movebox.css'; */

.dialog-footer button:first-child {
  margin-right: 10px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.BkBox{
  width:100%;
  height:200px;
  background-image: url("../assets/ApplyGame_bk.png");
}
</style>