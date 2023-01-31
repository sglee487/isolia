<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeftIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

import boardNames from '@/enums/menuDict'
import { getPost, postComment } from '@/apis/board'
import { goBack, routerTo } from '@/utils/routerUtils'
import { useUserStore } from '@/stores/userStore'
import InputAreaBox from '@/components/InputAreaBox.vue'
import TiptapComment from '@/components/TiptapComment.vue'
import ButtonBox from '@/components/ButtonBox.vue'
import { axiosErrorHandler } from '@/handler/axiosErrorHandler'

const instance = getCurrentInstance()

const user = useUserStore()

const isHideHeader = ref<boolean>(false)
let lastScroll = 0

const handleScroll = async () => {
  // header hide and show
  const currentScroll = window.scrollY
  if (currentScroll > lastScroll) {
    isHideHeader.value = true
  } else {
    isHideHeader.value = false
  }
  lastScroll = currentScroll
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const postData = ref<any>({})

const writeCommentText = ref<string>('')

if ('postId' in instance.proxy.$route.params) {
  const postId = parseInt(instance.proxy.$route.params.postId)
  getPost(postId).then((res) => {
    postData.value = res.data
  })
}

const saveComment = async () => {
  try {
    const commentResponse = await postComment(postData.value.id, writeCommentText.value, user.data.token)
    if (commentResponse.status === 201) {
      writeCommentText.value = ''
      const postId = parseInt(instance.proxy.$route.params.postId)
      getPost(postId).then((res) => {
        postData.value = res.data
      })
    }
  } catch (error) {
    axiosErrorHandler(instance, error)
    return
  }
}

</script>

<template>
  <header :class="{ 'hiddenHeader': isHideHeader }"
    class="md:hidden transition duration-300 transform fixed px-4 w-full h-14 flex space-x-4 justify-between items-center font-extrabold bg-[#f2f2f2] dark:bg-[#222222] border-b border-gray-300 dark:border-gray-700">
    <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack($router)" />
    <div class="flex-grow flex">
      <img src="../assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
      <div
        class="inline-block place-self-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-white">
        Isolia
      </div>
    </div>
  </header>
  <div class="p-4 w-[62rem] mb-8">
    <div class="mt-14 md:mt-0 px-2 py-1 flex flex-col space-y-4 divide-gray-200 dark:divide-gray-700">
      <div class="space-y-2">
        <small class="p-1 rounded-md bg-slate-300 dark:bg-slate-600 w-fit text-app-600 dark:text-app-300">
          {{ boardNames[postData.board_type] }}
        </small>
        <div class="font-extrabold my-1">
          {{ postData.title }}
        </div>
        <small class="self-end text-gray-600 dark:text-gray-400">
          {{ dayjs(postData.created_at).format('YY.MM.DD HH:mm:ss ddd') }} | 조회수 {{ postData.hits }}
        </small>
        <div class="flex space-x-2 items-center">
          <img class="w-10 h-10 inline-block mb-1 rounded-full shadow-lg" :src="postData.picture_96" alt="pic96">
          <div>
            {{ postData.display_name }}
          </div>
        </div>
      </div>
      <hr />
      <article class="break-all prose dark:prose-invert" v-html="postData.content" />
      <hr />
      <div>
        댓글 {{ postData.comments?.length || 0 }} 개
      </div>
      <hr />
      <div class="space-y-8">
        <div v-for="comment in postData.comments" :key="comment.comment_id"
          class="space-y-4 divide-gray-300 dark:divide-gray-500">
          <div class="flex space-x-2 items-center">
            <img class="w-8 h-8 inline-block mb-1 rounded-full shadow-lg" :src="comment.picture_96" alt="pic96">
            <div class="flex flex-col ">
              <div class="text-sm">
                {{ comment.display_name }}
              </div>
              <div class="text-gray-600 dark:text-gray-400 text-xs">
                {{ dayjs(comment.created_at).format('YY.MM.DD HH:mm:ss ddd') }}
              </div>
            </div>
          </div>
          <article class="break-all prose dark:prose-invert" v-html="comment.content" />
          <!-- <div class="flex flex-col w-full px-2">
            <div class="self-end space-x">
              <HeartIcon class="w-6 h-6 inline-block" />
              <span class="text-sm">{{ comment.like }}</span>
            </div>
          </div> -->
          <hr />
        </div>
      </div>
    </div>
  </div>

  <!-- comment -->
  <div :class="{ 'hiddenComment': isHideHeader }"
    class="transition duration-300 transform justify-center w-full fixed flex bottom-0 py-1 px-2 border-t border-gray-200 dark:border-gray-700 bg-[#f5f5f5] dark:bg-[#121212] z-10">
    <div v-if="user.isLogined()" class="flex items-center w-[58rem] space-x-2">
      <img class="flex-none w-8 h-8 inline-block mb-1 rounded-full shadow-lg" :src="user.data.picture_96" alt="pic96">
      <!-- <InputAreaBox class="grow max-h-[40vh]" v-model="writeCommentText"
        :placeholder="`${user.data.display_name} (으)로 댓글 입력...`" /> -->
      <TiptapComment v-model="writeCommentText" class="grow" :placeholder="`${user.data.display_name} (으)로 댓글 입력...`" />
      <ButtonBox class="flex-none w-18" @click="saveComment" color="app">등록</ButtonBox>
    </div>
    <div v-else :class="{ 'hiddenComment': isHideHeader }" class="flex items-center w-[58rem] space-x-2">
      <UserIcon class="flex-none w-8 h-8 inline-block mb-1 rounded-full shadow-lg" />
      <InputAreaBox class="grow" v-model="writeCommentText" placeholder="댓글을 입력하시려면 로그인하세요" disabled />
      <ButtonBox class="flex-none" color="app" @click="routerTo($router, '/settings/login')">로그인</ButtonBox>
    </div>
  </div>
</template>

<style scoped>
.hiddenHeader {
  transform: translateY(-100%);
}

.hiddenComment {
  transform: translateY(100%);
}
</style>
