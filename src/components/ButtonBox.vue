<script setup lang="ts">
const props = defineProps<{
  color?: string
}>()
</script>

<template>
  <!-- <button :class="[`bg-${props.color ?? 'blue'}-100 hover:bg-${props.color ?? 'blue'}-200`]" class="p-2 rounded-lg"> -->
  <!-- <button class="bg-blue-100 p-2 rounded-lg"> -->
  <button :class="`border-${props.color}-500 hover:bg-${props.color}-500 text-${props.color}-500`"
    class="border px-5 py-3 rounded-lg hover:text-white">
    <slot />
  </button>
</template>
