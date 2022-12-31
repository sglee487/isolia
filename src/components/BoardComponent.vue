<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import moment from 'moment'

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
    key: 'id',
    width: '10%'
  },
  {
    title: '제목',
    dataIndex: 'title',
    key: 'title',
    width: '40%'
  },
  {
    title: '작성자',
    dataIndex: 'display_name',
    key: 'display_name',
    width: '20%'
  },
  {
    title: '작성일',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '30%'
  }
]

const changeMode = (mode: string) => {
  instance?.proxy?.$router.push({
    path: `${boardType.value}/${mode}`
  })
}

const viewPost = (id: number) => {
  instance?.proxy?.$router.push({
    path: `${boardType.value}/${id}`
  })
}

</script>

<template>
  <div class="space-y-4">
    <div
      class="text-2xl font-bold content-start pt-4 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-app-400 to-yellow-400">
      {{ props.boardName }}
    </div>
    <template v-if="pageId">
      <WriteComponent v-if="pageId === 'write'" />
      <ViewComponent v-else />
    </template>
    <template v-else>
      <table class="w-full text-left border-separate border-spacing-2 border border-slate-500 rounded-md">
        <thead>
          <tr>
            <th v-for="postColumn in postColumns" :key="postColumn['key']" :style="`width: ${postColumn['width']}`">
              {{ postColumn['title'] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post['id']" class="cursor-pointer" @click="viewPost(post['id'])">
            <td v-for="postColumn in postColumns" :key="postColumn['key']">
              {{ postColumn['dataIndex'] === 'created_at' ? moment(post[postColumn['dataIndex']]).format('YYYY-MM-DD \
                            HH:mm:ss') :
                  post[postColumn['dataIndex']]
              }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end">
        <ButtonBox class="w-28 content-end" color="app" @click="changeMode('write')">글쓰기</ButtonBox>
      </div>
    </template>
  </div>
</template>
