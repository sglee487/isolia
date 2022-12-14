<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import ButtonBox from '@/components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'
import { getBoardList } from '@/apis/board'


const props = defineProps<{
  boardName: string
}>()

const user = useUserStore()

const instance = getCurrentInstance()
const routerParams = instance.proxy.$route.params
const posts = ref<any[]>([])

if (Object.keys(routerParams).includes('name')) {
  const boardType = routerParams.name as string
  getBoardList(boardType).then((response) => {
    posts.value = response.data
  })
}

// watch(() => instance.proxy.$route.params.name, async (name) => {
//   console.log(name)
//   const response = await getBoardList(name)
//   console.log(response)
// })

</script>

<template>
  <div>
    <div class="text-2xl content-start">
      {{ props.boardName }}
    </div>
    <div class="flex flex-col">
      <ul v-if="posts.length > 0" class="grid grid-cols-2 gap-4 justify-items-center mb-2">
        <li v-for="post in posts" :key="post.id" class="w-full">
          <router-link :to="`/board/${post.id}`"
            class="block text-center py-2 hover:bg-orange-500 hover:text-white rounded-xl bg-orange-300">
            {{ post.title }}
          </router-link>
        </li>
      </ul>
      <div v-else>
        게시물이 없습니다.
      </div>
      <router-link to="/board/notice/write">
        <ButtonBox color="orange">글쓰기</ButtonBox>
      </router-link>
    </div>
  </div>
</template>
