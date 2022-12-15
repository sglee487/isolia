<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

const user = useUserStore()

const title = ref<string>('')
const content = ref<string>('')

console.log(user)

</script>

<template>
  <div class="w-full space-y-10">
    <div class="flex flex-col">
      <InputBox label="제목" v-model="title" />
      <InputBox label="내용" v-model="content" />
    </div>
    <div class="flex flex-row justify-evenly">
      <ButtonBox class="w-44" color="orange" size="sm">작성</ButtonBox>
      <ButtonBox color="gray" size="sm">취소</ButtonBox>
    </div>

  </div>
</template>
