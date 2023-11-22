<template>
<div class="container" v-if="state === 1">
    <el-row>
        <!-- 左侧棋盘 -->
        <el-col :span="16" class="goban-container">
            <goban
                :showCoordinates="true"
                :boardSize="boardSize"
                mode="game"
                :maxHeight="850"
                :maxWidth="850"
                :canPlaceStoneTag="canPlaceStoneTag"
                :signMap="map"
                :currentColor="currentColor"
                :stepInfo="stepInfo"
                :pauseTag="pauseTag"
                :canSendStepTag="canSendStepTag"
                ref="mygoban"
            ></goban>
        </el-col>
        <!-- 右侧数据信息 -->
        <el-col :span="8">
          <h3>玩家对局: {{game_info['game_Name']}}</h3>



          <el-row>
            <el-col :span="12">
              <el-card class="black-card">
                <el-row style="margin-top: -20%;margin-left: -20%;">
                  <el-col :span="6" ><img :src="require('@/assets/default.png')" class="responsive-img"/></el-col>
                  <el-col :span="10" :push="1">
                    <el-row>{{ blackName }}</el-row>
                    <el-row>{{ helper.getRank(blackScore) }}</el-row>
                  </el-col>
                  <el-col :span="5" :push="7">{{ blackIsWho }}</el-col>
                </el-row>
                <!-- 倒计时 -->
                <el-row style="margin-left: -20%;margin-right: -20%;margin-bottom: -10%;">
                  <el-col :span="8" ><countdown :mainTime="blackMainTime" :start="true" ref="blackTimer"></countdown></el-col>
                  <el-col :span="8" :push="1" style="margin-top: 2.5%;">{{ blackSecondCountingTime }}秒  {{ blackSecondCountingNum }}次</el-col>
                </el-row>
                
                <!-- <el-button @click="blackTimer.setTime(20)"></el-button> -->
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="white-card">
                <el-row style="margin-top: -20%;margin-left: -20%;">
                  <el-col :span="6" ><img :src="require('@/assets/default.png')" class="responsive-img"/></el-col>
                  <el-col :span="10" :push="1">
                    <el-row>{{ whiteName }}</el-row>
                    <el-row>{{ helper.getRank(whiteScore) }}</el-row>
                  </el-col>
                  <el-col :span="5" :push="7">{{ whiteIsWho }}</el-col>
                </el-row>
                <!-- 倒计时 -->
                <el-row style="margin-left: -20%;margin-right: -20%;margin-bottom: -10%;">
                  <el-col :span="8"><countdown :mainTime="whiteMainTime" :start="false" ref="whiteTimer"></countdown></el-col>
                  <el-col :span="8" :push="1" style="margin-top: 2.5%;">{{ whiteSecondCountingTime }}秒  {{ whiteSecondCountingNum }}次</el-col>
                </el-row>


              </el-card>
            </el-col>
          </el-row>



          <h1>轮到{{ canPlaceStoneTag[0] && currentColor === 1 || !canPlaceStoneTag[0] && currentColor === -1 ?('黑'):('白') }}方落子</h1>

          <el-button type="primary" @click="pause">息手</el-button>
          <el-button type="danger" @click="resign">认输</el-button>
          <!-- <el-button @click="console.log(mygoban.canPlaceStoneTag[0])">111</el-button>
          <el-button @click="console.log(canPlaceStoneTag[0])">222</el-button>
          <el-button @click="canPlaceStoneTag[0]=true">333</el-button>
          <el-button @click="canPlaceStoneTag[0]=false">444</el-button> -->
          <!-- <el-button @click="console.log(map)">2</el-button> -->
          <!-- <el-button @click="console.log(stepInfo)">3</el-button> -->


          <!-- 聊天框 -->
          <div class="chat-container">
            <el-card class="chat-window">
              <div class="message" v-for="(message, index) in messages" :key="index">
                <span class="sender">{{ message.name }}</span>[{{ message.rank }}] : {{ message.content }}
              </div>
            </el-card>

            <el-row class="input-container">
              <el-col :span="19">
                <el-input v-model="content" placeholder="输入要发送的信息..." />
              </el-col>
              <el-col :span="4">
                <el-button type="success" @click="SendChatMessage">发送</el-button>
              </el-col>
            </el-row>
          </div>



        </el-col>
    </el-row>
</div>
<div v-if="state === 0">
  <h1>你的申请正在等待被接受</h1>
  <el-button @click="cancelApply">取消申请</el-button>
</div>
<div v-if="state === 2">
  <h1>没有对局也没有申请</h1>
  <el-button @click="gotoApply">去申请</el-button>
</div>
</template>




<script>
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import helper from '../components/helper.js';
import {ref, watch, nextTick, onMounted} from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from "vue-router";
import countdown from '../components/CountDown.vue'



export default{
    components:{
      countdown
    },

    beforeRouteLeave(to, from, next) {
      // 在离开页面之前执行的逻辑
      if (this.state === 1) {
        // 阻止离开
        ElMessageBox.alert('正在对局中，请勿离开当前页面', '提示', {
          confirmButtonText: '确认',
        }).then(() => {
              
            })
            .catch(() => {

            })
        next(false);
      } else {
        // 允许离开
        next();
      }
    },
  
    setup(){
      const router = useRouter();
      const map=ref([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]);

      const state=ref();//页面状态，据此显示不同组件
      const hubConnection=ref();//sigbalr连接
      const blackTimer=ref();//黑白双方倒计时组件的ref
      const whiteTimer=ref();

      const game_info={
        game_ID:null,
        game_Name:null,
        self_Name:null,
        other_Name:null,
        self_Score:null,
        other_Score:null,
        self_ID:null,
        other_ID:null,
        step_Info:null,
        board_Size:null,
        self_Color:null,
        other_Color:null,
        main_Time:null,
        second_Counting_Time:null,
        second_Counting_Num:null
      };
      const boardSize=ref();
      const stepInfo=ref([]);
      const blackMainTime=ref();
      const blackSecondCountingTime=ref();
      const blackSecondCountingNum=ref();
      const whiteMainTime=ref();
      const whiteSecondCountingTime=ref();
      const whiteSecondCountingNum=ref();
      const canPlaceStoneTag=ref([false]);
      const currentColor=ref();
      const pauseTag=ref(false);
      const canSendStepTag=ref([false]);
      const timerInterval=null;//定时器标识，用于停止定时器
      const sendStepTagInterval=null;



      const mygoban=ref();//接受步骤信息后要将最新一步插入棋盘中，需要调用goban组件内部方法
      const messages=ref([]);//所有聊天信息
      const content=ref();//当前发送框里的聊天信息
      return{
        mygoban,//棋盘组件的ref
        map,//棋盘信息
        hubConnection,//SignalR连接
        state,//状态，0有申请 1有对局 2都没有
        blackTimer,
        whiteTimer,
        router,
        helper,
        game_info,
        
        boardSize,
        stepInfo,
        blackMainTime,
        blackSecondCountingTime,
        blackSecondCountingNum,
        whiteMainTime,
        whiteSecondCountingTime,
        whiteSecondCountingNum,
        canPlaceStoneTag,
        currentColor,
        pauseTag,
        canSendStepTag,
        timerInterval,
        sendStepTagInterval,
        messages,
        content,

        blackName:null,//双方卡片信息显示变量
        whiteName:null,
        blackScore:null,
        whiteScore:null,
        blackIsWho:null,
        whiteIsWho:null,

      }
    },

    created() {
      this.checkState();//进入页面首先检查state状态
    },



  methods: {
    checkState() {//调接口检查state值，页面根据state值显示
      const service = axios.create({
        headers: {
          'Authorization': 'bearer ' + localStorage.getItem('token')
        }
      });

      service.get("http://43.139.128.42:9876/api/Game/checkState")
        .then(res => {
          if (res.data.isSuccess) {
            //this.state = res.data.result;
            console.log('state:'+res.data.result)
            if (res.data.result === 0) {                          
              // 如果state等于0（有申请），继续轮询等待申请被接受
              this.state=0;
              setTimeout(() => {
                this.checkState();
              }, 5000); // 5秒钟调用一次
            }
            else if(res.data.result === 1){//有对局，页面初始化
              this.pageInit();                                      //这里问题在于，由于棋盘有些数据响应绑定不好，所以先进行init相关数据，
            }                                                       //在pageInit()函数最后再赋值state=1，直接渲染正确数据，防止盘面错位等
            else{
              this.state=2;
            }
          } else {
            ElMessageBox.alert(res.data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },


    cancelApply(){//取消申请
      ElMessageBox.confirm(
        '确定要取消对局申请吗',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '返回',
          type: 'warning',
        }
      )
      .then(() => {//点击确认
        const service = axios.create({
          headers: {
            'Authorization': 'bearer ' + localStorage.getItem('token')
          }
        });

        service.get("http://43.139.128.42:9876/api/Game/deleteGame")
          .then(res => {
            if(res.data.isSuccess){
              ElMessage({
                type: 'success',
                message: res.data.result,
              })
              //console.log(res.data);
              this.checkState();
            }
            else{
              ElMessage({
                type: 'error',
                message: res.data.result,
              })
            }
          })
          .catch((error) => {
          console.log(error);
        });

        
      })
      .catch(() => {//单击返回
        
      })
    },


    gotoApply(){//跳转申请页面
      this.router.push('/player/apply');
    },



    pageInit(){//获取对局信息赋值game_info存储，并建立websocket连接，同时初始化页面相关数据
      const service = axios.create({
        headers: {
          'Authorization': 'bearer ' + localStorage.getItem('token')
        }
      });

      service.get("http://43.139.128.42:9876/api/Game/getGamePlaying")
        .then(res => {
          this.game_info=res.data.result;
          console.log(this.game_info);

          this.connectSignalR();//连接SignalR（websocket方式）

          this.currentColor=this.game_info['self_Color'];//棋盘赋值棋色、尺寸
          if(this.game_info['board_Size'] === '\u0000')
            this.boardSize=19;
          else if(this.game_info['board_Size'] === '\u0001')
            this.boardSize=13;
          else if(this.game_info['board_Size'] === '\u0002')
            this.boardSize=9; 
          //console.log("board"+this.boardSize);


          this.blackMainTime=this.game_info['main_Time'] * 60;//转换成秒数
          this.whiteMainTime=this.game_info['main_Time'] * 60;
          this.blackSecondCountingTime=this.game_info['second_Counting_Time'];
          this.whiteSecondCountingTime=this.game_info['second_Counting_Time'];
          this.blackSecondCountingNum=this.game_info['second_Counting_Num'];
          this.whiteSecondCountingNum=this.game_info['second_Counting_Num'];
          console.log('blackMainTime'+this.blackMainTime)
          console.log('whiteMainTime'+this.whiteMainTime)
          console.log('blackSecondCountingTime'+this.blackSecondCountingTime)

          if(this.game_info['self_Color'] === 1){//自己执黑时的初始化
            this.blackName=this.game_info['self_Name'];
            this.blackScore=this.game_info['self_Score'];
            this.blackIsWho='我';
            this.whiteName=this.game_info['other_Name'];
            this.whiteScore=this.game_info['other_Score'];
            this.whiteIsWho='对手';
          }
          else{//自己执白时的初始化
            this.whiteName=this.game_info['self_Name'];
            this.whiteScore=this.game_info['self_Score'];
            this.whiteIsWho='我';
            this.blackName=this.game_info['other_Name'];
            this.blackScore=this.game_info['other_Score'];
            this.blackIsWho='对手';
          }


          if(this.currentColor === 1)//执黑先下
            this.canPlaceStoneTag[0]=true;
          
          
          

          this.state=1;//！！！！赋值state，然后才渲染对局相关的组件（棋盘，信息窗等）！！！！

          this.checkCanSendStepTag()//由于监听使用失败，只能以定时器检测发送步骤信息tag
          this.checkTimer()//检测倒计时何时归零
        })
        .catch((error) => {
          console.error(error);
          ElMessage.error("获取当前对局失败");
        });
        
    },


    pageOver(){//对局结束后的操作
      this.state=2;
      clearInterval(this.timerInterval);//关闭定时器
      clearInterval(this.sendStepTagInterval);

      this.hubConnection.invoke("LeaveGameRoom", this.game_info['game_ID'])//切断signalR连接
        .then(() => {
            console.log(`离开对局室 ${this.game_info['game_ID']}`);
        })
        .catch((error) => {
            console.error(`离开对局室失败 ${this.game_info['game_ID']}:`, error);
        });
    },


    connectSignalR(){//连接websocket
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`http://43.139.128.42:9876/gameHub?game_id=${this.game_info['game_ID']}`,
          {skipNegotiation:true,
          transport: HttpTransportType.WebSockets}
        )
        .build();

      const self=this;//箭头函数里没有this，在此声明！！！！！

      this.hubConnection.on("ReceiveGameStep", (game_id, info) => {//接收到步骤信息时的处理函数
        const data=JSON.parse(info);
        const lastStep=data['stepInfo'][data['stepInfo'].length - 1];
        this.stepInfo.push(lastStep);
        const judgeResult=this.mygoban.judgeOtherPosition(lastStep['offset']);//调用内部方法获得死子信息
        //console.log('死子信息：'+judgeResult)
        this.map[lastStep['offset']]= - this.currentColor//对应的位置赋值为对方棋色
        if(judgeResult !== false)
          for(const off of judgeResult){//去除死棋
            this.map[off] = 0;
          }


        //console.log(666)
        //console.log(data['blackMainTime'])
        self.blackTimer.setTime(data['blackMainTime']);
        this.blackSecondCountingNum=data['blackSecondCountingNum'];
        this.blackSecondCountingTime=data['blackSecondCountingTime'];
        self.whiteTimer.setTime(data['whiteMainTime']);
        this.whiteSecondCountingNum=data['whiteSecondCountingNum'];
        this.whiteSecondCountingTime=data['whiteSecondCountingTime'];
        //console.log('当前黑倒计时：'+this.blackMainTime)
        if(this.currentColor === 1){                                    //处理倒计时
          this.whiteTimer.toggleCountdown();
          this.blackTimer.toggleCountdown();
        }
        else{
          this.blackTimer.toggleCountdown();
          this.whiteTimer.toggleCountdown();
        }
    

        //console.log(this.stepInfo)
        this.canPlaceStoneTag[0]=true;
        this.pauseTag=false;
        console.log('接收到步骤信息，可以下了:'+this.canPlaceStoneTag[0])
        //console.log("收到info:", data);
      });


      this.hubConnection.on("ReceiveCountDown", (game_id) => {//接收到读秒次数-1信息时的处理函数
        if(this.currentColor === 1){//自己为黑，则对方为白，读秒次数-1
          this.whiteSecondCountingNum=this.whiteSecondCountingNum - 1;
          self.whiteTimer.setTime(this.whiteSecondCountingTime);//设置秒数继续倒计时
          //self.whiteTimer.toggleCountdown();
        }
        else{
          this.blackSecondCountingNum=this.blackSecondCountingNum - 1;
          self.blackTimer.setTime(this.blackSecondCountingTime);//设置秒数继续倒计时
          //self.blackTimer.toggleCountdown();
          console.log('收到信息，黑棋读秒次数减一');
        }
      });


      this.hubConnection.on("ReceiveOverTime", (game_id) => {//接收到超时致输信息时的处理函数
        if(this.currentColor === 1){//自己为黑，要调用接口
          this.canPlaceStoneTag[0]=false;

          const data={
            game_Id:self.game_info['game_ID'],
            own_id:self.game_info['self_ID'],
            opposite_id:self.game_info['other_ID'],
            result_Type:1,
            result_Description:'白超时负',
            step_Info:{
              steps:JSON.parse(JSON.stringify(self.stepInfo))
            },
            board_Info:{
              board: JSON.parse(JSON.stringify(self.map))
            }

          }

          const service = axios.create({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          service
            .post("http://43.139.128.42:9876/api/Game/gameFinished", data)
            .then((response) => {
              if (response.data.isSuccess) {
                ElMessageBox.alert('白超时负，结果已上传', '对局结束', {
                  confirmButtonText: '确认',
                })
              } else {
                ElMessage.error("更新对局信息失败，不存在此对局或对局已结束");
              }
            })
            .catch((error) => {
              console.error(error);
              ElMessage.error("对局上传失败");
            });
          this.pageOver();

        }
        else{
          this.canPlaceStoneTag[0]=false;

          ElMessageBox.alert('黑超时负', '对局结束', {
            confirmButtonText: '确认',
          })
          this.pageOver();
        }
      });



      this.hubConnection.on("ReceiveResign", (game_id) => {//接收到认输信息时的处理函数
        if(this.currentColor === 1){//自己为黑，要调用接口
          this.canPlaceStoneTag[0]=false;

          const data={
            game_Id:self.game_info['game_ID'],
            own_id:self.game_info['self_ID'],
            opposite_id:self.game_info['other_ID'],
            result_Type:1,
            result_Description:'白方认输',
            step_Info:{
              steps:JSON.parse(JSON.stringify(self.stepInfo))
            },
            board_Info:{
              board: JSON.parse(JSON.stringify(self.map))
            }

          }

          const service = axios.create({
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          service
            .post("http://43.139.128.42:9876/api/Game/gameFinished", data)
            .then((response) => {
              if (response.data.isSuccess) {
                ElMessageBox.alert('白方认输，结果已上传', '对局结束', {
                  confirmButtonText: '确认',
                })
              } else {
                ElMessage.error("更新对局信息失败，不存在此对局或对局已结束");
              }
            })
            .catch((error) => {
              console.error(error);
              ElMessage.error("对局上传失败");
            });
          this.pageOver();

        }
        else{
          this.canPlaceStoneTag[0]=false;

          ElMessageBox.alert('黑方认输', '对局结束', {
            confirmButtonText: '确认',
          })
          this.pageOver();
        }
      });



      this.hubConnection.on("ReceivePause", (game_id) => {//接收到息手信息时的处理函数
        if(this.pauseTag){//息手tag为true
          if(this.currentColor === 1){//黑棋则直接计算并上传
            self.whiteTimer.toggleCountdown();
            console.log('要计算结果并上传了');     /******************这里做结果处理*******************/
          }
          else{//白棋则再发一个信息让黑棋计算
            self.SendPause();
            self.blackTimer.toggleCountdown();
          }

        }
        else{//息手标签为false，弹窗是否息手
          this.canPlaceStoneTag[0]=true;
          self.blackTimer.toggleCountdown();
          self.whiteTimer.toggleCountdown();

          ElMessageBox.confirm(
            '对方息手一步，你是否息手',
            '提示',
            {
              confirmButtonText: '息手',
              cancelButtonText: '取消',
              type: 'info',
            }
          )
            .then(() => {
              this.SendPause();

              this.canPlaceStoneTag[0]=false;
              this.pauseTag=true;
              if(this.currentColor === -1){
                self.whiteTimer.toggleCountdown();
              }
              else{
                self.blackTimer.toggleCountdown();
                self.whiteTimer.toggleCountdown();
              }
              

            })
            .catch(() => {

            })
        }
      });



      this.hubConnection.on("ReceiveChatMessage", (game_id, name, score, content) => {//接收到聊天信息时的处理函数
        self.messages.push({name:name,rank:helper.getRank(score),content:content});
      });



      // 连接到服务器
      this.hubConnection
        .start()
        .then(() => {
          console.log("SignalR连接已建立");
          this.hubConnection.invoke("JoinGameRoom", this.game_info['game_ID'])
          .then(() => {
              console.log(`加入对局室 ${this.game_info['game_ID']}`);
          })
          .catch((error) => {
              console.error(`加入对局室失败 ${this.game_info['game_ID']}:`, error);
          });
        })
        .catch((error) => {
          console.error("SignalR连接错误: ", error);
        });
    },

  
    sendGameStep(){//signalr发送步骤信息
      if (this.hubConnection) {
        const data={
          stepInfo:this.stepInfo,
          blackMainTime:this.blackTimer.getTime(),
          blackSecondCountingNum:this.blackSecondCountingNum,
          blackSecondCountingTime:this.blackSecondCountingTime,
          whiteMainTime:this.whiteTimer.getTime(),
          whiteSecondCountingNum:this.whiteSecondCountingNum,
          whiteSecondCountingTime:this.whiteSecondCountingTime
        };
        const info=JSON.stringify(JSON.parse(JSON.stringify(data)));
        const game_id=this.game_info['game_ID'];
        console.log(info)
        this.hubConnection.invoke("SendGameStep", game_id, info)
            .then(() => {
            console.log("步骤信息已发送");
            })
            .catch((error) => {
            console.error("步骤信息发送失败", error);
            });
      }
    },

    SendCountDown(){//signalr发送读秒次数-1信息
      if (this.hubConnection) {
        const game_id=this.game_info['game_ID'];
        this.hubConnection.invoke("SendCountDown", game_id)
            .then(() => {
            console.log("读秒次数-1信息已发送");
            })
            .catch((error) => {
            console.error("读秒次数-1信息发送失败", error);
            });
      }
    },

    SendOverTime(){//发送超时致输信息
      if (this.hubConnection) {
        const game_id=this.game_info['game_ID'];
        this.hubConnection.invoke("SendOverTime", game_id)
            .then(() => {
            console.log("超时致输信息已发送");
            })
            .catch((error) => {
            console.error("超时致输信息发送失败", error);
            });
      }
    },


    SendResign(){//发送认输信息
      if (this.hubConnection) {
        const game_id=this.game_info['game_ID'];
        this.hubConnection.invoke("SendResign", game_id)
            .then(() => {
            console.log("认输信息已发送");
            })
            .catch((error) => {
            console.error("认输信息发送失败", error);
            });
      }
    },


    SendPause(){//发送息手信息
      if (this.hubConnection) {
        const game_id=this.game_info['game_ID'];
        this.hubConnection.invoke("SendPause", game_id)
            .then(() => {
            console.log("息手信息已发送");
            })
            .catch((error) => {
            console.error("息手信息发送失败", error);
            });
      }
    },



    resign(){//认输
      this.canPlaceStoneTag[0]=false;
      this.SendResign();//发送信息
      if(this.currentColor === 1){//为黑棋则上传结果
        const self=this;
        const data={
          game_Id:self.game_info['game_ID'],
          own_id:self.game_info['self_ID'],
          opposite_id:self.game_info['other_ID'],
          result_Type:0,
          result_Description:'黑方认输',
          step_Info:{
            steps:JSON.parse(JSON.stringify(self.stepInfo))
          },
          board_Info:{
            board: JSON.parse(JSON.stringify(self.map))
          }

        }

        const service = axios.create({
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        service
          .post("http://43.139.128.42:9876/api/Game/gameFinished", data)
          .then((response) => {
            if (response.data.isSuccess) {
              ElMessageBox.alert('黑方认输，结果已上传', '对局结束', {
                confirmButtonText: '确认',
              })
            } else {
              ElMessage.error("更新对局信息失败，不存在此对局或对局已结束");
            }
          })
          .catch((error) => {
            console.error(error);
            ElMessage.error("对局上传失败");
          });
      }
      else{//为白棋则弹窗
        ElMessageBox.alert('白方认输', '对局结束', {
          confirmButtonText: '确认',
        })
      }


      this.pageOver();
    },


    pause(){//息手
      this.canPlaceStoneTag[0]=false;
      this.pauseTag=true;
      this.blackTimer.toggleCountdown();
      this.whiteTimer.toggleCountdown();

      this.SendPause();
    },



    SendChatMessage(){//发送聊天信息
      if(this.content){//不等于空才可发送
        if (this.hubConnection) {
          const game_id=this.game_info['game_ID'];
          const name=this.game_info['self_Name'];
          const score=this.game_info['self_Score'];
          const content=this.content;
          this.hubConnection.invoke("SendChatMessage", game_id, name, score, content)
              .then(() => {
              console.log("聊天信息已发送");
              })
              .catch((error) => {
              console.error("聊天信息发送失败", error);
              });
        }


        this.content='';//清空
      }
    },
    
    

    //！！！！！！！定时器都在pageInit()末尾执行
                                                                     

    checkCanSendStepTag(){//监听canSendStepTag发送信息的定时器替代版
      this.sendStepTagInterval = setInterval(() => {
        if (this.canSendStepTag[0] === true) {
          this.sendGameStep();
          this.canSendStepTag[0] = false; // 将其设置回 false

          if(this.currentColor === 1){//暂停倒计时
            this.blackTimer.toggleCountdown();
            this.whiteTimer.toggleCountdown();
          }
          else{
            this.whiteTimer.toggleCountdown();
            this.blackTimer.toggleCountdown();
          }
        }
      }, 1000); // 间隔为1秒
    },

    checkTimer(){//定时器监听倒计时是否归零
      this.timerInterval = setInterval(()=>{
        const blackTime = this.blackTimer.getTime();
        const whiteTime = this.whiteTimer.getTime();

        if(blackTime === 0 && this.currentColor === 1){     //自己是黑棋，且倒计时归零
          if(this.blackSecondCountingNum > 0){//还有读秒次数
            this.blackSecondCountingNum=this.blackSecondCountingNum - 1;
            this.blackTimer.setTime(this.blackSecondCountingTime);//设置秒数继续倒计时
            //this.blackTimer.toggleCountdown();

            this.SendCountDown();//发送读秒次数-1信息
            console.log('黑棋读秒一次');
          }
          else{//没有读秒次数，超时判负，告诉对方，为黑方则调接口结束对局上传信息，结束页面
            this.canPlaceStoneTag[0]=false;
            this.SendOverTime();

            const self=this;
            const data={
              game_Id:self.game_info['game_ID'],
              own_id:self.game_info['self_ID'],
              opposite_id:self.game_info['other_ID'],
              result_Type:0,
              result_Description:'黑超时负',
              step_Info:{
                steps:JSON.parse(JSON.stringify(self.stepInfo))
              },
              board_Info:{
                board: JSON.parse(JSON.stringify(self.map))
              }

            }

            const service = axios.create({
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            service
              .post("http://43.139.128.42:9876/api/Game/gameFinished", data)
              .then((response) => {
                if (response.data.isSuccess) {
                  ElMessageBox.alert('黑超时负，结果已上传', '对局结束', {
                    confirmButtonText: '确认',
                  })
                } else {
                  ElMessage.error("更新对局信息失败，不存在此对局或对局已结束");
                }
              })
              .catch((error) => {
                console.error(error);
                ElMessage.error("对局上传失败");
              });
            this.pageOver();

          }
        }
        else if(whiteTime === 0 && this.currentColor === -1){
          if(this.whiteSecondCountingNum > 0){
            this.whiteSecondCountingNum=this.whiteSecondCountingNum - 1;
            this.whiteTimer.setTime(this.whiteSecondCountingTime);//设置秒数继续倒计时
            //this.whiteTimer.toggleCountdown();

            this.SendCountDown();//发送读秒次数-1信息
          }
          else{
            this.canPlaceStoneTag[0]=false;
            this.SendOverTime();

            ElMessageBox.alert('白超时负', '对局结束', {
              confirmButtonText: '确认',
            })
            this.pageOver();
          }
        }
      },1000)//1秒
    }

  },
}
</script>




<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%; /* 设置容器高度为100%，以充分利用可用空间 */
}

.goban-container {
  flex: 1; /* 使Goban容器填充剩余的可用空间 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.black-card {
  background: linear-gradient(to bottom, #757474, #000000);
  color: white; /* 文字颜色，可以根据需要更改 */
  border: none; /* 移除默认边框 */
  padding: 20px;
  margin: 10px;
  display: flex;
}

.white-card {
  background: linear-gradient(to bottom, #cdcbcb, #ffffff);
  color: black; /* 文字颜色，可以根据需要更改 */
  border: none; /* 移除默认边框 */
  padding: 20px;
  margin: 10px;
  display: flex;
}

.responsive-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}



.chat-container {
    display: flex;
    flex-direction: column;
    height: 65vh;
  }
  
  .chat-window {
    flex-grow: 1;
    overflow-y: scroll;
    margin-bottom: 10px;
  }
  
  .message {
    margin-bottom: 10px;
    text-align: left;
  }
  
  .sender {
    font-weight: bold;
    margin-right: 5px;
    color: rgb(20, 156, 240);
  }

  .input-container {
  display: flex;
  gap: 10px;
}
</style>