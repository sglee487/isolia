import { createRouter, createWebHistory } from 'vue-router'

import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/userStore'

import HomePage from '@/pages/HomePage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LogoutPage from '@/pages/LogoutPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import BoardPage from '@/pages/BoardPage.vue'
import WritePage from '@/pages/WritePage.vue'
import PostPage from '@/pages/PostPage.vue'
import CalculatorPage from '@/pages/CalculatorPage.vue'
import AccountSettingPage from '@/pages/AccountSettingPage.vue'
import MorePage from '@/pages/MorePage.vue'
import MineSweeper from '@/pages/morepages/MineSweeperPage.vue'
import ImageUpscaling from '@/pages/morepages/ImageUpscaling.vue'
import QuestionPage from '@/pages/morepages/QuestionPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

const $toast = useToast()

const routes = [
  { path: '/', component: HomePage },
  // { path: '/settings/user_edit', component: AccountSettingPage },
  { path: '/auth/callback/', component: AuthPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/board',
    name: 'board',
    children: [
      {
        path: 'write/:menu',
        component: WritePage,
        name: 'write'
      },
      {
        path: ':name/:menu',
        component: BoardPage
      },
      {
        path: 'post/:postId',
        component: PostPage,
        name: 'post'
      }
    ]
  },
  {
    path: '/calculator',
    children: [
      {
        path: '',
        component: CalculatorPage
      },
      {
        path: ':name',
        component: CalculatorPage
      }
    ]
  },
  {
    path: '/more',
    name: 'more',
    children: [
      {
        path: '',
        component: MorePage,
        name: 'more'
      },
      {
        path: 'minesweeper',
        name: 'minesweeper',
        component: MineSweeper
      },
      {
        path: 'image_upscaling',
        name: 'image_upscaling',
        component: ImageUpscaling
      },
      {
        path: 'question',
        component: QuestionPage
      },
    ]
  },
  {
    path: '/settings',
    children: [
      {
        path: '',
        component: SettingsPage
      },
      {
        path: 'user_edit',
        component: AccountSettingPage
      }
    ]
  },
  { path: '/settings/login', component: LoginPage },
  { path: '/settings/logout', component: LogoutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const user = useUserStore()
  if (to.path === '/board') {
    return '/board/list/all'
  }

  if (user.isLogined() && to.path === '/settings/login') {
    return '/'
  }

  if (!user.isLogined() && to.path === '/settings/user_edit') {
    return '/settings/login'
  }
  if (to.name === 'write') {
    if (!user.isLogined()) {
      $toast.error('로그인 후에 이용해주세요.')
      return '/settings/login'
    }
    if (to.params.menu === 'notice' && user.isAdmin() === false) {
      $toast.error('권한이 없습니다.')
      return '/board/list/all'
    }
  }
})

export default router
