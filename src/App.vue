<script setup lang="ts">
import { getCurrentInstance, onBeforeMount, ref } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown'
import Popper from 'vue3-popper'

import { checkToken } from '@/apis/user'

import ButtonBox from './components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'

import {
  ArrowLeftOnRectangleIcon,
  CalculatorIcon,
  ClockIcon,
  NewspaperIcon,
  UserIcon,
  HomeIcon,
  BellIcon,
  CogIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

const instance = getCurrentInstance()
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
    icon: NewspaperIcon
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
    response.data.picture_32,
    response.data.picture_96,
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

const rootPaths = ['/', '/login', '/logout', '/user', '/register', '/board', '/calculator', '/notification', '/settings']
const isRootPath = () => {
  for (const path of rootPaths) {
    if (instance?.proxy?.$route.path === path) {
      return true
    }
  }
  return false
}

const goBack = () => {
  instance?.proxy?.$router.back()
}

</script>

<template>
  <header class="hidden md:block fixed w-full bg-[#f5f5f5]">
    <nav class="border-b border-gray-300">
      <div class="h-16 ml-4 flex justify-between items-center">
        <router-link to="/" class="hidden md:inline-block p-1 cursor-pointer rounded-md">
          <div class="flex flex-row space-x-2 items-center">
            <img src="./assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
              Isolia
            </h1>
          </div>
        </router-link>
        <div class="flex flex-grow justify-start items-center ml-5">
          <div class="font-bold">
            <router-link id="menu" v-for="route in navRoutes" :key="route.to" :to="route.to"
              class="px-5 py-2 hover:border-b-2 border-app-200">
              <component :is="route.icon" class="w-5 h-5 inline-block" />
              {{ route.name }}
            </router-link>
          </div>
        </div>
        <router-link to="/">
          <div class="md:hidden flex flex-row space-x-2 items-center">
            <img src="./assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
              Isolia
            </h1>
          </div>
        </router-link>
        <div class="flex justify-end">
          <router-link to="/login" v-if="!user.isLogined()" class="px-4">
            <ButtonBox color="app" size="sm">로그인</ButtonBox>
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
            <div class="flex flex-row h-16 px-4 items-center cursor-pointer hover:bg-app-400 hover:text-white"
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

  <header class="md:hidden fixed mt-4 mx-2">
    <nav v-if="!isRootPath()" class="cursor-pointer bg-gray-500 bg-opacity-10 rounded-full bg-transparent "
      @click="goBack()">
      <ChevronLeftIcon class="w-8 h-8 pr-1 text-app-400" />
    </nav>
  </header>

  <div class="flex justify-center pt-4 md:pt-16 pb-14 md:pb-0">
    <router-view />
  </div>

  <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
    <div id="tabs" class="flex justify-between">
      <router-link to="/" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <HomeIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-home block text-xs">홈</span>
      </router-link>
      <router-link to="/board" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <NewspaperIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">게시판</span>
      </router-link>
      <router-link to="/calculator" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <CalculatorIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">계산기</span>
      </router-link>
      <!-- <router-link to="/notification" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <BellIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs line-through">알림(미구현)</span>
      </router-link> -->
      <div id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <BellIcon class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs line-through">알림(미구현)</span>
      </div>
      <router-link to="/settings" id="nav"
        class="w-full focus:text-app-400 hover:text-app-400 justify-center inline-block text-center pt-2 pb-1">
        <img :src="user.data.picture_32" v-if="user.isLogined()"
          class="w-6 h-6 inline-block mb-1 rounded-full shadow-lg" />
        <UserIcon v-else class="w-6 h-6 inline-block mb-1" />
        <span class="tab tab-kategori block text-xs">나의 솔리</span>
      </router-link>
    </div>
  </section>

  <!-- <footer>
    <div class="h-16 flex justify-center items-center">
      <div class="text-sm text-gray-500">
        <span>© 2021 Isolia</span>
        <span class="mx-2">|</span>
        <span>개인정보처리방침</span>
        <span class="mx-2">|</span>
        <span>이용약관</span>
      </div>
    </div>
  </footer> -->

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
        <router-link :to="route.to" class="p-3 hover:bg-sky-400 hover:text-white cursor-pointer block"
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
  border-bottom: 2px solid rgb(56 189 248);
}

#nav.router-link-active,
#nav.router-link-exact-active {
  border-bottom: 2px solid rgb(56 189 248);
  /* #4EBDE5 */
}

@media (max-width: 768px) {

  #menu.router-link-active,
  #menu.router-link-exact-active #menu {
    color: white;
    background-color: rgb(56 189 248);
  }

  #nav.router-link-active,
  #nav.router-link-exact-active #nav {
    color: rgb(56 189 248);
  }
}
</style>
