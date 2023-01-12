import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VueToast, { useToast } from 'vue-toast-notification'
import { vfmPlugin } from 'vue-final-modal'
import GoogleSignInPlugin from 'vue3-google-signin'

import { useUserStore } from '@/stores/userStore'

import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import LogoutPage from './pages/LogoutPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import BoardPage from './pages/BoardPage.vue'
import WritePage from './pages/WritePage.vue'
import CalculatorPage from './pages/CalculatorPage.vue'
import AccountSettingPage from './pages/AccountSettingPage.vue'
import NotificationPage from './pages/NotificationPage.vue'
import SettingsPage from './pages/SettingsPage.vue'

// import BoardComponent from './components/BoardComponent.vue'

import './style.css'
import 'vue-toast-notification/dist/theme-default.css'

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
        path: '',
        component: BoardPage
      },
      {
        path: 'write/:menu',
        component: WritePage
      },
      {
        path: ':name/:menu',
        component: BoardPage
      }
    ]
  },
  // {
  //   path: '/board',
  //   name: 'board',
  //   children: [
  //     { path: '', component: BoardPage },
  //     {
  //       path: ':name',
  //       name: 'boardType',
  //       component: BoardComponent,
  //       children: [
  //         {
  //           path: ':postId',
  //           name: 'postId',
  //           component: BoardComponent
  //         }
  //       ]
  //     }
  //     // { path: 'write', query: { mode: 'write' } },
  //     // { path: ':id', component: ViewPage }
  //   ]
  // },
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
  const user = useUserStore()
  if (user.isLogined() && to.path === '/board') {
    return '/board/list/all'
  }

  if (user.isLogined() && to.path === '/settings/login') {
    return '/'
  }

  if (!user.isLogined() && to.path === '/settings/user_edit') {
    return '/settings/login'
  }

  if (to.params.name === 'notice' && to.params.postId === 'write') {
    if (user.data.token === null) {
      $toast.error('로그인 후에 이용해주세요.')
      return '/settings/login'
    }
    if (user.isAdmin() === false) {
      $toast.error('권한이 없습니다.')
      return '/board'
    }
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
createApp(App).use(router).use(pinia).use(VueToast).use(vfmPlugin).use(GoogleSignInPlugin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
}).mount('#app')
