<template>
    <template v-if="isLoading">
      加载中...
    </template>
    <template v-else>

      <div class="post-content">
        <div class="content">
        <h3 style="font-size: 30px;">{{ postInfo.post_Name }}</h3>
        <p class="info-text" style="font-size: 15px;">创建时间: {{ formatDate(postInfo.post_Time) }}</p>
        <p class="info-text2" style="font-size: 15px;">
          <el-icon><View /></el-icon>
                            <span>{{ postInfo.view_Num }}</span>
        </p>
        <div class="detailContent" v-html="postInfo.post_Content" style="font-size: 20px;"></div>
          </div>
        <div class="jubao_button">
        <el-button type="danger" size="mini" @click="showReportDialog(postInfo.user_ID)">举报</el-button>
      </div>
        </div>


           <div class="comment-heading">
      <span class="comment-heading-bg">
       <span>评论</span><el-icon><ChatDotSquare /></el-icon></span>
    </div>

    <div class="comments-section">
      <ul class="comment-list">
        <li v-for="(comment, index) in comments" :key="comment.comment_ID"
            :class="{ 'comment-item': true, 'even': index % 2 === 0, 'odd': index % 2 !== 0 }">
          <div class="comment-content" style="font-size: 15px;">{{ comment.comment_Content }}</div>
          <div class="comment-time">{{ formatDate(comment.comment_Time) }}</div>
           <el-button class="report_button" type="danger" size="mini" @click="showReportDialog(comment.user_ID)">举报</el-button>
        </li>
      </ul>
    </div>
      <li class="comment-item comment-box">
          <el-input v-model="newComment" type="textarea" placeholder="请输入评论内容"></el-input>
          <el-button class="comment-submit-button" @click="submitComment">发布</el-button>
        </li>
</template>
   <el-dialog v-model="reportDialogVisible" title="举报原因" @close="reportReason = ''">
      <el-input v-model="reportReason" type="textarea" placeholder="请输入举报原因"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReport">确认举报</el-button>
      </span>
    </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessageBox, ElInput, ElButton,ElDialog } from 'element-plus'

const route = useRoute();
const isLoading = ref(true);
const postInfo = ref({
  post_ID: 0,
  post_Name: '',
  post_Content: '',
  post_Time: '',
  view_Num: 0
});
const comments = ref([]);
const newComment = ref('');
const showCommentBox = ref(false);

const reportDialogVisible = ref(false)
const reportReason = ref('')
const selectedUserId = ref(0)

// 获取帖子详情和评论内容
const getPostAndComments = (postId: number) => {
  var service = axios.create({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  const getPostInfo = service.get(`http://43.139.128.42:9876/api/Post/getPost?post_id=${postId}`);
  const getComments = service.get(`http://43.139.128.42:9876/api/Post/getComment?post_id=${postId}`);

  Promise.all([getPostInfo, getComments])
    .then(([postResponse, commentsResponse]) => {
      postInfo.value = postResponse.data.result;
      comments.value = commentsResponse.data.result;
      isLoading.value = false;
    })
    .catch((error) => {
      console.log(error);
      isLoading.value = false;
    });
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

// 提交评论
const submitComment = () => {
  if (newComment.value.trim() === '') {
    ElMessageBox.alert('评论内容不能为空', '提示', { type: 'warning' });
    return;
  }

  const commentData = {
    comment_ID: 0,
    post_ID: postInfo.value.post_ID,
    user_ID: localStorage.getItem('user_ID'), // 替换成你的用户ID获取逻辑
    comment_Content: newComment.value,
    comment_Time: new Date().toISOString()
  };

  axios.post('http://43.139.128.42:9876/api/Post/comment', commentData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => {
    if (response.data.isSuccess) {
      ElMessageBox.alert('评论发布成功', '成功', { type: 'success' });
      newComment.value = '';
      showCommentBox.value = false;
      getPostAndComments(route.params.postId); // 刷新评论列表
    } else {
      ElMessageBox.alert(response.data.msg, '失败', { type: 'error' });
    }
  }).catch(error => {
    console.error(error);
    ElMessageBox.alert('评论发布失败', '失败', { type: 'error' });
  });
}

const showReportDialog = (commentId: number) => {
  selectedUserId.value = commentId
  reportDialogVisible.value = true
}

const submitReport = () => {
  if (reportReason.value.trim() === '') {
    ElMessageBox.alert('请输入举报原因', '提示', { type: 'warning' })
    return
  }
  const reportData = {
    violation_ID: 0,
    violator_ID: selectedUserId.value,
    reporter_ID: localStorage.getItem('user_ID'), // 替换为您的用户ID获取逻辑
    violation_Content: reportReason.value,
    violation_Time: new Date().toISOString(),
    is_Deal: 0
  }

  axios.post('http://43.139.128.42:9876/api/User/report', reportData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => {
    if (response.data.isSuccess) {
      ElMessageBox.alert('举报成功', '成功', { type: 'success' })
      reportDialogVisible.value = false
      reportReason.value = ''
    } else {
      ElMessageBox.alert(response.data.msg, '失败', { type: 'error' })
    }
  }).catch(error => {
    console.error(error)
    ElMessageBox.alert('举报失败', '失败', { type: 'error' })
  })
}



// 页面加载时自动获取帖子详情和评论内容
onMounted(() => {
  const postId = Number(route.params.postId);
  getPostAndComments(postId);
});



</script>

<style scoped>




.content-text {
  text-align: left;
  color: #333;
}
.info-text ,.info-text2{
  color: #333;
}
.post-content {
  font-size:10px;
  margin-bottom: 20px;
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 5px;
  height:40%;
  background-image: url('../assets/postcontent_back.jpg');
  /* 设置背景图片的尺寸，可以根据图片和页面的需求进行调整 */
  background-size: cover;
  /* 设置背景图片的重复方式，这里设置为不重复 */
  background-repeat: no-repeat;
}
.comments-section{
   background-image: url('../assets/postcomment_back.jpg');
  /* 设置背景图片的尺寸，可以根据图片和页面的需求进行调整 */
  background-size: cover;
  /* 设置背景图片的重复方式，这里设置为不重复 */
  background-repeat: no-repeat;
}

.content{
  height: 200px;
  overflow: auto;
}
::-webkit-scrollbar {
     width: 0 !important;
   }
   ::-webkit-scrollbar {
     width: 0 !important;height: 0;
   }

.comments-section {
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 5px;
  max-height: 350px; /* 固定高度，超过高度自动出现滚动条 */
  overflow: auto; /* 添加滚动条 */
  margin-bottom: 20px;
}

.comment-heading {
  text-align: left;
  margin-bottom: 10px;
}

.comment-heading-bg {
  font-size:20px;
  background-color: #bebeb2;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.comment-list {
  list-style: none;
  padding-left: 0;
}

.comment-item {
  font-size:10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-radius: 3px;
  color: #555;
  margin-bottom: 10px;
}

.comment-content {
  flex: 1;
  text-align: left;
}

.comment-time {
  color: #888;
}

.even {
  background-color: #d5d5d5; /* Even row background color */
}

.odd {
  background-color: #c0c0c0; /* Odd row background color */
}

.comment-submit-button{
  background-color: #336699; /* 自定义的背景颜色 */
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
}
.report_button{
  font-size:10px;
  width: 40px;
  height: 25px;
  margin-left: 2px;
}
.jubao_button{
  margin-bottom: 5px;
  margin-top: 10px;
}

</style>

