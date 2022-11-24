<script setup lang="ts">
import { computed } from 'vue'
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
  <div class="grid grid-cols-1 items-center">
    <label
      class="text-sm font-bold inline-block bg-gradient-to-r from-orange-300 to-yellow-300 border ring-1 ring-orange-300 text-orange-600 rounded-t-lg p-2.5"
      v-if="props.label">
      {{ props.label
      }}
    </label>
    <input
      class="inline-block bg-gray-50 border ring-orange-300 text-gray-900 text-sm rounded-b-lg ring-1 outline-none focus:ring-orange-400 p-2.5"
      v-model="value" :placeholder="props.placeholder">
    <slot />
  </div>
</template>
