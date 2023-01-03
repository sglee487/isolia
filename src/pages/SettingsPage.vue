<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

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

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import useAnimateElement from '@/composables/AnimateElement'

import { useUserStore } from '@/stores/userStore'

import { updateUser } from '@/apis/user'
import { getGenerateRandomName } from '@/utils/generateName'

const instance = getCurrentInstance()
const user = useUserStore()


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

</script>

<template>
  <div class="w-full pl-8 flex flex-col space-y-2 divide-y divide-gray-300">
    <div class="text-2xl font-bold pt-4 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-app-200">
      나의 아이솔리아
    </div>
    <div class="flex flex-col space-y-2 divide-y">
      <div class="flex flex-row gap-2 p-5 items-start">
        <img :src="user.data.picture_96" v-if="user.isLogined()"
          class="w-14 h-14 inline-block mb-1 rounded-full shadow-lg" />
        <UserIcon v-else class="w-14 h-14 inline-block mb-1" />
        <div class="flex flex-col">
          <span class="font-medium text-ellipsis">{{ user.data.display_name }}</span>
          <span class="text-sm text-ellipsis">{{ user.data.email }}</span>
        </div>
        <ButtonBox color="app" size="xs">
          <UserIcon class="w-4 inline-block mr-1" />수정
        </ButtonBox>
      </div>
    </div>
    <div
      class="mb-12 w-64 bg-[#f0f0f0] rounded-xl mx-2 divide-y divide-gray-300 shadow-md absolute right-3 top-80 max-w-xs">
      <div class="flex flex-row gap-2 p-5 items-start">
        <UserIcon class="w-12 h-12" />
        <div class="flex flex-col">
          <span class="font-medium text-ellipsis">{{ user.data.display_name }}</span>
          <span class="text-sm text-ellipsis">{{ user.data.email }}</span>
          <!-- <span class="text-sm py-2">계정관리 링크~</span> -->
        </div>
      </div>
      <div v-for="route in modalRoutes" :key="route.to" class="py-2 ">
        <router-link :to="route.to" class="p-3 hover:bg-sky-400 hover:text-white cursor-pointer block">
          <component :is="route.icon" class="w-5 h-5 inline-block">
          </component>
          {{ route.name }}
        </router-link>
      </div>

    </div>
  </div>

</template>
