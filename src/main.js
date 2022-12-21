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
import CalculatorPage from './pages/CalculatorPage.vue'
import AccountSettingPage from './pages/AccountSettingPage.vue'

import BoardComponent from './components/BoardComponent.vue'

import './style.css'
import 'vue-toast-notification/dist/theme-default.css'

const $toast = useToast()

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/logout', component: LogoutPage },
  { path: '/user/edit', component: AccountSettingPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/board',
    name: 'board',
    component: BoardPage,
    children: [
      { path: '' },
      {
        path: ':name',
        name: 'boardType',
        component: BoardComponent,
        children: [
          {
            path: ':postId',
            name: 'postId',
            component: BoardComponent
          }
        ]
      }
      // { path: 'write', query: { mode: 'write' } },
      // { path: ':id', component: ViewPage }
    ]
  },
  {
    path: '/calculator',
    component: CalculatorPage,
    children: [
      {
        path: ':name',
        component: CalculatorPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const user = useUserStore()

  if (to.params.name === 'notice' && to.params.postId === 'write') {
    if (user.data.token === null) {
      $toast.error('로그인 후에 이용해주세요.')
      return '/login'
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
