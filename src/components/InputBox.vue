<script setup lang="ts">
import { ref } from 'vue'
import { computed } from '@vue/reactivity'
const props = defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const value = computed<string | number>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

</script>

<template>
  <div class="grid grid-cols-1">
    <label v-if="props.label"> {{ props.label }} </label>
    <input
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      v-model="value" :placeholder="props.placeholder">
    <slot />
  </div>
</template>