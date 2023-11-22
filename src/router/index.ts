import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'logInView',//注册登录页面
    component: () => import('../views/LogInView.vue'),
  },


  {
    path: '/player',
    name: 'playerLayout',//玩家侧栏
    component: () => import('../layout/PlayerLayout.vue'),
    children: [
      {
        path: 'home',
        name:'homeView',//主页
        component: () => import('../views/HomeView.vue'),
        meta: {
          requiresAuth: true, // 需要登录权限
          permission: 'player', // 玩家权限
        },
      },
      {
        path: 'apply',
        name:'applyView',//对局申请页面
        component: () => import('../views/ApplyView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'game',
        name:'gameView',//对局页面
        component: () => import('../views/GameView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },


      {
        path: 'allGame',
        name:'allGameView',//所有对局页面
        component: () => import('../views/AllGameView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allGame/watch/:gameId', 
        name: 'watchGameView', // 观看对局页面
        component: () => import('../views/WatchGameView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },


      {
        path: 'allMatch',
        name:'allMatchView',//所有比赛页面
        component: () => import('../views/AllMatchView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allMatch/:matchId', 
        name: 'matchInfoView', // 比赛信息页面
        component: () => import('../views/MatchInfoView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },


      {
        path: 'allPost',
        name:'allPostView',//论坛页面
        component: () => import('../views/AllPostView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allPost/:postId', 
        name: 'postInfoView', // 帖子页面
        component: () => import('../views/PostInfoView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allPost/create', 
        name: 'createPostView', // 发帖页面
        component: () => import('../views/CreatePostView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },


      {
        path: 'allExercise',
        name:'allExerciseView',//所有习题页面
        component: () => import('../views/AllExerciseView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allExercise/create', 
        name: 'createExerciseView', // 发布习题页面
        component: () => import('../views/CreateExerciseView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'allExercise/:exerciseId', 
        name: 'exerciseView', // 做习题页面
        component: () => import('../views/ExerciseView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },


      {
        path: 'selfInfo',
        name:'selfInfoView',//个人信息页面
        component: () => import('../views/SelfInfoView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'selfInfo/watchHistory/:gameId', 
        name: 'watchHistoryGameView', // 观看历史对局页面
        component: () => import('../views/WatchHistoryGameView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
      {
        path: 'announcement', 
        name: 'announcementPlayerView', // 公告页面
        component: () => import('../views/AnnouncementPlayerView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'player',
        },
      },
    ]
  },


  {
    path: '/admin',
    name: 'adminLayout',//管理员侧栏
    component: () => import('../layout/AdminLayout.vue'),
    children: [
      {
        path: 'announcement',
        name:'announcementView',//公告页面
        component: () => import('../views/AnnouncementView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'admin',
        },
      },
      {
        path: 'manageMatch',
        name:'manageMatchView',//管理比赛页面
        component: () => import('../views/ManageMatchView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'admin',
        },
      },
      {
        path: 'handleViolation',
        name:'handleViolationView',//处理违规信息页面
        component: () => import('../views/HandleViolationView.vue'),
        meta: {
          requiresAuth: true,
          permission: 'admin',
        },
      },
    ]
  },

  {
    path: '/:catchAll(.*)', // 匹配所有路径 
    
    //根据用户权限重定向
    redirect: to => {
      const role = localStorage.getItem('user_permission');
      
      if (role === 'player') {
        return { name: 'homeView' };
      } else if (role === 'admin') {
        return { name: 'announcementView' };
      } else {
        return { name: 'logInView' };
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userPermission = localStorage.getItem('user_Permission'); 

  if (to.matched.some(record => record.meta.requiresAuth)) {// 判断是否需要登录权限
    
    if (!token) {
      next({ name: 'logInView' }); // 未登录，跳转到登录页面
    } else {
      // 判断用户权限是否满足要求
      if ((to.meta.permission === 'player' && userPermission === 'player') ||
          (to.meta.permission === 'admin' && userPermission === 'admin')) {
        next(); // 用户权限满足，继续导航
      } else {
        // 用户权限不满足，根据身份进行重定向
        if (userPermission === 'player') {
          next({ name: 'homeView' }); 
        } else if (userPermission === 'admin') {
          next({ name: 'announcementView' }); 
        }
      }
    }
  } else {
    next(); // 不需要登录权限的页面，直接导航
  }
});

export default router
