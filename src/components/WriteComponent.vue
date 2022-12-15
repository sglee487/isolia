<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

import InputBox from '@/components/InputBox.vue'

const user = useUserStore()
console.log('안녕 난 작성용 컴포넌트야')

const title = ref<string>('')
const content = ref<string>('')

console.log(user)

</script>

<template>
  <div class="w-96">
    <div class="flex flex-col w-2/3">
      <InputBox label="제목" v-model="title" />
      <InputBox label="내용" v-model="content" />
    </div>
    <div>
      이것은 작성용 컴포넌트이다.
    </div>

  </div>
</template>
