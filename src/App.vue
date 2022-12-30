<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import Popper from 'vue3-popper'

import { checkToken } from '@/apis/user'

import ButtonBox from './components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'

import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  CalculatorIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  UserIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const user = useUserStore()

// const userDisplayNameSubscribed = ref<string>('')
// const userEmailSubscribed = ref<string>('')

// user.$subscribe((mutation, state) => {
//   console.log(mutation)
//   console.log(state)
//   console.log(state.data)
//   console.log(state.data.display_name)
//   console.log(state.data.email)
//   // if (mutation.storeId === 'user' && mutation.type === 'direct') {
//   //   userDisplayNameSubscribed.value = state.display_name
//   //   userEmailSubscribed.value = state.email
//   // }
// })

const profileModal = ref<boolean>(false)

const navRoutes = [
  {
    to: '/board',
    name: '게시판',
    icon: ClipboardDocumentIcon
  },
  {
    to: '/calculator',
    name: '의료계산기',
    icon: CalculatorIcon
  }
]

const modalRoutes = [
  {
    to: '/user/edit',
    name: 'My Account',
    icon: CogIcon
  },
  {
    to: '/logout',
    name: 'Logout',
    icon: ArrowLeftOnRectangleIcon
  }
]

const isOpenMobileMenu = ref<boolean>(false)

onBeforeMount(async () => {
  if (!user.isLogined()) {
    return
  }
  const response = await checkToken(user.data.token)

  if (response.status !== 200) {
    user.logout()
    return
  }

  user.login(
    response.data.token,
    response.data.exp,
    response.data.login_type,
    response.data.email,
    response.data.display_name,
    response.data.role === 'admin'
  )
})

const getRemainTime = () => {
  if (!user.isLogined()) {
    return 0
  }
  const now = new Date()
  const exp = new Date(user.data.exp * 1000)
  const diff = exp.getTime() - now.getTime()
  const remainTime = Math.floor(diff)
  return remainTime
}

// const timer = setInterval(() => {
//   remainTime.value = getRemainTime()
// }, 1000)

</script>

<template>
  <header class="fixed w-full bg-[#f5f5f5]">
    <nav class="border-b border-gray-300">
      <div class="h-16 ml-4 flex justify-between items-center">
        <router-link to="/" class="hidden md:inline-block p-1 cursor-pointer rounded-md">
          <div class="flex flex-row space-x-2 items-center">
            <img src="./assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Isolia
            </h1>
          </div>
        </router-link>
        <button class="md:hidden inline-block p-1 cursor-pointer rounded-md">
          <Bars3Icon class="w-6 h-6 text-orange-600" @click="isOpenMobileMenu = !isOpenMobileMenu" />
        </button>
        <div class="hidden md:flex flex-grow justify-start items-center ml-5">
          <div class="font-bold">
            <router-link id="menu" v-for="route in navRoutes" :key="route.to" :to="route.to"
              class="px-5 py-2 hover:border-b-2 border-orange-200">
              {{ route.name }}
            </router-link>
          </div>
        </div>
        <div v-if="isOpenMobileMenu" class="z-10 md:hidden block absolute top-16 left-0 w-full bg-gray-100 shadow-md">
          <div class="flex flex-col font-bold">
            <router-link v-for="route in navRoutes" :key="route.to" :to="route.to" @click="isOpenMobileMenu = false"
              class="px-5 py-2 hover:bg-orange-200 hover:text-white">
              {{ route.name }}
            </router-link>
          </div>
        </div>
        <router-link to="/">
          <div class="md:hidden flex flex-row space-x-2 items-center">
            <img src="./assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              Isolia
            </h1>
          </div>
        </router-link>
        <div class="flex justify-end">
          <router-link to="/login" v-if="!user.isLogined()" class="px-4">
            <ButtonBox color="orange" size="sm">로그인</ButtonBox>
          </router-link>
          <div v-else class="flex flex-row space-x-2 items-center">
            <VueCountdown :time="getRemainTime()" v-slot="{ hours, minutes }" :interval="1000 * 60" class="mt-2">
              <Popper :hover="true" :arrow="true">
                <template #content>
                  <div class="bg-slate-300 p-1 rounded-md text-sm">남은 세션 시간</div>
                </template>
                <div class="flex flex-row space-x-4 items-center cursor-default">
                  <ClockIcon class="w-5 h-5 mr-1" />
                  {{ hours * 60 + minutes }} 분
                </div>
              </Popper>

            </VueCountdown>
            <div class="flex flex-row h-16 px-4 items-center cursor-pointer hover:bg-orange-400 hover:text-white"
              @click="profileModal = true">
              <UserIcon class="w-6 h-6 'inline-block mr-2" />
              <span class="font-semibold">{{ user.data.display_name }}</span>
            </div>
            <!-- <UserIcon /> -->
            <!-- <div class="font-bold">{{ user.data.display_name }}</div>
              <div class="">{{ user.data.email }}</div> -->
            <!-- <ButtonBox color="red" @click="logout">로그아웃</ButtonBox> -->
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div class="h-content flex justify-center pt-16">
    <router-view />
  </div>

  <vue-final-modal v-model="profileModal" :hide-overlay="true">
    <div
      class="mb-12 w-64 bg-[#f0f0f0] rounded-xl mx-2 divide-y divide-gray-300 shadow-md absolute right-3 top-20 max-w-xs">
      <div class="flex flex-row gap-2 p-5 items-start">
        <UserIcon class="w-12 h-12" />
        <div class="flex flex-col">
          <span class="font-medium text-ellipsis">{{ user.data.display_name }}</span>
          <span class="text-sm text-ellipsis">{{ user.data.email }}</span>
          <!-- <span class="text-sm py-2">계정관리 링크~</span> -->
        </div>
      </div>
      <div v-for="route in modalRoutes" :key="route.to" class="py-2 ">
        <router-link :to="route.to" class="p-3 hover:bg-orange-400 hover:text-white cursor-pointer block"
          @click="profileModal = false">
          <component :is="route.icon" class="w-5 h-5 inline-block">
          </component>
          {{ route.name }}
        </router-link>
      </div>
    </div>
  </vue-final-modal>
</template>

<style>
html,
body,
#app {
  height: 100%;
}

header {
  font-family: 'gothica1';
}

#app {
  font-family: 'naverNeo';
}
</style>

<style scoped>
.h-content {
  height: calc(100% - 4.05rem);
}

#menu.router-link-active,
#menu.router-link-exact-active {
  border-bottom: 2px solid rgb(251 146 60);
}

@media (max-width: 768px) {

  #menu.router-link-active,
  #menu.router-link-exact-active #menu {
    color: white;
    background-color: rgb(251 146 60);
  }
}
</style>
