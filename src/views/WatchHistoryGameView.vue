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
          <h3>历史对局: {{game_info['game_Name']}}</h3>

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

          <h1>当前是第{{ showNum }}手棋</h1>
          <div style="height: 10vh;"></div>

          
          <el-button @click="moveStep(-1)">后退一步<el-icon><CaretLeft /></el-icon></el-button>
          <el-button @click="moveStep(1)"><el-icon><CaretRight /></el-icon>前进一步</el-button>
          <div style="height: 5vh;"></div>

          <el-button @click="moveStep(-5)">后退五步<el-icon><ArrowLeft /></el-icon></el-button>
          <el-button @click="moveStep(5)"><el-icon><ArrowRight /></el-icon>前进五步</el-button>
          <div style="height: 5vh;"></div>

          <el-button @click="moveStep(-999)">回到最初<el-icon><DArrowLeft /></el-icon></el-button>
          <el-button @click="moveStep(999)"><el-icon><DArrowRight /></el-icon>回到最末</el-button>

        </el-col>

    </el-row>
</div>
</template>



<script>
import helper from '../components/helper.js';
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue'

export default{

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

        const boardSize=ref();
        const stepInfo=ref([]);
        const mygoban=ref();
        const mapMemory=ref([]);//每一步棋的棋盘信息记录
        const showNum=ref(1);//当前展示到第几手棋

        const state=ref(0);
        return{
            helper,
            router,
            game_info,
            map,
            boardSize,
            stepInfo,
            mygoban,
            mapMemory,
            showNum,


            blackName:null,//双方卡片信息显示变量
            whiteName:null,
            blackScore:null,
            whiteScore:null,

            state
        }
        
    },



    created(){//获取接口数据，计算每一步棋盘信息
        this.pageInit();       
    },


    methods:{
        pageInit(){//先调接口获取信息，赋值完成后再修改state=1渲染组件，是因为棋盘
            const router = useRouter();
            const service = axios.create({
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(router.currentRoute.value.params.gameId)
            service.get('http://43.139.128.42:9876/api/Game/getHistoryGameWatching?id='+`${router.currentRoute.value.params.gameId}`).then(res => {
                //console.log(res.data.result)
                if (res.data.isSuccess) {
                    this.game_info=res.data.result;
                    this.game_info.step_Info=res.data.result['step_Info']['steps']
                    //console.log(this.game_info)

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

                    this.calcMap();//计算每一步棋盘信息
                    //console.log(this.boardSize)
                    //console.log(this.game_info)
                    this.state=1;
                }
                else{
                    ElMessage.error('获取历史对局失败');
                }
            
            }).catch(error => {
                console.error(error);
                ElMessage.error('获取历史对局失败');
            });
        },


        calcMap(){//计算每步棋后的棋盘信息并存储
            const map0=new Array(this.boardSize*this.boardSize).fill(0);

            for(let i = 0;i<this.game_info['step_Info'].length;i++){
                const judgeResult=this.judgePosition(this.game_info['step_Info'][i]['offset'],map0,this.game_info['step_Info'][i]['color']);
                map0[this.game_info['step_Info'][i]['offset']]=this.game_info['step_Info'][i]['color'];
                for(const off of judgeResult){
                    map0[off] = 0;
                }

                this.mapMemory.push([...map0]);//存储这一步的棋盘信息
                //console.log(map0);
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
        },

        moveStep(towards){//切换棋盘信息
            if(towards < 0){
                if(this.showNum > 1 && this.showNum + towards >= 1){
                    this.showNum=this.showNum + towards;
                }
                else if(this.showNum > 1 && this.showNum + towards < 1){
                    this.showNum=1;
                }
                else if(this.showNum === 1){
                    ElMessage({
                        message: '已经是第一手',
                        type: 'success',
                    })
                    return;
                }

            }
            else{
                if(this.showNum < this.mapMemory.length && this.showNum + towards <= this.mapMemory.length){
                    this.showNum=this.showNum + towards;
                }
                else if(this.showNum < this.mapMemory.length && this.showNum + towards > this.mapMemory.length){
                    this.showNum=this.mapMemory.length;
                }
                else if(this.showNum === this.mapMemory.length){
                    ElMessage({
                        message: '已经是最后一手',
                        type: 'success',
                    })
                    return;
                }

            }

            for(let i=0;i<this.mapMemory[this.showNum - 1].length;i++){
                this.map[i]=this.mapMemory[this.showNum - 1][i];
            }
        },
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


</style>