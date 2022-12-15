<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const user = useUserStore()
console.log('안녕 난 작성용 컴포넌트야')

console.log(user)

</script>

<template>
  <div>
    이것은 작성용 컴포넌트이다.
  </div>
</template>