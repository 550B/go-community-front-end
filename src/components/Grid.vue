<template>
    <svg class="grid">
        <rect
            v-for="(l, i) in lines"
            :key="`l${i}`"
            :class="l.classes"
            :x="l.x"
            :y="l.y"
            :width="l.width"
            :height="l.height"
            />
        <circle
            v-for="(p, i) in points"
            :key="`p${i}`"
            class="hoshi"
            :cx="p.x"
            :cy="p.y"
            r=".12em"
            />
    </svg>
</template>



<script>
const lineWidth = 0.042; // 当font-size === 24px, 0.042em约1px
const convert = (val, length) => (2 * val + 1) * 0.5 * 19 / length;//换算偏移em值

export default{
    props: {
        width: {
            type: Number,
            required: true
        },

        height: {
            type: Number,
            required: true
        },

        xs: {
            type: Array,
            required: true
        },

        ys: {
            type: Array,
            required: true
        },

        hoshis: {
            type: Array,
            required: true
        }
    },


    computed: {
        lines() {
            const { width, height, xs, ys } = this;//实际width, height值是相等的
            const x = xs[0] === 0 ? 19 / width * 0.5 : 0;
            const y = ys[0] === 19 - height ? 19 / height * 0.5 : 0;//计算棋盘画线部分左上角相对于整个中心区左上角的偏移em值（为了画线位置对齐标签位置）
            const calcLen = (val, sets, size) => {//画线长度!!!暂弃用
                return sets[sets.length - 1] === size - 1
                    ? (2 * sets.length - 1) * 0.5 - val
                    : sets.length - val;
            };

            return [
                ...ys.map((_, i) => {
                    return {
                        classes: 'gridline horizontal',
                        x: `${x}em`,
                        y: `${convert(i,height)}em`,
                        width: `${(width-1)*19/width}em`,
                        height: `${lineWidth}em`
                    };
                }),
                ...xs.map((_, i) => {
                    return {
                        classes: 'gridline vertical',
                        x: `${convert(i,width)}em`,
                        y: `${y}em`,
                        width: `${lineWidth}em`,
                        height: `${(height-1)*19/height}em`
                    };
                })
            ];
        },

        points() {//依次计算星位坐标
            const { xs, ys, width, hoshis = [] } = this;
            const result = [];
            hoshis.forEach(([x, y]) => {
                const [i, j] = [xs.indexOf(x), ys.indexOf(18 - y)];
                if (i >= 0 && j >= 0) {
                    result.push({
                        x: `${convert(i, width) + 0.5 * lineWidth}em`,
                        y: `${convert(j, width) + 0.5 * lineWidth}em`
                    });
                    
                }
            });
            return result;
        }
    }
}
</script>



<style scoped>
.grid {
    position: 'absolute';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}
</style>