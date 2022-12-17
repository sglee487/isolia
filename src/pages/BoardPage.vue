<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import BoardComponent from '@/components/BoardComponent.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// eslint-disable-next-line no-unused-vars
const BoardTypes = {
  notice: 'notice',
  suggestion: 'suggestion',
  free: 'free'
}

const BoardNames = {
  notice: '공지게시판',
  suggestion: '건의게시판',
  free: '자유게시판'
}

const instance = getCurrentInstance()

const boardType = ref<any>()

const routerParams = instance.proxy.$route.params

if (Object.keys(routerParams).includes('name')) {
  boardType.value = routerParams.name
}

watch(() => instance.proxy.$route.params.name, async (name) => {
  boardType.value = name
})

const routes = [
  {
    to: '/board/notice',
    name: '공지게시판'
  },
  {
    to: '/board/suggestion',
    name: '건의게시판'
  }
]

</script>

<template>
  <div class="w-2/3">
    <BoardComponent v-if="boardType" :boardName="BoardNames[boardType]" />
    <div v-else>
      <ul class="grid grid-cols-2 gap-4 justify-items-center mb-2">
        <li v-for="route in routes" :key="route.to" class="w-full">
          <router-link :to="route.to"
            class="block text-center py-2 hover:bg-orange-500 hover:text-white rounded-xl bg-orange-300">
            {{ route.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
