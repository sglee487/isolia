<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()
</script>

<template>
  <button class="bg-blue-100 hover:bg-blue-200">
    <slot />
  </button>
</template>