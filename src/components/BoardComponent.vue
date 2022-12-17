<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import WriteComponent from './WriteComponent.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import { useUserStore } from '@/stores/userStore'
import { getBoardList } from '@/apis/board'

const props = defineProps<{
  boardName: string
}>()

const user = useUserStore()

const instance = getCurrentInstance()
const routerParams = instance.proxy.$route.params
const queryParams = instance.proxy.$route.query
const pageMode = ref<string | undefined>('')
const posts = ref<any[]>([])

if (Object.keys(routerParams).includes('name')) {
  const boardType = routerParams.name as string
  getBoardList(boardType).then((response) => {
    posts.value = response.data
  })
}

if (Object.keys(queryParams).includes('mode')) {
  pageMode.value = queryParams.mode as string
}

watch(() => instance.proxy.$route.query.mode, async (to) => {
  pageMode.value = to as undefined | string
})

const changeMode = (mode: string) => {
  instance?.proxy?.$router.push({
    path: '',
    query: {
      mode
    }
  })
}

</script>

<template>
  <div
    class="text-2xl font-bold content-start pt-4 pb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
    {{ props.boardName }}
  </div>
  <WriteComponent v-if="pageMode === 'write'" />
  <div v-else class="flex flex-col space-y-4">
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
    <div class="flex justify-end">
      <ButtonBox class="w-28 content-end" color="orange" @click="changeMode('write')">글쓰기</ButtonBox>
    </div>
  </div>
</template>
