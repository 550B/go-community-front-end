<template>
  <div>
    <div 
      ref="goban-root" 
      :class="['goban',
        {
            'coordinates': showCoordinates
        }
      ]" 
      :style="`width: ${maxWidth}px; height: ${maxHeight}px; font-size: ${vertexSize}px;`">

        <!-- 棋盘中心 -->
        <div
          class="center content"
          :style="{
            position: 'relative',
            width: `${xs.length * 19 / boardSize}em`,
            height: `${ys.length * 19 / boardSize}em`,
          }"
          >

          <!-- 棋盘网线及星位 -->
          <Grid
            :width="boardSize"
            :height="boardSize"
            :xs="xs"
            :ys="ys"
            :hoshis="hoshis"
            />


          <!-- 落点区域 -->
          <div
              class="vertices"
              :style="{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${xs.length}, ${1*19/boardSize}em)`,
                  gridTemplateRows: `repeat(${ys.length}, ${1*19/boardSize}em)`
              }"
              >
              <!-- 每一格都是一个vertex -->
              <Vertex
                v-for="v in vertices"
                :key="v.offset"
                :offset="v.offset"
                :sign="v.sign"
                :possibleColor="currentColor"
                :showPossibleStone="showPossibleStone"
                :canPlaceStoneTag="canPlaceStoneTag[0]"
                @click="handleVertexClick"
                @mouseenter="showPossibleStone=v.offset"    
                @mouseleave="showPossibleStone=-1"
                />
          </div>

        </div>


        <!-- 上左右下的刻度标签 -->
        <Coord
            v-if="showCoordinates"
            class="top"
            dir="x"
            :sets="xs"
            :labels="coordX"
            :boardSize="boardSize"
            />
        <Coord
            v-if="showCoordinates"
            class="left"
            dir="y"
            :sets="ys"
            :labels="coordY"
            :boardSize="boardSize"
            />
        <Coord
            v-if="showCoordinates"
            class="right"
            dir="y"
            :sets="ys"
            :labels="coordY"
            :boardSize="boardSize"
            />
        <Coord
            v-if="showCoordinates"
            class="bottom"
            dir="x"
            :sets="xs"
            :labels="coordX"
            :boardSize="boardSize"
            />
    </div>
  </div>
  <audio ref="placeStoneSound">
    <source src="../assets/placeStoneSound.mp3" type="audio/mpeg">
  </audio>
  <audio ref="killStoneSound">
    <source src="../assets/killStoneSound.mp3" type="audio/mpeg">
  </audio>
</template>

<script>
import helper from './helper.js';
import Coord from './Coord.vue';
import Grid from './Grid.vue';
import Vertex from './Vertex.vue';
import { ref, triggerRef, watchEffect } from 'vue';
import { ElMessage } from 'element-plus'

const defaultVertexSize = 24;

export default {
  name: 'Goban',


  components: {
        Coord,
        Grid,
        Vertex
    },


  props: {
    mode:{//模式，game对局模式，watch观看对局模式，createExercise出题模式，exercise做题模式，show盘面展示模式，self摆盘模式
      type:String,
      required:true,
      default:"game"
    },

    boardSize: {//棋盘路数
      type: Number,
      required: true,
      default: 19,
      validator: function(value) {
        return value >= 9 && value <= 19;
      }
    },

    maxWidth: {//棋盘宽度
      type: Number,
      default: 480
    },

    maxHeight: {//棋盘高度
      type: Number,
      default: 480
    },

    showCoordinates: {//是否显示刻度
        type: Boolean,
        default: false
    },

    coordX: {//x所有刻度标签
        type: Array,
        default: () => [...helper.alpha]
    },

    coordY: {//y所有刻度标签
        type: Array,
        default: () => [...helper.num]
    },

    rangeX: {//刻度显示范围，从coordX里截取，默认为当前路数全部显示
        type: Array,
        default: () =>  [0, Infinity]
    },

    rangeY: {//刻度显示范围，从coordY里截取，默认为当前路数全部显示
        type: Array,
        default: () =>  [0, Infinity]
    },

    signMap: {//棋盘信息
        type: Array,
        required:true,
        default: () => []
    //     default: () => [0, 0, 0, -1, -1, -1, 1, 0, 1, 1, -1, -1, 0, -1, 0, -1, -1, 1, 0,
    // 0, 0, -1, 0, -1, 1, 1, 1, 0, 1, -1, 0, -1, -1, -1, -1, 1, 1, 0,
    // 0, 0, -1, -1, -1, 1, 1, 0, 0, 1, 1, -1, -1, 1, -1, 1, 0, 1, 0,
    // 0, 0, 0, 0, -1, -1, 1, 0, 1, -1, 1, 1, 1, 1, 1, 0, 1, 0, 0,
    // 0, 0, 0, 0, -1, 0, -1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
    // 0, 0, -1, 0, 0, -1, -1, 1, 0, -1, -1, 1, -1, -1, 0, 1, 0, 0, 1,
    // 0, 0, 0, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, 1,
    // 0, 0, -1, 1, 1, 0, 1, -1, -1, 1, 0, 1, -1, 0, 1, -1, -1, -1, 1,
    // 0, 0, -1, -1, 1, 1, 1, 0, -1, 1, -1, -1, 0, -1, -1, 1, 1, 1, 1,
    // 0, 0, -1, 1, 1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1,
    // -1, -1, -1, -1, 1, 1, 1, -1, 0, -1, 1, -1, -1, 0, -1, 1, 1, -1, 0,
    // -1, 1, -1, 0, -1, -1, -1, -1, -1, -1, 1, -1, 0, -1, -1, 1, -1, 0, -1,
    // 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 0, 1, -1, 0, -1, 1, -1, -1, 0,
    // 0, 1, -1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1,
    // 0, 0, -1, 1, 0, 0, 1, 1, -1, -1, 0, 1, -1, 1, -1, 1, -1, 0, -1,
    // 0, 0, 1, 0, 1, 0, 1, 1, 1, -1, -1, 1, -1, -1, 1, -1, -1, -1, 0,
    // 0, 0, 0, 0, 1, 1, 0, 1, -1, 0, -1, -1, 1, 1, 1, 1, -1, -1, -1,
    // 0, 0, 1, 1, -1, 1, 1, -1, 0, -1, -1, 1, 1, 1, 1, 0, 1, -1, 1,
    // 0, 0, 0, 1, -1, -1, -1, -1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0]
    },

    currentColor:{//当前棋色，1黑,-1白
      type:Number,
      default:1,
      validator: function(value) {
        return value === 1 || value === -1;
      }
    },

    canPlaceStoneTag:{//当前是否可下
      type:Array,
      required:true,
      default: () => [true]
    },

    stepInfo:{//步骤信息
      type:Array,
      //required:true,
      default: () => []
    },

    pauseTag:{//息手tag
      type:Boolean,
      default:false
    },

    canSendStepTag:{//可以发送步骤信息tag   ！！！这里使用数组是因为在goban里会修改tag但需要反馈回父组件，所以用数组引用可以影响到父组件，不然
      type:Array,                        //      父组件得不到变化
      default:() => [false]
    },

    createBoardTag:{//正在输入题目棋盘信息tag
      type:Boolean,
      default:false
    },

    createStepTag:{//正在输入步骤信息tag
      type:Boolean,
      default:false
    }
  },




  setup(props) {//绑定响应式数据
    // const boardSize=ref(props.boardSize);
    // const maxHeight=ref(props.maxHeight);
    // const maxWidth=ref(props.maxWidth);
    // const showCoordinates=ref(props.showCoordinates);
    const placeStoneSound=ref();
    const killStoneSound=ref();

    const signMap = ref(props.signMap);
    const currentColor = ref(props.currentColor);
    const showPossibleStone = ref(-1);
    const canPlaceStoneTag = ref(props.canPlaceStoneTag);
    //const stepInfo = ref(JSON.parse(props.stepInfo));
    const stepInfo = ref(props.stepInfo);
    const pauseTag = ref(props.pauseTag);
    const canSendStepTag = ref(props.canSendStepTag);
    const createBoardTag = ref(props.createBoardTag);
    const createStepTag = ref(props.createStepTag);


    // watchEffect(()=>{                       //如果这个变量只要父组件影响子组件可以用watcheffect，子组件影响父组件的话只能定义为数组，用引用
    //   boardSize.value = props.boardSize
    //   console.log('监听了一次')
    // })


    return {
      // boardSize,
      // maxHeight,
      // maxWidth,
      // showCoordinates,
      placeStoneSound,
      killStoneSound,

      signMap,
      showPossibleStone,
      currentColor,
      canPlaceStoneTag,
      stepInfo,
      pauseTag,
      canSendStepTag,
      createBoardTag,
      createStepTag
    };
  },



  data: function () {
    return {
        offsetWidth: undefined,//宽高修正比例
        offsetHeight: undefined,
        fontSize: undefined,//标签字体
    };
  },


  computed:{
    xs() {
        this.updateElementSize();//获得实际显示标签的索引值，x向从小到大
        const { boardSize, rangeX } = this;
        return helper.range(boardSize).slice(rangeX[0], rangeX[1] + 1);
    },
    ys() {
        this.updateElementSize();//获得实际显示标签的索引值，y向从大到小
        const { boardSize, rangeY } = this;
        return helper.yRange(boardSize).slice(rangeY[0], rangeY[1] + 1);
    },

    vertexSize() {//计算边框标签字体大小
        const { offsetWidth, offsetHeight, fontSize } = this;
        if (!offsetWidth || !offsetHeight || !fontSize) {
            //console.log("间接")
            this.updateElementSize();
            return defaultVertexSize;
        }

        
        const { maxWidth, maxHeight } = this;
        //const scale = Math.min(maxWidth / offsetWidth, maxHeight / offsetHeight);
        const scale = Math.min(maxWidth / 510, maxHeight / 510);
        const vertexSize = Math.max(Math.floor(fontSize * scale), 1);
        // console.log("maxWidth"+maxWidth);
        // console.log("offsetWidth"+offsetWidth);
        // console.log("maxWidth / offsetWidth"+maxWidth / offsetWidth);
        // console.log("vertexSize"+vertexSize);
        return vertexSize;
    },


    hoshis() {//获得星位位置
        const { boardSize} = this;
        return helper.getHoshis(boardSize, boardSize);
    },


    vertices() {//因为以一维数组存放棋盘信息，所以offset是该位置的数组索引
      const { xs, ys, signMap, boardSize} = this;
      const result = [];
      ys.forEach(y => { xs.forEach(x => {
        const offset = (y-19+boardSize) * boardSize + x;
        //console.log(offset)
        result.push({
          offset,
          sign: signMap && signMap[offset],
        });
      });});
      return result;
  }

  },


  methods:{
    updateElementSize() {
      this.$nextTick(() => {
        const element = this.$refs['goban-root'];
        if (element) {
            this.offsetWidth = element.offsetWidth;
            this.offsetHeight = element.offsetHeight;
            this.fontSize = parseInt(element.style.fontSize) || defaultVertexSize;
            //console.log(this.fontSize);
        } else {
            console.log("递归调用了updateElementSize()");
            this.updateElementSize();
        }
      });
    },

    handleVertexClick(offset) {//点击事件，下棋       !!!!!!!最核心的函数!!!!!!!!
      //console.log(offset);
      //const test = [...this.signMap];
      //this.placeStoneSound.play();
      if(this.mode === "game" && this.canPlaceStoneTag[0]){

        if(this.signMap[offset] === 0){

          const judgeResult=this.judgePosition(offset);
          if(judgeResult === false){
            ElMessage.error('禁入点不可下棋');
          }
          else{//下棋，添加步骤信息，去除死棋，播放音效，更改不可下tag、可发送步骤tag
            this.signMap[offset] = this.currentColor;
            this.stepInfo.push({color:this.currentColor,offset:offset});

            for(const off of judgeResult){
              this.signMap[off] = 0;
            }

            if(judgeResult.length === 0)
              this.placeStoneSound.play();
            else
              this.killStoneSound.play();

            this.canPlaceStoneTag[0]=false;
            this.canSendStepTag[0]=true;
            console.log('canSendStepTag ='+this.canSendStepTag[0])
          }

        }
      }
      else if(this.mode === "watch"){
        this.canPlaceStoneTag[0]=false;//不可下棋

      }
      else if(this.mode === "createExercise"){
        this.canPlaceStoneTag[0]=true;//保证始终是能下棋状态

        if(this.createBoardTag){//输入题目棋盘信息true时的逻辑

          if(this.signMap[offset] === 0){//为空时下棋
            //console.log("offset",offset)
            const judgeResult=this.judgePosition(offset);

            if(judgeResult === false){
              ElMessage.error('禁入点不可下棋');
            }
            else{//下棋，去除死棋，播放音效
              this.signMap[offset] = this.currentColor;
              for(const off of judgeResult){
                this.signMap[off] = 0;
              }

              if(judgeResult.length === 0)
                this.placeStoneSound.play();
              else
                this.killStoneSound.play();
            }
          }
          else{//有棋子时清空
            this.signMap[offset]=0;
          }
        }
        else if(this.createStepTag){//输入题目步骤信息true时的逻辑
          
          if(this.signMap[offset] === 0){
            const judgeResult=this.judgePosition(offset);

            if(judgeResult === false){
              ElMessage.error('禁入点不可下棋');
            }
            else{//下棋，添加步骤信息，换色，去除死棋，播放音效
              this.signMap[offset] = this.currentColor;
              this.stepInfo.push({color:this.currentColor,offset:offset});
              this.currentColor = -this.currentColor;
              for(const off of judgeResult){
                this.signMap[off] = 0;
              }

              if(judgeResult.length === 0)
                this.placeStoneSound.play();
              else
                this.killStoneSound.play();
            }
          }
        }
        
      }
      else if(this.mode === "show"){
        this.canPlaceStoneTag[0]=false;//只展示，无操作

      }
      else if(this.mode === "watch"){
        this.canPlaceStoneTag[0]=false;
      }
      else if(this.mode === "self" || this.mode === "exercise"){
        this.canPlaceStoneTag[0]=true;//保证始终是能下棋状态

        if(this.signMap[offset] === 0){
          const judgeResult=this.judgePosition(offset);

          if(judgeResult === false){
            ElMessage.error('禁入点不可下棋');
          }
          else{//下棋，添加步骤信息，换色，去除死棋，播放音效
            this.signMap[offset] = this.currentColor;
            this.stepInfo.push({color:this.currentColor,offset:offset});
            //this.stepInfo.step1={color:this.currentColor,offset:offset};
              
              this.currentColor = -this.currentColor; 
          
            this.$emit("stepChanged", this.stepInfo);
            for(const off of judgeResult){
              this.signMap[off] = 0;
            }

            if(judgeResult.length === 0)
              this.placeStoneSound.play();
            else
              this.killStoneSound.play();
            //console.log(this.stepInfo)
          }
        }
      }

      
        
          
      //triggerRef(this.signMap);
    },


    judgePosition(offset){//判断该位置能否下棋

      const testMap = [...this.signMap];
      testMap[offset]=this.currentColor;//首先复制一份棋盘信息，放入这步棋，进行判断
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



    judgeOtherPosition(offset){//在在线对局时，计算获得对手颜色的棋造成的死子

      const testMap = [...this.signMap];
      testMap[offset]= - this.currentColor;//首先复制一份棋盘信息，放入这步棋，进行判断

      const other=[];//导致对方没气

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

      for (const adjoffset of adjacentOffests) {//所有死子合一起，有重复也没关系
        other.push.apply(other,this.ifDead(testMap,adjoffset));
      }

      if(other.length !== 0)
        return other;//返回杀死的对方棋子索引数组
      else
        return false;

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
@import "../styles/goban.css";

.goban {
        line-height: 1em;
        display: grid;
    }
    .goban.coordinates {
        grid-template-rows: 1em 1fr 1em;
        grid-template-columns: 1em 1fr 1em;
    }
    /* .goban:not(.coordinates) {
        grid-template-rows: 0 1fr 0;
        grid-template-columns: 0 1fr 0;
} */

.top.coordx {
    grid-area: 1 / 2 / auto / auto;
}

.left.coordy {
    grid-area: 2 / 1 / auto / auto;
}

.right.coordy {
    grid-area: 2 / 3 / auto / auto;
}

.bottom.coordx {
    grid-area: 3 / 2 / auto / auto;
}

.center.content {
    grid-area: 2 / 2 / auto / auto;
}

.vertices {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
}

</style>
