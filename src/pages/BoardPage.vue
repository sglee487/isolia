<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'
import {
  ChevronDownIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'

import { VueFinalModal } from 'vue-final-modal'

import BoardComponent from '@/components/BoardComponent.vue'
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
const boardMenuModal = ref<boolean>(false)

const routerParams = instance.proxy.$route.params

if (Object.keys(routerParams).includes('name')) {
  boardType.value = routerParams.name
}

watch(() => instance.proxy.$route.params.name, async (name) => {
  boardType.value = name
})

// const routes = [
//   {
//     to: '/board/notice',
//     name: '공지게시판'
//   },
//   {
//     to: '/board/suggestion',
//     name: '건의게시판'
//   }
// ]

const boardMenus = [
  '공지', '건의', '자유'
]

</script>

<template>
  <div class="p-4">
    <header
      class="flex flex-row justify-between items-center font-extrabold pb-2 border-b border-gray-300 dark:border-gray-700">
      <div class="relative">
        <button class="rounded-md" @click="boardMenuModal = true">
          전체
          <ChevronDownIcon class="w-5 h-5 inline-block" />
        </button>
        <vue-final-modal v-model="boardMenuModal" :hide-overlay="true">
          <div
            class="absolute w-28 top-12 left-2 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl divide-y divide-gray-300 dark:divide-gray-400 space-y-1 shadow-md">
            <div>
              전체
            </div>
            <ul class="space-y-1">
              <li v-for="boardMenu in boardMenus" :key="boardMenu" class="block my-1">
                {{ boardMenu }}
              </li>
            </ul>
          </div>
        </vue-final-modal>
      </div>
      <div class="pr-2">
        <PlusCircleIcon class="w-8 h-8" />
      </div>
    </header>
    <div>
      hji
    </div>
  </div>
</template>
