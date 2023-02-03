<script setup lang="ts">
const props = defineProps<{
  color?: string
  size?: string
}>()
</script>

<template>
  <button
    :class="[`border-${props.color}-500 hover:bg-${props.color}-500 text-${props.color}-500`, props.size == 'sm' ? 'px-3 py-1' : props.size == 'xs' ? 'px-3 py-1' : 'px-5 py-3']"
    class="border rounded-lg hover:text-white">
    <slot />
  </button>
</template>
