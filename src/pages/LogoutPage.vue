<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/userStore'

const instance = getCurrentInstance()

const user = useUserStore()

user.logout()
instance.proxy.$router.push('/')
</script>

<template>
  <div></div>
</template>
