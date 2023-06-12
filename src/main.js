import { createApp } from 'vue'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { vfmPlugin } from 'vue-final-modal'

import router from '@/router'

import App from './App.vue'

import './style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
createApp(App).use(router).use(pinia).use(VueToast).use(vfmPlugin).mount('#app')
