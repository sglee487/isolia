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
  <div class="flex flex-col">
    <InputBox class="flex-none font-bold pb-4" v-model="title" placeholder="제목을 입력하세요" />
    <QuillEditor class="min-h-[50vh]" theme="snow" />
    <div class="flex-none flex flex-row justify-evenly content-center place-items-center pt-8">
      <ButtonBox class="w-14 text-xs h-8" @click="goBack" color="gray" size="sm">취소</ButtonBox>
      <ButtonBox class="w-24" color="orange">작성</ButtonBox>
    </div>
  </div>
</template>
