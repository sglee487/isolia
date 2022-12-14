<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

import BoardComponent from '@/components/BoardComponent.vue'

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

</script>

<template>
  <div>
    글쓰기긱기기ㅣ긱기
  </div>
</template>
