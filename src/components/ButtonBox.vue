<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()
</script>

<template>
  <button :class="[`bg-${props.color ?? 'blue'}-100 hover:bg-${props.color ?? 'blue'}-200`]" class="p-2 rounded-lg">
    <slot />
  </button>
</template>