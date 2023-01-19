<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

import { getPost } from '@/apis/board'

const instance = getCurrentInstance()

let postData = ref<any>([])

const routerParams = instance.proxy.$route.params
console.log(instance.proxy.$route.params)

if ('postId' in instance.proxy.$route.params) {
  const postId = parseInt(instance.proxy.$route.params.postId)
  getPost(postId).then((res) => {
    console.log(res.data)
  });
}

watch(() => instance.proxy.$route.params.id, async (id) => {
  console.log(instance.proxy.$route.params)
  getPost(id).then((res) => {
    console.log(res.data)
  })
})


</script>

<template>
  <div class="p-4 w-[62rem] mb-12">
    <header
      class="flex space-x-4 justify-between items-center font-extrabold pb-2 mb-2 border-b border-gray-300 dark:border-gray-700">
      <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack()" />
      <img src="../assets/line-chart.png" class="w-10 p-1 inline-block rounded-md" />
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
        Isolia
      </h1>
      <div>
        sdfsd
      </div>
    </header>

  </div>

</template>