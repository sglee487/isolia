<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import WriteComponent from './WriteComponent.vue'
import ViewComponent from './ViewComponent.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import { getBoardList } from '@/apis/board'

const props = defineProps<{
  boardName: string
}>()

const instance = getCurrentInstance()
const boardType = ref<string>(instance.proxy.$route.params.name as string)
const pageId = ref<string | undefined>('')
const posts = ref<any[]>([])
const postColumns = ref<object[]>([])

if (Object.keys(instance.proxy.$route.params).includes('name')) {
  getBoardList(boardType.value).then((response) => {
    posts.value = response.data
  })
}

if (Object.keys(instance.proxy.$route.params).includes('id')) {
  pageId.value = instance.proxy.$route.params.postId as string
}

watch(() => instance.proxy.$route.params, async (to) => {
  pageId.value = to.postId as string
})

postColumns.value = [
  {
    title: '번호',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '제목',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '작성자',
    dataIndex: 'author',
    key: 'author'
  },
  {
    title: '작성일',
    dataIndex: 'createdAt',
    key: 'createdAt'
  }
]

const changeMode = (mode: string) => {
  instance?.proxy?.$router.push({
    path: `${boardType.value}/${mode}`
  })
}

</script>

<template>
  <div
    class="text-2xl font-bold content-start pt-4 pb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
    {{ props.boardName }}
  </div>
  <template v-if="pageId">
    <WriteComponent v-if="pageId === 'write'" />
    <ViewComponent v-else />
  </template>
  <div v-else class="flex flex-col space-y-4">
    <ul v-if="posts.length > 0" class="grid grid-cols-2 gap-4 justify-items-center mb-2">
      <li v-for="post in posts" :key="post.id" class="w-full">
        <router-link :to="`/board/${boardType}/${post.id}`"
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
