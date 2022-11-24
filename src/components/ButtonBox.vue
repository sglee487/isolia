<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()
</script>

<template>
  <button :class="`border-${props.color}-500 hover:bg-${props.color}-500 text-${props.color}-500`"
    class="border px-5 py-3 rounded-lg hover:text-white">
    <slot />
  </button>
</template>
