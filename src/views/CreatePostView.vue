<template>
  <div class="page-content">
  <div class="inside">
    <div class="bigBox">
        <el-divider />
        <h1 style="margin-top: 50px; font-size: 35px;">发帖</h1>
    </div>

    <el-form ref="postForm" :model="postFormData" label-width="100px">
      <el-form-item label="帖子标题" class="custom-label">
        <el-input v-model="postFormData.post_Name" placeholder="请输入帖子标题" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="帖子内容" class="custom-label">
        <!-- 使用 wangEditor 富文本编辑器 -->
        <div ref="editorRef" id="editor" style="width: 80%;"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPost">发布帖子</el-button>
      </el-form-item>
    </el-form>
  </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import EWangEditor from "wangeditor";

const router = useRouter();
const postFormData = ref({
  post_Name: '',
  post_Content: '',
});

const editorRef = ref(null)
const editor = ref(null)
// 在组件挂载后初始化 wangEditor
onMounted(() => {
 let editor = new EWangEditor("#editor");
    editor.config.uploadImgShowBase64 = true;
    editor.config.onchangeTimeout = 400;

    editor.config.customAlert = (err) => {
        console.log(err);
    };

    editor.customConfig = editor.customConfig
        ? editor.customConfig
        : editor.config;


    editor.customConfig.onchange = (html) => {
  postFormData.value.post_Content = html;
};
    //以下为新增
    const menuItem = [  //工具栏里有哪些工具
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  //字号
        'fontName',  //字体
        'italic',  // 斜体
        'underline',  //下划线
        'strikeThrough',  //删除线
        'indent',  //缩进
        'lineHeight',  //行高
        'foreColor',  //文字颜色
        'backColor',  //文字背景颜色
        'link',  //链接，插入一个链接地址，如果填写了描述，则高亮显示描述。若没有，则高亮显示链接
        'list',  // 序列（有序列表、无序列表）
        'todo',  //待办事项
        'justify',  // 对齐方式
        'quote',  //引用
        'emoticon',  //表情
        'table',  //表格
        'code',  //代码
        'splitLine',  //分割线
        'undo',  //撤销
        'redo' //恢复
      ];

      editor.config.menus = [...menuItem]; /* 应用设置好的工具栏 */

      editor.config.colors = ["#000000", "#eeece0", "#1c487f", "#4d80bf"];  /* 文字颜色、背景色可以选择哪些颜色? */

      editor.config.fontNames = [ /* 字体工具提供哪些字体? */
        "黑体",
        "仿宋",
        "楷体",
        "标楷体",
        "华文仿宋",
        "华文楷体",
        "宋体",
        "微软雅黑",
      ];
      editor.config.height = 300;//你可能发现这个编辑器是没法用样式调高度的?

      //新增至此
      editor.create();

});

// 提交帖子
const submitPost = () => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const requestBody = {
    post_ID: 0,
    post_Name: postFormData.value.post_Name,
    user_ID: localStorage.getItem('user_ID'), // 根据实际情况填写用户ID
    post_Content: postFormData.value.post_Content,
    post_Time: new Date().toISOString(), // 当前时间作为帖子发布时间
    view_Num: 0,
  };

  service.post('http://43.139.128.42:9876/api/Post/createPost', requestBody)
    .then(response => {
      if (response.data.isSuccess) {
        ElMessage.success('帖子发布成功');
        router.push({ name: 'allPostView' }); // 返回到帖子列表页面
      } else {
        ElMessage.error('帖子发布失败');
      }
    })
    .catch(error => {
      console.error(error);
      ElMessage.error('帖子发布失败');
    });
}

function removeHtmlTags(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const textContent = div.textContent || div.innerText || '';
  return textContent.trim();
}
</script>
<style>

.page-content {
  /* margin-top: -20px; */
  width: 100%;
  height: 92vh;
  /* 设置背景图片的路径，可以根据实际路径进行调整 */
  /* background-image: url('../assets/post_create_back.jpg'); */
  /* 设置背景图片的尺寸，可以根据图片和页面的需求进行调整 */
  /* background-size: cover; */
  /* 设置背景图片的重复方式，这里设置为不重复 */
  /* background-repeat: no-repeat; */
  /* 设置背景图片的位置，这里设置为页面右侧 */
  /*background-position: right;

   */
  /* 设置背景颜色作为备用，防止背景图片无法加载时显示背景颜色 */
  background-color: rgb(211,211,211);
  /* 其他样式属性，根据需要自行调整 */
}
.inside{
  position: relative;
  margin-left: 25px;
  margin-right: 25px;
  /* margin-bottom: 10px; */
  padding-top: 25px;
}
.title{

}

.bigBox{
    width:100%;
    height:200px;
    background-image: url("../assets/CreatePost_bk.png");
    margin-bottom: 30px;
}

.custom-label .el-form-item__label {
  font-size: 20px; /* 设置字体大小为16像素，根据需要调整 */
}
</style>