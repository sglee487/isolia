<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  ChevronLeftIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

import { postBoard } from '@/apis/board'
import { useUserStore } from '@/stores/userStore'
import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'
import Tiptap from '@/components/Tiptap.vue'
import boardNames from '@/pages/boardNames'

const instance = getCurrentInstance()
const user = useUserStore()

const routerParams = instance.proxy.$route.params

const title = ref<string>('')
const content = ref<string>('')
const boardRoutes = []
if (user.isAdmin()) {
  boardRoutes.push({
    to: '/board/write/notice',
    name: '공지게시판'
  })
}
boardRoutes.push(
  {
    to: '/board/write/suggestion',
    name: '건의게시판'
  },
  {
    to: '/board/write/free',
    name: '자유게시판'
  }
)
const goBack = () => {
  instance?.proxy?.$router.back()
}

const routerTo = (to: string) => {
  instance.proxy.$router.push(to)
}

const save = () => {
  console.log()
  // postBoard(routerParams.menu as string, title.value, content.value, user.data.token)
  //   .then((res) => {
  //     instance?.proxy?.$router.push(`/board/list/${routerParams.menu}`)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}


// TODO: Ctrl + S 누르면 저장되게 하기
</script>

<template>
  <div class="p-4 w-[46.5rem]">
    <header
      class="flex space-x-4 justify-between items-center font-extrabold pb-2 mb-2 border-b border-gray-300 dark:border-gray-700">
      <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack()" />
      <div
        class="grow text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
        게시글 쓰기
      </div>
      <!-- <div class="flex-none pr-2">
          임시저장
        </div> -->
      <div class="flex-none">
        <ButtonBox color="violet" size="sm" @click="save">게시</ButtonBox>
      </div>
    </header>
    <div class="w-full">
      <div class="flex space-x-2 pb-2">
        <Menu as="div" class="relative text-left z-10 mt-1">
          <MenuButton
            class="inline-flex w-full justify-center rounded-md bg-white dark:bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {{ boardNames[$route.params.menu] }}
            <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
          </MenuButton>

          <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
              class="absolute left-0 mt-2 w-32 px-2 origin-top-right divide-y divide-gray-200 dark:divide-gray-500 rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

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
        <InputBox class="grow font-bold" v-model="title" placeholder="제목을 입력하세요" />
      </div>
      <tiptap v-model="content" :user="user" />
    </div>
  </div>
</template>
