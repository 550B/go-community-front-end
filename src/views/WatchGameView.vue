<template>
<div class="container" v-if="state === 1">
    <el-row>
        <!-- 左侧棋盘 -->
        <el-col :span="16" class="goban-container">
            <goban
                :showCoordinates="true"
                :boardSize="boardSize"
                mode="watch"
                :maxHeight="800"
                :maxWidth="800"
                :canPlaceStoneTag="[false]"
                :signMap="map"
                :stepInfo="stepInfo"
                ref="mygoban"
            ></goban>
        </el-col>

        <!-- 右侧数据信息 -->
        <el-col :span="8">
          <h3>观看对局: {{game_info['game_Name']}}</h3>

          <el-row>

            <el-col :span="12">
              <el-card class="black-card">
                <el-row style="margin-top: -20%;margin-left: -20%;">
                  <el-col :span="6" ><img :src="require('@/assets/default.png')" class="responsive-img"/></el-col>
                  <el-col :span="10" :push="1">
                    <el-row>{{ blackName }}</el-row>
                    <el-row>{{ helper.getRank(blackScore) }}</el-row>
                  </el-col>
                </el-row>
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
                </el-row>
              </el-card>
            </el-col>

          </el-row>

          <h1>轮到{{ stepInfo.length===0?'': (stepInfo[stepInfo.length-1]['color'] === 1?'白':'黑') }}方落子</h1>
          <div style="height: 5vh;"></div>

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
</template>



<script>
import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr";
import helper from '../components/helper.js';
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue'


export default{
  beforeRouteLeave(to, from, next) {
      // 在离开页面之前执行的逻辑
      const game_id=parseInt(this.router.currentRoute.value.params.gameId);
      this.hubConnection.invoke("LeaveGameRoom", game_id)
      .then(() => {
          console.log(`离开对局室 ${game_id}`);
          next();
      })
      .catch((error) => {
          console.error(`离开对局室失败 ${game_id}:`, error);
      });
      
    },


    setup(){
        const router = useRouter();
        const game_info={
            board_Size:null,
            game_ID:null,
            game_Name:null,
            nickname1:null,
            nickname2:null,
            step_Info:null,
            user1_ID:null,
            user1_Color:null,
            user1_Score:null,
            user2_ID:null,
            user2_Color:null,
            user2_Score:null,
        };
        const self_info={
            current_Score:null,
            nickname:null,
        }
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

        const hubConnection=ref();//sigbalr连接
        const boardSize=ref();
        const stepInfo=ref([]);
        const mygoban=ref();
        const messages=ref([]);//所有聊天信息
        const content=ref();//当前发送框里的聊天信息
        const mapMemory=ref([]);//每一步棋的棋盘信息记录


        const state=ref(0);
        return{
            helper,
            router,
            game_info,
            self_info,
            map,
            hubConnection,
            boardSize,
            stepInfo,
            mygoban,
            messages,
            content,
            mapMemory,


            blackName:null,//双方卡片信息显示变量
            whiteName:null,
            blackScore:null,
            whiteScore:null,

            state
        }
    },


    created(){//获取接口数据，连接sigalr
        this.pageInit();
        this.connectSignalR();
    },


    methods:{
        pageInit(){//先调接口获取信息，赋值完成后再修改state=1渲染组件，是因为棋盘
            const router = useRouter();
            const service = axios.create({
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            service.get('http://43.139.128.42:9876/api/Game/getGameWatching?id='+`${router.currentRoute.value.params.gameId}`).then(res => {
                //console.log(res.data.result)
                if (res.data.isSuccess) {
                    this.game_info=res.data.result;

                    if(this.game_info['board_Size'] === '\u0000')
                        this.boardSize=19;
                    else if(this.game_info['board_Size'] === '\u0001')
                        this.boardSize=13;
                    else if(this.game_info['board_Size'] === '\u0002')
                        this.boardSize=9; 

                    if(this.game_info['user1_Color'] === 1){//用户1为黑
                        this.blackName=this.game_info['nickname1'];
                        this.blackScore=this.game_info['user1_Score'];
                        this.whiteName=this.game_info['nickname2'];
                        this.whiteScore=this.game_info['user2_Score']
                    }
                    else{
                        this.blackName=this.game_info['nickname2'];
                        this.blackScore=this.game_info['user2_Score'];
                        this.whiteName=this.game_info['nickname1'];
                        this.whiteScore=this.game_info['user1_Score']
                    }
                    //console.log(this.boardSize)
                    //console.log(this.game_info)
                    this.state=1;
                }
                else{
                    ElMessage.error('获取对局失败');
                }
            
            }).catch(error => {
                console.error(error);
                ElMessage.error('获取对局失败');
            });

            service.get('http://43.139.128.42:9876/api/User/getSelfInfo').then(res => {
                if(res.data.isSuccess){
                    this.self_info=res.data.result;
                    //console.log(this.self_info)
                }
                else{
                    ElMessage.error('获取个人信息失败');
                }
            }).catch(error => {
                console.error(error);
                ElMessage.error('获取个人信息失败');
            });
        },


        connectSignalR(){//连接websocket
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(`http://43.139.128.42:9876/gameHub?game_id=${this.router.currentRoute.value.params.gameId}`,
                {skipNegotiation:true,
                transport: HttpTransportType.WebSockets}
                )
                .build();

            const self=this;//箭头函数里没有this，在此声明！！！！！

            this.hubConnection.on("ReceiveChatMessage", (game_id, name, score, content) => {//接收到聊天信息时的处理函数
                self.messages.push({name:name,rank:helper.getRank(score),content:content});
            });



            this.hubConnection.on("ReceiveGameStep", (game_id, info) => {//接收到步骤信息时的处理函数
              const data=JSON.parse(info);
              if(this.stepInfo.length < data['stepInfo'].length){//更新存储的步骤，计算并更新存储的棋盘信息
                for(let i = this.stepInfo.length;i<=data['stepInfo'].length-1;i++){
                  console.log(data['stepInfo'][i])
                  this.stepInfo.push(data['stepInfo'][i]);
                }
                  
                // console.log('传递的')
                // console.log(data['stepInfo'])
                // console.log('当前的')
                // console.log(this.stepInfo)
                for(let i = this.mapMemory.length;i<=this.stepInfo.length-1;i++){
                  const map0=new Array(this.boardSize*this.boardSize).fill(0);
                  //const map0 = null;
                  if(i !== 0){//不是赋值第一步棋盘信息，先让map0变为上一步的棋盘信息，后面再插入这一步
                    for(let t=0;t<map0.length;t++){
                      map0[t]=this.mapMemory[i-1][t];
                    }
                    //map0=[...this.mapMemory[i-1]];
                  }
                  // else{
                  //   map0 = new Array(this.boardSize*this.boardSize).fill(0);
                  // }
                  // console.log(666)

                  const judgeResult=this.judgePosition(this.stepInfo[i]['offset'],map0,this.stepInfo[i]['color']);
                  map0[this.stepInfo[i]['offset']]=this.stepInfo[i]['color'];
                  for(const off of judgeResult){
                    map0[off] = 0;
                  }

                  this.mapMemory.push([...map0]);//存储这一步的棋盘信息
                  //console.log(this.mapMemory);

                  for(let i=0;i<map0.length;i++)//最新的棋盘信息显示在棋盘
                    this.map[i]=map0[i];
                }
              }


              
            });



            // 连接到服务器
            this.hubConnection
                .start()
                .then(() => {
                    console.log("SignalR连接已建立");
                    console.log(this.hubConnection.state)
                    const game_id=parseInt(this.router.currentRoute.value.params.gameId);
                    this.hubConnection.invoke("JoinGameRoom", game_id)
                    .then(() => {
                        console.log(`加入对局室 ${this.router.currentRoute.value.params.gameId}`);
                    })
                    .catch((error) => {
                        console.error(`加入对局室失败 ${this.router.currentRoute.value.params.gameId}:`, error);
                    });
                })
                .catch((error) => {
                console.error("SignalR连接错误: ", error);
                });


        },


        SendChatMessage(){//发送聊天信息
            if(this.content){//不等于空才可发送
                if (this.hubConnection) {
                const game_id=this.game_info['game_ID'];
                const name=this.self_info['nickname']
                const score=this.self_info['current_Score']
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


        judgePosition(offset,map0,color){//判断该位置能否下棋

          const testMap = [...map0];
          testMap[offset]=color;//首先复制一份棋盘信息，放入这步棋，进行判断
          //console.log(testMap[offset],this.signMap[offset]);

          const self=this.ifDead(testMap,offset);//判断是否导致自己没气
          const other=[];//导致对方没气
          //console.log(self);

          const adjacentOffests = [];//找到四周另一个颜色的棋子
          if (offset % this.boardSize !== 0 && testMap[offset - 1] + testMap[offset] === 0) {
            adjacentOffests.push(offset - 1); // 左
          }
          if ((offset + 1) % this.boardSize !== 0 && testMap[offset + 1] + testMap[offset] === 0) {
            adjacentOffests.push(offset + 1); // 右
          }
          if (offset >= this.boardSize && testMap[offset - this.boardSize] + testMap[offset] === 0) {
            adjacentOffests.push(offset - this.boardSize); // 上
          }
          if (offset < this.boardSize * (this.boardSize - 1) && testMap[offset + this.boardSize] + testMap[offset] === 0) {
            adjacentOffests.push(offset + this.boardSize); // 下
          }
          //console.log(adjacentOffests);

          for (const adjoffset of adjacentOffests) {//所有死子合一起，有重复也没关系
            other.push.apply(other,this.ifDead(testMap,adjoffset));
          }
          //console.log(other);
          //console.log(self.length,other.length)

          if(self.length !== 0 && other.length === 0)//导致自己没气，且不能杀死相邻的对方棋子，不可下
            return false;
          else
            return other;//返回杀死的对方棋子索引数组

        },

        ifDead(signMap, offset) {//判断offset处的棋子及其相邻棋子是否为死子，是则返回死子offset数组
          const boardSize=this.boardSize;
          //const [x, y] = [offset % boardSize, Math.floor(offset / boardSize)];

          const visited = new Set();
          const deadStones = [];

          function dfs(position) {
            if (position < 0 || position >= boardSize * boardSize || visited.has(position)) {
              return false; // 位置越界或已访问过，返回false无气
            }

            visited.add(position);

            if (signMap[position] === 0) {
              return true; // 遇到空子，说明有气，返回 true
            }

            if (signMap[position] === signMap[offset]) {
              const adjacentPositions = [];

              if (position % boardSize !== 0) {
                adjacentPositions.push(position - 1); // 左
              }
              if ((position + 1) % boardSize !== 0) {
                adjacentPositions.push(position + 1); // 右
              }
              if (position >= boardSize) {
                adjacentPositions.push(position - boardSize); // 上
              }
              if (position < boardSize * (boardSize - 1)) {
                adjacentPositions.push(position + boardSize); // 下
              }

              let hasAir = false;

              for (const adjPosition of adjacentPositions) {
                if (dfs(adjPosition)) {
                  hasAir = true; // 有相邻位置有气，返回 true
                }
              }

              if (!hasAir) {
                deadStones.push(position); // 没有气的情况下，当前子是死子
              }

              if(hasAir){
                deadStones.splice(0, deadStones.length);//有气的情况，说明所有子都不是死子，要清空deadStones
              }

              return hasAir;
            }

            return false;
          }

          dfs(offset);//递归调用
          return deadStones;
        }

    }

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