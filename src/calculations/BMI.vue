<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

import { useCalculateStoreHistory, useLastCalculatedStore } from '@/stores/calculateStore'

import InputBox from '@/components/InputBox.vue'
import ButtonBox from '@/components/ButtonBox.vue'

import { goBack } from '@/utils/routerUtils'

import CalculatorTypes from '@/enums/calculateTypes'

const calculateHistory = useCalculateStoreHistory()
const lastCalculated = useLastCalculatedStore()

const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const variables = [weight, height]

const lastSaved = lastCalculated.getLastCalculated(CalculatorTypes.BMI)
if (lastSaved) {
  weight.value = lastSaved.weight
  height.value = lastSaved.height
}

const calculated = computed<number | null>(() => {
  if (height.value === null || weight.value === null) {
    return null
  }

  if (!height.value || height.value !== 0) {
    return weight.value / (height.value * height.value) * 10000
  } else {
    return null
  }
})

const reset = () => {
  weight.value = null
  height.value = null

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
      label: '체질량지수',
      value: calculated.value.toFixed(2),
      unit: 'kg/m^2'
    }
  }
  calculateHistory.addResult(result)
}

variables.forEach((variable) => {
  watch(() => variable.value, async () => {
    if ((typeof variable.value) === 'string') {
      variable.value = null
    }
    lastCalculated.setLastCalculated(CalculatorTypes.BMI, {
      height: height.value,
      weight: weight.value
    })
  })
})

</script>

<template>
  <div class="flex flex-col">
    <header
      class="md:hidden transition duration-300 transform fixed flex w-full space-x-4 py-1 justify-between items-center top-0 left-0 font-bold bg-[#f5f5f5] dark:bg-[#222222] z-50 border-b border-gray-300 dark:border-gray-700">
      <ChevronLeftIcon class="flex-none w-8 h-8 cursor-pointer text-black dark:text-white" @click="goBack($router)" />
      <div
        class="grow flex flex-col bg-clip-text text-transparent bg-gradient-to-r from-app-500 to-app-300 dark:from-app-400 dark:to-app-200">
        <div class="text-xl">
          BMI
        </div>
        <div class="text-base">
          체질량 지수
        </div>
      </div>
    </header>
    <div class="pt-16 space-y-4">
      <InputBox label="키(cm)" v-model="height" type="number" @keyup.enter="save" placeholder="0"
        inputId="heightFocus" />
      <InputBox label="체중(kg)" v-model="weight" type="number" @keyup.enter="save" placeholder="0.00" />
    </div>
    <!-- <div class="fixed inset-x-0 text-center bottom-14 bg-white dark:bg-black py-2">
      BMI는
      <span class="font-bold text-app-600">
        {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
      </span>
      <small>kg/m^2</small> 입니다.
    </div> -->
    <div class="p-4 text-center">
      BMI는
      <span class="font-bold text-app-600">
        {{ calculated === null ? '0.00' : calculated.toFixed(2) }}
      </span>
      <small>kg/m^2</small> 입니다.
    </div>
    <div class="py-4 flex space-x-1">
      <ButtonBox class="text-sm w-32" @click="reset" color="red">초기화</ButtonBox>
      <ButtonBox class="w-full" @click="save" color="app">저장</ButtonBox>
    </div>
  </div>
</template>
