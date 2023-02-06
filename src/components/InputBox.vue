<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: string | number | undefined
  inputId?: string
  label?: string
  type?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'update:refValue'])

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
      class="text-sm font-bold inline-block border ring-1 ring-app-500 dark:ring-app-700 text-app-600 dark:text-app-500 rounded-t-lg p-2.5"
      v-if="props.label">
      {{ props.label }}
    </label>
    <input
      class="inline-block bg-zinc-50 dark:bg-zinc-800 border ring-app-500 dark:ring-app-700 text-gray-900 dark:text-gray-100 text-sm rounded-b-lg ring-1 outline-none focus:ring-app-400 dark:focus:ring-app-600 p-2.5"
      :class="[
        props.label ? 'rounded-t-none' : 'rounded-t-lg',
        props.disabled ? 'bg-gray-200 dark:bg-gray-500' : ''
      ]" v-model="value" :id="props.inputId" :type="props.type" :placeholder="props.placeholder"
      :readonly="props.readonly" :disabled="props.disabled">
    <slot />
  </div>
</template>
