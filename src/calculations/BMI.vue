<script setup lang="ts">
import { ref, watch } from 'vue'

import { useCalculateStore } from '@/stores/calculateStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

const calculateHistory = useCalculateStore()

const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const calculated = ref<number | null>(null)

const reset = () => {
  weight.value = null
  height.value = null
  calculated.value = null

  document.getElementById('heightFocus')?.focus()
}

const save = () => {
  if (calculated.value === null) {
    return
  }
  const result = {
    createdAt: new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }),
    type: 'BMI',
    input: {
      height: height.value,
      weight: weight.value
    },
    output: {
      label: 'BMI',
      value: calculated.value.toFixed(2),
      unit: 'kg/m^2'
    }
  }
  calculateHistory.addResult(result)
}

const decideValues = () => {
  if (height.value === null || weight.value === null) {
    calculated.value = null
    return
  }

  if (!height.value || height.value !== 0) {
    calculated.value = weight.value / (height.value * height.value) * 10000
  } else {
    calculated.value = null
  }
}
watch(() => height.value, async () => {
  decideValues()
})

watch(() => weight.value, async () => {
  decideValues()
})

</script>

<template>
  <div class="flex flex-col">
    <div
      class="pb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
      <div class="text-2xl">
        BMI
      </div>
      <div class="text-xl">
        체질량 지수
      </div>
    </div>
    <div class="space-y-4">
      <InputBox label="키(cm)" v-model="height" type="number" @keyup.enter="save" placeholder="0"
        inputId="heightFocus" />
      <InputBox label="체중(kg)" v-model="weight" type="number" @keyup.enter="save" placeholder="0.00" />
    </div>
    <div class="md:hidden block fixed inset-x-0 text-center bottom-14 bg-white dark:bg-black py-2">
      주입 속도는
      <span class="font-bold text-app-600">
        {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
      </span>
      <small>cc/hr</small> 입니다.
    </div>
    <div class="p-4 text-center">
      BMI는
      <span class="font-bold text-app-600">
        {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
      </span>입니다.
    </div>
    <div class="py-4 flex space-x-1">
      <ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
      <ButtonBox class="w-full" @click="save" color="app">저장</ButtonBox>
    </div>
  </div>
</template>
