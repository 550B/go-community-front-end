<template>
<div
    :class="classes"
    style="position: relative;"

    >

    <!-- 比外围div小一些，使棋子不占满格 -->
    <div
        key="stone"
        class="stone"
        style="z-index: 2;"
        @click="handleClick"
        >
        <!-- 阴影效果div -->
        <div
            v-show="!!sign"
            key="shadow"
            class="shadow"
            />
        <!-- 鼠标移动到对应格子显示的透明棋子 -->
        <div
            v-if="showPossibleStone === offset && canPlaceStoneTag"
            :class="[
                'possibleStone',
                'stone-image',
                `sign_${possibleColor}`
            ]"
            />
        <!-- 实际棋子贴图 -->
        <div
            v-show="!!sign"
            key="inner"
            :class="[
                'inner',
                'stone-image',
                `sign_${sign}`
            ]"

            v-text="sign"
            />
    </div>
</div>
</template>



<script>
import {watchEffect} from 'vue'
export default{
    props:{
        sign: {//0为空，-1白，1黑
            type: Number,
            required: true,
            default: 0
        },

        offset:{//当前vertex所在的棋盘信息数组位置索引
            type: Number,
            required: true,
            default: 0
        },

        showPossibleStone:{//需要显示透明棋子的索引值（棋盘信息的索引值）（鼠标移动到该格时）
            type:Number,
            required: true,
            default: -1
        },

        possibleColor:{//透明棋子颜色
            type:Number,
            required:true,
            default:1
        },

        canPlaceStoneTag:{//当前是否可下
            type:Boolean,
            required:true,
            default:true
        },
    },


    methods:{
        handleClick(event) {
            event.stopPropagation();//确保点击事件不会继续冒泡到父组件
            this.$emit('click', this.offset); // 触发自定义点击事件，传递 offset 值
        }
    },


    computed:{
        classes() {
            const { sign } = this;
            return [
                'vertex',
                `sign_${sign}`,
            ];
        }
    }
}
</script>




<style scoped>
.vertex div {
    position: absolute;
}


</style>