<template>
    <div :class="`coord${dir}`">
        <div
            v-for="(t, i) in _labels"
            :key="i"
            :style="getStyle()"
            >
            <span v-text="t" />
        </div>
    </div>
</template>

<script>
export default{
    props: {
        dir: {
            type: String,
            required: true,
            validator: v => v === 'x' || v === 'y'
        },

        sets: {//实际需要渲染的标签索引
            type: Array,
            required: true
        },

        labels: {//所有标签
            type: Array,
            required: true
        },

        boardSize:{//棋盘路数
            type: Number,
            default: 19
        }
    },


    computed: {
        _labels() {//获得实际渲染的标签
            const { sets = [], labels = [' '], dir } = this;
            const sub = labels[labels.length - 1];
            if(dir === 'x')
                return sets.map((t => labels[t] !== undefined ? labels[t] : sub));
            else
                return sets.map((t => labels[t] !== undefined ? labels[t] : sub));
        }
    },

    methods:{
        getStyle() {//根据棋盘路数计算每个标签div的宽或高
            const style = {};

            if (this.dir === 'x') {
                style.width = `${19 / this.boardSize}em`;
            } else if (this.dir === 'y') {
                style.height = `${19 / this.boardSize}em`;
            }

            return style;
        }
    }



}


</script>


<style scoped>
.coordx {
    display: flex;
    text-align: center;
}
.coordx div {
    width: 1em;
}

.coordy {
    text-align: center;
}
.coordy div {
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coordx span,
.coordy span {
    display: block;
}
</style>
