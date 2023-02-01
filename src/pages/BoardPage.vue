<script setup lang="ts">
import { getCurrentInstance, ref, watch, onMounted, onUnmounted } from 'vue'
import {
  ChevronDownIcon,
  PlusCircleIcon,
  ArrowUpCircleIcon
} from '@heroicons/vue/24/outline'

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

import { getListBoard } from '@/apis/board'
import { useBoardStore } from '@/stores/boardStore'
import { routerTo } from '@/utils/routerUtils'
import boardNames from '@/enums/menuDict'
import PostCard from '@/components/PostCard.vue'
import SpinnerIcon from '@/icons/Spinner.vue'

const instance = getCurrentInstance()
const boardStore = useBoardStore()

const boardType = ref<any>()

const routerParams = instance.proxy.$route.params

const headerComponent = ref<any>(null)
const isHideHeader = ref<boolean>(false)
const isShowScrollToTop = ref<boolean>(false)
let lastScroll = 0

const moreLoading = ref<Boolean>(false)

const scrollComponent = ref<any>(null)

const loadMorePosts = async (boardType: string) => {
  const res = await getListBoard(boardType, boardStore.currentPage + 1)
  if (res.status === 200) {
    if (res.data.length > 0) {
      boardStore.incresePage()
      boardStore.addPosts(res.data)
    } else {
      boardStore.endIsLastPage()
    }
  }
}

if (routerParams && Object.keys(routerParams).includes('menu')) {
  boardType.value = routerParams.menu
  if (boardStore.posts.length === 0) {
    loadMorePosts(boardType.value)
  }
}

watch(() => instance.proxy.$route.params.menu, async (menu) => {
  if (menu) {
    boardStore.clearPosts()
    boardStore.resetPage()
    boardType.value = menu
    loadMorePosts(boardType.value)
  }
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

const getWriteMenu = () => {
  if (instance.proxy.$route.params.menu === 'all') {
    return 'free'
  }
  return instance.proxy.$route.params.menu
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = async () => {
  const postsElement = scrollComponent.value

  // header hide and show
  const currentScroll = window.scrollY
  if (currentScroll > lastScroll) {
    isHideHeader.value = true
  } else {
    isHideHeader.value = false
  }
  lastScroll = currentScroll

  // scroll to top
  if (currentScroll !== 0) {
    isShowScrollToTop.value = true
  } else {
    isShowScrollToTop.value = false
  }

  // infinite scroll
  if (!boardStore.isLastPage && !moreLoading.value && postsElement.getBoundingClientRect().bottom < window.innerHeight) {
    moreLoading.value = true
    await loadMorePosts(boardType.value)
    moreLoading.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

</script>

<template>
  <div class="p-4 w-[62rem] mb-12">
    <header ref="headerComponent" :class="{ 'hiddenHeader': isHideHeader }"
      class="flex justify-center w-full px-6 fixed top-0 md:top-16 left-0 pt-2 bg-[#f2f2f2] dark:bg-[#222222] transition duration-300 transform pb-2 border-b border-gray-300 dark:border-gray-700">
      <div class="w-[62rem] flex flex-row justify-between items-center font-extrabold">
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
                <button @click="routerTo($router, '/board/list/all')"
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50">
                  전체
                </button>
                </MenuItem>
              </div>
              <div class="px-1 py-1">
                <MenuItem v-for="boardRoute in boardRoutes" :key="boardRoute.to">
                <button
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-50"
                  @click="routerTo($router, boardRoute.to)">
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
      </div>
    </header>
    <div class="mt-12 scroll-smooth" ref="scrollComponent">
      <router-link :to="`/board/post/${post.id}/`" v-for="post in boardStore.posts" :key="post.id">
        <PostCard class="flex flex-col" :post="post" :menu="instance.proxy.$route.params.menu as string" />
      </router-link>
      <div v-if="moreLoading" class="flex justify-center items-center mt-4">
        <SpinnerIcon class="w-16 h-16 animate-spin" />
      </div>
    </div>
    <div :class="{ 'showToTop': isShowScrollToTop }"
      class="fixed right-8 bottom-20 w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-500 opacity-0 transition duration-300 transform cursor-pointer">
      <ArrowUpCircleIcon @click="scrollToTop" class="opacity-70" />
    </div>
  </div>
</template>

<style scoped>
.hiddenHeader {
  transform: translateY(-100%);
}

.showToTop {
  opacity: 40%;
}
</style>
