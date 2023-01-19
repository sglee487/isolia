<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

import boardNames from '@/pages/menuDict'
import { getPost } from '@/apis/board'
import { goBack } from '@/utils/routerUtils'

const instance = getCurrentInstance()

const postData = ref<any>([])

const routerParams = instance.proxy.$route.params
console.log(instance.proxy.$route.params)

if ('postId' in instance.proxy.$route.params) {
  const postId = parseInt(instance.proxy.$route.params.postId)
  getPost(postId).then((res) => {
    console.log(res.data)
    postData.value = res.data
  });
}

watch(() => instance.proxy.$route.params.id, async (id) => {
  console.log(instance.proxy.$route.params)
  getPost(id).then((res) => {
    console.log(res.data)
    postData.value = res.data
  })
})

</script>

<template>
  <header
    class="fixed px-4 w-full h-14 flex space-x-4 justify-between items-center font-extrabold bg-[#f2f2f2] dark:bg-[#222222] border-b border-gray-300 dark:border-gray-700">
    <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack($router)" />
    <div class="flex-grow flex">
      <img src="../assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
      <div
        class="inline-block place-self-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-white">
        Isolia
      </div>
    </div>
    <!-- <EllipsisVerticalIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" /> -->
  </header>
  <div class="p-4 w-[62rem] mb-12">
    <div class="mt-14 md:mt-0 px-2 py-1 flex flex-col space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
      <div>
        <small class="p-1 rounded-md bg-slate-400 dark:bg-slate-600 w-fit text-app-600 dark:text-app-300">
          {{ boardNames[postData.board_type] }}
        </small>
        <div class="font-extrabold my-1">
          {{ postData.title }}
        </div>
        <small class="self-end text-gray-300 dark:text-gray-400">
          {{ dayjs(postData.created_at).format('YY.MM.DD HH:mm:ss ddd') }} | 조회수 {{ postData.hits }}
        </small>
        <div>

        </div>
      </div>
      <article class="break-all prose dark:prose-invert" v-html="postData.content" />
    </div>
  </div>

</template>