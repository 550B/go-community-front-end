<template>
  <el-scrollbar height="95vh">
  <div class="back_total">
    <div class="videoContainer">
      <video class="fullscreenvideo" id="bgVid" playsinline="" autoplay="" muted="" loop="">
        <source src="../assets/地球.mp4" type="video/mp4">
      </video>
      <h2 class="forum-title" style="font-size: 50px;">论坛</h2>
      <h2 class="forum-title_2" style="font-size: 20px;">每一步棋的后面，都是一个未知的世界</h2>
    </div>
    <div class="bottom_area">
    <div class="right-side-area" type="flex" justify="end">
<img id="building" class="background-image" src="../assets/Post_weiqi.jpg" alt="Background Image" />
        <div class="button_union">
          <div class="User_Icon">
          <el-icon><UserFilled /></el-icon>
            </div>
          <div class="button_col">
          <el-button class="post-button" @click="goToCreatePostView()">发帖</el-button>
        <el-button class="my_post" @click="showSelfPostsDialog">我的帖子</el-button>
        <el-button class="my_comment" @click="showUserCommentsDialog">我的评论</el-button>
            </div>
      </div>
  </div>

     <div class="gray-background">
       <div class="title_totalpost">全部帖子</div>
          <div class="post-list-container">
             <div class="pagination">

      <button class="button_page_pre" @click="prevPage" :disabled="currentPage === 1"><el-icon><DArrowLeft /></el-icon>上一页</button>
      <button class="button_page_next" @click="nextPage" :disabled="currentPage === totalPages">下一页<el-icon><DArrowRight /></el-icon></button>
    </div>
       <div class="left-column">
        <div v-for="(post, index) in visiblePosts" :key="post.post_ID" @click="goToPostInfoView(post.post_ID)" class="highlight-on-hover">
          {{ post.post_Name }}
        </div>
      </div>
      <div class="right-column">
        <div v-for="(post, index) in visiblePosts" :key="post.post_ID" @click="goToPostInfoView(post.post_ID)" class="highlight-on-hover">
          {{ post.post_Name }}
        </div>
      </div>

      </div>
    </div>
       </div>
    </div>
  <el-dialog v-model="dialogVisible" title="我的历史评论" width="50%">
       <div class="mycomment_dialog">
      <div class="self-comment" v-for="comment in userComments" :key="comment.comment_ID">
        <div class="comment_detail">
          {{ comment.comment_Content }}
        </div>
          <div class="comment-time">
            <el-icon><Timer /></el-icon>{{ formatDate(comment.comment_Time) }}
          </div>
          <div class="comment-delete">
             <el-icon class="comment_delete_icon" @click="showDeleteCommentConfirm(comment.comment_ID)"><DeleteFilled /></el-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 弹窗用于显示我的帖子 -->
    <el-dialog title="我的帖子" v-model="selfPostsDialogVisible" width="50%">
      <div class="mypost_dialog">
      <div class="self-post" v-for="post in selfPosts" :key="post.post_ID">
        <div class="post-name" @click="goToPostInfoView(post.post_ID)">
          {{ post.post_Name }}
        </div>
          <div class="post-time">
            <el-icon><Timer /></el-icon> {{ formatDate(post.post_Time) }}
          </div>
          <div class="post-view">
            <el-icon><View /></el-icon> {{ post.view_Num }}
          </div>
          <div class="post-delete">
             <el-icon class="delete_icon" @click="showDeletePostConfirm(post.post_ID)"><DeleteFilled /></el-icon>
          </div>
        </div>
      </div>
  </el-dialog>
</el-scrollbar>
</template>

<style scoped>
.mypost_dialog{
  background-image: url('../assets/mypost_dialog_back.jpg');
  /* 设置背景图片的尺寸，可以根据图片和页面的需求进行调整 */
  background-size: cover;
  /* 设置背景图片的重复方式，这里设置为不重复 */
  background-repeat: no-repeat;
  height:300px;
  overflow: auto;

}
.self-post{
   display:flex;
  margin-bottom: 3px;
}

.post-name{
  margin-left:10px;
  width:300px;
}
.post-name:hover {
  color:#6796a6;
  cursor: pointer; /* 鼠标移上去显示手型指针 */
  /* 你可以根据需要自定义其他样式，比如文本颜色、边框等 */
}
.post-time{
  text-align: left;
  width:150px;
}
.post-view{
  text-align: left;
  width:50px;
}
.delete_icon{
  font-size:20px;
  color:#f56c6c
}
.mycomment_dialog{
  margin-top: -20px;
  background-image: url('../assets/mycomment_dialog_back.jpg');
  /* 设置背景图片的尺寸，可以根据图片和页面的需求进行调整 */
  background-size: cover;
  /* 设置背景图片的重复方式，这里设置为不重复 */
  background-repeat: no-repeat;
  height:300px;
  overflow: auto;
}
.self-comment{
  margin-top: 10px;
  display:flex;
  margin-bottom: 3px;
}
.comment_detail{
  text-align: left;
  margin-left:10px;
  width:400px;
}
.comment-time{
  margin-left:10px;
  width:140px;
  text-align: left;
}
.comment-delete{
  margin-right: 5px;
}
.comment_delete_icon{
   font-size:20px;
  color:#f56c6c
}
.videoContainer {
  position: relative;
  width: 100%;
  height: 30vh; /* Adjust the height as needed */
  overflow: hidden;
  z-index: -1;
  border-radius: 10px;
}

.fullscreenvideo {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  transform: translateX(-50%) translateY(-50%);
  transition: 1s opacity;
}

.forum-title {
  text-align: center;
  position: absolute;
  top: 20%; /* Adjust the top position to move the title higher */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 2.5em; /* Increase the font size */
  color: white; /* Change the title color as needed */
  font-family: "楷体", cursive;
  letter-spacing: 12px; /* Increase letter spacing */
}

.forum-title_2 {
  text-align: center;
  position: absolute;
  top: 60%; /* 调整顶部位置以将标题移动得更高 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 1em; /* 增加字体大小 */
  color: gray; /* 将标题颜色更改为灰色 */
  font-family: cursive; /* 使用连笔字体 */
  letter-spacing: 1px; /* 增加字母间距 */
}
.gray-background {
  position: relative;
  overflow: hidden; /* 隐藏超出容器的内容 */
  z-index: 2; /* 确保在内容上方 */
  margin-top: 3px;
  border-radius: 5px;
  height:70vh;

}
.back_total{
  width: 100%;
  height: 100%;
}

.button_col{
  display: flex;
  flex-direction: column; /* 垂直排列 */
}

/* 可以为按钮添加一些样式来调整间距等 */
.post-button,
.my_post,
.my_comment {
  margin-left: 60px;
  width:90px;
  height:35px;
  margin-bottom: 20px; /* 按钮之间的垂直间距 */
  font-size:15px;
  background-color: #42b983;
  opacity: 1;
  color:whitesmoke;
  z-index: 3;
}
.background-image{
  position:relative;
  width:250px;
  height: 70vh;
  float:right;
  border-radius: 4px;
  z-index: 1;


}


.User_Icon{
  font-size: 35px;
  margin-top: 10px;
}
.button_union{
  position:absolute;
 width:200px;
  height: 50vh;
  z-index: 3;
  margin-top:60px;
  margin-left:20px;
  background-color:rgba(192,192,192,0.5);
}
.right-side-area{
  position:revert;
  width:250px;
  height: 65vh;
  float:right;
  z-index: 0;
}
.bottom_area{
   background: linear-gradient(#888888, whitesmoke);
  border-radius: 5px;
  /*
  box-shadow:5px 5px 10px gray inset;

   */
  opacity: 1;
}
.post-list-container{
  max-height: 80%;
  overflow: auto;
  position: relative;
  width: 100%;
  margin-left: 20px;}

::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }
.left-column {
   float: left;
  width: 50%;
  height: 100%;
  position: relative;
  text-align: left;
  font-family: "仿宋";
}

.right-column {
  float: right;
  width: 50%;
  height: 100%;
  position: relative;
  text-align: left;
  font-family: "仿宋";

}
.pagination{
  margin-right: 40px;
  margin-bottom: 10px;
}
.button_page_pre{
  margin-right: 5px;
  font-size: 10px;
}
.button_page_next{
  margin-right: 5px;
  font-size: 10px;
}

.title_totalpost{
  border-radius: 3px;
  font-size: 35px;
  width: auto;
  height:30px;
  margin: auto;
  margin-top:20px ;
  margin-bottom: 10px;
  color:#2b2b2b;
letter-spacing:0.33em;
  font-family: "楷体";

}

.highlight-on-hover:hover {
  color:#589df6;
  cursor: pointer; /* 鼠标移上去显示手型指针 */
  /* 你可以根据需要自定义其他样式，比如文本颜色、边框等 */

}

.highlight-on-hover{
  font-size: 28px;
}


</style>


<script lang="ts" setup>
import axios from 'axios'
import { ref ,computed} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
const router = useRouter();
const posts = ref([])
import { ElButton, ElDialog, ElMessage } from 'element-plus'
const dialogVisible = ref(false); // 控制弹窗是否可见
const userComments = ref([]); // 存储用户的评论
const selfPostsDialogVisible =ref(false);
const selfPosts = ref([]);
 const currentPage=ref(1);
 const pageSize= 15;// 每页显示的帖子数量
const totalPages = computed(() => Math.ceil(posts.value.length / pageSize));
const visiblePosts = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return posts.value.slice(startIndex, endIndex);
    });

const prevPage=()=>{
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}
const nextPage =()=> {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}
// 获取帖子列表
const getPosts = () => {
  var service = axios.create({
    headers: {
      'Authorization': `bearer ${localStorage.getItem('token')}`
    }
  })

  service.get('http://43.139.128.42:9876/api/Post/getAllPost').then(response => {
    posts.value = response.data.result;
  })
  .catch((error) => {
    console.log(error)
  })
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

// 跳转到详情页面
const goToPostInfoView = (postId) => {
  // 使用 Vue Router 导航到 PostInfoView 页面，并传递 postId 参数
  router.push({ name: 'postInfoView', params: { postId: postId } });
}

//跳转到新建帖子页面
const goToCreatePostView =()=>{
  router.push({ name: 'createPostView'});
}
//弹窗显示自己的评论
const showUserCommentsDialog = () => {
  dialogVisible.value = true;
  getUserComments(); // 获取用户的评论
}

const showSelfPostsDialog =()=>{
  selfPostsDialogVisible.value =true;
  getUserPosts();
}

// 获取当前登录用户的评论
const getUserComments = () => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  service.get('http://43.139.128.42:9876/api/Post/getSelfComment')
    .then(response => {
      if (response.data.isSuccess) {
        userComments.value = response.data.result;
      }
    })
    .catch(error => {
      //console.error(error);
      //ElMessage.error('获取评论失败');
    });
}
const getUserPosts = () => {
  const service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  service.get('http://43.139.128.42:9876/api/Post/getSelfPost')
    .then(response => {
      if (response.data.isSuccess) {
        selfPosts.value = response.data.result;
      }
    })
    .catch(error => {
      //console.error(error);
      //ElMessage.error('获取评论失败');
    });
}

//删除评论
const deleteComment = (commentId) => {
      const service = axios.create({
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      service.get(`http://43.139.128.42:9876/api/Post/deleteComment?comment_id=${commentId}`)
        .then(response => {
          if (response.data.isSuccess) {
            getUserComments();
            ElMessage.success('删除成功');
          } else {
            ElMessage.error(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          ElMessage.error('删除失败');
        });
    };

//删除帖子
const deletePost = (postID) =>{
  const service = axios.create({
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      service.get(`http://43.139.128.42:9876/api/Post/deletePost?post_id=${postID}`)
        .then(response => {
          if (response.data.isSuccess) {
            getUserPosts();
            ElMessage.success('删除成功');
          } else {
            ElMessage.error(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          ElMessage.error('删除失败');
        });
}
const showDeleteCommentConfirm = (commentId) => {
  ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  }).then(() => {
    deleteComment(commentId);
  }).catch(() => {
    // 用户取消操作
  });
}

// 显示确认删除帖子弹窗
const showDeletePostConfirm = (postID) => {
  ElMessageBox.confirm('确定要删除这篇帖子吗？', '提示', {
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  }).then(() => {
    deletePost(postID);
  }).catch(() => {
    // 用户取消操作
  });
}
// 页面加载时自动获取帖子列表
getPosts();
</script>