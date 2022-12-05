import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VueToast from 'vue-toast-notification'
import { vfmPlugin } from 'vue-final-modal'
import GoogleSignInPlugin from 'vue3-google-signin'

import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import LogoutPage from './pages/LogoutPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import CalculatorPage from './pages/CalculatorPage.vue'
import AccountSettingPage from './pages/AccountSettingPage.vue'

import './style.css'
import 'vue-toast-notification/dist/theme-default.css'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/logout', component: LogoutPage },
  { path: '/user/edit', component: AccountSettingPage },
  { path: '/register', component: RegisterPage },
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

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(pinia).use(VueToast).use(vfmPlugin).use(GoogleSignInPlugin, {
  clientId: ''
}).mount('#app')
