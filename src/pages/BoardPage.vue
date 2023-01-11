<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
  ChevronDownIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'


import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import BoardComponent from '@/components/BoardComponent.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// eslint-disable-next-line no-unused-vars
const BoardTypes = {
  notice: 'notice',
  suggestion: 'suggestion',
  free: 'free'
}

const BoardNames = {
  all: '전체',
  notice: '공지',
  suggestion: '건의',
  free: '자유'
}

const instance = getCurrentInstance()

const boardType = ref<any>()
const boardMenuModal = ref<boolean>(false)

const routerParams = instance.proxy.$route.params

console.log(routerParams)
console.log(instance.proxy.$route.params)

if (Object.keys(routerParams).includes('name')) {
  boardType.value = routerParams.name
}

watch(() => instance.proxy.$route.params.name, async (name) => {
  boardType.value = name
})

const boardRoutes = [
  {
    to: '/board/list/notice',
    name: '공지'
  },
  {
    to: '/board/list/suggestion',
    name: '건의'
  },
  {
    to: '/board/list/free',
    name: '자유'
  }
]

const boardMenus = [
  '공지', '건의', '자유'
]

</script>

<template>
  <div class="p-4">
    <header
      class="flex flex-row justify-between items-center font-extrabold pb-2 border-b border-gray-300 dark:border-gray-700">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full justify-center rounded-md bg-white dark:bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {{ BoardNames[$route.params.menu] }}
            <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
          </MenuButton>
        </div>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute left-0 mt-2 w-32 px-2 origin-top-right divide-y divide-gray-200 dark:divide-gray-500 rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="px-1 py-1">
              <MenuItem>
              <router-link to="/board/list/all"
                class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50">
                전체
              </router-link>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem v-for="boardRoute in boardRoutes" :key="boardRoute.to">
              <router-link :to="boardRoute.to"
                class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50">
                {{ boardRoute.name }}
              </router-link>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
      <div class="pr-2">
        <PlusCircleIcon class="w-8 h-8" />
      </div>
    </header>
    <div>
      hji
    </div>
  </div>
</template>
