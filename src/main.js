import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import CalculatorPage from './pages/CalculatorPage.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/calculator', component: CalculatorPage },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

createApp(App).use(router).mount('#app')
