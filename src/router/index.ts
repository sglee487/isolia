import { createRouter, createWebHistory } from 'vue-router'

import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/userStore'

import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import LogoutPage from '@/pages/LogoutPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import BoardPage from '@/pages/BoardPage.vue'
import WritePage from '@/pages/WritePage.vue'
import PostPage from '@/pages/PostPage.vue'
import CalculatorPage from '@/pages/CalculatorPage.vue'
import AccountSettingPage from '@/pages/AccountSettingPage.vue'
import NotificationPage from '@/pages/NotificationPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

const $toast = useToast()

const routes = [
  { path: '/', component: HomePage },
  // { path: '/settings/user_edit', component: AccountSettingPage },
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
    path: '/notification',
    component: NotificationPage
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
  if (to.path === '/register') {
    return '/settings/login'
  }

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
