import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import CalculatorPage from './pages/CalculatorPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  {
    path: '/calculator/',
    component: CalculatorPage,
    props: (route) => {
      return { name: null }
    }
  },
  {
    path: '/calculator/:name',
    component: CalculatorPage,
    props: (route) => {
      return { name: route.params.name }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
