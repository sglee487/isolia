<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import { useUserStore } from '@/stores/userStore'
import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

const instance = getCurrentInstance()
const user = useUserStore()

const title = ref<string>('')
const content = ref<string>('')

console.log(user)

const goBack = () => {
  instance?.proxy?.$router.back()
}

</script>

<template>
  <div class="w-full space-y-10">
    <div class="flex flex-col">
      <InputBox class="flex-none font-bold pb-4" v-model="title" placeholder="제목을 입력하세요" />
      <QuillEditor class="min-h-[80%]" theme="snow" />
    </div>
    <div class="flex flex-row justify-evenly">
      <ButtonBox @click="goBack" color="gray" size="sm">취소</ButtonBox>
      <ButtonBox class="w-44" color="orange" size="sm">작성</ButtonBox>
    </div>

  </div>
</template>
