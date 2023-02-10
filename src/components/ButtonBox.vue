<script setup lang="ts">
const props = defineProps<{
  color?: string
  size?: string
  active?: boolean
}>()
</script>

<template>
  <button :class="[
  `border-${props.color}-400 dark:border-${props.color}-600`,
  props.active ? `bg-${props.color}-600 text-white` : `hover:bg-${props.color}-500`,
  `text-${props.color}-500 dark:text-${props.color}-200`
  , props.size == 'sm' ? 'px-3 py-1' : props.size == 'xs' ? 'px-3 py-1' : 'px-5 py-3']"
    class="border-2 rounded-lg hover:text-white">
    <slot />
  </button>
</template>
