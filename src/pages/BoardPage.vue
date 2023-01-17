<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
  ChevronDownIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import BoardComponent from '@/components/BoardComponent.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import { getListBoard } from '@/apis/board'
import boardNames from '@/pages/boardNames'
import PostCard from '@/components/PostCard.vue'

const instance = getCurrentInstance()

const boardType = ref<any>()

const routerParams = instance.proxy.$route.params

const posts = ref<any>([])

if (Object.keys(routerParams).includes('menu')) {
  boardType.value = routerParams.menu
  getListBoard(boardType.value).then((res) => {
    posts.value = res.data
    console.log(res.data)
  })
}

watch(() => instance.proxy.$route.params.menu, async (menu) => {
  boardType.value = menu
  getListBoard(boardType.value).then((res) => {
    posts.value = res.data
  })
})

const boardRoutes = [
  {
    to: '/board/list/notice',
    name: '공지게시판'
  },
  {
    to: '/board/list/suggestion',
    name: '건의게시판'
  },
  {
    to: '/board/list/free',
    name: '자유게시판'
  }
]

const routerTo = (to: string) => {
  instance.proxy.$router.push(to)
}

const getWriteMenu = () => {
  if (instance.proxy.$route.params.menu === 'all') {
    return 'free'
  }
  return instance.proxy.$route.params.menu
}

</script>

<template>
  <div class="p-4 w-[62rem] mb-12">
    <header
      class="flex flex-row justify-between items-center font-extrabold pb-2 border-b border-gray-300 dark:border-gray-700">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full justify-center rounded-md bg-white dark:bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {{ boardNames[$route.params.menu] }}
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
              <button @click="routerTo('/board/list/all')"
                class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50">
                전체
              </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem v-for="boardRoute in boardRoutes" :key="boardRoute.to">
              <button
                class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50"
                @click="routerTo(boardRoute.to)">
                {{ boardRoute.name }}
              </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
      <router-link :to="`/board/write/${getWriteMenu()}`" class="mr-2" v-if="$route.params.menu !== 'notice'">
        <PlusCircleIcon class="w-8 h-8" />
      </router-link>
    </header>
    <div>
      <PostCard v-for="post in posts" :key="post.id" class="flex flex-col" :post="post"
        :menu="instance.proxy.$route.params.menu as string" />
    </div>
  </div>
</template>
