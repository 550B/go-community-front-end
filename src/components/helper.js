export const alpha = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
export const num = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];


export function range(n) { return [...Array(n)].map((_, i) => i); }//返回0到n-1的数组，用于slice()后获得x方向需要渲染标签的索引
export function yRange(n) { return [...Array(n)].map((_, i) => 19 - n + i); }//返回19-n到18的数组，用于slice()后获得y方向需要渲染标签的索引

export function getHoshis(width, height) {//计算棋盘星位
    if (Math.min(width, height) < 6) return [];

    let [nearX, nearY] = [width, height].map(x => x >= 13 ? 3 : 2);
    let [farX, farY] = [width - nearX - 1, height - nearY - 1];
    let [middleX, middleY] = [width, height].map(x => (x - 1) / 2);

    let result = [[nearX, farY], [farX, nearY], [farX, farY], [nearX, nearY]];

    if (width % 2 !== 0 && height % 2 !== 0)
        result.push([middleX, middleY]);
    if (width % 2 !== 0 && width === 19)
        result.push([middleX, nearY], [middleX, farY]);
    if (height % 2 !== 0 && height === 19)
        result.push([nearX, middleY], [farX, middleY]);

    return result;
}

export function getRank(score){//根据等级分计算等级
    const rankScore = [3100,2800,2500,2300,2100,1900,1700,1500,1300,1100,1000,900,800,700,620,540,460,380];
    const rank=['9段','8段','7段','6段','5段','4段','3段','2段','1段','1级','2级','3级','4级','5级','6级','7级','8级','9级']
    for(const r of rankScore){
        if(score >= r){
            const index=rankScore.indexOf(r);
            return rank[index];
        }
    }
    return '10级';
}

let helper = { alpha, num, range, yRange, getHoshis, getRank};
export default helper;